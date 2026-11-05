import { useCallback, useState } from "react";
import { atlFileName, buildAtlPdf } from "@/lib/atlPdf";
import { uploadPdfToDrive } from "@/lib/googleDrive";
import type { AtlPage } from "@/types/atl";

export type ExportState =
  | { status: "working"; message: string }
  | { status: "done"; message: string; link?: string }
  | { status: "error"; message: string };

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Une erreur inattendue est survenue.";
}

export function useArchiveExport() {
  const [states, setStates] = useState<Record<string, ExportState>>({});

  const setState = useCallback((id: string, state: ExportState | null) => {
    setStates((current) => {
      const next = { ...current };
      if (state) next[id] = state;
      else delete next[id];
      return next;
    });
  }, []);

  const download = useCallback(
    async (page: AtlPage) => {
      setState(page.id, { status: "working", message: "Génération du PDF en cours..." });
      try {
        const pdf = await buildAtlPdf(page);
        const url = URL.createObjectURL(pdf);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${atlFileName(page)}.pdf`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
        setState(page.id, { status: "done", message: "PDF téléchargé." });
      } catch (error) {
        setState(page.id, { status: "error", message: errorMessage(error) });
      }
    },
    [setState],
  );

  const sendToDrive = useCallback(
    async (page: AtlPage) => {
      setState(page.id, { status: "working", message: "Génération du PDF en cours..." });
      try {
        const pdf = await buildAtlPdf(page);
        setState(page.id, { status: "working", message: "Envoi vers Google Drive..." });
        const file = await uploadPdfToDrive(pdf, atlFileName(page));
        setState(page.id, {
          status: "done",
          message: "Fichier envoyé dans Google Drive.",
          link: file.webViewLink,
        });
      } catch (error) {
        setState(page.id, { status: "error", message: errorMessage(error) });
      }
    },
    [setState],
  );

  return { states, download, sendToDrive };
}
