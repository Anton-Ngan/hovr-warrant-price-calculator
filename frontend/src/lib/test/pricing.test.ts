import { describe, it, expect } from "vitest";
import { blackScholes, solveIV } from "../pricing";

describe("blackScholes", () => {
  it("matches the known at-the-money reference value", () => {
    const result = blackScholes(100, 100, 1, 0.05, 0.2);
    expect(result.price).toBeCloseTo(10.45, 1);
    expect(result.delta).toBeCloseTo(0.637, 2);
  });

  it("returns intrinsic value at T=0 (expiry)", () => {
    // Below strike -> worthless
    expect(blackScholes(10, 11.5, 0, 0.045, 0.5).price).toBeCloseTo(0, 5);
    // Above strike -> worth the difference, no time value left
    expect(blackScholes(15, 11.5, 0, 0.045, 0.5).price).toBeCloseTo(3.5, 5);
  });

  it("price approaches zero, deep out-of-the-money", () => {
    // Stock far below strike, short time left
    const { price } = blackScholes(2, 11.5, 0.1, 0.045, 0.9);
    expect(price).toBeLessThan(0.05);
  });

  it("price approaches intrinsic value deep in-the-money", () => {
    const S = 50;
    const K = 11.5;
    const { price } = blackScholes(S, K, 1, 0.045, 0.3);
    expect(price).toBeGreaterThan(S - K - 1); // close to S-K, time value negligible
  });

  it("delta stays within [0, 1] and gamma and vega are (>= 0) across a range of stock prices", () => {
    for (const S of [1, 5, 10, 11.5, 15, 30, 100]) {
      const { delta, gamma, vega } = blackScholes(S, 11.5, 1, 0.045, 0.9);
      expect(delta).toBeGreaterThanOrEqual(0);
      expect(delta).toBeLessThanOrEqual(1);
      expect(gamma).toBeGreaterThanOrEqual(0);
      expect(vega).toBeGreaterThanOrEqual(0);
    }
  });

  it("price increases monotonically with volatility", () => {
    const low = blackScholes(11.5, 11.5, 1, 0.045, 0.3).price;
    const high = blackScholes(11.5, 11.5, 1, 0.045, 0.9).price;
    expect(high).toBeGreaterThan(low);
  });

  it("price decreases as time to expiry shrinks (theta decay), all else equal", () => {
    const longer = blackScholes(11.5, 11.5, 1, 0.045, 0.9).price;
    const shorter = blackScholes(11.5, 11.5, 0.1, 0.045, 0.9).price;
    expect(shorter).toBeLessThan(longer);
  });
});

describe("Find the Implied Volatility", () => {
  it("round-trips: price at sigma=0.96, recover sigma=0.96", () => {
    const S = 5,
      K = 11.5,
      T = 2,
      r = 0.045,
      trueSigma = 0.96;
    const { price } = blackScholes(S, K, T, r, trueSigma);
    expect(solveIV(S, K, T, r, price)).toBeCloseTo(trueSigma, 2);
  });

  it("round-trips at a low volatility", () => {
    const S = 11.5,
      K = 11.5,
      T = 1,
      r = 0.045,
      trueSigma = 0.25;
    const { price } = blackScholes(S, K, T, r, trueSigma);
    expect(solveIV(S, K, T, r, price)).toBeCloseTo(trueSigma, 2);
  });

  it("round-trips deep out-of-the-money, near-expiry", () => {
    const S = 2,
      K = 11.5,
      T = 0.2,
      r = 0.045,
      trueSigma = 1.1;
    const { price } = blackScholes(S, K, T, r, trueSigma);
    // True option price is very low at $0.0001, thus IV cannot be precisely pinned down
    // two different volatilities can produce option prices less than bisection's tolerance
    // so there has to be loose tolerance here
    expect(solveIV(S, K, T, r, price)).toBeCloseTo(trueSigma, 0);
  });
});
