import { FUEL_TO_LBS_FACTOR } from "@/lib/atlConstants";
import type { AtlPage, Flight } from "@/types/atl";


export function parseNum(value: string): number | null {
  const normalized = value.replace(",", ".").trim();
  if (normalized === "") return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export function formatNum(value: number, decimals = 0): string {
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: false,
  });
}

export function parseHHMM(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function formatMinutes(total: number): string {
  const hours = Math.floor(total / 60) % 24;
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function decimalHoursToHHMM(value: string): string {
  const decimal = parseNum(value);
  if (decimal === null || decimal < 0) return "";
  return formatMinutes(Math.round(decimal * 60));
}

export function fuelTotal(flight: Flight): number | null {
  const initial = parseNum(flight.remainingFuel);
  if (initial === null) return null;
  const uplift = parseNum(flight.upliftDelivered) ?? 0;
  return Math.round((initial + uplift * FUEL_TO_LBS_FACTOR) * 100) / 100;
}

function shiftHHMM(value: string, deltaMinutes: number): string {
  const minutes = parseHHMM(value);
  if (minutes === null) return "";
  return formatMinutes((((minutes + deltaMinutes) % 1440) + 1440) % 1440);
}

export function blockOffHHMM(flight: Flight): string {
  return shiftHHMM(flight.takeoff, -3);
}

export function landingHHMM(flight: Flight): string {
  const flightMinutes = parseNum(flight.flightDecimal);
  const takeoff = parseHHMM(flight.takeoff);
  if (flightMinutes === null || takeoff === null) return "";
  return formatMinutes(takeoff + Math.round(flightMinutes * 60));
}

export function blockOnHHMM(flight: Flight): string {
  return shiftHHMM(landingHHMM(flight), 3);
}

export function blockTimeHHMM(flight: Flight): string {
  const flightMinutes = parseNum(flight.flightDecimal);
  if (flightMinutes === null) return "";
  return formatMinutes(Math.round(flightMinutes * 60) + 6);
}

export type PageTotals = {
  dailyTime: number;
  dailyLdg: number;
  newTime: number;
  newLdg: number;
};

export function pageTotals(page: AtlPage): PageTotals {
  const dailyTime = page.flights.reduce((sum, f) => sum + (parseNum(f.flightDecimal) ?? 0), 0);
  const dailyLdg = page.flights.reduce((sum, f) => sum + (parseNum(f.landings) ?? 0), 0);
  const round = (n: number) => Math.round(n * 100) / 100;
  return {
    dailyTime: round(dailyTime),
    dailyLdg,
    newTime: round((parseNum(page.previousTotalTime) ?? 0) + dailyTime),
    newLdg: (parseNum(page.previousTotalLdg) ?? 0) + dailyLdg,
  };
}
