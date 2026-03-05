import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getEventById } from "@/lib/services/repair-event.service";
import { deleteEventAction, updateEventAction } from "@/lib/actions/repair-event.actions";
import { STATUS_LABELS, CATEGORY_LABELS } from "@/lib/domain/repair-request";
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

function toDatetimeLocal(date: Date): string {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default async function VolunteerEventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const event = await getEventById(params.id);
  if (!event) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/volunteer/events" className="text-green-700 hover:underline">
          ← Back to Events
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Edit form */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Event</h1>
          <form
            action={async (fd: FormData) => {
              "use server";
              const startAt = new Date(fd.get("startAt") as string).toISOString();
              const endAt = new Date(fd.get("endAt") as string).toISOString();
              fd.set("startAt", startAt);
              fd.set("endAt", endAt);
              await updateEventAction(event.id, fd);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                name="title"
                type="text"
                defaultValue={event.title}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                name="location"
                type="text"
                defaultValue={event.location}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
              <input
                name="startAt"
                type="datetime-local"
                defaultValue={toDatetimeLocal(event.startAt)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
              <input
                name="endAt"
                type="datetime-local"
                defaultValue={toDatetimeLocal(event.endAt)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                name="capacity"
                type="number"
                defaultValue={event.capacity}
                required
                min={event._count.scheduledRequests}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-gray-400 text-sm mt-1">
                Min: {event._count.scheduledRequests} (current scheduled)
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800"
            >
              Save Changes
            </button>
          </form>

          {event._count.scheduledRequests === 0 && (
            <form
              action={async () => {
                "use server";
                await deleteEventAction(event.id);
              }}
              className="mt-4"
            >
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Delete Event
              </button>
            </form>
          )}
        </div>

        {/* Scheduled requests */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Scheduled Items</h2>
          <p className="text-gray-500 mb-4">
            {event._count.scheduledRequests} / {event.capacity} capacity used
          </p>

          {event.scheduledRequests.length === 0 ? (
            <p className="text-gray-400">No items scheduled yet.</p>
          ) : (
            <div className="space-y-3">
              {event.scheduledRequests.map((req) => (
                <div key={req.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <Link
                        href={`/volunteer/requests/${req.id}`}
                        className="font-medium text-gray-800 hover:text-green-700"
                      >
                        {req.title}
                      </Link>
                      <p className="text-gray-500 text-sm">
                        {CATEGORY_LABELS[req.category as keyof typeof CATEGORY_LABELS]} • by{" "}
                        {req.createdBy.name}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[req.status]}`}
                    >
                      {STATUS_LABELS[req.status as keyof typeof STATUS_LABELS]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
