const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const FOLDER_NAME = "Aircraft Technical Logs";
const GIS_SCRIPT_URL = "https://accounts.google.com/gsi/client";
const CLIENT_ID: string | undefined = import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined;

type TokenResponse = { access_token?: string; expires_in?: number | string; error?: string };
type TokenClient = { requestAccessToken: (options?: { prompt?: string }) => void };
type GoogleAccounts = {
  accounts: {
    oauth2: {
      initTokenClient: (config: {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
        error_callback?: (error: { type?: string; message?: string }) => void;
      }) => TokenClient;
    };
  };
};

type DriveFile = { id: string; webViewLink?: string };

let cachedToken: { value: string; expiresAt: number } | null = null;
let gisLoading: Promise<void> | null = null;

export function isGoogleDriveConfigured(): boolean {
  return CLIENT_ID !== undefined;
}

export function isGoogleDriveConnected(): boolean {
  return cachedToken !== null && cachedToken.expiresAt > Date.now() + 60_000;
}

function getGoogle(): GoogleAccounts | undefined {
  return (window as unknown as { google?: GoogleAccounts }).google;
}

function loadGoogleIdentityScript(): Promise<void> {
  if (getGoogle()?.accounts.oauth2) return Promise.resolve();
  if (gisLoading) return gisLoading;

  gisLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GIS_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      gisLoading = null;
      reject(new Error("Impossible de charger le service de connexion Google."));
    };
    document.head.appendChild(script);
  });
  return gisLoading;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  if (!CLIENT_ID) throw new Error("La connexion Google Drive n'est pas encore configurée pour cette application.");

  await loadGoogleIdentityScript();
  const google = getGoogle();
  if (!google) throw new Error("Le service de connexion Google n'est pas disponible.");

  return new Promise<string>((resolve, reject) => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: DRIVE_SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error("La connexion à Google Drive a été refusée ou annulée."));
          return;
        }
        cachedToken = {
          value: response.access_token,
          expiresAt: Date.now() + Number(response.expires_in ?? 3600) * 1000,
        };
        resolve(response.access_token);
      },
      error_callback: () => reject(new Error("La fenêtre de connexion Google a été fermée.")),
    });
    client.requestAccessToken({ prompt: "" });
  });
}

async function driveRequest<T>(token: string, url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...init.headers },
  });
  if (!response.ok) throw new Error(`Google Drive a répondu avec une erreur (${response.status}).`);
  return (await response.json()) as T;
}

async function findOrCreateFolder(token: string): Promise<string> {
  const query = `name = '${FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const search = await driveRequest<{ files: { id: string }[] }>(
    token,
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id)&spaces=drive`,
  );
  if (search.files[0]) return search.files[0].id;

  const created = await driveRequest<{ id: string }>(token, "https://www.googleapis.com/drive/v3/files?fields=id", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: FOLDER_NAME, mimeType: "application/vnd.google-apps.folder" }),
  });
  return created.id;
}

export async function uploadPdfToDrive(pdf: Blob, fileName: string): Promise<DriveFile> {
  const token = await getAccessToken();
  const folderId = await findOrCreateFolder(token);

  const boundary = `atl-${crypto.randomUUID()}`;
  const metadata = { name: `${fileName}.pdf`, mimeType: "application/pdf", parents: [folderId] };
  const body = new Blob([
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`,
    `--${boundary}\r\nContent-Type: application/pdf\r\n\r\n`,
    pdf,
    `\r\n--${boundary}--`,
  ]);

  return driveRequest<DriveFile>(
    token,
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink",
    {
      method: "POST",
      headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
      body,
    },
  );
}
