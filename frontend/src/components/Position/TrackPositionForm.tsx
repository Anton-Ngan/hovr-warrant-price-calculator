import { NumberField } from "../UI/NumberField";
import type { TrackPosition } from "../../lib/types";

interface TrackPositionFormProps {
  position: TrackPosition;
  onChange: (position: TrackPosition) => void;
}

export function TrackPositionForm({
  position,
  onChange,
}: TrackPositionFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label="Shares owned"
          value={position.sharesOwned}
          onChange={(sharesOwned) => onChange({ ...position, sharesOwned })}
        />
        <NumberField
          label="Avg cost ($)"
          value={position.avgShareCost}
          step={0.01}
          onChange={(avgShareCost) => onChange({ ...position, avgShareCost })}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label="Warrants owned"
          value={position.warrantsOwned}
          onChange={(warrantsOwned) => onChange({ ...position, warrantsOwned })}
        />
        <NumberField
          label="Avg cost ($)"
          value={position.avgWarrantCost}
          step={0.01}
          onChange={(avgWarrantCost) =>
            onChange({ ...position, avgWarrantCost })
          }
        />
      </div>
    </>
  );
}
