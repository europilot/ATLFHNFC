import { ArchiveX, ChevronRight, Clock, Plane, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatNum, pageTotals } from "@/lib/atlCalc";
import type { AtlPage } from "@/types/atl";

type AtlArchiveListProps = {
  archives: AtlPage[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
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

export function AtlArchiveList({ archives, onOpen, onDelete }: AtlArchiveListProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  if (archives.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <ArchiveX className="size-5" />
        </div>
        <p className="text-sm font-semibold text-slate-900">Aucune page archivée</p>
        <p className="text-sm text-slate-500">
          Lorsque vous archivez une page, elle apparaît ici avec tous ses vols et ses signatures.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {archives.map((page) => {
        const totals = pageTotals(page);
        const confirmingDelete = pendingDeleteId === page.id;
        return (
          <li
            key={page.id}
            className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => onOpen(page.id)}
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

            {confirmingDelete ? (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-red-100 bg-red-50 px-5 py-3">
                <p className="text-sm font-medium text-red-800">Supprimer définitivement cette page ?</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(null)}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-white"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingDeleteId(null);
                      onDelete(page.id);
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
                onClick={() => setPendingDeleteId(page.id)}
                className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-red-50 hover:text-red-600 hover:ring-red-200"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
