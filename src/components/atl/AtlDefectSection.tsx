import type { ReactNode } from "react";
import { AtlInput, AtlOutput, AtlTextarea, CaseNo } from "@/components/atl/AtlCell";
import type { AtlSectionProps, DefectRow } from "@/types/atl";

const head =
  "border-b border-r border-black bg-slate-900 px-1 py-1.5 text-center text-[9px] font-bold uppercase leading-tight tracking-wide text-white";

function Cell({ caseNumber, children }: { caseNumber?: number; children: ReactNode }) {
  return (
    <td className="border-b border-r border-black p-0 align-top">
      <div className="relative flex min-h-[2rem] items-stretch">
        {caseNumber !== undefined && <CaseNo n={caseNumber} />}
        {children}
      </div>
    </td>
  );
}

export function AtlDefectSection({ page, readOnly, onChange }: AtlSectionProps) {
  const setDefect = (index: number, patch: Partial<DefectRow>) => {
    onChange({ defects: page.defects.map((row, i) => (i === index ? { ...row, ...patch } : row)) });
  };

  return (
    <div className="border-b border-black">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col style={{ width: 72 }} />
          <col style={{ width: "34%" }} />
          <col style={{ width: "26%" }} />
          <col style={{ width: 120 }} />
          <col style={{ width: 112 }} />
          <col style={{ width: 150 }} />
        </colgroup>
        <thead>
          <tr>
            <th className={head}>Sector</th>
            <th className={head}>Defect report / technical remarks</th>
            <th className={head}>Action taken (by authorized staff only)</th>
            <th className={head}>W/O - Task</th>
            <th className={head}>Date</th>
            <th className={`${head} border-r-0`}>Sign. &amp; Auth #</th>
          </tr>
        </thead>
        <tbody>
          {page.defects.map((row, index) => (
            <tr key={index}>
              <Cell caseNumber={index === 0 ? 26 : undefined}>
                <AtlOutput value={String(index + 1)} className="py-2" />
              </Cell>
              <Cell caseNumber={index === 0 ? 27 : undefined}>
                <AtlTextarea
                  ariaLabel={`Défaut ${index + 1} description`}
                  value={row.defect}
                  readOnly={readOnly}
                  onChange={(v) => setDefect(index, { defect: v })}
                  className="py-1.5"
                />
              </Cell>
              <Cell>
                <AtlTextarea
                  ariaLabel={`Défaut ${index + 1} action réalisée`}
                  value={row.action}
                  readOnly={readOnly}
                  onChange={(v) => setDefect(index, { action: v })}
                  className="py-1.5"
                />
              </Cell>
              <Cell>
                <AtlInput
                  ariaLabel={`Défaut ${index + 1} W/O task`}
                  value={row.wo}
                  sanitize={(v) => v.toUpperCase()}
                  maxLength={12}
                  readOnly={readOnly}
                  onChange={(v) => setDefect(index, { wo: v })}
                  className="py-2"
                />
              </Cell>
              <Cell>
                <AtlInput
                  type="date"
                  ariaLabel={`Défaut ${index + 1} date`}
                  value={row.date}
                  readOnly={readOnly}
                  onChange={(v) => setDefect(index, { date: v })}
                  className="py-2 text-[10px]"
                />
              </Cell>
              <td className="border-b border-black p-0 align-top">
                <div className="relative flex min-h-[1.75rem] items-stretch">
                  <AtlInput
                    ariaLabel={`Défaut ${index + 1} signature et autorisation`}
                    value={row.sign}
                    maxLength={16}
                    readOnly={readOnly}
                    onChange={(v) => setDefect(index, { sign: v })}
                    className="py-2"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
