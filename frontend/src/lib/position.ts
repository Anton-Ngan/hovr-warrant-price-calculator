import type { ModelInputs, Position } from "./types";

export interface PositionQuantities {
  sharesQty: number;
  warrantsQty: number;
  stockAllocation: number;
  warrantAllocation: number;
  costBasis: number;
}

export function computePositionQuantities(
  position: Position,
  modelInputs: ModelInputs,
): PositionQuantities {
  if (position.mode === "track") {
    const stockAllocation = position.sharesOwned * position.avgShareCost;
    const warrantAllocation = position.warrantsOwned * position.avgWarrantCost;
    return {
      sharesQty: position.sharesOwned,
      warrantsQty: position.warrantsOwned,
      stockAllocation,
      warrantAllocation,
      costBasis: stockAllocation + warrantAllocation,
    };
  }

  const warrantAllocation =
    (position.allocationPct / 100) * position.investment;
  const stockAllocation = position.investment - warrantAllocation;

  const sharesQty =
    modelInputs.stockPrice > 0 ? stockAllocation / modelInputs.stockPrice : 0;
  const warrantsQty =
    modelInputs.warrantPrice > 0
      ? warrantAllocation / modelInputs.warrantPrice
      : 0;

  return {
    sharesQty,
    warrantsQty,
    stockAllocation,
    warrantAllocation,
    costBasis: position.investment,
  };
}
