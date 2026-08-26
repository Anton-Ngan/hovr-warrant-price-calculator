import { blackScholes } from "./pricing";
import { HOVR, RISK_FREE_RATE } from "./constants";

export interface PayoffPoint {
  [key: string]: number;
  stockPrice: number;
  warrantBSPrice: number;
  positionValue: number;
  positionPL: number;
  positionPLPercent: number;
  allStockPL: number;
  allWarrantPL: number;
  vsAllStockAmount: number;
  vsAllStockMultiple: number; // NaN when allStockPL is too close to $0 to divide meaningfully
  redeemedValue: number;
  timeValue: number;
  timeValueAtRisk: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  fdMarketCap: number;
}

export interface PayoffInputs {
  T: number;
  iv: number;
  sharesQty: number;
  warrantsQty: number;
  costBasis: number;
  currentStockPrice: number;
  currentWarrantPrice: number;
  chartCap: number;
}

const PRICE_STEP_CENTS = 1;

export function computePayoffPoints({
  T,
  iv,
  sharesQty,
  warrantsQty,
  costBasis,
  currentStockPrice,
  currentWarrantPrice,
  chartCap,
}: PayoffInputs): PayoffPoint[] {
  const capCents = Math.round(chartCap * 100);
  const allStockQty = currentStockPrice > 0 ? costBasis / currentStockPrice : 0;
  const allWarrantQty =
    currentWarrantPrice > 0 ? costBasis / currentWarrantPrice : 0;
  const fdShareBase = HOVR.sharesOutstanding.value + HOVR.totalWarrants;

  const points: PayoffPoint[] = [];
  for (let cents = 0; cents <= capCents; cents += PRICE_STEP_CENTS) {
    const stockPrice = cents / 100;
    const {
      price: warrantBSPrice,
      delta,
      gamma,
      theta,
      vega,
      rho,
    } = blackScholes(stockPrice, HOVR.strike, T, RISK_FREE_RATE, iv);

    const positionValue = sharesQty * stockPrice + warrantsQty * warrantBSPrice;
    const positionPL = positionValue - costBasis;
    const allStockPL = allStockQty * stockPrice - costBasis;
    const intrinsic = Math.max(0, stockPrice - HOVR.strike);
    const timeValue = warrantBSPrice - intrinsic;

    points.push({
      stockPrice,
      warrantBSPrice,
      positionValue,
      positionPL,
      positionPLPercent: costBasis > 0 ? positionPL / costBasis : 0,
      allStockPL,
      allWarrantPL: allWarrantQty * warrantBSPrice - costBasis,
      vsAllStockAmount: positionPL - allStockPL,
      vsAllStockMultiple:
        Math.abs(allStockPL) > 0.01 ? positionPL / allStockPL : NaN,
      redeemedValue: sharesQty * stockPrice + warrantsQty * intrinsic,
      timeValue,
      timeValueAtRisk: timeValue * warrantsQty,
      delta,
      gamma,
      theta,
      vega,
      rho,
      fdMarketCap: stockPrice * fdShareBase,
    });
  }
  return points;
}
