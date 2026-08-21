import { pdf, cdf } from "@stdlib/stats-base-dists-normal";

export interface BlackScholesResult {
  price: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export const STANDARD_SIGMA = 1;
export const STANDARD_MU = 0;

export function blackScholes(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
): BlackScholesResult {
  // Warrant has expired, value is intrinsic and greeks are degenerate
  if (T <= 0) {
    const price = Math.max(0, S - K);
    return {
      price,
      delta: S > K ? 1 : 0,
      gamma: 0,
      theta: 0,
      vega: 0,
      rho: 0,
    };
  }

  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  const Nd1 = cdf(d1, STANDARD_MU, STANDARD_SIGMA);
  const Nd2 = cdf(d2, STANDARD_MU, STANDARD_SIGMA);
  const pdfD1 = pdf(d1, STANDARD_MU, STANDARD_SIGMA);
  const discountedK = K * Math.exp(-r * T);

  const price = S * Nd1 - discountedK * Nd2;
  const delta = Nd1;
  const gamma = pdfD1 / (S * sigma * sqrtT);
  const theta =
    (-(S * pdfD1 * sigma) / (2 * sqrtT) - r * discountedK * Nd2) / 365;
  const vega = (S * pdfD1 * sqrtT) / 100;
  const rho = (discountedK * T * Nd2) / 100;

  return { price, delta, gamma, theta, vega, rho };
}

export function solveIV(
  S: number,
  K: number,
  T: number,
  r: number,
  marketPrice: number,
): number {
  let low = 0.001;
  let high = 5.0;
  const tolerance = Math.max(0.0001, marketPrice * 0.001);
  const maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2;
    const { price } = blackScholes(S, K, T, r, mid);

    if (Math.abs(price - marketPrice) < tolerance) {
      return mid;
    }

    if (price > marketPrice) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return (low + high) / 2;
}
