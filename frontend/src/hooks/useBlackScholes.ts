import { useMemo } from "react";
import { blackScholes, solveIV, type BlackScholesResult } from "../lib/pricing";
import { HOVR, RISK_FREE_RATE } from "../lib/constants";
import type { ModelInputs } from "../lib/types";

function yearsBetween(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24 * 365.2425);
}

export interface UseBlackScholesResult extends BlackScholesResult {
  T: number; // years to expiry, after applying the model-date offset
  iv: number; // volatility acutally used (override or solved from market price)
}

export function useBlackScholes(
  modelInputs: ModelInputs,
): UseBlackScholesResult {
  const T = useMemo(() => {
    const baseT = Math.max(0, yearsBetween(new Date(), new Date(HOVR.expiry)));
    return Math.max(0, baseT - modelInputs.modelDateOffsetMonths / 12);
  }, [modelInputs.modelDateOffsetMonths]);

  const iv = useMemo(() => {
    if (modelInputs.impliedVolOverride !== null) {
      return modelInputs.impliedVolOverride;
    }
    return solveIV(
      modelInputs.stockPrice,
      HOVR.strike,
      T,
      RISK_FREE_RATE,
      modelInputs.warrantPrice,
    );
  }, [
    modelInputs.impliedVolOverride,
    modelInputs.stockPrice,
    modelInputs.warrantPrice,
    T,
  ]);

  const result = useMemo(
    () =>
      blackScholes(modelInputs.stockPrice, HOVR.strike, T, RISK_FREE_RATE, iv),
    [modelInputs.stockPrice, T, iv],
  );

  return { ...result, T, iv };
}
