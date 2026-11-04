import { AtlCheckbox, AtlInput, CaseNo } from "@/components/atl/AtlCell";
import { AtlSignature } from "@/components/atl/AtlSignature";
import { AIRCRAFT } from "@/lib/atlConstants";
import { sanitizeDecimal, sanitizeDigits, sanitizeTime } from "@/lib/atlInputRules";
import type { AtlSectionProps, ServicingChecks } from "@/types/atl";

const PIC_NOTE =
  "* PIC acceptance confirms correct completion of crew pre-flight inspection, ground Anti/De-icing, acceptance of aircraft/defect, sufficient fuel and oil for planned trip.";

function ServicingCheck({
  label,
  checked,
  readOnly,
  onChange,
}: {
  label: string;
  checked: boolean;
  readOnly: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[8px] font-semibold uppercase text-slate-700">{label}</span>
      <div className="h-7 w-7">
        <AtlCheckbox ariaLabel={label} checked={checked} readOnly={readOnly} onChange={onChange} />
      </div>
    </div>
  );
}

const TIRE_ROWS = [[0], [1, 2]];

export function AtlStatusSection({ page, readOnly, onChange }: AtlSectionProps) {
  const setServicing = (patch: Partial<ServicingChecks>) => onChange({ servicing: { ...page.servicing, ...patch } });
  const setTire = (index: number, value: boolean) => {
    const tire = [...page.servicing.tire] as ServicingChecks["tire"];
    tire[index] = value;
    setServicing({ tire });
  };

  return (
    <>
      <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)_minmax(0,1.7fr)_minmax(0,1.6fr)] border-b border-black text-[11px]">
        <div className="relative flex flex-col justify-between border-r border-black p-2">
          <CaseNo n={2} />
          <div>
            <p className="text-[11px] font-bold leading-tight">Servicing &amp; Pre-flight inspection</p>
            <p className="text-[10px] leading-tight">by approved personnel only</p>
          </div>
        </div>

        <div className="flex flex-col border-r border-black">
          <p className="border-b border-black px-2 py-1 text-[9px] leading-tight text-slate-700">
            Autorisation / Time / Signature (Authorized staff)
          </p>
          <div className="flex min-h-[3.25rem] flex-1 items-stretch">
            <div className="w-20 shrink-0 border-r border-black">
              <AtlInput
                ariaLabel="Heure d'autorisation"
                value={page.authTime}
                sanitize={sanitizeTime}
                inputMode="numeric"
                placeholder="hh:mm"
                readOnly={readOnly}
                onChange={(v) => onChange({ authTime: v })}
              />
            </div>
            <div className="min-w-0 flex-1">
              <AtlSignature
                ariaLabel="Signature d'autorisation"
                value={page.authSignature}
                readOnly={readOnly}
                onChange={(v) => onChange({ authSignature: v })}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-around gap-1 border-r border-black px-2 py-1.5">
          <ServicingCheck
            label="Hyd"
            checked={page.servicing.hyd}
            readOnly={readOnly}
            onChange={(v) => setServicing({ hyd: v })}
          />
          <ServicingCheck
            label="Toilet"
            checked={page.servicing.toilet}
            readOnly={readOnly}
            onChange={(v) => setServicing({ toilet: v })}
          />
          <ServicingCheck
            label="O2"
            checked={page.servicing.o2}
            readOnly={readOnly}
            onChange={(v) => setServicing({ o2: v })}
          />
          <ServicingCheck
            label="Oil"
            checked={page.servicing.oil}
            readOnly={readOnly}
            onChange={(v) => setServicing({ oil: v })}
          />
          <div className="flex flex-col items-center gap-1">
            <span className="text-[8px] font-semibold uppercase text-slate-700">Tire press</span>
            <div className="flex flex-col items-center gap-0.5">
              {TIRE_ROWS.map((row) => (
                <div key={row[0]} className="flex gap-0.5">
                  {row.map((i) => (
                    <div key={i} className="h-3.5 w-3.5">
                      <AtlCheckbox
                        ariaLabel={`Pression pneu ${i + 1}`}
                        checked={page.servicing.tire[i]}
                        readOnly={readOnly}
                        onChange={(v) => setTire(i, v)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-[4.5rem_1fr] border-b border-black">
            <span className="border-r border-black px-2 py-1 text-[10px] font-semibold">A/C Type</span>
            <span className="px-2 py-1 font-bold">{AIRCRAFT.type}</span>
          </div>
          <div className="grid grid-cols-[4.5rem_1fr_3.5rem_1fr] border-b border-black">
            <span className="border-r border-black px-2 py-1 text-[10px] font-semibold">SN</span>
            <span className="border-r border-black px-2 py-1 font-bold">{AIRCRAFT.serial}</span>
            <span className="border-r border-black px-2 py-1 text-[10px] font-semibold">Tail</span>
            <span className="px-2 py-1 font-bold">{AIRCRAFT.tail}</span>
          </div>
          <div className="bg-slate-900 px-2 py-1 text-center text-[9px] font-bold uppercase tracking-wide text-white">
            Next maint. inspection refer to ACAS
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] border-b border-black">
        <p className="flex items-center px-2 py-1 text-[9px] leading-snug text-slate-700">{PIC_NOTE}</p>
        <div className="w-[17.5rem] border-l border-black">
          <div className="bg-slate-900 px-2 py-1 text-center text-[9px] font-bold uppercase tracking-wide text-white">
            Previous report
          </div>
          <div className="grid grid-cols-2">
            <div className="relative flex h-8 items-stretch border-r border-black">
              <CaseNo n={3} />
              <AtlInput
                ariaLabel="Report précédent, total heures"
                value={page.previousTotalTime}
                sanitize={sanitizeDecimal}
                inputMode="decimal"
                readOnly={readOnly}
                onChange={(v) => onChange({ previousTotalTime: v })}
              />
            </div>
            <div className="relative flex h-8 items-stretch">
              <CaseNo n={4} />
              <AtlInput
                ariaLabel="Report précédent, atterrissages"
                value={page.previousTotalLdg}
                sanitize={(v) => sanitizeDigits(v, 6)}
                inputMode="numeric"
                readOnly={readOnly}
                onChange={(v) => onChange({ previousTotalLdg: v })}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
