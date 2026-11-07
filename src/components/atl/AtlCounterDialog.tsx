import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatNum } from "@/lib/atlCalc";
import { sanitizeDecimal, validateFlightCounter } from "@/lib/atlInputRules";

type AtlCounterDialogProps = {
  referenceValue: string;
  onConfirm: (delta: string) => void;
  onCancel: () => void;
};

export function AtlCounterDialog({ referenceValue, onConfirm, onCancel }: AtlCounterDialogProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const submit = () => {
    const result = validateFlightCounter(value, referenceValue);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onConfirm(formatNum(result.delta, 1));
  };

  return (
    <div
      className="atl-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Saisie du compteur avion"
        className="atl-zoom-in w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-200"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Saisie du Compteur Avion - Case 19</h2>
            <p className="text-xs text-slate-500">Le temps de vol est calculé à partir du compteur.</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Fermer"
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
          <span className="text-sm text-slate-600">Compteur initial (Case 3)</span>
          <span className="text-base font-bold tabular-nums text-slate-900">{referenceValue || "-"}</span>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-700">Nouveau compteur avion</span>
          <input
            autoFocus
            type="text"
            inputMode="decimal"
            placeholder="0,0"
            value={value}
            aria-invalid={error !== null}
            onChange={(e) => {
              setValue(sanitizeDecimal(e.target.value));
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            className={`w-full rounded-lg px-3 py-2 text-base font-semibold tabular-nums text-blue-700 outline-none ring-1 transition-shadow focus:ring-2 ${
              error ? "ring-red-400 focus:ring-red-500" : "ring-slate-300 focus:ring-sky-500"
            }`}
          />
        </label>

        {error && (
          <p role="alert" className="mt-2 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={value === ""}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}
