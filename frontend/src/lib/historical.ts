import { blackScholes } from "./pricing";
import { HOVR, RISK_FREE_RATE } from "./constants";
import { yearsBetween } from "./time";

export interface HistoricalPoint {
  date: number; 
  stockPrice: number;
  warrantPrice: number;
  iv: number;
  bsPrice: number;
  bsVsMarket: number;
  delta: number;
}

/** Tiny seeded RNG so the fake series is stable across re-renders. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSimulatedHistory(
  tradingDays = 252,
  seed = 20260831,
): HistoricalPoint[] {
  const rand = mulberry32(seed);
  const expiry = new Date(HOVR.expiry + "T00:00:00");
  const points: HistoricalPoint[] = [];

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - tradingDays);

  let stockPrice = 2.4;

  for (let i = 0; i <= tradingDays; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    stockPrice = Math.max(0.25, stockPrice * (1 + (rand() - 0.48) * 0.055));
    const T = Math.max(0, yearsBetween(date, expiry));
    const iv = Math.min(2.2, Math.max(0.35, 0.92 + (rand() - 0.5) * 0.28));
    const { price: bsPrice, delta } = blackScholes(
      stockPrice,
      HOVR.strike,
      T,
      RISK_FREE_RATE,
      iv,
    );
    const warrantPrice = Math.max(0.04, bsPrice * (1 + (rand() - 0.5) * 0.1));

    points.push({
      date: date.getTime(),
      stockPrice,
      warrantPrice,
      iv,
      bsPrice,
      bsVsMarket: bsPrice - warrantPrice,
      delta,
    });
  }

  return points;
}

export const SIMULATED_HISTORY = generateSimulatedHistory();