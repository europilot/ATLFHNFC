export type Flight = {
  id: string;
  remainingFuel: string;
  upliftAsked: string;
  upliftDelivered: string;
  oilQty: string;
  pristQty: string;
  picAcceptance: string | null;
  from: string;
  to: string;
  pax: string;
  pic: string;
  sic: string;
  takeoff: string;
  flightDecimal: string;
  landings: string;
};

export type GroundRow = {
  sector: string;
  type: string;
  mix: string;
  start: string;
  end: string;
  holdover: string;
};

export type DefectRow = {
  defect: string;
  action: string;
  wo: string;
  date: string;
  sign: string;
};

export type DeferredRow = {
  hil: string;
  ata: string;
  dueDate: string;
  limitation: "yes" | "none" | null;
  wo: string;
  date: string;
  sign: string;
};

export type ServicingChecks = {
  hyd: boolean;
  toilet: boolean;
  o2: boolean;
  oil: boolean;
  tire: [boolean, boolean, boolean];
};

export type AtlPage = {
  id: string;
  pageNumber: number;
  createdAt: string;
  archivedAt: string | null;
  date: string;
  authTime: string;
  authSignature: string | null;
  servicing: ServicingChecks;
  deferredActive: boolean;
  previousTotalTime: string;
  previousTotalLdg: string;
  remainingFuelEnd: string;
  flights: Flight[];
  ground: GroundRow[];
  defects: DefectRow[];
  deferred: DeferredRow[];
  easaIdent: string;
  agreementNumber: string;
  crsSignature: string | null;
};

export type AtlState = {
  pages: AtlPage[];
};

export type AtlSectionProps = {
  page: AtlPage;
  readOnly: boolean;
  onChange: (patch: Partial<AtlPage>) => void;
};
