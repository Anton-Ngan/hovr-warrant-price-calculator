import ReactEChartsCoreImport from "echarts-for-react/lib/core";
import type { EChartsOption } from "echarts";
import echarts from "../lib/echarts-setup";
import { usePayoffData } from "../hooks/usePayoffData";
import { computePositionQuantities } from "../lib/position";
import { formatCurrency } from "../lib/format";
import type { ModelInputs, Position } from "../lib/types";
import type { PayoffPoint } from "../lib/payoff";


// CJS-guard to handle the default export of ReactEChartsCoreImport
// If the import is the class itself, keep it as it is, otherwise unwrap the default export.
const ReactEChartsCore =
  (ReactEChartsCoreImport as unknown as { default?: typeof ReactEChartsCoreImport })
    .default ?? ReactEChartsCoreImport;

interface PayoffChartProps {
  modelInputs: ModelInputs;
  position: Position;
  chartCap: number;
}

function computeYMax(points: PayoffPoint[]): number {
  let max = 0;
  for (const p of points) {
    if (p.positionValue > max) max = p.positionValue;
    if (p.allStockPL > max) max = p.allStockPL;
    if (p.allWarrantPL > max) max = p.allWarrantPL;
  }
  return max;
}

export function PayoffChart({ modelInputs, position, chartCap }: PayoffChartProps) {
  const points = usePayoffData(modelInputs, position, chartCap);
  const { costBasis } = computePositionQuantities(position, modelInputs);

  const option: EChartsOption = {
    backgroundColor: "transparent",
    grid: { top: 70, right: 20, left: 60, bottom: 30 },
    legend: {
      top: 0,
      textStyle: { color: "#94a3b8", fontSize: 12 },
    },
    dataset: { source: points },
    xAxis: {
      type: "value",
      min: 0,
      max: chartCap,
      axisLabel: { formatter: (v: number) => formatCurrency(v, 0), color: "#94a3b8" },
      axisLine: { lineStyle: { color: "#64748b" } },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      min: -costBasis,
      max: 1.3 * computeYMax(points),
      axisLabel: { formatter: (v: number) => formatCurrency(v, 0), color: "#94a3b8" },
      axisLine: { lineStyle: { color: "#64748b" } },
      splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
    },
    series: [
      {
        type: "line",
        name: "Position Value",
        encode: { x: "stockPrice", y: "positionValue" },
        showSymbol: false,
        lineStyle: { color: "#3987e5", width: 2 },
        areaStyle: { color: "#3987e5", opacity: 0.08 },
        animation: false,
        z: 3,
      },
      {
        type: "line",
        name: "All Stock P/L",
        encode: { x: "stockPrice", y: "allStockPL" },
        showSymbol: false,
        lineStyle: { color: "#94a3b8", width: 1.5, type: "dashed" },
        animation: false,
        z: 1,
      },
      {
        type: "line",
        name: "All Warrant P/L",
        encode: { x: "stockPrice", y: "allWarrantPL" },
        showSymbol: false,
        lineStyle: { color: "#199e70", width: 1.5, type: "dashed" },
        animation: false,
        z: 2,
      },
      {
        type: "line",
        name: "If Redeemed",
        encode: { x: "stockPrice", y: "redeemedValue" },
        showSymbol: false,
        lineStyle: { color: "#d95926", width: 2 },
        animation: false,
        z: 2,
      },
    ],
  };

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      notMerge={true}
      style={{ height: 600 }}
    />
  );
}