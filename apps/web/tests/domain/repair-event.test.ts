import { describe, it, expect } from "vitest";
import {
  isEventFull,
  hasAvailableCapacity,
  remainingCapacity,
} from "../../lib/domain/repair-event";

describe("isEventFull", () => {
  it("returns true when at capacity", () => {
    expect(isEventFull(10, 10)).toBe(true);
  });
  it("returns false when below capacity", () => {
    expect(isEventFull(10, 9)).toBe(false);
  });
  it("returns true when over capacity", () => {
    expect(isEventFull(10, 11)).toBe(true);
  });
});

describe("hasAvailableCapacity", () => {
  it("returns true when below capacity", () => {
    expect(hasAvailableCapacity(10, 5)).toBe(true);
  });
  it("returns false when at capacity", () => {
    expect(hasAvailableCapacity(10, 10)).toBe(false);
  });
});

describe("remainingCapacity", () => {
  it("returns correct remaining", () => {
    expect(remainingCapacity(10, 4)).toBe(6);
  });
  it("returns 0 when full", () => {
    expect(remainingCapacity(10, 10)).toBe(0);
  });
  it("returns 0 when over capacity", () => {
    expect(remainingCapacity(10, 12)).toBe(0);
  });
});
