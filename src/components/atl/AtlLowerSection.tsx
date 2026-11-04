import { AtlInput, AtlOutput, CaseNo } from "@/components/atl/AtlCell";
import { formatNum, pageTotals } from "@/lib/atlCalc";
import { sanitizeDigits, sanitizeTime } from "@/lib/atlInputRules";
import type { AtlSectionProps, GroundRow } from "@/types/atl";

const groundHead =
  "border-b border-r border-black bg-slate-100 px-1 py-1 text-center text-[8px] font-bold uppercase leading-tight text-slate-900";

export function AtlLowerSection({ page, readOnly, onChange }: AtlSectionProps) {
  const totals = pageTotals(page);
  const setGround = (index: number, patch: Partial<GroundRow>) => {
    onChange({ ground: page.ground.map((row, i) => (i === index ? { ...row, ...patch } : row)) });
  };

  return (
    <div className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,2.5fr)_minmax(0,1.25fr)] border-b border-black">
      <div className="flex flex-col border-r border-black">
        <div className="relative flex min-h-[2.25rem] items-stretch border-b border-black">
          <div className="flex w-28 shrink-0 items-center border-r border-black px-2 text-[10px] font-bold leading-tight">
            Remaining fuel (lbs)
          </div>
          <div className="relative flex min-w-0 flex-1 items-stretch">
            <CaseNo n={21} />
            <AtlInput
              ariaLabel="Carburant restant de la page (lbs)"
              value={page.remainingFuelEnd}
              sanitize={(v) => sanitizeDigits(v, 5)}
              inputMode="numeric"
              readOnly={readOnly}
              onChange={(v) => onChange({ remainingFuelEnd: v })}
            />
          </div>
        </div>
        <p className="flex flex-1 items-center justify-center px-3 py-2 text-center text-[8px] font-semibold uppercase leading-snug tracking-wide text-slate-600">
          Engine condition trend data are electronically recorded
        </p>
      </div>

      <div className="flex flex-col border-r border-black">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: "16%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr>
              <th colSpan={6} className="border-b border-r border-black bg-slate-900 px-1 py-1 text-center text-[9px] font-bold uppercase tracking-wide text-white">
                Ground / Anti / De-ice
              </th>
            </tr>
            <tr>
              <th className={groundHead}>Sector N°</th>
              <th className={groundHead}>Type</th>
              <th className={groundHead}>Mix %</th>
              <th className={groundHead}>Start</th>
              <th className={groundHead}>End</th>
              <th className={`${groundHead} border-r-0`}>Holdover</th>
            </tr>
          </thead>
          <tbody>
            {page.ground.map((row, index) => (
              <tr key={index}>
                <td className="border-b border-r border-black p-0">
                  <AtlInput
                    ariaLabel={`Sol ${index + 1} numéro de secteur`}
                    value={row.sector}
                    sanitize={(v) => sanitizeDigits(v, 2)}
                    inputMode="numeric"
                    readOnly={readOnly}
                    onChange={(v) => setGround(index, { sector: v })}
                    className="h-8"
                  />
                </td>
                <td className="border-b border-r border-black p-0">
                  <AtlInput
                    ariaLabel={`Sol ${index + 1} type`}
                    value={row.type}
                    maxLength={10}
                    readOnly={readOnly}
                    onChange={(v) => setGround(index, { type: v })}
                    className="h-8"
                  />
                </td>
                <td className="border-b border-r border-black p-0">
                  <AtlInput
                    ariaLabel={`Sol ${index + 1} mélange %`}
                    value={row.mix}
                    sanitize={(v) => sanitizeDigits(v, 3)}
                    inputMode="numeric"
                    readOnly={readOnly}
                    onChange={(v) => setGround(index, { mix: v })}
                    className="h-8"
                  />
                </td>
                <td className="border-b border-r border-black p-0">
                  <AtlInput
                    ariaLabel={`Sol ${index + 1} début`}
                    value={row.start}
                    sanitize={sanitizeTime}
                    inputMode="numeric"
                    placeholder="hh:mm"
                    readOnly={readOnly}
                    onChange={(v) => setGround(index, { start: v })}
                    className="h-8"
                  />
                </td>
                <td className="border-b border-r border-black p-0">
                  <AtlInput
                    ariaLabel={`Sol ${index + 1} fin`}
                    value={row.end}
                    sanitize={sanitizeTime}
                    inputMode="numeric"
                    placeholder="hh:mm"
                    readOnly={readOnly}
                    onChange={(v) => setGround(index, { end: v })}
                    className="h-8"
                  />
                </td>
                <td className="border-b border-black p-0">
                  <AtlInput
                    ariaLabel={`Sol ${index + 1} holdover`}
                    value={row.holdover}
                    maxLength={10}
                    readOnly={readOnly}
                    onChange={(v) => setGround(index, { holdover: v })}
                    className="h-8"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-[1fr_4.5rem_4.5rem] border-b border-black bg-slate-100 text-[8px] font-bold uppercase tracking-wide text-slate-700">
          <span className="px-2 py-1" />
          <span className="border-l border-black px-1 py-1 text-center">Hours</span>
          <span className="border-l border-black px-1 py-1 text-center">LDG</span>
        </div>
        <div className="grid grid-cols-[1fr_4.5rem_4.5rem] border-b border-black">
          <span className="flex items-center px-2 text-[10px] font-semibold uppercase tracking-wide">Daily total</span>
          <div className="relative flex h-9 items-stretch border-l border-black">
            <CaseNo n={22} />
            <AtlOutput value={formatNum(totals.dailyTime, 1)} />
          </div>
          <div className="relative flex h-9 items-stretch border-l border-black">
            <CaseNo n={23} />
            <AtlOutput value={formatNum(totals.dailyLdg, 0)} />
          </div>
        </div>
        <div className="grid grid-cols-[1fr_4.5rem_4.5rem] border-b border-black">
          <span className="flex items-center px-2 text-[10px] font-bold uppercase tracking-wide">New total</span>
          <div className="relative flex h-9 items-stretch border-l border-black">
            <CaseNo n={24} />
            <AtlOutput value={formatNum(totals.newTime, 1)} />
          </div>
          <div className="relative flex h-9 items-stretch border-l border-black">
            <CaseNo n={25} />
            <AtlOutput value={formatNum(totals.newLdg, 0)} />
          </div>
        </div>
        <p className="px-2 py-1 text-right text-[8px] italic text-slate-600">To be reported on next page</p>
      </div>
    </div>
  );
}
