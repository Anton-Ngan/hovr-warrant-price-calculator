import { useBlackScholes } from "../hooks/useBlackScholes";
import { usePayoffData } from "../hooks/usePayoffData";
import { computePositionQuantities } from "../lib/position";
import { findBreakevenPrice } from "../lib/payoff";
import { HOVR } from "../lib/constants";
import { formatCurrency, formatPercent } from "../lib/format";
import type { ModelInputs, Position } from "../lib/types";
import type { PayoffPoint } from "../lib/payoff";

interface ThresholdListProps {
  modelInputs: ModelInputs;
  position: Position;
  chartCap: number;
  hoveredPoint?: PayoffPoint | null;
}

function pctFromSpot(threshold: number, spot: number): string {
  if (!(spot > 0) || !Number.isFinite(threshold)) return "—";
  const pct = (threshold - spot) / spot;
  const signed = `${pct >= 0 ? "+" : ""}${formatPercent(pct)}`;
  return `${signed} from spot`;
}

export function ThresholdList({
  modelInputs,
  position,
  chartCap,
  hoveredPoint = null,
}: ThresholdListProps) {
  const bs = useBlackScholes(modelInputs);
  const { warrantsQty } = computePositionQuantities(position, modelInputs);
  const points = usePayoffData(modelInputs, position, chartCap);
  const breakeven = findBreakevenPrice(points);

  const spot = modelInputs.stockPrice;
  const intrinsic = Math.max(0, spot - HOVR.strike);
  const liveTvar = (bs.price - intrinsic) * warrantsQty;
  const tvar = hoveredPoint ? hoveredPoint.timeValueAtRisk : liveTvar;

  const rows = [
    {
      name: "Breakeven",
      value:
        breakeven === null
          ? `> ${formatCurrency(chartCap, 0)}`
          : formatCurrency(breakeven),
      hint:
        breakeven === null
          ? `P/L still negative at the chart cap`
          : pctFromSpot(breakeven, spot),
    },
    {
      name: "Strike (exercise)",
      value: formatCurrency(HOVR.strike),
      hint: pctFromSpot(HOVR.strike, spot),
    },
    {
      name: "Redemption trigger",
      value: formatCurrency(HOVR.redemptionTrigger, 0),
      hint: pctFromSpot(HOVR.redemptionTrigger, spot),
    },
    {
      name: "Time value at risk",
      value: formatCurrency(tvar, 0),
      hint: "BS minus intrinsic, for your warrant qty",
    },
  ];

  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-300 mb-3">
        Key Thresholds
      </h2>
      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.name}
            className="flex items-baseline justify-between gap-3 bg-slate-800 rounded-lg p-3"
          >
            <div>
              <div className="text-sm text-slate-200">{row.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{row.hint}</div>
            </div>
            <div className="text-lg font-semibold tabular-nums whitespace-nowrap">
              {row.value}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}