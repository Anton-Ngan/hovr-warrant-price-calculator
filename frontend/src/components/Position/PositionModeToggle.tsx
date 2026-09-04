import type { ModelInputs, Position } from "../../lib/types";

interface PositionModeToggleProps {
  position: Position;
  modelInputs: ModelInputs;
  onChange: (position: Position) => void;
}

export function PositionModeToggle({
  position,
  modelInputs,
  onChange,
}: PositionModeToggleProps) {
  return (
    <div className="inline-flex rounded-lg bg-white/5 p-0.5 ring-1 ring-white/10">
      <button
        type="button"
        onClick={() =>
          onChange({ mode: "plan", investment: 10000, allocationPct: 50 })
        }
        className={`text-xs px-2.5 py-1 rounded-md ${
          position.mode === "plan"
            ? "bg-white/10 text-white"
            : "text-zinc-300 hover:text-zinc-100"
        }`}
      >
        Plan
      </button>
      <button
        type="button"
        onClick={() =>
          onChange({
            mode: "track",
            sharesOwned: 1000,
            avgShareCost: modelInputs.stockPrice,
            warrantsOwned: 5000,
            avgWarrantCost: modelInputs.warrantPrice,
          })
        }
        className={`text-xs px-2.5 py-1 rounded-md ${
          position.mode === "track"
            ? "bg-white/10 text-white"
            : "text-zinc-300 hover:text-zinc-100"
        }`}
      >
        Track
      </button>
    </div>
  );
}
