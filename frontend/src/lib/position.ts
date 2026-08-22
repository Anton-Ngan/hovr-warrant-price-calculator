import type { ModelInputs, Position } from "./types";

export interface PositionQuantities {
  sharesQty: number;
  warrantsQty: number;
  stockAllocation: number;
  warrantAllocation: number;
}

export function computePositionQuantities(
  position: Position,
  modelInputs: ModelInputs,
): PositionQuantities {
  const warrantAllocation =
    (position.allocationPct / 100) * position.investment;
  const stockAllocation = position.investment - warrantAllocation;

  const sharesQty =
    modelInputs.stockPrice > 0 ? stockAllocation / modelInputs.stockPrice : 0;
  const warrantsQty =
    modelInputs.warrantPrice > 0
      ? warrantAllocation / modelInputs.warrantPrice
      : 0;

  return { warrantAllocation, stockAllocation, sharesQty, warrantsQty };
}
