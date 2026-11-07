import { formatNum, parseNum } from "@/lib/atlCalc";

export const MAX_FLIGHT_COUNTER_DELTA = 5;

export type CounterValidation = { ok: true; delta: number } | { ok: false; error: string };

export function validateFlightCounter(newValue: string, reference: string): CounterValidation {
  const ref = parseNum(reference);
  if (ref === null) return { ok: false, error: "Renseignez d'abord le total de la Case 3." };
  const next = parseNum(newValue);
  if (next === null) return { ok: false, error: "Saisissez le nouveau compteur avion." };
  if (next <= ref) {
    return { ok: false, error: `Le compteur doit être supérieur à la Case 3 (${formatNum(ref, 1)}).` };
  }
  const delta = Math.round((next - ref) * 100) / 100;
  if (delta > MAX_FLIGHT_COUNTER_DELTA) {
    return {
      ok: false,
      error: `La différence ne peut pas dépasser ${MAX_FLIGHT_COUNTER_DELTA} heures (écart calculé : ${formatNum(delta, 1)}).`,
    };
  }
  return { ok: true, delta };
}

export function sanitizeLetters(value: string, max: number): string {
  return value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, max);
}

export function sanitizeDigits(value: string, max: number): string {
  return value.replace(/\D/g, "").slice(0, max);
}

export function sanitizeDecimal(value: string): string {
  const cleaned = value.replace(/[^\d.,]/g, "").replace(".", ",");
  const [integer, ...rest] = cleaned.split(",");
  return rest.length > 0 ? `${integer},${rest.join("")}` : integer;
}

export function sanitizeTime(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function sanitizeAsked(value: string): string {
  const upper = value.toUpperCase();
  if (/^\d{0,4}$/.test(upper) || "FULL".startsWith(upper)) return upper;
  return upper.replace(/\D/g, "").slice(0, 4);
}
