export interface ModelInputs {
  stockPrice: number;
  warrantPrice: number;
  impliedVolOverride: number | null;
  modelDateOffsetMonths: number;
}

export interface Position {
  investment: number;
  allocationPct: number;
}

export type ViewMode = "model" | "historical";
export type HistoricalMetric = "price" | "iv" | "bsVsMarket" | "delta";
