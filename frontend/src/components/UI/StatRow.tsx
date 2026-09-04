interface StatRowProps {
  label: string;
  value: string;
  hint?: string;
  hintTone?: "muted" | "positive" | "negative";
  last?: boolean;
}

const HINT_COLOR = {
  muted: "text-zinc-400",
  positive: "text-emerald-400",
  negative: "text-red-400",
} as const;

export function StatRow({
  label,
  value,
  hint,
  hintTone = "muted",
  last = false,
}: StatRowProps) {
  return (
    <div className="flex items-stretch gap-3">
      <div className="text-sm text-zinc-300 pt-2.5 pb-2.5 shrink-0">
        {label}
      </div>
      <div
        className={`flex-1 min-w-0 pt-2.5 pb-2.5 text-right ${
          last ? "" : "border-b border-white/6"
        }`}
      >
        <div className="text-sm font-semibold tabular-nums text-zinc-50 leading-tight">
          {value}
        </div>
        {hint ? (
          <div className={`text-xs mt-0.5 leading-tight ${HINT_COLOR[hintTone]}`}>
            {hint}
          </div>
        ) : null}
      </div>
    </div>
  );
}
