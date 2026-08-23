export interface ModelInputs {
  stockPrice: number;
  warrantPrice: number;
  impliedVolOverride: number | null;
  modelDateOffsetDays: number;
}

export interface PlanPosition {
  mode: "plan";
  investment: number;
  allocationPct: number;
}

export interface TrackPosition {
  mode: "track";
  sharesOwned: number;
  avgShareCost: number;
  warrantsOwned: number;
  avgWarrantCost: number;
}

export type Position = PlanPosition | TrackPosition;
export type ViewMode = "model" | "historical";
export type HistoricalMetric = "price" | "iv" | "bsVsMarket" | "delta";
