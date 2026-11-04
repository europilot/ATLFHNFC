import { Archive, Plane, Printer } from "lucide-react";
import { useState, type ReactNode } from "react";

export type AtlView = "current" | "archives";

type AtlToolbarProps = {
  view: AtlView;
  archiveCount: number;
  onViewChange: (view: AtlView) => void;
  onArchive: () => void;
  onPrint: () => void;
};

export function AtlToolbar({ view, archiveCount, onViewChange, onArchive, onPrint }: AtlToolbarProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm">
            <Plane className="size-5 -rotate-45" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight text-slate-900">Carnet de route ATL</h1>
            <p className="text-xs text-slate-500">GREMAR SAS · PC12/47E · F-HNFC</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div role="tablist" className="inline-flex rounded-lg bg-slate-100 p-1">
            <TabButton active={view === "current"} onClick={() => onViewChange("current")}>
              Carnet en cours
            </TabButton>
            <TabButton active={view === "archives"} onClick={() => onViewChange("archives")}>
              Archives
              <span className="ml-1.5 rounded-full bg-slate-200 px-1.5 text-[10px] font-semibold text-slate-700">
                {archiveCount}
              </span>
            </TabButton>
          </div>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
          >
            <Printer className="size-4" />
            Imprimer
          </button>

          {view === "current" &&
            (confirming ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirming(false);
                    onArchive();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-800 active:scale-[0.98]"
                >
                  <Archive className="size-4" />
                  Confirmer l'archivage
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98]"
              >
                <Archive className="size-4" />
                Archiver et créer la page suivante
              </button>
            ))}
        </div>
      </div>
    </header>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
        active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
      }`}
    >
      {children}
    </button>
  );
}
