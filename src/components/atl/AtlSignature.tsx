import { PenLine, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

type AtlSignatureProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  ariaLabel: string;
  readOnly?: boolean;
  className?: string;
};

export function AtlSignature({ value, onChange, ariaLabel, readOnly = false, className = "" }: AtlSignatureProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        disabled={readOnly}
        onClick={() => setOpen(true)}
        className={`flex h-full w-full items-center justify-center overflow-hidden px-1 transition-colors hover:bg-sky-50 disabled:cursor-default disabled:hover:bg-transparent ${className}`}
      >
        {value ? (
          <img src={value} alt="" className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wide text-slate-400 print:hidden">
            {!readOnly && <PenLine className="size-3" />}
            {!readOnly && "Signer"}
          </span>
        )}
      </button>
      {open && (
        <SignatureDialog
          onCancel={() => setOpen(false)}
          onValidate={(dataUrl) => {
            onChange(dataUrl);
            setOpen(false);
          }}
          onClear={() => {
            onChange(null);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

type SignatureDialogProps = {
  onCancel: () => void;
  onValidate: (dataUrl: string) => void;
  onClear: () => void;
};

const INK = "#1e3a8a";

function SignatureDialog({ onCancel, onValidate, onClear }: SignatureDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const pointAt = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    };
  };

  const handleDown = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    canvas.setPointerCapture(e.pointerId);
    drawing.current = true;
    const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const { x, y } = pointAt(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 0.1, y + 0.1);
    ctx.stroke();
    setHasInk(true);
  };

  const handleMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = pointAt(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleUp = () => {
    drawing.current = false;
  };

  const reset = () => {
    const canvas = canvasRef.current!;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
  };

  const validate = () => {
    if (!hasInk) return;
    onValidate(canvasRef.current!.toDataURL("image/png"));
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
        aria-label="Signature"
        className="atl-zoom-in w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-200"
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Signature</h2>
            <p className="text-xs text-slate-500">Signez directement sur la zone ci-dessous.</p>
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
        <canvas
          ref={canvasRef}
          width={600}
          height={240}
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          onPointerCancel={handleUp}
          className="aspect-[5/2] w-full touch-none rounded-xl border border-dashed border-slate-300 bg-slate-50 cursor-crosshair"
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <RotateCcw className="size-4" />
            Effacer
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Supprimer
            </button>
            <button
              type="button"
              onClick={validate}
              disabled={!hasInk}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
