import { createElement } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { AtlDocument } from "@/components/atl/AtlDocument";
import type { AtlPage } from "@/types/atl";

const PAGE_WIDTH_MM = 297;
const PAGE_HEIGHT_MM = 210;
const PAGE_MARGIN_MM = 6;
const CAPTURE_SCALE = 2;

export function atlFileName(page: AtlPage): string {
  return `ATL - ${page.pageNumber}`;
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

function freezeFormFields(doc: Document) {
  doc.querySelectorAll('[class~="print:hidden"]').forEach((el) => el.remove());

  doc.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea").forEach((field) => {
    const isTextarea = field.tagName === "TEXTAREA";
    const justify = field.classList.contains("text-center")
      ? "justify-center"
      : field.classList.contains("text-right")
        ? "justify-end"
        : "justify-start";
    const span = doc.createElement("span");
    span.textContent = field.value;
    span.className = `${field.className} flex ${isTextarea ? "items-start" : "items-center"} ${justify} whitespace-pre-wrap break-words`;
    field.replaceWith(span);
  });
}

async function captureAtlPage(page: AtlPage): Promise<HTMLCanvasElement> {
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;left:-100000px;top:0;background:#ffffff;";
  document.body.appendChild(host);
  const root = createRoot(host);

  try {
    flushSync(() => {
      root.render(createElement(AtlDocument, { page, readOnly: true, onChange: () => undefined }));
    });
    await nextFrame();
    const target = host.firstElementChild as HTMLElement;
    return await html2canvas(target, {
      scale: CAPTURE_SCALE,
      backgroundColor: "#ffffff",
      windowWidth: target.scrollWidth,
      onclone: freezeFormFields,
    });
  } finally {
    root.unmount();
    host.remove();
  }
}

export async function buildAtlPdf(page: AtlPage): Promise<Blob> {
  const canvas = await captureAtlPage(page);
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  pdf.setProperties({ title: atlFileName(page) });

  const availableWidth = PAGE_WIDTH_MM - PAGE_MARGIN_MM * 2;
  const availableHeight = PAGE_HEIGHT_MM - PAGE_MARGIN_MM * 2;
  const ratio = canvas.width / canvas.height;
  let width = availableWidth;
  let height = width / ratio;
  if (height > availableHeight) {
    height = availableHeight;
    width = height * ratio;
  }
  const x = (PAGE_WIDTH_MM - width) / 2;
  const y = (PAGE_HEIGHT_MM - height) / 2;

  pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", x, y, width, height);
  return pdf.output("blob");
}
