import { NumberField } from "../UI/NumberField";
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

      <label className="block text-xs uppercase tracking-wide text-zinc-400">
        Allocation to warrants {position.allocationPct}%
        <input
          type="range"
          min={0}
          max={100}
          value={position.allocationPct}
          onChange={(e) =>
            onChange({ ...position, allocationPct: Number(e.target.value) })
          }
          className="slider-clean mt-2 w-full"
        />
      </label>
    </>
  );
}
