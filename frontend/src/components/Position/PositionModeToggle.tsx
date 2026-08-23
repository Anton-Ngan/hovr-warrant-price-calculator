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
    <div className="flex gap-1">
      <button
        onClick={() =>
          onChange({ mode: "plan", investment: 10000, allocationPct: 50 })
        }
        className={`text-xs px-2 py-1 rounded ${
          position.mode === "plan" ? "bg-blue-600" : "bg-slate-800"
        }`}
      >
        Plan
      </button>
      <button
        onClick={() =>
          onChange({
            mode: "track",
            sharesOwned: 0,
            avgShareCost: modelInputs.stockPrice,
            warrantsOwned: 0,
            avgWarrantCost: modelInputs.warrantPrice,
          })
        }
        className={`text-xs px-2 py-1 rounded ${
          position.mode === "track" ? "bg-blue-600" : "bg-slate-800"
        }`}
      >
        Track
      </button>
    </div>
  );
}
