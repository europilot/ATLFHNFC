import { Check } from "lucide-react";
import type { ReactNode } from "react";

export function CaseNo({ n }: { n: number | string }) {
  return (
    <span className="pointer-events-none absolute left-0.5 top-0 z-10 select-none text-[8px] font-semibold leading-none text-sky-600/80 print:hidden">
      {n}
    </span>
  );
}

type AtlCellProps = {
  caseNumber?: number | string;
  className?: string;
  children?: ReactNode;
};

export function AtlCell({ caseNumber, className = "", children }: AtlCellProps) {
  return (
    <div className={`group relative flex min-w-0 items-stretch border-b border-r border-black ${className}`}>
      {caseNumber !== undefined && <CaseNo n={caseNumber} />}
      {children}
    </div>
  );
}

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

type AtlInputProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  type?: "text" | "date";
  sanitize?: (value: string) => string;
  readOnly?: boolean;
  align?: "left" | "center" | "right";
  inputMode?: "text" | "numeric" | "decimal";
  placeholder?: string;
  maxLength?: number;
  className?: string;
};

export function AtlInput({
  value,
  onChange,
  ariaLabel,
  type = "text",
  sanitize,
  readOnly = false,
  align = "center",
  inputMode = "text",
  placeholder,
  maxLength,
  className = "",
}: AtlInputProps) {
  return (
    <input
      type={type}
      aria-label={ariaLabel}
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      inputMode={inputMode}
      readOnly={readOnly}
      disabled={readOnly}
      onChange={(e) => onChange(sanitize ? sanitize(e.target.value) : e.target.value)}
      className={`h-full w-full min-w-0 bg-transparent px-1 py-0.5 font-medium text-blue-700 placeholder:text-slate-300 outline-none transition-colors focus:bg-sky-50 focus:ring-2 focus:ring-inset focus:ring-sky-500 disabled:cursor-default ${alignClass[align]} ${className}`}
    />
  );
}

type AtlTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  readOnly?: boolean;
  className?: string;
};

export function AtlTextarea({ value, onChange, ariaLabel, readOnly = false, className = "" }: AtlTextareaProps) {
  return (
    <textarea
      aria-label={ariaLabel}
      value={value}
      rows={1}
      readOnly={readOnly}
      disabled={readOnly}
      onChange={(e) => onChange(e.target.value)}
      className={`h-full min-h-[2rem] w-full min-w-0 resize-none bg-transparent px-1 py-0.5 text-[11px] leading-snug text-blue-700 outline-none transition-colors focus:bg-sky-50 focus:ring-2 focus:ring-inset focus:ring-sky-500 disabled:cursor-default ${className}`}
    />
  );
}

type AtlOutputProps = {
  value: string;
  align?: "left" | "center" | "right";
  className?: string;
};

export function AtlOutput({ value, align = "center", className = "" }: AtlOutputProps) {
  const justify = align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";
  return (
    <span
      className={`flex h-full w-full items-center px-1 py-0.5 font-semibold text-slate-900 tabular-nums ${justify} ${className}`}
    >
      {value}
    </span>
  );
}

type AtlCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
  readOnly?: boolean;
};

export function AtlCheckbox({ checked, onChange, ariaLabel, readOnly = false }: AtlCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={readOnly}
      onClick={() => onChange(!checked)}
      className="group flex h-full w-full items-center justify-center disabled:cursor-default"
    >
      <span
        className={`flex size-4 items-center justify-center rounded-[3px] border-[1.5px] transition-all duration-150 ${
          checked ? "border-blue-700 bg-blue-700 text-white" : "border-black bg-white group-hover:border-sky-500"
        } ${readOnly ? "" : "active:scale-90"}`}
      >
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
    </button>
  );
}
