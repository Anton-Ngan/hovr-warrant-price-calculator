import { computePositionQuantities } from "../lib/position";
import { formatCurrency, formatNumber } from "../lib/format";
import { PositionModeToggle } from "./Position/PositionModeToggle";
import { PlanPositionForm } from "./Position/PlanPositionForm";
import { TrackPositionForm } from "./Position/TrackPositionForm";
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
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-300">Position</h2>
        <PositionModeToggle
          position={position}
          modelInputs={modelInputs}
          onChange={onChange}
        />
      </div>

      {position.mode === "plan" ? (
        <PlanPositionForm position={position} onChange={onChange} />
      ) : (
        <TrackPositionForm position={position} onChange={onChange} />
      )}

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
