import { Plus, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { AtlCounterDialog } from "@/components/atl/AtlCounterDialog";
import { AtlInput, AtlOutput, CaseNo } from "@/components/atl/AtlCell";
import { AtlSignature } from "@/components/atl/AtlSignature";
import {
  blockOffHHMM,
  blockOnHHMM,
  blockTimeHHMM,
  decimalHoursToHHMM,
  formatNum,
  fuelTotal,
  landingHHMM,
} from "@/lib/atlCalc";
import { createFlight } from "@/lib/atlPages";
import {
  sanitizeAsked,
  sanitizeDecimal,
  sanitizeDigits,
  sanitizeLetters,
  sanitizeTime,
} from "@/lib/atlInputRules";
import type { AtlSectionProps, Flight } from "@/types/atl";

const COLUMN_WIDTHS = [62, 56, 62, 62, 48, 48, 64, 34, 56, 56, 44, 48, 48, 64, 60, 60, 60, 60, 64, 60, 48, 32];

const headCell =
  "border-b border-r border-black bg-slate-100 px-0.5 py-1 text-center text-[8px] font-bold uppercase leading-tight text-slate-900";
const barCell =
  "border-b border-r border-black bg-slate-900 px-1 py-1 text-center text-[9px] font-bold uppercase leading-tight tracking-wide text-white";

function Td({ caseNumber, children }: { caseNumber?: number; children?: ReactNode }) {
  return (
    <td className="border-b border-r border-black p-0 align-top">
      <div className="relative flex h-9 items-stretch">
        {caseNumber !== undefined && <CaseNo n={caseNumber} />}
        {children}
      </div>
    </td>
  );
}

export function AtlFlightTable({ page, readOnly, onChange }: AtlSectionProps) {
  const [counterFlightId, setCounterFlightId] = useState<string | null>(null);

  const updateFlight = (id: string, patch: Partial<Flight>) => {
    onChange({ flights: page.flights.map((f) => (f.id === id ? { ...f, ...patch } : f)) });
  };

  const addFlight = () => {
    onChange({ flights: [...page.flights, createFlight()] });
  };

  const removeFlight = (id: string) => {
    onChange({ flights: page.flights.filter((f) => f.id !== id) });
  };

  return (
    <div>
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          {COLUMN_WIDTHS.map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th colSpan={4} className={barCell}>
              Fuel information
            </th>
            <th className={barCell}>Oil ref.</th>
            <th className={barCell}>PRIST</th>
            <th className={barCell}>Acceptance</th>
            <th rowSpan={2} className={`${barCell} [writing-mode:vertical-rl] rotate-180`}>
              Sect or
            </th>
            <th colSpan={2} className={barCell}>
              Flight
            </th>
            <th className={barCell}>Pax</th>
            <th colSpan={2} className={barCell}>
              Crew
            </th>
            <th colSpan={8} className={barCell}>
              Flight time
            </th>
            <th rowSpan={2} className="border-b border-black bg-slate-100" />
          </tr>
          <tr>
            <th className={headCell}>Remaining (lbs)</th>
            <th className={headCell}>Uplift asked</th>
            <th className={headCell}>Uplift delivered (Ltr)</th>
            <th className={headCell}>Total (lbs)</th>
            <th className={headCell}>Qty (quarts)</th>
            <th className={headCell}>Qty</th>
            <th className={headCell}>* PIC</th>
            <th className={headCell}>From</th>
            <th className={headCell}>To</th>
            <th className={headCell}>Nbr</th>
            <th className={headCell}>PIC</th>
            <th className={headCell}>SIC</th>
            <th className={headCell}>Block off</th>
            <th className={headCell}>T/O</th>
            <th className={headCell}>Landing</th>
            <th className={headCell}>Block on</th>
            <th className={headCell}>Block time</th>
            <th className={headCell}>Hours : minutes</th>
            <th className={headCell}>Decimal</th>
            <th className={headCell}>Nbr LDG</th>
          </tr>
        </thead>
        <tbody>
          {page.flights.map((f, index) => {
            const total = fuelTotal(f);
            const totalText =
              total === null ? "" : formatNum(total, Number.isInteger(total) ? 0 : 1);
            const set = (patch: Partial<Flight>) => updateFlight(f.id, patch);
            return (
              <tr key={f.id}>
                <Td caseNumber={5}>
                  <AtlInput
                    ariaLabel={`Vol ${index + 1} carburant restant`}
                    value={f.remainingFuel}
                    sanitize={(v) => sanitizeDigits(v, 5)}
                    inputMode="numeric"
                    readOnly={readOnly}
                    onChange={(v) => set({ remainingFuel: v })}
                  />
                </Td>
                <Td caseNumber={6}>
                  <AtlInput
                    ariaLabel={`Vol ${index + 1} uplift demandé`}
                    value={f.upliftAsked}
                    sanitize={sanitizeAsked}
                    maxLength={4}
                    readOnly={readOnly}
                    onChange={(v) => set({ upliftAsked: v })}
                  />
                </Td>
                <Td caseNumber={7}>
                  <AtlInput
                    ariaLabel={`Vol ${index + 1} uplift livré`}
                    value={f.upliftDelivered}
                    sanitize={sanitizeDecimal}
                    inputMode="decimal"
                    readOnly={readOnly}
                    onChange={(v) => set({ upliftDelivered: v })}
                  />
                </Td>
                <Td caseNumber={8}>
                  <AtlOutput value={totalText} className="text-[11px]" />
                </Td>
                <Td caseNumber={9}>
                  <AtlInput
                    ariaLabel={`Vol ${index + 1} huile quantité`}
                    value={f.oilQty}
                    sanitize={(v) => sanitizeDigits(v, 3)}
                    inputMode="numeric"
                    readOnly={readOnly}
                    onChange={(v) => set({ oilQty: v })}
                  />
                </Td>
                <Td caseNumber={10}>
                  <AtlInput
                    ariaLabel={`Vol ${index + 1} PRIST quantité`}
                    value={f.pristQty}
                    sanitize={(v) => sanitizeDigits(v, 3)}
                    inputMode="numeric"
                    readOnly={readOnly}
                    onChange={(v) => set({ pristQty: v })}
                  />
                </Td>
                <Td caseNumber={11}>
                  <AtlSignature
                    ariaLabel={`Vol ${index + 1} acceptation PIC`}
                    value={f.picAcceptance}
                    readOnly={readOnly}
                    onChange={(v) => set({ picAcceptance: v })}
                  />
                </Td>
                <Td caseNumber={12}>
                  <AtlOutput value={String(index + 1)} className="text-[11px]" />
                </Td>
                <Td caseNumber={13}>
                  <AtlInput
                    ariaLabel={`Vol ${index + 1} départ (OACI)`}
                    value={f.from}
                    sanitize={(v) => sanitizeLetters(v, 4)}
                    maxLength={4}
                    placeholder="ICAO"
                    readOnly={readOnly}
                    onChange={(v) => set({ from: v })}
                  />
                </Td>
                <Td caseNumber={14}>
                  <AtlInput
                    ariaLabel={`Vol ${index + 1} arrivée (OACI)`}
                    value={f.to}
                    sanitize={(v) => sanitizeLetters(v, 4)}
                    maxLength={4}
                    placeholder="ICAO"
                    readOnly={readOnly}
                    onChange={(v) => set({ to: v })}
                  />
                </Td>
                <Td caseNumber={15}>
                  <AtlInput
                    ariaLabel={`Vol ${index + 1} nombre de passagers`}
                    value={f.pax}
                    sanitize={(v) => sanitizeDigits(v, 1)}
                    inputMode="numeric"
                    readOnly={readOnly}
                    onChange={(v) => set({ pax: v })}
                  />
                </Td>
                <Td caseNumber={16}>
                  <AtlInput
                    ariaLabel={`Vol ${index + 1} PIC initiales`}
                    value={f.pic}
                    sanitize={(v) => sanitizeLetters(v, 3)}
                    maxLength={3}
                    readOnly={readOnly}
                    onChange={(v) => set({ pic: v })}
                  />
                </Td>
                <Td caseNumber={17}>
                  <AtlInput
                    ariaLabel={`Vol ${index + 1} SIC initiales`}
                    value={f.sic}
                    sanitize={(v) => sanitizeLetters(v, 3)}
                    maxLength={3}
                    readOnly={readOnly}
                    onChange={(v) => set({ sic: v })}
                  />
                </Td>
                <Td caseNumber={18}>
                  <AtlOutput value={blockOffHHMM(f)} className="text-[11px]" />
                </Td>
                <Td>
                  <AtlInput
                    ariaLabel={`Vol ${index + 1} décollage`}
                    value={f.takeoff}
                    sanitize={sanitizeTime}
                    inputMode="numeric"
                    placeholder="hh:mm"
                    readOnly={readOnly}
                    onChange={(v) => set({ takeoff: v })}
                  />
                </Td>
                <Td>
                  <AtlOutput value={landingHHMM(f)} className="text-[11px]" />
                </Td>
                <Td>
                  <AtlOutput value={blockOnHHMM(f)} className="text-[11px]" />
                </Td>
                <Td>
                  <AtlOutput value={blockTimeHHMM(f)} className="text-[11px]" />
                </Td>
                <Td>
                  <AtlOutput value={decimalHoursToHHMM(f.flightDecimal)} className="text-[11px]" />
                </Td>
                <Td caseNumber={19}>
                  <button
                    type="button"
                    aria-label={`Vol ${index + 1} temps de vol décimal`}
                    disabled={readOnly}
                    onClick={() => setCounterFlightId(f.id)}
                    className="flex h-full w-full items-center justify-center px-1 py-0.5 font-medium tabular-nums text-blue-700 transition-colors hover:bg-sky-50 disabled:cursor-default disabled:hover:bg-transparent"
                  >
                    {f.flightDecimal}
                  </button>
                </Td>
                <Td caseNumber={20}>
                  <AtlInput
                    ariaLabel={`Vol ${index + 1} atterrissages`}
                    value={f.landings}
                    sanitize={(v) => sanitizeDigits(v, 2)}
                    inputMode="numeric"
                    readOnly={readOnly}
                    onChange={(v) => set({ landings: v })}
                  />
                </Td>
                <td className="border-b p-0 text-center align-middle border-black">
                  {!readOnly && (
                    <button
                      type="button"
                      aria-label={`Supprimer la ligne ${index + 1}`}
                      disabled={page.flights.length === 1}
                      onClick={() => removeFlight(f.id)}
                      className="mx-auto flex h-9 w-full items-center justify-center text-slate-300 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-300"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {counterFlightId && (
        <AtlCounterDialog
          referenceValue={page.previousTotalTime}
          onCancel={() => setCounterFlightId(null)}
          onConfirm={(delta) => {
            updateFlight(counterFlightId, { flightDecimal: delta });
            setCounterFlightId(null);
          }}
        />
      )}
      {!readOnly && (
        <div className="flex justify-start border-b border-black bg-white px-2 py-1.5 print:hidden">
          <button
            type="button"
            onClick={addFlight}
            className="inline-flex items-center gap-1.5 rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 transition-all hover:bg-sky-100 active:scale-[0.98]"
          >
            <Plus className="size-3.5" />
            Ajouter une ligne de vol
          </button>
        </div>
      )}
    </div>
  );
}
