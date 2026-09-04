import { describe, it, expect } from "vitest";
import { endLabelPixelOffsets } from "../chartTheme";

describe("endLabelPixelOffsets", () => {
  it("leaves well-separated values unshifted", () => {
    const offsets = endLabelPixelOffsets([0, 50, 100], 0, 100, 100, 10);
    expect(offsets[0]).toBeCloseTo(0);
    expect(offsets[1]).toBeCloseTo(0);
    expect(offsets[2]).toBeCloseTo(0);
  });

  it("pushes stacked labels apart in pixel space", () => {
    const offsets = endLabelPixelOffsets([50, 50], 0, 100, 100, 14);
    expect(offsets[0]).not.toBeCloseTo(offsets[1]);
    expect(Math.abs(offsets[0] - offsets[1])).toBeGreaterThanOrEqual(13.9);
  });
});
