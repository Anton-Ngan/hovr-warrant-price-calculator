import { useBlackScholes } from "../hooks/useBlackScholes";
import { formatNumber } from "../lib/format";
import type { ModelInputs } from "../lib/types";
import type { PayoffPoint } from "../lib/payoff";

interface GreeksGridProps {
  modelInputs: ModelInputs;
  hoveredPoint?: PayoffPoint | null;
}

interface GreekItem {
  symbol: string;
  name: string;
  value: string;
  hint: string;
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

  const items: GreekItem[] = [
    {
      symbol: "Δ",
      name: "Delta",
      value: formatNumber(delta, 3),
      hint: "Warrant $ change if HOVR moves $1",
    },
    {
      symbol: "Γ",
      name: "Gamma",
      value: formatNumber(gamma, 3),
      hint: "Delta's change if HOVR moves $1",
    },
    {
      symbol: "Θ",
      name: "Theta",
      value: formatNumber(theta, 3),
      hint: "Estimated $ decay per year, all else equal",
    },
    {
      symbol: "ν",
      name: "Vega",
      value: formatNumber(vega, 3),
      hint: "Warrant $ change if IV moves 1 vol point",
    },
  ];

  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-300 mb-3">Greeks</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((g) => (
          <div key={g.name} className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs text-slate-400">
                {g.symbol} {g.name}
              </span>
              <span className="text-lg font-semibold tabular-nums">{g.value}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{g.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
}