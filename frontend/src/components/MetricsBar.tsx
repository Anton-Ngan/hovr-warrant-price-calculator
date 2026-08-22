import { useBlackScholes } from "../hooks/useBlackScholes";
import { computePositionQuantities } from "../lib/position";
import { formatCurrency, formatPercent, formatNumber } from "../lib/format";
import { HOVR } from "../lib/constants";
import type { ModelInputs, Position } from "../lib/types";

interface MetricsBarProps {
  modelInputs: ModelInputs;
  position: Position;
}

interface Metric {
  label: string;
  value: string;
  colorClass?: string;
}

export function MetricsBar({ modelInputs, position }: MetricsBarProps) {
  const bs = useBlackScholes(modelInputs);
  const { sharesQty, warrantsQty } = computePositionQuantities(
    position,
    modelInputs,
  );

  const positionValue =
    sharesQty * modelInputs.stockPrice + warrantsQty * bs.price;
  const profitLoss = positionValue - position.investment;
  const vsMarket = bs.price - modelInputs.warrantPrice;
  const fdMarketCap =
    modelInputs.stockPrice *
    (HOVR.sharesOutstanding.value + HOVR.totalWarrants);
  const daysToExpiry = Math.round(bs.T * 365.2425);

  const metrics: Metric[] = [
    { label: "Position Value", value: formatCurrency(positionValue, 0) },
    {
      label: "P/L",
      value: formatCurrency(profitLoss, 0),
      colorClass: profitLoss >= 0 ? "text-emerald-400" : "text-red-400",
    },
    { label: "BS Fair", value: formatCurrency(bs.price) },
    {
      label: "vs Mkt",
      value: formatCurrency(vsMarket),
      colorClass: vsMarket >= 0 ? "text-emerald-400" : "text-red-400",
    },
    { label: "IV", value: formatPercent(bs.iv) },
    { label: "Δ", value: formatNumber(bs.delta, 3) },
    { label: "FD Cap", value: formatCurrency(fdMarketCap, 0) },
    { label: "Days to Expiry", value: `${daysToExpiry}d` },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="bg-slate-900 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-400">{m.label}</div>
          <div className={`text-lg font-semibold ${m.colorClass ?? ""}`}>
            {m.value}
          </div>
        </div>
      ))}
    </div>
  );
}
