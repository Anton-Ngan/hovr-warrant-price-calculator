import { describe, it, expect } from "vitest";
import { computePositionQuantities } from "../position";
import type { ModelInputs, Position } from "../types";

const baseModelInputs: ModelInputs = {
  stockPrice: 5,
  warrantPrice: 1.5,
  impliedVolOverride: null,
  modelDateOffsetDays: 0,
};

describe("computePositionQuantities in plan mode", () => {
  it("splits investment between stock and warrants per allocationPct", () => {
    const position: Position = {
      mode: "plan",
      investment: 10000,
      allocationPct: 40,
    };
    const result = computePositionQuantities(position, baseModelInputs);

    expect(result.warrantAllocation).toBeCloseTo(4000);
    expect(result.stockAllocation).toBeCloseTo(6000);
  });

  it("computes share and warrant quantities from the allocated dollars", () => {
    const position: Position = {
      mode: "plan",
      investment: 10000,
      allocationPct: 40,
    };
    const result = computePositionQuantities(position, baseModelInputs);

    expect(result.sharesQty).toBeCloseTo(6000 / 5);
    expect(result.warrantsQty).toBeCloseTo(4000 / 1.5);
  });

  it("puts everything into stock at 0% allocation", () => {
    const position: Position = {
      mode: "plan",
      investment: 10000,
      allocationPct: 0,
    };
    const result = computePositionQuantities(position, baseModelInputs);

    expect(result.stockAllocation).toBe(10000);
    expect(result.warrantAllocation).toBe(0);
    expect(result.warrantsQty).toBe(0);
  });

  it("puts everything into warrants at 100% allocation", () => {
    const position: Position = {
      mode: "plan",
      investment: 10000,
      allocationPct: 100,
    };
    const result = computePositionQuantities(position, baseModelInputs);

    expect(result.warrantAllocation).toBe(10000);
    expect(result.stockAllocation).toBe(0);
    expect(result.sharesQty).toBe(0);
  });

  it("returns zero quantities (not Infinity/NaN) when stockPrice is 0", () => {
    const position: Position = {
      mode: "plan",
      investment: 10000,
      allocationPct: 40,
    };
    const modelInputs: ModelInputs = { ...baseModelInputs, stockPrice: 0 };
    const result = computePositionQuantities(position, modelInputs);

    expect(result.sharesQty).toBe(0);
    expect(Number.isFinite(result.sharesQty)).toBe(true);
  });

  it("returns zero quantities (not Infinity/NaN) when warrantPrice is 0", () => {
    const position: Position = {
      mode: "plan",
      investment: 10000,
      allocationPct: 40,
    };
    const modelInputs: ModelInputs = { ...baseModelInputs, warrantPrice: 0 };
    const result = computePositionQuantities(position, modelInputs);

    expect(result.warrantsQty).toBe(0);
    expect(Number.isFinite(result.warrantsQty)).toBe(true);
  });

  it("handles zero investment", () => {
    const position: Position = {
      mode: "plan",
      investment: 0,
      allocationPct: 50,
    };
    const result = computePositionQuantities(position, baseModelInputs);

    expect(result.sharesQty).toBe(0);
    expect(result.warrantsQty).toBe(0);
  });

  it("cost basis equals the investment amount", () => {
    const position: Position = {
      mode: "plan",
      investment: 10000,
      allocationPct: 40,
    };
    const result = computePositionQuantities(position, baseModelInputs);

    expect(result.costBasis).toBe(10000);
  });
});

describe("computePositionQuantities in track mode", () => {
  it("uses owned quantities directly, ignoring current model prices", () => {
    const position: Position = {
      mode: "track",
      sharesOwned: 2000,
      avgShareCost: 4,
      warrantsOwned: 5000,
      avgWarrantCost: 1.2,
    };

    const modelInputs: ModelInputs = {
      ...baseModelInputs,
      stockPrice: 999,
      warrantPrice: 999,
    };
    const result = computePositionQuantities(position, modelInputs);

    expect(result.sharesQty).toBe(2000);
    expect(result.warrantsQty).toBe(5000);
  });

  it("computes stock/warrant dollar allocation from quantity x avg cost", () => {
    const position: Position = {
      mode: "track",
      sharesOwned: 2000,
      avgShareCost: 4,
      warrantsOwned: 5000,
      avgWarrantCost: 1.2,
    };
    const result = computePositionQuantities(position, baseModelInputs);

    expect(result.stockAllocation).toBeCloseTo(8000);
    expect(result.warrantAllocation).toBeCloseTo(6000);
  });

  it("cost basis is the sum of both legs' cost", () => {
    const position: Position = {
      mode: "track",
      sharesOwned: 2000,
      avgShareCost: 4,
      warrantsOwned: 5000,
      avgWarrantCost: 1.2,
    };
    const result = computePositionQuantities(position, baseModelInputs);

    expect(result.costBasis).toBeCloseTo(14000);
  });

  it("handles zero holdings", () => {
    const position: Position = {
      mode: "track",
      sharesOwned: 0,
      avgShareCost: 0,
      warrantsOwned: 0,
      avgWarrantCost: 0,
    };
    const result = computePositionQuantities(position, baseModelInputs);

    expect(result.sharesQty).toBe(0);
    expect(result.warrantsQty).toBe(0);
    expect(result.costBasis).toBe(0);
  });
});
