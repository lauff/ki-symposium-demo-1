"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "../auth";
import {
  createRequest,
  cancelRequest,
  claimRequest,
  unclaimRequest,
  scheduleRequest,
  updateRequestStatus,
  updateRequestNotes,
} from "../services/repair-request.service";
import { saveUploadedFiles } from "../services/upload.service";
import type { RepairStatus } from "../domain/repair-request";

const createSchema = z.object({
  title: z.string().min(3),
  category: z.enum(["ELECTRONICS", "SMALL_APPLIANCE", "TEXTILE", "BIKE", "WOOD", "OTHER"]),
  description: z.string().min(10),
});

export async function createRequestAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const raw = {
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
  };

  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const photoFiles = formData.getAll("photos") as File[];
  const photos =
    photoFiles.length > 0 && photoFiles[0].size > 0
      ? await saveUploadedFiles(photoFiles)
      : [];

  await createRequest({ ...parsed.data, photos, createdByUserId: session.user.id });
  revalidatePath("/citizen/requests");
  redirect("/citizen/requests");
}

export async function cancelRequestAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  try {
    await cancelRequest(id, session.user.id);
    revalidatePath("/citizen/requests");
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function claimRequestAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  try {
    await claimRequest(id, session.user.id);
    revalidatePath("/volunteer/requests");
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function unclaimRequestAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  try {
    await unclaimRequest(id, session.user.id);
    revalidatePath("/volunteer/requests");
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function scheduleRequestAction(id: string, eventId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  try {
    await scheduleRequest(id, eventId);
    revalidatePath("/volunteer/requests");
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function updateStatusAction(id: string, newStatus: RepairStatus) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  try {
    await updateRequestStatus(id, newStatus, session.user.id);
    revalidatePath("/volunteer/requests");
    revalidatePath(`/volunteer/requests/${id}`);
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function updateNotesAction(id: string, notes: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  try {
    await updateRequestNotes(id, notes);
    revalidatePath(`/volunteer/requests/${id}`);
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}
