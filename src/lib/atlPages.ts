import { formatNum, pageTotals } from "@/lib/atlCalc";
import {
  DEFECT_ROWS,
  DEFERRED_ROWS,
  FIRST_PAGE_NUMBER,
  FIRST_PREVIOUS_TOTAL_LDG,
  FIRST_PREVIOUS_TOTAL_TIME,
  FIRST_REMAINING_FUEL,
  FLIGHT_ROWS_DEFAULT,
  GROUND_ROWS,
} from "@/lib/atlConstants";
import type { AtlPage, DeferredRow, DefectRow, Flight, GroundRow } from "@/types/atl";

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createFlight(remainingFuel = ""): Flight {
  return {
    id: newId(),
    remainingFuel,
    upliftAsked: "",
    upliftDelivered: "",
    oilQty: "",
    pristQty: "",
    picAcceptance: null,
    from: "",
    to: "",
    pax: "",
    pic: "",
    sic: "",
    takeoff: "",
    flightDecimal: "",
    counterEnd: "",
    landings: "",
  };
}

function createGround(): GroundRow {
  return { sector: "", type: "", mix: "", start: "", end: "", holdover: "" };
}

function createDefect(): DefectRow {
  return { defect: "", action: "", wo: "", date: "", sign: "" };
}

function createDeferred(): DeferredRow {
  return { hil: "", ata: "", dueDate: "", limitation: null, wo: "", date: "", sign: "" };
}

type NewPageInput = {
  pageNumber: number;
  previousTotalTime: string;
  previousTotalLdg: string;
  remainingFuel: string;
};

function createPage({ pageNumber, previousTotalTime, previousTotalLdg, remainingFuel }: NewPageInput): AtlPage {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: newId(),
    pageNumber,
    createdAt: new Date().toISOString(),
    archivedAt: null,
    date: today,
    authTime: "",
    authSignature: null,
    deferredActive: false,
    servicing: { hyd: false, toilet: false, o2: false, oil: false, tire: [false, false, false] },
    previousTotalTime,
    previousTotalLdg,
    remainingFuelEnd: "",
    flights: Array.from({ length: FLIGHT_ROWS_DEFAULT }, (_, index) => createFlight(index === 0 ? remainingFuel : "")),
    ground: Array.from({ length: GROUND_ROWS }, createGround),
    defects: Array.from({ length: DEFECT_ROWS }, createDefect),
    deferred: Array.from({ length: DEFERRED_ROWS }, createDeferred),
    easaIdent: "",
    agreementNumber: "",
    crsSignature: null,
  };
}

export function createFirstPage(): AtlPage {
  return createPage({
    pageNumber: FIRST_PAGE_NUMBER,
    previousTotalTime: FIRST_PREVIOUS_TOTAL_TIME,
    previousTotalLdg: FIRST_PREVIOUS_TOTAL_LDG,
    remainingFuel: FIRST_REMAINING_FUEL,
  });
}

export function createNextPage(previous: AtlPage): AtlPage {
  const totals = pageTotals(previous);
  return createPage({
    pageNumber: previous.pageNumber + 1,
    previousTotalTime: formatNum(totals.newTime, 1),
    previousTotalLdg: formatNum(totals.newLdg, 0),
    remainingFuel: previous.remainingFuelEnd,
  });
}
