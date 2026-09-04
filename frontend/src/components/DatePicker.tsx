import { useEffect, useRef, useState } from "react";
import { formatDate } from "../lib/format";
import { toDateInputValue } from "../lib/time";

interface DatePickerProps {
  value: Date;
  min: Date;
  max: Date;
  onChange: (date: Date) => void;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function DatePicker({ value, min, max, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(
    () => new Date(value.getFullYear(), value.getMonth(), 1),
  );
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setView(new Date(value.getFullYear(), value.getMonth(), 1));
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const minDay = startOfDay(min);
  const maxDay = startOfDay(max);
  const selected = toDateInputValue(value);
  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const count = daysInMonth(year, month);
  const cells: (number | null)[] = [
    ...Array<null>(firstDow).fill(null),
    ...Array.from({ length: count }, (_, i) => i + 1),
  ];

  const monthLabel = view.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const canPrev =
    new Date(year, month, 1) >
    new Date(minDay.getFullYear(), minDay.getMonth(), 1);
  const canNext =
    new Date(year, month, 1) <
    new Date(maxDay.getFullYear(), maxDay.getMonth(), 1);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] tabular-nums text-zinc-200 ring-1 ring-white/10 hover:bg-white/5"
      >
        {formatDate(value)}
        <svg
          width="12"
          height="12"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="text-zinc-400"
        >
          <rect
            x="2"
            y="3"
            width="12"
            height="11"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <path
            d="M2 6.5h12M5.5 2v2.5M10.5 2v2.5"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open ? (
        <div className="absolute right-0 z-20 mt-1.5 w-[232px] rounded-xl bg-zinc-900 p-2.5 shadow-xl ring-1 ring-white/10">
          <div className="flex items-center justify-between mb-2 px-0.5">
            <button
              type="button"
              disabled={!canPrev}
              onClick={() => setView(new Date(year, month - 1, 1))}
              className="h-6 w-6 rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-200 disabled:opacity-30"
            >
              ‹
            </button>
            <span className="text-[12px] text-zinc-300">{monthLabel}</span>
            <button
              type="button"
              disabled={!canNext}
              onClick={() => setView(new Date(year, month + 1, 1))}
              className="h-6 w-6 rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-200 disabled:opacity-30"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 mb-1 text-center text-xs text-zinc-400">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={`${d}-${i}`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (day == null) return <div key={`e-${i}`} />;
              const date = new Date(year, month, day);
              const key = toDateInputValue(date);
              const disabled = date < minDay || date > maxDay;
              const isSelected = key === selected;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(date);
                    setOpen(false);
                  }}
                  className={`h-7 rounded-md text-xs tabular-nums ${
                    isSelected
                      ? "bg-white/15 text-white"
                      : disabled
                        ? "text-zinc-700 cursor-not-allowed"
                        : "text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
