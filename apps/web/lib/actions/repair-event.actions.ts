"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "../auth";
import { createEvent, updateEvent, deleteEvent } from "../services/repair-event.service";

const eventSchema = z.object({
  title: z.string().min(3),
  location: z.string().min(3),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  capacity: z.coerce.number().int().min(1),
});

export async function createEventAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const raw = {
    title: formData.get("title"),
    location: formData.get("location"),
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
    capacity: formData.get("capacity"),
  };

  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await createEvent({
    ...parsed.data,
    startAt: new Date(parsed.data.startAt),
    endAt: new Date(parsed.data.endAt),
    volunteerOwnerId: session.user.id,
  });

  revalidatePath("/volunteer/events");
  redirect("/volunteer/events");
}

export async function updateEventAction(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const raw = {
    title: formData.get("title"),
    location: formData.get("location"),
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
    capacity: formData.get("capacity"),
  };

  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await updateEvent(id, {
      ...parsed.data,
      startAt: new Date(parsed.data.startAt),
      endAt: new Date(parsed.data.endAt),
    });
    revalidatePath("/volunteer/events");
    revalidatePath(`/volunteer/events/${id}`);
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function deleteEventAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  try {
    await deleteEvent(id);
    revalidatePath("/volunteer/events");
    redirect("/volunteer/events");
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}
