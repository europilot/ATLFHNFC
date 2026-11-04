import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { AtlArchiveList } from "@/components/atl/AtlArchiveList";
import { AtlDocument } from "@/components/atl/AtlDocument";
import { AtlToolbar, type AtlView } from "@/components/atl/AtlToolbar";
import { useAtlStore } from "@/hooks/useAtlStore";

function formatArchiveDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function App() {
  const { currentPage, archives, updatePage, archiveCurrent, deleteArchive } = useAtlStore();
  const [view, setView] = useState<AtlView>("current");
  const [selectedArchiveId, setSelectedArchiveId] = useState<string | null>(null);

  const selectedArchive = archives.find((p) => p.id === selectedArchiveId) ?? null;
  const viewedPage = view === "current" ? currentPage : selectedArchive;

  const changeView = (next: AtlView) => {
    setView(next);
    setSelectedArchiveId(null);
  };

  const archive = () => {
    archiveCurrent();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      <AtlToolbar
        view={view}
        archiveCount={archives.length}
        onViewChange={changeView}
        onArchive={archive}
        onPrint={() => window.print()}
      />

      <main className="mx-auto max-w-[90rem] px-4 py-6 md:px-6 print:max-w-none print:p-0">
        {view === "archives" && !selectedArchive && (
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Pages archivées</h2>
              <p className="text-sm text-slate-500">Consultez, imprimez ou exportez les pages validées.</p>
            </div>
            <AtlArchiveList archives={archives} onOpen={setSelectedArchiveId} onDelete={deleteArchive} />
          </section>
        )}

        {viewedPage && (view === "current" || selectedArchive) && (
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
              {selectedArchive ? (
                <button
                  type="button"
                  onClick={() => setSelectedArchiveId(null)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900"
                >
                  <ArrowLeft className="size-4" />
                  Retour aux archives
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  Enregistrement automatique sur cet appareil
                </div>
              )}
              <p className="text-sm font-medium text-slate-700">
                Page N° {viewedPage.pageNumber}
                {viewedPage.archivedAt
                  ? ` · archivée le ${formatArchiveDate(viewedPage.archivedAt)}`
                  : " · en cours"}
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 print:rounded-none print:p-0 print:shadow-none print:ring-0">
              <AtlDocument
                page={viewedPage}
                readOnly={viewedPage.archivedAt !== null}
                onChange={(patch) => updatePage(viewedPage.id, patch)}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
