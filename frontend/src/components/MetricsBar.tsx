import { useBlackScholes } from "../hooks/useBlackScholes";
import { computePositionQuantities } from "../lib/position";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatSignedCompactCurrency,
  formatSignedPercent,
  zeroIfNegligible,
} from "../lib/format";
import { HOVR } from "../lib/constants";
import type { ModelInputs, Position } from "../lib/types";
import type { PayoffPoint } from "../lib/payoff";

interface MetricsBarProps {
  modelInputs: ModelInputs;
  position: Position;
  hoveredPoint?: PayoffPoint | null;
}

function pnlTone(value: number): string {
  if (value > 0) return "text-emerald-400";
  if (value < 0) return "text-red-400";
  return "text-zinc-400";
}

export function MetricsBar({
  modelInputs,
  position,
  hoveredPoint = null,
}: MetricsBarProps) {
  const bs = useBlackScholes(modelInputs);
  const { sharesQty, warrantsQty, costBasis } = computePositionQuantities(
    position,
    modelInputs,
  );

  const positionValue = hoveredPoint
    ? hoveredPoint.positionValue
    : sharesQty * modelInputs.stockPrice + warrantsQty * bs.price;
  const bsFairPrice = hoveredPoint ? hoveredPoint.warrantBSPrice : bs.price;
  const fdMarketCap = hoveredPoint
    ? hoveredPoint.fdMarketCap
    : modelInputs.stockPrice *
      (HOVR.sharesOutstanding.value + HOVR.totalWarrants);

  const profitLoss = zeroIfNegligible(
    positionValue - costBasis,
    Math.max(0.01, costBasis * 1e-6),
  );
  const plPct = costBasis > 0 ? profitLoss / costBasis : 0;

  const allStockQty =
    modelInputs.stockPrice > 0 ? costBasis / modelInputs.stockPrice : 0;
  const allStockPLLive =
    allStockQty * modelInputs.stockPrice - costBasis;
  const vsAllStockAmount = zeroIfNegligible(
    hoveredPoint
      ? hoveredPoint.vsAllStockAmount
      : profitLoss - allStockPLLive,
  );
  const vsAllStockMultiple = hoveredPoint
    ? hoveredPoint.vsAllStockMultiple
    : Math.abs(allStockPLLive) > 0.01
      ? profitLoss / allStockPLLive
      : NaN;

  const pillTone =
    profitLoss > 0
      ? "bg-emerald-950/70 text-emerald-400 ring-emerald-500/15"
      : profitLoss < 0
        ? "bg-red-950/70 text-red-400 ring-red-500/15"
        : "bg-zinc-800/80 text-zinc-400 ring-white/10";

  const pillArrow = profitLoss > 0 ? "▲" : profitLoss < 0 ? "▼" : "–";
  const vsTone = pnlTone(vsAllStockAmount);
  const multipleLabel = Number.isFinite(vsAllStockMultiple)
    ? `${formatNumber(vsAllStockMultiple, 1)}×`
    : "—";

  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-zinc-400">
        Position value
      </div>
      <div className="text-3xl font-semibold tabular-nums tracking-tight">
        {formatCurrency(positionValue, 0)}
      </div>
      <div
        className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium tabular-nums ring-1 ${pillTone}`}
      >
        <span className="text-[9px] leading-none">{pillArrow}</span>
        <span>{formatSignedCompactCurrency(profitLoss)}</span>
        <span className="opacity-40">·</span>
        <span>{formatSignedPercent(plPct)}</span>
      </div>
      <p className="text-xs text-zinc-400 mt-1.5">P/L vs cost basis</p>
      <div className="mt-3 pt-3 border-t border-white/5 text-xs text-zinc-400 space-y-0.5">
        <div>
          HOVR {formatCurrency(modelInputs.stockPrice)} · FD{" "}
          {formatCurrency(fdMarketCap, 0)}
        </div>
        <div>
          IV {formatPercent(bs.iv)} · BS {formatCurrency(bsFairPrice)}
        </div>
      </div>
      <div
        className={`mt-3 pt-3 border-t border-white/5 text-xs font-medium tabular-nums ${vsTone}`}
      >
        vs all-stock {formatSignedCompactCurrency(vsAllStockAmount)}
        <span className="opacity-50"> · </span>
        {multipleLabel}
      </div>
    </div>
  );
}
