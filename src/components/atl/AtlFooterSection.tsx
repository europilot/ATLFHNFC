import type { ReactNode } from "react";
import { AtlCheckbox, AtlInput } from "@/components/atl/AtlCell";
import { AtlSignature } from "@/components/atl/AtlSignature";
import type { AtlSectionProps, DeferredRow } from "@/types/atl";

const HIL_LABELS = ["Must be entered in HIL FORM", "To be reported on next sheet by PILOT until defect is corrected", ""];

const head =
  "border-b border-r border-black bg-slate-900 px-1 py-1.5 text-center text-[8px] font-bold uppercase leading-tight tracking-wide text-white";

function LimitationOption({
  label,
  checked,
  readOnly,
  onToggle,
}: {
  label: string;
  checked: boolean;
  readOnly: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-1 text-[9px] font-medium">
      <span className="size-4">
        <AtlCheckbox ariaLabel={`Limitation de vol ${label}`} checked={checked} readOnly={readOnly} onChange={onToggle} />
      </span>
      {label}
    </div>
  );
}

function Td({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <td className={`border-b border-r border-black p-0 align-middle ${className}`}>
      <div className="relative flex h-9 items-stretch">{children}</div>
    </td>
  );
}

export function AtlFooterSection({ page, readOnly, onChange }: AtlSectionProps) {
  const setDeferred = (index: number, patch: Partial<DeferredRow>) => {
    onChange({ deferred: page.deferred.map((row, i) => (i === index ? { ...row, ...patch } : row)) });
  };

  return (
    <>
      <div className="grid grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)] border-b border-black">
        <div className="flex flex-col border-r border-black">
          <div className="flex items-center gap-2 border-b border-black bg-slate-100 px-2 py-1">
            <span className="text-[9px] font-bold uppercase tracking-wide">Deferred items</span>
            <div className="flex items-center gap-1 text-[9px] font-semibold">
              <span className="size-4">
                <AtlCheckbox
                  ariaLabel="Éléments différés : oui"
                  checked={page.deferredActive}
                  readOnly={readOnly}
                  onChange={(v) => onChange({ deferredActive: v })}
                />
              </span>
              Yes
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] table-fixed border-collapse">
              <colgroup>
                <col style={{ width: "22%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "14%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className={head}>Items</th>
                  <th className={head}>HIL Items N°</th>
                  <th className={head}>ATA</th>
                  <th className={head}>Due date</th>
                  <th className={head}>Flight limitations</th>
                  <th className={head}>W/O</th>
                  <th className={head}>Date</th>
                  <th className={`${head} border-r-0`}>Sign. &amp; Auth #</th>
                </tr>
              </thead>
              <tbody>
                {page.deferred.map((row, index) => (
                  <tr key={index}>
                    <Td className="bg-slate-50">
                      <span className="flex items-center px-1.5 text-[8px] font-semibold leading-tight text-slate-700">
                        {HIL_LABELS[index]}
                      </span>
                    </Td>
                    <Td>
                      <AtlInput
                        ariaLabel={`Élément différé ${index + 1} numéro HIL`}
                        value={row.hil}
                        maxLength={10}
                        readOnly={readOnly}
                        onChange={(v) => setDeferred(index, { hil: v })}
                      />
                    </Td>
                    <Td>
                      <AtlInput
                        ariaLabel={`Élément différé ${index + 1} ATA`}
                        value={row.ata}
                        maxLength={6}
                        readOnly={readOnly}
                        onChange={(v) => setDeferred(index, { ata: v })}
                      />
                    </Td>
                    <Td>
                      <AtlInput
                        type="date"
                        ariaLabel={`Élément différé ${index + 1} date d'échéance`}
                        value={row.dueDate}
                        readOnly={readOnly}
                        onChange={(v) => setDeferred(index, { dueDate: v })}
                        className="text-[10px]"
                      />
                    </Td>
                    <Td>
                      <div className="flex w-full items-center justify-center gap-2 px-1">
                        <LimitationOption
                          label="Yes"
                          checked={row.limitation === "yes"}
                          readOnly={readOnly}
                          onToggle={() => setDeferred(index, { limitation: row.limitation === "yes" ? null : "yes" })}
                        />
                        <LimitationOption
                          label="None"
                          checked={row.limitation === "none"}
                          readOnly={readOnly}
                          onToggle={() => setDeferred(index, { limitation: row.limitation === "none" ? null : "none" })}
                        />
                      </div>
                    </Td>
                    <Td>
                      <AtlInput
                        ariaLabel={`Élément différé ${index + 1} W/O`}
                        value={row.wo}
                        maxLength={12}
                        readOnly={readOnly}
                        onChange={(v) => setDeferred(index, { wo: v.toUpperCase() })}
                      />
                    </Td>
                    <Td>
                      <AtlInput
                        type="date"
                        ariaLabel={`Élément différé ${index + 1} date`}
                        value={row.date}
                        readOnly={readOnly}
                        onChange={(v) => setDeferred(index, { date: v })}
                        className="text-[10px]"
                      />
                    </Td>
                    <td className="border-b border-black p-0 align-middle">
                      <div className="relative flex h-9 items-stretch">
                        <AtlInput
                          ariaLabel={`Élément différé ${index + 1} signature et autorisation`}
                          value={row.sign}
                          maxLength={16}
                          readOnly={readOnly}
                          onChange={(v) => setDeferred(index, { sign: v })}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="bg-slate-900 px-2 py-1 text-center text-[8px] font-bold uppercase tracking-wide text-white">
            CRS - Certificate of Release to Service by:
          </div>
          <div className="relative flex min-h-[2rem] items-stretch border-b border-black">
            <span className="flex w-28 shrink-0 items-center border-r border-black px-2 text-[9px] font-semibold leading-tight">
              EASA Part 145 Ident.:
            </span>
            <AtlInput
              ariaLabel="Identification EASA Part 145"
              value={page.easaIdent}
              maxLength={20}
              readOnly={readOnly}
              onChange={(v) => onChange({ easaIdent: v })}
              align="left"
            />
          </div>
          <div className="flex min-h-[2rem] items-stretch border-b border-black">
            <span className="flex w-28 shrink-0 items-center border-r border-black px-2 text-[9px] font-semibold leading-tight">
              Agreement N°
            </span>
            <AtlInput
              ariaLabel="Numéro d'agrément"
              value={page.agreementNumber}
              maxLength={20}
              readOnly={readOnly}
              onChange={(v) => onChange({ agreementNumber: v })}
              align="left"
            />
          </div>
          <p className="border-b border-black px-2 py-1 text-[7.5px] leading-snug text-slate-700">
            Certifies that the work specified, except as otherwise specified was carried out in accordance with Part 145,
            and in respect to that work, the aircraft/aircraft component is ready for release to service.
          </p>
          <div className="flex min-h-[3rem] items-stretch">
            <span className="flex w-28 shrink-0 items-center border-r border-black px-2 text-[9px] font-semibold">
              Signature:
            </span>
            <div className="min-w-0 flex-1">
              <AtlSignature
                ariaLabel="Signature CRS"
                value={page.crsSignature}
                readOnly={readOnly}
                onChange={(v) => onChange({ crsSignature: v })}
              />
            </div>
          </div>
        </div>
      </div>
      <p className="px-2 py-1.5 text-center text-[9px] text-slate-800">
        Maintenance Support Information: Flight Crew shall request technical support via{" "}
        <span className="font-semibold">camo@jgaviation.eu</span> <span className="font-bold">+33 3 84 65 51 11</span>
      </p>
    </>
  );
}
