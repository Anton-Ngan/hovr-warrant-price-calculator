import { useMemo } from "react";
import { blackScholes, solveIV, type BlackScholesResult } from "../lib/pricing";
import { HOVR, RISK_FREE_RATE } from "../lib/constants";
import type { ModelInputs } from "../lib/types";
import { getBaseYearsToExpiry } from "../lib/time";

export interface UseBlackScholesResult extends BlackScholesResult {
  T: number; // years to expiry, after applying the model-date offset
  iv: number; // volatility acutally used (override or solved from market price)
}

export function useBlackScholes(
  modelInputs: ModelInputs,
): UseBlackScholesResult {
  const T = useMemo(() => {
    return Math.max(
      0,
      getBaseYearsToExpiry() - modelInputs.modelDateOffsetMonths / 12,
    );
  }, [modelInputs.modelDateOffsetMonths]);

  const iv = useMemo(() => {
    if (modelInputs.impliedVolOverride !== null) {
      return modelInputs.impliedVolOverride;
    }
    const baseT = getBaseYearsToExpiry();
    return solveIV(
      modelInputs.stockPrice,
      HOVR.strike,
      baseT,
      RISK_FREE_RATE,
      modelInputs.warrantPrice,
    );
  }, [
    modelInputs.impliedVolOverride,
    modelInputs.stockPrice,
    modelInputs.warrantPrice,
  ]);

  const result = useMemo(
    () =>
      blackScholes(modelInputs.stockPrice, HOVR.strike, T, RISK_FREE_RATE, iv),
    [modelInputs.stockPrice, T, iv],
  );

  return { ...result, T, iv };
}
