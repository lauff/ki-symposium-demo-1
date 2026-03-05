export type RepairStatus =
  | "SUBMITTED"
  | "REVIEWED"
  | "SCHEDULED"
  | "IN_REPAIR"
  | "REPAIRED"
  | "NOT_REPAIRABLE"
  | "CANCELLED";

export type RepairCategory =
  | "ELECTRONICS"
  | "SMALL_APPLIANCE"
  | "TEXTILE"
  | "BIKE"
  | "WOOD"
  | "OTHER";

export const CITIZEN_CANCELLABLE_STATUSES: RepairStatus[] = ["SUBMITTED", "REVIEWED"];

export const VOLUNTEER_FORWARD_TRANSITIONS: Record<RepairStatus, RepairStatus[]> = {
  SUBMITTED: ["REVIEWED"],
  REVIEWED: ["SCHEDULED"],
  SCHEDULED: ["IN_REPAIR"],
  IN_REPAIR: ["REPAIRED", "NOT_REPAIRABLE"],
  REPAIRED: [],
  NOT_REPAIRABLE: [],
  CANCELLED: [],
};

export function canCitizenCancel(status: RepairStatus): boolean {
  return CITIZEN_CANCELLABLE_STATUSES.includes(status);
}

export function getNextStatuses(status: RepairStatus): RepairStatus[] {
  return VOLUNTEER_FORWARD_TRANSITIONS[status] ?? [];
}

export function isTerminalStatus(status: RepairStatus): boolean {
  return ["REPAIRED", "NOT_REPAIRABLE", "CANCELLED"].includes(status);
}

export const CATEGORY_LABELS: Record<RepairCategory, string> = {
  ELECTRONICS: "Electronics",
  SMALL_APPLIANCE: "Small Appliance",
  TEXTILE: "Textile",
  BIKE: "Bike",
  WOOD: "Wood",
  OTHER: "Other",
};

export const STATUS_LABELS: Record<RepairStatus, string> = {
  SUBMITTED: "Submitted",
  REVIEWED: "Reviewed",
  SCHEDULED: "Scheduled",
  IN_REPAIR: "In Repair",
  REPAIRED: "Repaired",
  NOT_REPAIRABLE: "Not Repairable",
  CANCELLED: "Cancelled",
};
