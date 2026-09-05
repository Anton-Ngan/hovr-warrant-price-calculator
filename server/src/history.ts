import { HOVR, RISK_FREE_RATE } from "./lib/constants.js";
import { solveIV } from "./lib/pricing.js";
import { yearsBetween } from "./lib/time.js";
import { loadCSVClosePrices } from "./csvStore.js";

export interface HistoryPoint {
  date: number;
  stockPrice: number;
  warrantPrice: number;
  iv: number;
}

export function buildHistory(): HistoryPoint[] {
  const stocks = loadCSVClosePrices("HOVR");
  const warrants = loadCSVClosePrices("HOVRW");
  const expiry = new Date(`${HOVR.expiry}T00:00:00`);
  const points: HistoryPoint[] = [];

  for (const [iso, stockPrice] of stocks) {
    const warrantPrice = warrants.get(iso);
    if (warrantPrice === undefined) continue;

    const [y, m, d] = iso.split("-").map(Number);
    if (y === undefined || m === undefined || d === undefined) {
      throw new Error(`Bad ISO date: ${iso}`);
    }
    const asOf = new Date(y, m - 1, d);
    const T = Math.max(0, yearsBetween(asOf, expiry));
    const iv = solveIV(stockPrice, HOVR.strike, T, RISK_FREE_RATE, warrantPrice);

    points.push({
      date: asOf.getTime(),
      stockPrice,
      warrantPrice,
      iv,
    });
  }

  return points;
}