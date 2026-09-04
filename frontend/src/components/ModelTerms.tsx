import { useBlackScholes } from "../hooks/useBlackScholes";
import { HOVR, RISK_FREE_RATE } from "../lib/constants";
import { formatDate, formatPercent } from "../lib/format";
import { getDateAtOffset, parseDateInputValue } from "../lib/time";
import type { ModelInputs } from "../lib/types";

interface ModelTermsProps {
  modelInputs: ModelInputs;
}

function Term({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-zinc-400">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-50">
        {value}
      </div>
    </div>
  );
}

export function ModelTerms({ modelInputs }: ModelTermsProps) {
  const bs = useBlackScholes(modelInputs);
  const expiry = parseDateInputValue(HOVR.expiry);
  const modelDate = getDateAtOffset(modelInputs.modelDateOffsetDays);

  const ivLabel =
    modelInputs.impliedVolOverride !== null ? "IV override" : "HOVRW IV";

  return (
    <div>
      <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-400 mb-3">
        Model Terms
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Term label="Expiry" value={formatDate(expiry)} />
        <Term label="Time to expiry" value={`${bs.T.toFixed(2)}y`} />
        <Term label="3Y Treasury" value={formatPercent(RISK_FREE_RATE, 2)} />
        <Term label="Model date" value={formatDate(modelDate)} />
        <Term label={ivLabel} value={formatPercent(bs.iv)} />
      </div>
      <p className="mt-4 pt-3 border-t border-white/6 text-xs leading-relaxed text-zinc-400">
        Informational only; not advice or a recommendation. Data/calculations
        may be wrong or delayed; verify independently.
      </p>
    </div>
  );
}
