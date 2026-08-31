import { memo, useLayoutEffect, useRef, useState } from "react";
import type { ECharts } from "echarts/core";
import ReactEChartsCoreImport from "echarts-for-react/lib/core";
import type { EChartsOption } from "echarts";
import echarts from "../lib/echarts-setup";
import { usePayoffData } from "../hooks/usePayoffData";
import { computePositionQuantities } from "../lib/position";
import { formatCurrency } from "../lib/format";
import type { ModelInputs, Position } from "../lib/types";
import type { PayoffPoint } from "../lib/payoff";
import { HOVR } from "../lib/constants";


// CJS-guard to handle the default export of ReactEChartsCoreImport
// If the import is the class itself, keep it as it is, otherwise unwrap the default export.
const ReactEChartsCore =
  (ReactEChartsCoreImport as unknown as { default?: typeof ReactEChartsCoreImport })
    .default ?? ReactEChartsCoreImport;

interface PayoffChartProps {
  modelInputs: ModelInputs;
  position: Position;
  chartCap: number;
  onHover?: (point: PayoffPoint | null) => void;
}

function computeYMax(points: PayoffPoint[]): number {
  let max = 0;
  for (const p of points) {
    if (p.positionValue > max) max = p.positionValue;
    if (p.allStockPL > max) max = p.allStockPL;
    if (p.allWarrantPL > max) max = p.allWarrantPL;
    if (p.redeemedValue > max) max = p.redeemedValue;
  }
  return max;
}

export const PayoffChart = memo(function PayoffChart({ modelInputs, position, chartCap, onHover, }: PayoffChartProps) {
  const points = usePayoffData(modelInputs, position, chartCap);
  const { costBasis } = computePositionQuantities(position, modelInputs);

  const [pinned, setPinned] = useState<boolean>(false);
  const chartRef = useRef<ECharts | null>(null);
  const pinnedRef = useRef<boolean>(false);
  const pinnedIndexRef = useRef<number | null>(null);
  const lastHoverIndexRef = useRef<number | null>(null);
  const onHoverRef = useRef(onHover);
  const pointsRef = useRef<PayoffPoint[]>(points);

  pinnedRef.current = pinned;
  onHoverRef.current = onHover;
  pointsRef.current = points;
  
  const markLineConfig = {
    silent: true,
    symbol: "none" as const,
    animation: false,
    label: {
      position: "end" as const,
      formatter: (p: { name: string }) => p.name,
      fontSize: 12,
    },
    data: [
      {
        name: `SPOT ${formatCurrency(modelInputs.stockPrice)}`,
        xAxis: modelInputs.stockPrice,
        lineStyle: { color: "#22c55e", type: "dashed" as const },
        label: { color: "#22c55e" },
      },
      {
        name: `STRIKE ${formatCurrency(HOVR.strike)}`,
        xAxis: HOVR.strike,
        lineStyle: { color: "#eab308", type: "dashed" as const },
        label: { color: "#eab308" },
      },
      {
        name: `REDEMPTION ${formatCurrency(HOVR.redemptionTrigger)}`,
        xAxis: HOVR.redemptionTrigger,
        lineStyle: { color: "#ef4444", type: "dashed" as const },
        label: { color: "#ef4444" },
      },
    ],
  };

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
        markLine: markLineConfig,
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
    tooltip: {
        trigger: "axis",
        triggerOn: pinned ? "none" : "mousemove",
        alwaysShowContent: pinned,
        axisPointer: {
          type: "line",
          snap: true,
          lineStyle: { color: "#64748b", type: "dashed" },
          label: {
            show: true,
            backgroundColor: "#1e293b",
            color: "#e2e8f0",
            formatter: (params: { value: unknown }) =>
              formatCurrency(Number(params.value)),
          },
        },
        backgroundColor: "#0f172a",
        borderColor: "#1e293b",
        textStyle: { color: "#e2e8f0" },
        confine: true,
        formatter: (raw) => {
          const params = Array.isArray(raw) ? raw : [raw];
          const idx = params[0]?.dataIndex;
          if (idx == null) return "";
          const p = points[idx];
          if (!p) return "";
          return [
            `Stock: ${formatCurrency(p.stockPrice)}`,
            `Position Value: ${formatCurrency(p.positionValue, 0)}`,
            `All Stock P/L: ${formatCurrency(p.allStockPL, 0)}`,
            `All Warrant P/L: ${formatCurrency(p.allWarrantPL, 0)}`,
            `If Redeemed: ${formatCurrency(p.redeemedValue, 0)}`,
            `BS Fair: ${formatCurrency(p.warrantBSPrice)}`,
            `Delta: ${p.delta.toFixed(3)}`,
          ].join("<br/>");
        },
      },
  };

  function applyPinnedDecorations(chart: ECharts, idx: number) {
    const p = pointsRef.current[idx];
    if (!p) return;
  
    chart.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: idx,
    });
  }
  
  useLayoutEffect(() => {
    const chart = chartRef.current;
    const idx = pinnedIndexRef.current;
    if (!chart || !pinned || idx == null) return;

    const p = points[idx] ?? points[points.length - 1];
    if (!p) return;
    
    pinnedIndexRef.current = points[idx] ? idx : points.length - 1;
    onHoverRef.current?.(p);
    applyPinnedDecorations(chart, idx);
  });

  const onEvents = {
    updateAxisPointer: (params: { dataIndex?: number }) => {
      if (params.dataIndex == null) return;
      lastHoverIndexRef.current = params.dataIndex;
  
      if (pinnedRef.current) return;
  
      const p = pointsRef.current[params.dataIndex];
      onHoverRef.current?.(p ?? null);
    },
    globalout: () => {
      if (pinnedRef.current) return;
      lastHoverIndexRef.current = null;
      onHoverRef.current?.(null);
    },
  };
  
  const handleChartReady = (chart: ECharts) => {
    chartRef.current = chart;
    chart.getZr().on("click", (event: { offsetX: number; offsetY: number }) => {
      if (!chart.containPixel("grid", [event.offsetX, event.offsetY])) return;
  
      if (pinnedRef.current) {
        pinnedIndexRef.current = null;
        setPinned(false);
        chart.dispatchAction({ type: "hideTip" });
        return;
      }
  
      const idx = lastHoverIndexRef.current;
      if (idx == null) return;
      pinnedIndexRef.current = idx;
      onHoverRef.current?.(pointsRef.current[idx] ?? null);
      setPinned(true);
    });
  };

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      notMerge={true}
      style={{ height: 900 }}
      onEvents={onEvents}
      onChartReady={handleChartReady}
    />
  );
});