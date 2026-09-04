import {
  daysBetween,
  getBaseDaysToExpiry,
  getDateAtOffset,
} from "../lib/time";
import type { ModelInputs } from "../lib/types";
import { DatePicker } from "./DatePicker";

interface ModelDateControlProps {
  modelInputs: ModelInputs;
  onChange: (next: ModelInputs) => void;
}

export function ModelDateControl({
  modelInputs,
  onChange,
}: ModelDateControlProps) {
  const maxDays = getBaseDaysToExpiry();
  const years = (modelInputs.modelDateOffsetDays / 365.2425).toFixed(2);
  const modelDate = getDateAtOffset(modelInputs.modelDateOffsetDays);
  const today = new Date();
  const maxDate = getDateAtOffset(maxDays);

  return (
    <div className="flex-1 min-w-0 text-xs">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs uppercase tracking-wide text-zinc-400">
          Model date
        </span>
        <span className="tabular-nums text-zinc-300 text-[13px]">{years}y</span>
        <div className="ml-auto">
          <DatePicker
            value={modelDate}
            min={today}
            max={maxDate}
            onChange={(picked) => {
              const offsetDays = Math.min(
                Math.max(daysBetween(new Date(), picked), 0),
                maxDays,
              );
              onChange({ ...modelInputs, modelDateOffsetDays: offsetDays });
            }}
          />
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={maxDays}
        value={modelInputs.modelDateOffsetDays}
        onChange={(e) =>
          onChange({
            ...modelInputs,
            modelDateOffsetDays: Number(e.target.value),
          })
        }
        className="slider-clean w-full"
      />
      <div className="flex gap-1 mt-1.5">
        {[
          { label: "Today", days: 0 },
          { label: "6M", days: Math.min(183, maxDays) },
          { label: "12M", days: Math.min(365, maxDays) },
          { label: "Expiry", days: maxDays },
        ].map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={() =>
              onChange({ ...modelInputs, modelDateOffsetDays: btn.days })
            }
            className={`text-xs px-2 py-0.5 rounded-md ${
              modelInputs.modelDateOffsetDays === btn.days
                ? "bg-white/10 text-white"
                : "text-zinc-300 hover:text-zinc-100 hover:bg-white/5"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
