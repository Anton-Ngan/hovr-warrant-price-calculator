import echarts from "./echarts-setup";

export const CHART_FONT =
  "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif";

export const CHART_COLORS = {
  position: "#5eead4",
  stock: "#7dd3fc",
  warrant: "#c4b5fd",
  redeemed: "#fb7185",
  iv: "#c4b5fd",
  spot: "#34d399",
  strike: "#fbbf24",
  redemption: "#f87171",
  axis: "#d4d4d8",
  axisLine: "#3f3f46",
  split: "#27272a",
} as const;

function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function areaGradient(hex: string) {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: withAlpha(hex, 0.36) },
    { offset: 0.55, color: withAlpha(hex, 0.1) },
    { offset: 1, color: withAlpha(hex, 0) },
  ]);
}

export const legendChrome = {
  left: 4,
  top: 8,
  icon: "roundRect" as const,
  itemWidth: 16,
  itemHeight: 2,
  itemGap: 16,
  itemStyle: { borderWidth: 0 },
  inactiveColor: "#52525b",
  textStyle: {
    color: "#d4d4d8",
    fontSize: 12,
    fontFamily: CHART_FONT,
  },
};

export const tooltipChrome = {
  backgroundColor: "rgba(24, 24, 27, 0.96)",
  borderColor: "rgba(255, 255, 255, 0.08)",
  borderWidth: 1,
  padding: 12,
  extraCssText:
    "border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,0.45);backdrop-filter:blur(8px);",
  textStyle: {
    color: "#e4e4e7",
    fontSize: 13,
    fontFamily: CHART_FONT,
  },
  confine: true as const,
};

export function tooltipShell(title: string, body: string, footer?: string): string {
  return `<div style="min-width:188px;font-family:${CHART_FONT}">
    <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#a1a1aa;margin-bottom:8px">${title}</div>
    ${body}
    ${
      footer
        ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.06)">${footer}</div>`
        : ""
    }
  </div>`;
}

export function tooltipRow(
  label: string,
  value: string,
  color?: string,
  valueColor = "#f4f4f5",
): string {
  const swatch = color
    ? `<span style="width:7px;height:7px;border-radius:99px;background:${color};flex-shrink:0"></span>`
    : "";
  return `<div style="display:flex;align-items:center;justify-content:space-between;gap:20px;padding:2.5px 0">
    <span style="display:flex;align-items:center;gap:8px;color:#d4d4d8;font-size:13px">${swatch}${label}</span>
    <span style="font-variant-numeric:tabular-nums;color:${valueColor};font-size:13px;font-weight:500">${value}</span>
  </div>`;
}

export function pnlTextColor(value: number): string {
  if (value > 0) return "#34d399";
  if (value < 0) return "#f87171";
  return "#a1a1aa";
}

/** Pixel y-offsets so end-of-line labels don't stack on top of each other. */
export function endLabelPixelOffsets(
  values: number[],
  yMin: number,
  yMax: number,
  gridHeightPx = 280,
  minGapPx = 16,
): number[] {
  const span = Math.max(yMax - yMin, 1e-6);
  const pxPer = gridHeightPx / span;
  const order = values.map((y, i) => ({ i, y })).sort((a, b) => a.y - b.y);
  const display = order.map((o) => o.y);
  for (let k = 1; k < order.length; k++) {
    const floor = display[k - 1] + minGapPx / pxPer;
    if (display[k] < floor) display[k] = floor;
  }
  const offsets = Array(values.length).fill(0);
  order.forEach((o, k) => {
    offsets[o.i] = (o.y - display[k]) * pxPer;
  });
  return offsets;
}

export const axisLabelStyle = {
  color: CHART_COLORS.axis,
  fontFamily: CHART_FONT,
  fontSize: 12,
};

export const axisLineStyle = { lineStyle: { color: CHART_COLORS.axisLine } };

export const splitLineStyle = {
  lineStyle: { color: CHART_COLORS.split, type: "dashed" as const },
};
