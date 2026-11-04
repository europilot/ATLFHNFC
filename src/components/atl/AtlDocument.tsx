import { useRef } from "react";
import { AtlFlightTable } from "@/components/atl/AtlFlightTable";
import { AtlDefectSection } from "@/components/atl/AtlDefectSection";
import { AtlFooterSection } from "@/components/atl/AtlFooterSection";
import { AtlLowerSection } from "@/components/atl/AtlLowerSection";
import { AtlStatusSection } from "@/components/atl/AtlStatusSection";
import { AtlTitleSection } from "@/components/atl/AtlTitleSection";
import { useFitToPrintPage } from "@/hooks/useFitToPrintPage";
import type { AtlSectionProps } from "@/types/atl";

export function AtlDocument(props: AtlSectionProps) {
  const documentRef = useRef<HTMLDivElement>(null);
  useFitToPrintPage(documentRef);

  return (
    <div
      id="atl-document"
      ref={documentRef}
      className="min-w-[75rem] border border-black bg-white text-[11px] text-black print:min-w-0"
    >
      <AtlTitleSection {...props} />
      <AtlStatusSection {...props} />
      <AtlFlightTable {...props} />
      <AtlLowerSection {...props} />
      <AtlDefectSection {...props} />
      <AtlFooterSection {...props} />
    </div>
  );
}
