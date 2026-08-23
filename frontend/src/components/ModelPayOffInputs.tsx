import { getBaseYearsToExpiry } from "../lib/time";
import type { ModelInputs } from "../lib/types";
import { NumberField } from "./NumberField";

interface ModelInputsProps {
  modelInputs: ModelInputs;
  onChange: (ModelInputs: ModelInputs) => void;
}

export function ModelPayOffInputs({ modelInputs, onChange }: ModelInputsProps) {
  const maxMonths = Math.round(getBaseYearsToExpiry() * 12);

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-300">Model Inputs</h2>

      <NumberField
        label="HOVR ($)"
        value={modelInputs.stockPrice}
        step={0.01}
        onChange={(stockPrice) => onChange({ ...modelInputs, stockPrice })}
      />

      <NumberField
        label="HOVRW ($)"
        value={modelInputs.warrantPrice}
        step={0.01}
        onChange={(warrantPrice) => onChange({ ...modelInputs, warrantPrice })}
      />

      <label className="block text-sm">
        IV override (%){" "}
        <span className="text-slate-500 text-xs">
          blank uses market-implied IV
        </span>
        <input
          type="number"
          min={0}
          step={1}
          value={
            modelInputs.impliedVolOverride === null
              ? ""
              : Math.round(modelInputs.impliedVolOverride * 100)
          }
          placeholder="auto"
          onChange={(e) => {
            const raw = e.target.value;
            onChange({
              ...modelInputs,
              impliedVolOverride: raw === "" ? null : Number(raw) / 100,
            });
          }}
          className="mt-1 w-full bg-slate-800 rounded px-2 py-1"
        />
      </label>

      <div className="text-sm">
        <div className="flex justify-between">
          <span>Model date</span>
          <span>{modelInputs.modelDateOffsetMonths}mo forward</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxMonths}
          value={modelInputs.modelDateOffsetMonths}
          onChange={(e) =>
            onChange({
              ...modelInputs,
              modelDateOffsetMonths: Number(e.target.value),
            })
          }
          className="mt-1 w-full"
        />
        <div className="flex gap-2 mt-1">
          {[
            { label: "Today", months: 0 },
            { label: "6M", months: 6 },
            { label: "12M", months: 12 },
            { label: "Expiry", months: maxMonths },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={() =>
                onChange({ ...modelInputs, modelDateOffsetMonths: btn.months })
              }
              className="text-xs px-2 py-1 bg-slate-800 rounded hover:bg-slate-700"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
