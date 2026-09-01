import { memo } from "react";
import ReactEChartsCoreImport from "echarts-for-react/lib/core";
import type { EChartsOption } from "echarts";
import type { LineSeriesOption } from "echarts/charts";
import echarts from "../lib/echarts-setup";
import { SIMULATED_HISTORY } from "../lib/historical";
import { formatCurrency, formatPercent } from "../lib/format";
import type { HistoricalMetric } from "../lib/types";

const ReactEChartsCore =
  (ReactEChartsCoreImport as unknown as { default?: typeof ReactEChartsCoreImport })
    .default ?? ReactEChartsCoreImport;

interface HistoricalChartProps {
  metric: HistoricalMetric;
  onMetricChange: (metric: HistoricalMetric) => void;
}

const PILLS: { id: HistoricalMetric, label: string }[] = [
  { id: "price", label: "Price" },
  { id: "iv", label: "IV" },
];

export const HistoricalChart = memo(function HistoricalChart({
  metric,
  onMetricChange,
}: HistoricalChartProps) {
  const isPrice = metric === "price";

  const series: LineSeriesOption[] = isPrice
    ? [
        {
          type: "line",
          name: "HOVR",
          encode: { x: "date", y: "stockPrice" },
          showSymbol: false,
          lineStyle: { color: "#3987e5", width: 2 },
          areaStyle: { color: "#3987e5", opacity: 0.1 },
          animation: false,
        },
        {
          type: "line",
          name: "HOVRW",
          encode: { x: "date", y: "warrantPrice" },
          showSymbol: false,
          lineStyle: { color: "#d95926", width: 2 },
          animation: false,
        },
      ]
    : [
        {
          type: "line",
          name: "IV",
          encode: { x: "date", y: "iv" },
          showSymbol: false,
          lineStyle: { color: "#a78bfa", width: 2 },
          areaStyle: { color: "#a78bfa", opacity: 0.12 },
          animation: false,
        },
      ];

  const option: EChartsOption = {
    backgroundColor: "transparent",
    grid: { top: isPrice ? 40 : 24, right: 20, left: 56, bottom: 32 },
    legend: isPrice
      ? { top: 0, textStyle: { color: "#94a3b8", fontSize: 12 } }
      : { show: false },
    dataset: { source: SIMULATED_HISTORY },
    xAxis: {
      type: "time",
      axisLabel: {
        color: "#94a3b8",
        formatter: (value: number) =>
          new Date(value).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
      },
      axisLine: { lineStyle: { color: "#64748b" } },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLabel: {
        color: "#94a3b8",
        formatter: (v: number) =>
          isPrice ? formatCurrency(v) : formatPercent(v),
      },
      axisLine: { lineStyle: { color: "#64748b" } },
      splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#0f172a",
      borderColor: "#1e293b",
      textStyle: { color: "#e2e8f0" },
      confine: true,
      formatter: (raw) => {
        const params = Array.isArray(raw) ? raw : [raw];
        const idx = params[0]?.dataIndex;
        if (idx == null) return "";
        const p = SIMULATED_HISTORY[idx];
        if (!p) return "";
        const when = new Date(p.date).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        if (isPrice) {
          return [
            when,
            `HOVR: ${formatCurrency(p.stockPrice)}`,
            `HOVRW: ${formatCurrency(p.warrantPrice)}`,
          ].join("<br/>");
        }
        return [when, `IV: ${formatPercent(p.iv)}`].join("<br/>");
      },
    },
    series,
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap justify-center gap-2">
        {PILLS.map((pill) => (
          <button
            key={pill.id}
            type="button"
            onClick={() => onMetricChange(pill.id)}
            className={`px-3 py-1 rounded text-sm ${
              metric === pill.id ? "bg-blue-600" : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        notMerge={true}
        style={{ height: 500 }}
      />
    </div>
  );
});