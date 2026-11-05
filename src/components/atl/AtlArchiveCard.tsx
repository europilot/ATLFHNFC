import { ChevronRight, Clock, Download, Loader2, Plane, Trash2, CloudUpload, ExternalLink } from "lucide-react";
import { useState } from "react";
import { formatNum, pageTotals } from "@/lib/atlCalc";
import { isGoogleDriveConfigured } from "@/lib/googleDrive";
import type { ExportState } from "@/hooks/useArchiveExport";
import type { AtlPage } from "@/types/atl";

type AtlArchiveCardProps = {
  page: AtlPage;
  exportState?: ExportState;
  onOpen: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onSendToDrive: () => void;
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const statusClass: Record<ExportState["status"], string> = {
  working: "text-slate-600",
  done: "text-emerald-700",
  error: "text-red-700",
};

export function AtlArchiveCard({
  page,
  exportState,
  onOpen,
  onDelete,
  onDownload,
  onSendToDrive,
}: AtlArchiveCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const totals = pageTotals(page);
  const busy = exportState?.status === "working";

  return (
    <li className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={onOpen}
        className="group flex w-full flex-col gap-4 p-5 text-left transition-transform active:scale-[0.99]"
      >
        <div className="flex items-start justify-between gap-3 pr-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Page ATL</p>
            <p className="text-2xl font-bold tabular-nums text-slate-900">N° {page.pageNumber}</p>
          </div>
          <span className="flex size-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700 transition-colors group-hover:bg-sky-100">
            <Plane className="size-4 -rotate-45" />
          </span>
        </div>

        <dl className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Vols</dt>
            <dd className="font-semibold tabular-nums text-slate-900">{page.flights.length}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Heures</dt>
            <dd className="font-semibold tabular-nums text-slate-900">{formatNum(totals.dailyTime, 1)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Atterrissages</dt>
            <dd className="font-semibold tabular-nums text-slate-900">{formatNum(totals.dailyLdg, 0)}</dd>
          </div>
        </dl>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {page.archivedAt ? formatDateTime(page.archivedAt) : ""}
          </span>
          <span className="inline-flex items-center gap-0.5 font-semibold text-sky-700">
            Consulter
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </button>

      <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onDownload}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="size-4" />
            Télécharger le PDF
          </button>
          <button
            type="button"
            onClick={onSendToDrive}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CloudUpload className="size-4" />
            Exporter vers Google Drive
          </button>
        </div>

        {exportState && (
          <p role="status" className={`flex flex-wrap items-center gap-1.5 text-xs font-medium ${statusClass[exportState.status]}`}>
            {exportState.status === "working" && <Loader2 className="size-3.5 animate-spin" />}
            {exportState.message}
            {exportState.status === "done" && exportState.link && (
              <a
                href={exportState.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-blue-700 underline-offset-2 hover:underline"
              >
                Ouvrir dans Google Drive
                <ExternalLink className="size-3" />
              </a>
            )}
          </p>
        )}
        {!isGoogleDriveConfigured() && (
          <p className="text-xs text-slate-500">La connexion Google Drive n'est pas encore configurée.</p>
        )}
      </div>

      {confirmingDelete ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-red-100 bg-red-50 px-5 py-3">
          <p className="text-sm font-medium text-red-800">Supprimer définitivement cette page ?</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-white"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmingDelete(false);
                onDelete();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 active:scale-[0.98]"
            >
              <Trash2 className="size-4" />
              Supprimer
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          aria-label={`Supprimer la page ${page.pageNumber}`}
          onClick={() => setConfirmingDelete(true)}
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-red-50 hover:text-red-600 hover:ring-red-200"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </li>
  );
}
