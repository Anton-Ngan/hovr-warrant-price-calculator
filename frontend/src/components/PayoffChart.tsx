import { memo, useLayoutEffect, useRef, useState } from "react";
import type { ECharts } from "echarts/core";
import ReactEChartsCoreImport from "echarts-for-react/lib/core";
import type { EChartsOption } from "echarts";
import type { LineSeriesOption } from "echarts/charts";
import echarts from "../lib/echarts-setup";
import { usePayoffData } from "../hooks/usePayoffData";
import { computePositionQuantities } from "../lib/position";
import {
  formatCompactCurrency,
  formatCurrency,
  formatSignedCompactCurrency,
} from "../lib/format";
import type { ModelInputs, Position } from "../lib/types";
import type { PayoffPoint } from "../lib/payoff";
import { HOVR } from "../lib/constants";
import {
  CHART_COLORS,
  CHART_FONT,
  areaGradient,
  axisLabelStyle,
  axisLineStyle,
  endLabelPixelOffsets,
  legendChrome,
  pnlTextColor,
  splitLineStyle,
  tooltipChrome,
  tooltipRow,
  tooltipShell,
} from "../lib/chartTheme";

const ReactEChartsCore =
  (ReactEChartsCoreImport as unknown as { default?: typeof ReactEChartsCoreImport })
    .default ?? ReactEChartsCoreImport;

const FD_SHARES = HOVR.sharesOutstanding.value + HOVR.totalWarrants;

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

function lineSeries(config: LineSeriesOption): LineSeriesOption {
  return {
    showSymbol: false,
    symbol: "circle",
    symbolSize: 8,
    animation: false,
    emphasis: { scale: false },
    ...config,
  };
}

