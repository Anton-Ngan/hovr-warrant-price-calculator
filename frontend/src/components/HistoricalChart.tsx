import { memo } from "react";
import ReactEChartsCoreImport from "echarts-for-react/lib/core";
import type { EChartsOption } from "echarts";
import type { LineSeriesOption } from "echarts/charts";
import echarts from "../lib/echarts-setup";
import { formatCurrency, formatPercent } from "../lib/format";
import type { HistoricalMetric } from "../lib/types";
import { SegmentedControl } from "./UI/SegmentedControl";
import type { HistoryPoint } from "../hooks/useHistoricalData";
import {
  CHART_COLORS,
  areaGradient,
  axisLabelStyle,
  axisLineStyle,
  legendChrome,
  splitLineStyle,
  tooltipChrome,
  tooltipRow,
  tooltipShell,
} from "../lib/chartTheme";

const ReactEChartsCore =
  (ReactEChartsCoreImport as unknown as { default?: typeof ReactEChartsCoreImport })
    .default ?? ReactEChartsCoreImport;

interface HistoricalChartProps {
  metric: HistoricalMetric;
  onMetricChange: (metric: HistoricalMetric) => void;
  points: HistoryPoint[];
}

const PILLS: { id: HistoricalMetric; label: string }[] = [
  { id: "price", label: "Price" },
  { id: "iv", label: "IV" },
];

export const HistoricalChart = memo(function HistoricalChart({
  metric,
  onMetricChange,
  points,
}: HistoricalChartProps) {
  const isPrice = metric === "price";

  const series: LineSeriesOption[] = isPrice
    ? [
        {
          type: "line",
          name: "HOVR",
          encode: { x: "date", y: "stockPrice" },
          showSymbol: false,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { color: CHART_COLORS.stock, width: 2 },
          itemStyle: { color: CHART_COLORS.stock },
          areaStyle: { color: areaGradient(CHART_COLORS.stock) },
          animation: false,
        },
        {
          type: "line",
          name: "HOVRW",
          encode: { x: "date", y: "warrantPrice" },
          showSymbol: false,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { color: CHART_COLORS.warrant, width: 2 },
          itemStyle: { color: CHART_COLORS.warrant },
          animation: false,
        },
      ]
    : [
        {
          type: "line",
          name: "IV",
          encode: { x: "date", y: "iv" },
          showSymbol: false,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { color: CHART_COLORS.iv, width: 2 },
          itemStyle: { color: CHART_COLORS.iv },
          areaStyle: { color: areaGradient(CHART_COLORS.iv) },
          animation: false,
        },
      ];

  const option: EChartsOption = {
    backgroundColor: "transparent",
    grid: { top: isPrice ? 56 : 24, right: 20, left: 56, bottom: 32 },
    legend: isPrice ? legendChrome : { show: false },
    dataset: { source: points },
    xAxis: {
      type: "time",
      axisLabel: {
        ...axisLabelStyle,
        formatter: (value: number) =>
          new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
      },
      axisLine: axisLineStyle,
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLabel: {
        ...axisLabelStyle,
        formatter: (v: number) =>
          isPrice ? formatCurrency(v) : formatPercent(v),
      },
      axisLine: axisLineStyle,
      splitLine: splitLineStyle,
    },
    tooltip: {
      ...tooltipChrome,
      trigger: "axis",
      axisPointer: {
        type: "line",
        snap: true,
        lineStyle: { color: CHART_COLORS.stock, width: 1, type: "solid" },
      },
      formatter: (raw) => {
        const params = Array.isArray(raw) ? raw : [raw];
        const idx = params[0]?.dataIndex;
        if (idx == null) return "";
        const p = points[idx];
        if (!p) return "";
        const when = new Date(p.date).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        if (isPrice) {
          return tooltipShell(
            when,
            [
              tooltipRow(
                "HOVR",
                formatCurrency(p.stockPrice),
                CHART_COLORS.stock,
              ),
              tooltipRow(
                "HOVRW",
                formatCurrency(p.warrantPrice),
                CHART_COLORS.warrant,
              ),
            ].join(""),
          );
        }
        return tooltipShell(
          when,
          tooltipRow("IV", formatPercent(p.iv), CHART_COLORS.iv),
        );
      },
    },
    series,
  };

  return (
    <div className="h-full min-h-0 flex flex-col gap-2">
      <div className="flex shrink-0">
        <SegmentedControl
          value={metric}
          onChange={onMetricChange}
          options={PILLS}
        />
      </div>
      <div className="flex-1 min-h-0">
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          notMerge={true}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
});
