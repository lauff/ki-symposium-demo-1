export type RepairEventDomain = {
  id: string;
  title: string;
  location: string;
  startAt: Date;
  endAt: Date;
  capacity: number;
  volunteerOwnerId: string;
};

export function isEventFull(capacity: number, scheduledCount: number): boolean {
  return scheduledCount >= capacity;
}

export function hasAvailableCapacity(capacity: number, scheduledCount: number): boolean {
  return scheduledCount < capacity;
}

export function remainingCapacity(capacity: number, scheduledCount: number): number {
  return Math.max(0, capacity - scheduledCount);
}
