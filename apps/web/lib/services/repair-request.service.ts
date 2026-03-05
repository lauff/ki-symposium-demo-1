import { db } from "../db";
import { canCitizenCancel, getNextStatuses } from "../domain/repair-request";
import type { RepairCategory, RepairStatus } from "../domain/repair-request";

export async function getRequestsByUser(userId: string) {
  return db.repairRequest.findMany({
    where: { createdByUserId: userId },
    include: { scheduledEvent: true, claimedBy: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRequestById(id: string) {
  return db.repairRequest.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      claimedBy: { select: { id: true, name: true, email: true } },
      scheduledEvent: true,
    },
  });
}

export async function getAllRequests(filters?: { status?: RepairStatus; category?: RepairCategory }) {
  return db.repairRequest.findMany({
    where: {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.category && { category: filters.category }),
    },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      claimedBy: { select: { id: true, name: true, email: true } },
      scheduledEvent: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createRequest(data: {
  title: string;
  category: RepairCategory;
  description: string;
  photos: string[];
  createdByUserId: string;
}) {
  return db.repairRequest.create({ data });
}

export async function cancelRequest(id: string, userId: string) {
  const req = await db.repairRequest.findUnique({ where: { id } });
  if (!req) throw new Error("Request not found");
  if (req.createdByUserId !== userId) throw new Error("Unauthorized");
  if (!canCitizenCancel(req.status as RepairStatus)) {
    throw new Error(`Cannot cancel a request with status ${req.status}`);
  }
  return db.repairRequest.update({ where: { id }, data: { status: "CANCELLED" } });
}

export async function claimRequest(id: string, volunteerId: string) {
  const req = await db.repairRequest.findUnique({ where: { id } });
  if (!req) throw new Error("Request not found");
  if (req.claimedByVolunteerId) throw new Error("Already claimed");
  return db.repairRequest.update({ where: { id }, data: { claimedByVolunteerId: volunteerId } });
}

export async function unclaimRequest(id: string, volunteerId: string) {
  const req = await db.repairRequest.findUnique({ where: { id } });
  if (!req) throw new Error("Request not found");
  if (req.claimedByVolunteerId !== volunteerId) throw new Error("Not your claim");
  return db.repairRequest.update({
    where: { id },
    data: { claimedByVolunteerId: null },
  });
}

export async function scheduleRequest(id: string, eventId: string) {
  const event = await db.repairEvent.findUnique({
    where: { id: eventId },
    include: { _count: { select: { scheduledRequests: true } } },
  });
  if (!event) throw new Error("Event not found");
  if (event._count.scheduledRequests >= event.capacity) {
    throw new Error("Event is at full capacity");
  }
  return db.repairRequest.update({
    where: { id },
    data: { scheduledEventId: eventId, status: "SCHEDULED" },
  });
}

export async function updateRequestStatus(id: string, newStatus: RepairStatus, _volunteerId?: string) {
  const req = await db.repairRequest.findUnique({ where: { id } });
  if (!req) throw new Error("Request not found");

  const allowed = getNextStatuses(req.status as RepairStatus);
  if (!allowed.includes(newStatus)) {
    throw new Error(`Cannot transition from ${req.status} to ${newStatus}`);
  }
  if (newStatus === "IN_REPAIR" && !req.scheduledEventId) {
    throw new Error("Must be scheduled to an event before IN_REPAIR");
  }
  return db.repairRequest.update({ where: { id }, data: { status: newStatus } });
}

export async function updateRequestNotes(id: string, notes: string) {
  return db.repairRequest.update({ where: { id }, data: { notes } });
}
