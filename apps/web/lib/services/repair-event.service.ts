import { db } from "../db";

export async function getAllEvents() {
  return db.repairEvent.findMany({
    include: {
      volunteerOwner: { select: { id: true, name: true } },
      _count: { select: { scheduledRequests: true } },
    },
    orderBy: { startAt: "asc" },
  });
}

export async function getUpcomingEvents(limit = 3) {
  return db.repairEvent.findMany({
    where: { startAt: { gte: new Date() } },
    include: {
      volunteerOwner: { select: { id: true, name: true } },
      _count: { select: { scheduledRequests: true } },
    },
    orderBy: { startAt: "asc" },
    take: limit,
  });
}

export async function getEventById(id: string) {
  return db.repairEvent.findUnique({
    where: { id },
    include: {
      volunteerOwner: { select: { id: true, name: true } },
      scheduledRequests: {
        include: {
          createdBy: { select: { id: true, name: true } },
          claimedBy: { select: { id: true, name: true } },
        },
      },
      _count: { select: { scheduledRequests: true } },
    },
  });
}

export async function createEvent(data: {
  title: string;
  location: string;
  startAt: Date;
  endAt: Date;
  capacity: number;
  volunteerOwnerId: string;
}) {
  return db.repairEvent.create({ data });
}

export async function updateEvent(
  id: string,
  data: Partial<{ title: string; location: string; startAt: Date; endAt: Date; capacity: number }>
) {
  const event = await db.repairEvent.findUnique({
    where: { id },
    include: { _count: { select: { scheduledRequests: true } } },
  });
  if (!event) throw new Error("Event not found");
  if (data.capacity !== undefined && data.capacity < event._count.scheduledRequests) {
    throw new Error(`Cannot reduce capacity below current scheduled count (${event._count.scheduledRequests})`);
  }
  return db.repairEvent.update({ where: { id }, data });
}

export async function deleteEvent(id: string) {
  const scheduled = await db.repairRequest.count({ where: { scheduledEventId: id } });
  if (scheduled > 0) throw new Error("Cannot delete event with scheduled requests");
  return db.repairEvent.delete({ where: { id } });
}
