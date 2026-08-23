import { computePositionQuantities } from "../lib/position";
import { formatCurrency, formatNumber } from "../lib/format";
import type { ModelInputs, Position } from "../lib/types";

interface PositionBuilderProps {
  position: Position;
  modelInputs: ModelInputs;
  onChange: (position: Position) => void;
}

export function PositionBuilder({
  position,
  modelInputs,
  onChange,
}: PositionBuilderProps) {
  const { sharesQty, warrantsQty, stockAllocation, warrantAllocation } =
    computePositionQuantities(position, modelInputs);

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-300">Position</h2>

      <label className="block text-sm">
        Investment ($)
        <input
          type="number"
          min={0}
          value={position.investment}
          onChange={(e) =>
            onChange({ ...position, investment: Number(e.target.value) })
          }
          className="mt-1 w-full bg-slate-800 rounded px-2 py-1"
        />
      </label>

      <label className="block text-sm">
        Allocation to warrants: {position.allocationPct}%
        <input
          type="range"
          min={0}
          max={100}
          value={position.allocationPct}
          onChange={(e) =>
            onChange({ ...position, allocationPct: Number(e.target.value) })
          }
          className="mt-1 w-full"
        />
      </label>

      <div className="text-xs text-slate-400 grid grid-cols-2 gap-2">
        <div>
          Stock: {formatCurrency(stockAllocation, 0)}
          <br />
          {formatNumber(sharesQty, 0)} shares
        </div>
        <div>
          Warrants: {formatCurrency(warrantAllocation, 0)}
          <br />
          {formatNumber(warrantsQty, 0)} warrants
        </div>
      </div>
    </div>
  );
}
