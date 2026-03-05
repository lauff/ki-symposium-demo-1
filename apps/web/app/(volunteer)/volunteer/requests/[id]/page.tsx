import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getRequestById } from "@/lib/services/repair-request.service";
import { getAllEvents } from "@/lib/services/repair-event.service";
import { STATUS_LABELS, CATEGORY_LABELS, getNextStatuses } from "@/lib/domain/repair-request";
import {
  claimRequestAction,
  unclaimRequestAction,
  scheduleRequestAction,
  updateStatusAction,
  updateNotesAction,
} from "@/lib/actions/repair-request.actions";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "bg-blue-100 text-blue-800",
  REVIEWED: "bg-yellow-100 text-yellow-800",
  SCHEDULED: "bg-purple-100 text-purple-800",
  IN_REPAIR: "bg-orange-100 text-orange-800",
  REPAIRED: "bg-green-100 text-green-800",
  NOT_REPAIRABLE: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-600",
};

export default async function VolunteerRequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [req, events] = await Promise.all([getRequestById(params.id), getAllEvents()]);

  if (!req) notFound();

  const nextStatuses = getNextStatuses(req.status as Parameters<typeof getNextStatuses>[0]);
  const isClaimed = req.claimedByVolunteerId === session.user.id;
  const availableEvents = events.filter((e) => e._count.scheduledRequests < e.capacity);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/volunteer/requests" className="text-green-700 hover:underline">
          ← Back to Requests
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-start flex-wrap gap-3 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{req.title}</h1>
          <span className={`px-4 py-2 rounded-full font-medium ${STATUS_COLORS[req.status]}`}>
            {STATUS_LABELS[req.status as keyof typeof STATUS_LABELS]}
          </span>
        </div>

        <div className="space-y-4 text-lg mb-8">
          <div>
            <span className="font-medium text-gray-600">Category:</span>{" "}
            {CATEGORY_LABELS[req.category as keyof typeof CATEGORY_LABELS]}
          </div>
          <div>
            <span className="font-medium text-gray-600">Description:</span>
            <p className="text-gray-800 mt-1 whitespace-pre-wrap">{req.description}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Submitted by:</span> {req.createdBy.name}{" "}
            ({req.createdBy.email})
          </div>
          {req.claimedBy && (
            <div>
              <span className="font-medium text-gray-600">Claimed by:</span> {req.claimedBy.name}
            </div>
          )}
          {req.scheduledEvent && (
            <div>
              <span className="font-medium text-gray-600">Scheduled Event:</span>
              <p className="text-gray-800">
                {req.scheduledEvent.title} — {req.scheduledEvent.location}
              </p>
              <p className="text-gray-600">
                {new Date(req.scheduledEvent.startAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-6 border-t pt-6">
          {/* Claim/Unclaim */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Claim</h3>
            {!req.claimedByVolunteerId ? (
              <form
                action={async () => {
                  "use server";
                  await claimRequestAction(req.id);
                }}
              >
                <button
                  type="submit"
                  className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800"
                >
                  Claim this request
                </button>
              </form>
            ) : isClaimed ? (
              <form
                action={async () => {
                  "use server";
                  await unclaimRequestAction(req.id);
                }}
              >
                <button
                  type="submit"
                  className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300"
                >
                  Unclaim
                </button>
              </form>
            ) : (
              <p className="text-gray-500">Claimed by another volunteer.</p>
            )}
          </div>

          {/* Schedule to event */}
          {!req.scheduledEventId && availableEvents.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Schedule to Event</h3>
              <form
                action={async (fd: FormData) => {
                  "use server";
                  const eventId = fd.get("eventId") as string;
                  await scheduleRequestAction(req.id, eventId);
                }}
                className="flex gap-3 flex-wrap"
              >
                <select
                  name="eventId"
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select event...</option>
                  {availableEvents.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title} ({new Date(e.startAt).toLocaleDateString()}) —{" "}
                      {e._count.scheduledRequests}/{e.capacity}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700"
                >
                  Schedule
                </button>
              </form>
            </div>
          )}

          {/* Status transitions */}
          {nextStatuses.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Update Status</h3>
              <div className="flex gap-3 flex-wrap">
                {nextStatuses.map((status) => (
                  <form
                    key={status}
                    action={async () => {
                      "use server";
                      await updateStatusAction(
                        req.id,
                        status as Parameters<typeof updateStatusAction>[1]
                      );
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                      → {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                    </button>
                  </form>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Volunteer Notes</h3>
            <form
              action={async (fd: FormData) => {
                "use server";
                const notes = fd.get("notes") as string;
                await updateNotesAction(req.id, notes);
              }}
              className="space-y-2"
            >
              <textarea
                name="notes"
                rows={3}
                defaultValue={req.notes || ""}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Add notes about this repair..."
              />
              <button
                type="submit"
                className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800"
              >
                Save Notes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
