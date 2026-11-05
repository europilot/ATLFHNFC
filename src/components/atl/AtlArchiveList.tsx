import { ArchiveX } from "lucide-react";
import { AtlArchiveCard } from "@/components/atl/AtlArchiveCard";
import { useArchiveExport } from "@/hooks/useArchiveExport";
import type { AtlPage } from "@/types/atl";

type AtlArchiveListProps = {
  archives: AtlPage[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
};

export function AtlArchiveList({ archives, onOpen, onDelete }: AtlArchiveListProps) {
  const { states, download, sendToDrive } = useArchiveExport();

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
      {archives.map((page) => (
        <AtlArchiveCard
          key={page.id}
          page={page}
          exportState={states[page.id]}
          onOpen={() => onOpen(page.id)}
          onDelete={() => onDelete(page.id)}
          onDownload={() => void download(page)}
          onSendToDrive={() => void sendToDrive(page)}
        />
      ))}
    </ul>
  );
}
