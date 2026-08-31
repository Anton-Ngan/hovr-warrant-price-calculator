import { describe, it, expect } from "vitest";
import { computePayoffPoints, type PayoffPoint, findBreakevenPrice } from "../payoff";
import { blackScholes } from "../pricing";
import { HOVR, RISK_FREE_RATE } from "../constants";

const baseInputs = {
  T: 1,
  iv: 0.9,
  sharesQty: 1000,
  warrantsQty: 2000,
  costBasis: 10000,
  currentStockPrice: 5,
  currentWarrantPrice: 1.5,
  chartCap: 25,
};

const points: PayoffPoint[] = computePayoffPoints(baseInputs);

describe("computePayoffPoints @ shape and resolution", () => {
  it("generates one point per $0.01 step from 0 to chartCap, inclusive", () => {
    expect(points).toHaveLength(2501);
  });

  it("starts at stockPrice 0 and ends exactly at chartCap", () => {
    expect(points[0].stockPrice).toBe(0);
    expect(points[points.length - 1].stockPrice).toBe(25);
  });

  it("steps by exactly $0.01 with no floating-point drift", () => {
    expect(points[1].stockPrice).toBe(0.01);
    expect(points[782].stockPrice).toBe(7.82);
    expect(points[783].stockPrice).toBe(7.83);
  });
});

describe("computePayoffPoints @ warrant pricing", () => {
  it("warrantBSPrice matches blackScholes price at that stock price", () => {
    const point = points[1000];
    const { price } = blackScholes(
      point.stockPrice,
      HOVR.strike,
      baseInputs.T,
      RISK_FREE_RATE,
      baseInputs.iv,
    );
    expect(point.warrantBSPrice).toBeCloseTo(price);
  });

  it("timeValue is warrantBSPrice minus intrinsic value, and never negative", () => {
    for (const p of points) {
      const intrinsic = Math.max(0, p.stockPrice - HOVR.strike);
      expect(p.timeValue).toBeCloseTo(p.warrantBSPrice - intrinsic);
      expect(p.timeValue).toBeGreaterThanOrEqual(-1e-9);
    }
  });

  it("timeValueAtRisk scales timeValue by warrantsQty", () => {
    const point = points[1000];
    expect(point.timeValueAtRisk).toBeCloseTo(
      point.timeValue * baseInputs.warrantsQty,
    );
  });
});

describe("computePayoffPoints @ position value and P/L", () => {
  it("redeemedValue matches sharesQty*price + warrantsQty*max(0, price-strike)", () => {
    const point = points[1500];
    const expected =
      baseInputs.sharesQty * point.stockPrice +
      baseInputs.warrantsQty * Math.max(0, point.stockPrice - HOVR.strike);
    expect(point.redeemedValue).toBeCloseTo(expected);
  });

  it("positionPL and positionPLPercent are derived from positionValue and costBasis", () => {
    const point = points[1000];
    expect(point.positionPL).toBeCloseTo(
      point.positionValue - baseInputs.costBasis,
    );
    expect(point.positionPLPercent).toBeCloseTo(
      point.positionPL / baseInputs.costBasis,
    );
  });

  it("positionValue is never negative", () => {
    for (const p of points) {
      expect(p.positionValue).toBeGreaterThanOrEqual(0);
    }
  });

  it("redeemedValue never exceeds positionValue, since BS price >= intrinsic value", () => {
    for (const p of points) {
      expect(p.redeemedValue).toBeLessThanOrEqual(p.positionValue + 1e-6);
    }
  });
});

describe("computePayoffPoints @ alternate scenarios", () => {
  it("allStockPL matches allStockQty * price - costBasis", () => {
    const point = points[2000];
    const allStockQty = baseInputs.costBasis / baseInputs.currentStockPrice;
    const expected = allStockQty * point.stockPrice - baseInputs.costBasis;
    expect(point.allStockPL).toBeCloseTo(expected);
  });

  it("allWarrantPL matches allWarrantQty * warrantBSPrice - costBasis", () => {
    const point = points[1000];
    const allWarrantQty = baseInputs.costBasis / baseInputs.currentWarrantPrice;
    expect(point.allWarrantPL).toBeCloseTo(
      allWarrantQty * point.warrantBSPrice - baseInputs.costBasis,
    );
  });

  it("vsAllStockAmount is the difference between positionPL and allStockPL", () => {
    const point = points[1000];
    expect(point.vsAllStockAmount).toBeCloseTo(
      point.positionPL - point.allStockPL,
    );
  });

  it("vsAllStockMultiple is NaN exactly at the entry stock price (allStockPL = 0 there)", () => {
    const entryIndex = Math.round(baseInputs.currentStockPrice * 100);
    const entryPoint = points[entryIndex];
    expect(entryPoint.stockPrice).toBe(baseInputs.currentStockPrice);
    expect(Number.isNaN(entryPoint.vsAllStockMultiple)).toBe(true);

    const farPoint = points[points.length - 1];
    expect(Number.isFinite(farPoint.vsAllStockMultiple)).toBe(true);
    expect(farPoint.vsAllStockMultiple).toBeCloseTo(
      farPoint.positionPL / farPoint.allStockPL,
    );
  });
});

describe("computePayoffPoints @ Greeks and FD cap", () => {
  it("includes per-point Greeks with sane bounds", () => {
    const point = points[1000];
    expect(point.delta).toBeGreaterThanOrEqual(0);
    expect(point.delta).toBeLessThanOrEqual(1);
    expect(point.gamma).toBeGreaterThanOrEqual(0);
    expect(point.vega).toBeGreaterThanOrEqual(0);
  });

  it("fdMarketCap is 0 at stockPrice 0 and grows with stock price", () => {
    expect(points[0].fdMarketCap).toBe(0);
    expect(points[1000].fdMarketCap).toBeGreaterThan(points[500].fdMarketCap);
  });
});

describe("findBreakevenPrice", () => {
  it("findBreakevenPrice is the first grid point with positionPL >= 0", () => {
    const points = computePayoffPoints(baseInputs);
    const be = findBreakevenPrice(points);
    expect(be).not.toBeNull();
    const idx = Math.round(be! * 100);
    expect(points[idx].positionPL).toBeGreaterThanOrEqual(0);
    if (idx > 0) {
      expect(points[idx - 1].positionPL).toBeLessThan(0);
    }
  });
});
