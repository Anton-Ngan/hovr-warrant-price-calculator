import type { ModelInputs } from "../lib/types";
import { NumberField } from "./UI/NumberField";

interface ModelInputsProps {
  modelInputs: ModelInputs;
  onChange: (modelInputs: ModelInputs) => void;
}

export function ModelPayOffInputs({ modelInputs, onChange }: ModelInputsProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        Model Inputs
      </h2>

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

      <label className="block text-xs uppercase tracking-wide text-zinc-400">
        IV override (%)
        <span className="ml-1 normal-case tracking-normal text-zinc-400">
          blank = market
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
          className="field-input mt-0.5"
        />
      </label>
    </div>
  );
}
