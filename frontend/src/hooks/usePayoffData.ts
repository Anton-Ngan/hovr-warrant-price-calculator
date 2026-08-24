import { useMemo } from "react";
import { useBlackScholes } from "./useBlackScholes";
import { computePositionQuantities } from "../lib/position";
import { computePayoffPoints, type PayoffPoint } from "../lib/payoff";
import type { ModelInputs, Position } from "../lib/types";

export function usePayoffData(
  modelInputs: ModelInputs,
  position: Position,
  chartCap: number,
): PayoffPoint[] {
  const { T, iv } = useBlackScholes(modelInputs);
  const { sharesQty, warrantsQty, costBasis } = computePositionQuantities(
    position,
    modelInputs,
  );

  return useMemo(
    () =>
      computePayoffPoints({
        T,
        iv,
        sharesQty,
        warrantsQty,
        costBasis,
        currentStockPrice: modelInputs.stockPrice,
        currentWarrantPrice: modelInputs.warrantPrice,
        chartCap,
      }),
    [
      T,
      iv,
      sharesQty,
      warrantsQty,
      costBasis,
      modelInputs.stockPrice,
      modelInputs.warrantPrice,
      chartCap,
    ],
  );
}
