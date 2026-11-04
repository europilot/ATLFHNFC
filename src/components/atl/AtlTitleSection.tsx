import type { ReactNode } from "react";
import { AtlInput, CaseNo } from "@/components/atl/AtlCell";
import type { AtlSectionProps } from "@/types/atl";

function HeaderField({ label, caseNumber, children }: { label: string; caseNumber?: number; children: ReactNode }) {
  return (
    <div className="flex min-h-[2rem] items-stretch border-b border-black last:border-b-0">
      <div className="relative flex w-28 shrink-0 items-center border-r border-black px-2 text-[10px] font-semibold leading-tight">
        {caseNumber !== undefined && <CaseNo n={caseNumber} />}
        {label}
      </div>
      <div className="relative flex min-w-0 flex-1 items-stretch">{children}</div>
    </div>
  );
}

export function AtlTitleSection({ page, readOnly, onChange }: AtlSectionProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.3fr)] border-b border-black">
      <div className="flex flex-col justify-center border-r border-black p-2.5">
        <p className="text-sm font-extrabold tracking-wide">GREMAR SAS</p>
        <p className="text-[8px] leading-tight text-slate-700">ZA Malataverne</p>
        <p className="text-[10px] leading-tight">26200 Montélimar</p>
      </div>

      <div className="flex flex-col items-center justify-center border-r border-black px-2 py-2 text-center">
        <h1 className="text-lg font-bold leading-tight tracking-tight">AEROPLANE TECH LOG (ATL)</h1>
        <p className="text-[9px] text-slate-700">& Flight log, Maintenance Log - Certif to Release to Serv (CRS)</p>
      </div>

      <div className="flex flex-col justify-center">
        <HeaderField label="Date">
          <AtlInput
            type="date"
            ariaLabel="Date du document"
            value={page.date}
            readOnly={readOnly}
            onChange={(v) => onChange({ date: v })}
          />
        </HeaderField>
      </div>
    </div>
  );
}
