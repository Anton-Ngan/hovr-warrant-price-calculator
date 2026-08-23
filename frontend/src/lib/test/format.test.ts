import { describe, it, expect } from "vitest";
import { formatCurrency, formatPercent, formatNumber } from "../format";

describe("formatCurrency", () => {
  it("formats a positive value with 2 decimals by default", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("respects a custom decimals argument", () => {
    expect(formatCurrency(1234.5, 0)).toBe("$1,235");
  });

  it("formats zero correctly", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats negative values with a leading minus sign", () => {
    expect(formatCurrency(-500)).toBe("-$500.00");
  });

  it("returns a dash for non-finite input", () => {
    expect(formatCurrency(Infinity)).toBe("-");
    expect(formatCurrency(-Infinity)).toBe("-");
    expect(formatCurrency(NaN)).toBe("-");
  });
});

describe("formatPercent", () => {
  it("converts a decimal fraction to a percent string", () => {
    expect(formatPercent(0.96)).toBe("96.0%");
  });

  it("respects a custom decimals argument", () => {
    expect(formatPercent(0.9634, 2)).toBe("96.34%");
  });

  it("formats zero as 0%", () => {
    expect(formatPercent(0)).toBe("0.0%");
  });

  it("returns a dash for non-finite input", () => {
    expect(formatPercent(NaN)).toBe("-");
    expect(formatPercent(Infinity)).toBe("-");
  });
});

describe("formatNumber", () => {
  it("formats with thousands separators and 2 decimals by default", () => {
    expect(formatNumber(1234567.891)).toBe("1,234,567.89");
  });

  it("respects a custom decimals argument (rounds to whole number)", () => {
    expect(formatNumber(1234.567, 0)).toBe("1,235");
  });

  it("returns a dash for non-finite input", () => {
    expect(formatNumber(NaN)).toBe("-");
    expect(formatNumber(Infinity)).toBe("-");
  });
});
