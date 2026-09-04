import { useBlackScholes } from "../hooks/useBlackScholes";
import { formatNumber } from "../lib/format";
import type { ModelInputs } from "../lib/types";
import type { PayoffPoint } from "../lib/payoff";

interface GreeksGridProps {
  modelInputs: ModelInputs;
  hoveredPoint?: PayoffPoint | null;
}

function Greek({
  symbol,
  name,
  value,
  hint,
}: {
  symbol: string;
  name: string;
  value: string;
  hint: string;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-zinc-400">
        <span className="mr-1 normal-case tracking-normal text-zinc-300">
          {symbol}
        </span>
        {name}
      </div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums text-zinc-50">
        {value}
      </div>
      <p className="mt-0.5 text-xs leading-snug text-zinc-400">{hint}</p>
    </div>
  );
}

export function GreeksGrid({
  modelInputs,
  hoveredPoint = null,
}: GreeksGridProps) {
  const bs = useBlackScholes(modelInputs);

  const delta = hoveredPoint ? hoveredPoint.delta : bs.delta;
  const gamma = hoveredPoint ? hoveredPoint.gamma : bs.gamma;
  const theta = hoveredPoint ? hoveredPoint.theta : bs.theta;
  const vega = hoveredPoint ? hoveredPoint.vega : bs.vega;

  return (
    <div>
      <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-400 mb-3">
        Greeks
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <Greek
          symbol="Δ"
          name="Delta"
          value={formatNumber(delta, 3)}
          hint="Warrant $ change if HOVR moves $1"
        />
        <Greek
          symbol="Γ"
          name="Gamma"
          value={formatNumber(gamma, 3)}
          hint="How much delta shifts if HOVR moves $1"
        />
        <Greek
          symbol="Θ"
          name="Theta"
          value={formatNumber(theta, 3)}
          hint="Estimated $ decay per year, all else equal"
        />
        <Greek
          symbol="ν"
          name="Vega"
          value={formatNumber(vega, 3)}
          hint="Warrant $ change if IV moves 1 vol point"
        />
      </div>
    </div>
  );
}
