import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatSignedPercent,
  formatSignedCompactCurrency,
  formatCompactCurrency,
} from "../format";

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

describe("formatSignedPercent", () => {
  it("prefixes a plus for positive fractions", () => {
    expect(formatSignedPercent(0.495)).toBe("+49.5%");
  });

  it("prefixes a minus for negative fractions", () => {
    expect(formatSignedPercent(-0.233)).toBe("-23.3%");
  });

  it("omits a sign at zero", () => {
    expect(formatSignedPercent(0)).toBe("0.0%");
  });
});

describe("formatSignedCompactCurrency", () => {
  it("uses K compact form with a leading plus", () => {
    expect(formatSignedCompactCurrency(5000)).toBe("+$5.0K");
  });

  it("uses K compact form with a leading minus", () => {
    expect(formatSignedCompactCurrency(-5000)).toBe("-$5.0K");
  });

  it("uses M compact form above a million", () => {
    expect(formatSignedCompactCurrency(1_500_000)).toBe("+$1.5M");
  });

  it("keeps full dollars below one thousand", () => {
    expect(formatSignedCompactCurrency(500)).toBe("+$500");
  });

  it("omits a sign at zero", () => {
    expect(formatSignedCompactCurrency(0)).toBe("$0");
  });
});

describe("formatCompactCurrency", () => {
  it("uses billions with one decimal", () => {
    expect(formatCompactCurrency(1_100_000_000)).toBe("$1.1B");
  });

  it("uses whole millions at 100M and above", () => {
    expect(formatCompactCurrency(394_476_875)).toBe("$394M");
  });

  it("uses one decimal million below 100M", () => {
    expect(formatCompactCurrency(71_000_000)).toBe("$71.0M");
  });

  it("uses K below one million", () => {
    expect(formatCompactCurrency(100_000)).toBe("$100.0K");
  });

  it("keeps a leading minus", () => {
    expect(formatCompactCurrency(-5000)).toBe("-$5.0K");
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
