import { useBlackScholes } from "../hooks/useBlackScholes";
import { usePayoffData } from "../hooks/usePayoffData";
import { computePositionQuantities } from "../lib/position";
import { findBreakevenPrice } from "../lib/payoff";
import { HOVR } from "../lib/constants";
import { formatCurrency, formatPercent } from "../lib/format";
import type { ModelInputs, Position } from "../lib/types";
import type { PayoffPoint } from "../lib/payoff";
import { StatRow } from "./UI/StatRow";

interface ThresholdListProps {
  modelInputs: ModelInputs;
  position: Position;
  chartCap: number;
  hoveredPoint?: PayoffPoint | null;
}

function pctFromSpot(threshold: number, spot: number): {
  hint: string;
  tone: "muted" | "positive";
} {
  if (!(spot > 0) || !Number.isFinite(threshold)) {
    return { hint: "—", tone: "muted" };
  }
  const pct = (threshold - spot) / spot;
  const signed = `${pct >= 0 ? "+" : ""}${formatPercent(pct)}`;
  return {
    hint: `${signed} from spot`,
    tone: pct > 0 ? "positive" : "muted",
  };
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
  const breakevenPct =
    breakeven === null ? null : pctFromSpot(breakeven, spot);
  const strikePct = pctFromSpot(HOVR.strike, spot);
  const redemptionPct = pctFromSpot(HOVR.redemptionTrigger, spot);

  const rows = [
    {
      name: "Breakeven",
      value:
        breakeven === null
          ? `> ${formatCurrency(chartCap, 0)}`
          : formatCurrency(breakeven),
      hint:
        breakeven === null
          ? "P/L still negative at the chart cap"
          : breakevenPct!.hint,
      hintTone: (breakevenPct?.tone ?? "muted") as "muted" | "positive",
    },
    {
      name: "Strike (exercise)",
      value: formatCurrency(HOVR.strike),
      hint: strikePct.hint,
      hintTone: strikePct.tone,
    },
    {
      name: "Redemption trigger",
      value: formatCurrency(HOVR.redemptionTrigger, 0),
      hint: redemptionPct.hint,
      hintTone: redemptionPct.tone,
    },
    {
      name: "Time value at risk",
      value: formatCurrency(tvar, 0),
      hint: "BS minus intrinsic, for your warrant qty",
      hintTone: "muted" as const,
    },
  ];

  return (
    <div>
      <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-400 mb-1">
        Key Thresholds
      </h2>
      {rows.map((row, i) => (
        <StatRow
          key={row.name}
          label={row.name}
          value={row.value}
          hint={row.hint}
          hintTone={row.hintTone}
          last={i === rows.length - 1}
        />
      ))}
    </div>
  );
}
