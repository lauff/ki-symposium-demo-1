import { describe, it, expect } from "vitest";
import {
  canCitizenCancel,
  getNextStatuses,
  isTerminalStatus,
} from "../../lib/domain/repair-request";

describe("canCitizenCancel", () => {
  it("allows cancel when SUBMITTED", () => {
    expect(canCitizenCancel("SUBMITTED")).toBe(true);
  });
  it("allows cancel when REVIEWED", () => {
    expect(canCitizenCancel("REVIEWED")).toBe(true);
  });
  it("denies cancel when SCHEDULED", () => {
    expect(canCitizenCancel("SCHEDULED")).toBe(false);
  });
  it("denies cancel when REPAIRED", () => {
    expect(canCitizenCancel("REPAIRED")).toBe(false);
  });
});

describe("getNextStatuses", () => {
  it("SUBMITTED → REVIEWED", () => {
    expect(getNextStatuses("SUBMITTED")).toEqual(["REVIEWED"]);
  });
  it("IN_REPAIR → REPAIRED or NOT_REPAIRABLE", () => {
    expect(getNextStatuses("IN_REPAIR")).toEqual(["REPAIRED", "NOT_REPAIRABLE"]);
  });
  it("REPAIRED has no transitions", () => {
    expect(getNextStatuses("REPAIRED")).toEqual([]);
  });
});

describe("isTerminalStatus", () => {
  it("REPAIRED is terminal", () => {
    expect(isTerminalStatus("REPAIRED")).toBe(true);
  });
  it("CANCELLED is terminal", () => {
    expect(isTerminalStatus("CANCELLED")).toBe(true);
  });
  it("SUBMITTED is not terminal", () => {
    expect(isTerminalStatus("SUBMITTED")).toBe(false);
  });
});