export const PayoffChart = memo(function PayoffChart({
  modelInputs,
  position,
  chartCap,
  onHover,
}: PayoffChartProps) {
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

  const yMin = -costBasis;
  const yMax = 1.3 * computeYMax(points);
  const last = points[points.length - 1];
  const labelOffsets = last
    ? endLabelPixelOffsets(
        [
          last.positionValue,
          last.allStockPL,
          last.allWarrantPL,
          last.redeemedValue,
        ],
        yMin,
        yMax,
      )
    : [0, 0, 0, 0];

  const markLineConfig = {
    silent: true,
    symbol: "none" as const,
    animation: false,
    label: {
      position: "end" as const,
      formatter: (p: { name: string }) => p.name,
      fontSize: 11,
      fontFamily: CHART_FONT,
    },
    data: [
      {
        name: `SPOT ${formatCurrency(modelInputs.stockPrice)}`,
        xAxis: modelInputs.stockPrice,
        lineStyle: { color: CHART_COLORS.spot, type: "dashed" as const },
        label: { color: CHART_COLORS.spot },
      },
      {
        name: `STRIKE ${formatCurrency(HOVR.strike)}`,
        xAxis: HOVR.strike,
        lineStyle: { color: CHART_COLORS.strike, type: "dashed" as const },
        label: { color: CHART_COLORS.strike },
      },
      {
        name: `REDEMPTION ${formatCurrency(HOVR.redemptionTrigger)}`,
        xAxis: HOVR.redemptionTrigger,
        lineStyle: {
          color: CHART_COLORS.redemption,
          type: "dashed" as const,
        },
        label: { color: CHART_COLORS.redemption },
      },
    ],
  };

  const option: EChartsOption = {
    backgroundColor: "transparent",
    grid: { top: 64, right: 112, left: 64, bottom: 56 },
    legend: {
      ...legendChrome,
      data: [
        { name: "Position", icon: "roundRect" },
        { name: "All-stock P/L", icon: "roundRect" },
        { name: "All-warrant P/L", icon: "roundRect" },
        { name: "If redeemed", icon: "roundRect" },
      ],
    },
    dataset: { source: points },
    xAxis: {
      type: "value",
      min: 0,
      max: chartCap,
      axisPointer: {
        label: {
          show: true,
          backgroundColor: "#09090b",
          borderColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          borderRadius: 8,
          padding: [4, 8],
          color: "#f4f4f5",
          fontFamily: CHART_FONT,
          fontSize: 12,
          formatter: (params: { value: unknown }) =>
            formatCurrency(Number(params.value)),
        },
      },
      axisLabel: {
        ...axisLabelStyle,
        hideOverlap: true,
        formatter: (v: number) =>
          `{price|${formatCurrency(v, 0)}}\n{fd|${formatCompactCurrency(v * FD_SHARES)} FD}`,
        rich: {
          price: {
            color: "#e4e4e7",
            fontSize: 12,
            fontFamily: CHART_FONT,
            fontWeight: 500,
            lineHeight: 18,
          },
          fd: {
            color: "#a1a1aa",
            fontSize: 11,
            fontFamily: CHART_FONT,
            lineHeight: 15,
          },
        },
      },
      axisLine: axisLineStyle,
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      min: yMin,
      max: yMax,
      axisPointer: { label: { show: false } },
      axisLabel: {
        ...axisLabelStyle,
        formatter: (v: number) => formatCompactCurrency(v),
      },
      axisLine: axisLineStyle,
      splitLine: splitLineStyle,
    },
    series: [
      lineSeries({
        type: "line",
        name: "Position",
        encode: { x: "stockPrice", y: "positionValue" },
        lineStyle: { color: CHART_COLORS.position, width: 2.25 },
        itemStyle: { color: CHART_COLORS.position },
        areaStyle: { color: areaGradient(CHART_COLORS.position) },
        z: 3,
        endLabel: {
          show: true,
          formatter: "POSITION",
          color: CHART_COLORS.position,
          fontSize: 11,
          fontFamily: CHART_FONT,
          fontWeight: 500,
          offset: [8, labelOffsets[0]],
        },
      }),
      lineSeries({
        type: "line",
        name: "All-stock P/L",
        encode: { x: "stockPrice", y: "allStockPL" },
        lineStyle: {
          color: CHART_COLORS.stock,
          width: 1.5,
          type: "dashed",
        },
        itemStyle: { color: CHART_COLORS.stock },
        z: 1,
        endLabel: {
          show: true,
          formatter: "ALL-STOCK P/L",
          color: CHART_COLORS.stock,
          fontSize: 11,
          fontFamily: CHART_FONT,
          fontWeight: 500,
          offset: [8, labelOffsets[1]],
        },
      }),
      lineSeries({
        type: "line",
        name: "All-warrant P/L",
        encode: { x: "stockPrice", y: "allWarrantPL" },
        lineStyle: {
          color: CHART_COLORS.warrant,
          width: 1.5,
          type: "dashed",
        },
        itemStyle: { color: CHART_COLORS.warrant },
        z: 2,
        markLine: markLineConfig,
        endLabel: {
          show: true,
          formatter: "ALL-WARRANT P/L",
          color: CHART_COLORS.warrant,
          fontSize: 11,
          fontFamily: CHART_FONT,
          fontWeight: 500,
          offset: [8, labelOffsets[2]],
        },
      }),
      lineSeries({
        type: "line",
        name: "If redeemed",
        encode: { x: "stockPrice", y: "redeemedValue" },
        lineStyle: { color: CHART_COLORS.redeemed, width: 1.75 },
        itemStyle: { color: CHART_COLORS.redeemed },
        z: 2,
        endLabel: {
          show: true,
          formatter: "IF REDEEMED",
          color: CHART_COLORS.redeemed,
          fontSize: 11,
          fontFamily: CHART_FONT,
          fontWeight: 500,
          offset: [8, labelOffsets[3]],
        },
      }),
    ],
    tooltip: {
      ...tooltipChrome,
      trigger: "axis",
      triggerOn: pinned ? "none" : "mousemove",
      alwaysShowContent: pinned,
      axisPointer: {
        type: "line",
        snap: true,
        lineStyle: { color: CHART_COLORS.position, width: 1, type: "solid" },
      },
      formatter: (raw) => {
        const params = Array.isArray(raw) ? raw : [raw];
        const idx = params[0]?.dataIndex;
        if (idx == null) return "";
        const p = points[idx];
        if (!p) return "";
        const redeemedPL = p.redeemedValue - costBasis;
        return tooltipShell(
          `HOVR ${formatCurrency(p.stockPrice)}`,
          [
            tooltipRow(
              "Position",
              formatCurrency(p.positionValue, 0),
              CHART_COLORS.position,
              pnlTextColor(p.positionPL),
            ),
            tooltipRow(
              "ALL stock P/L",
              formatSignedCompactCurrency(p.allStockPL),
              CHART_COLORS.stock,
              pnlTextColor(p.allStockPL),
            ),
            tooltipRow(
              "ALL warrant P/L",
              formatSignedCompactCurrency(p.allWarrantPL),
              CHART_COLORS.warrant,
              pnlTextColor(p.allWarrantPL),
            ),
            tooltipRow(
              "If redeemed (intrinsic)",
              formatCurrency(p.redeemedValue, 0),
              CHART_COLORS.redeemed,
              pnlTextColor(redeemedPL),
            ),
          ].join(""),
          tooltipRow("BS fair", formatCurrency(p.warrantBSPrice)),
        );
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
    <div className="h-full min-h-0">
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        notMerge={true}
        style={{ height: "100%", width: "100%" }}
        onEvents={onEvents}
        onChartReady={handleChartReady}
      />
    </div>
  );
});
