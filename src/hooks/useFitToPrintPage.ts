import { useEffect, type RefObject } from "react";

const MM_PER_INCH = 25.4;
const CSS_PX_PER_INCH = 96;
const PAGE_MARGIN_MM = 6;
const A4_LANDSCAPE_WIDTH_MM = 297;
const A4_LANDSCAPE_HEIGHT_MM = 210;

const toPx = (mm: number) => (mm * CSS_PX_PER_INCH) / MM_PER_INCH;

const PRINTABLE_WIDTH_PX = toPx(A4_LANDSCAPE_WIDTH_MM - PAGE_MARGIN_MM * 2);
const PRINTABLE_HEIGHT_PX = toPx(A4_LANDSCAPE_HEIGHT_MM - PAGE_MARGIN_MM * 2);

export function useFitToPrintPage(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const fit = () => {
      const el = ref.current;
      if (!el) return;
      el.style.zoom = "";
      const scale = Math.min(
        PRINTABLE_WIDTH_PX / el.scrollWidth,
        PRINTABLE_HEIGHT_PX / el.scrollHeight,
        1,
      );
      el.style.zoom = scale.toFixed(3);
    };
    const reset = () => {
      if (ref.current) ref.current.style.zoom = "";
    };

    window.addEventListener("beforeprint", fit);
    window.addEventListener("afterprint", reset);
    return () => {
      window.removeEventListener("beforeprint", fit);
      window.removeEventListener("afterprint", reset);
    };
  }, [ref]);
}
