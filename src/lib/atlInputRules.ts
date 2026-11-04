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
