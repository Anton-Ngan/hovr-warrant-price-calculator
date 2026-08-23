import { NumberField } from "../NumberField";
import type { PlanPosition } from "../../lib/types";

interface PlanPositionFormProps {
  position: PlanPosition;
  onChange: (position: PlanPosition) => void;
}

export function PlanPositionForm({
  position,
  onChange,
}: PlanPositionFormProps) {
  return (
    <>
      <NumberField
        label="Investment ($)"
        value={position.investment}
        onChange={(investment) => onChange({ ...position, investment })}
      />

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
    </>
  );
}
