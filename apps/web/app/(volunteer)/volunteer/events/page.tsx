import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllEvents } from "@/lib/services/repair-event.service";
import { remainingCapacity } from "@/lib/domain/repair-event";
import Link from "next/link";

export default async function VolunteerEventsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const events = await getAllEvents();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Repair Events</h1>
        <Link
          href="/volunteer/events/new"
          className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800"
        >
          + New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No events yet</h2>
          <Link
            href="/volunteer/events/new"
            className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 inline-block mt-2"
          >
            Create First Event
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const remaining = remainingCapacity(event.capacity, event._count.scheduledRequests);
            const isPast = new Date(event.endAt) < new Date();
            return (
              <div
                key={event.id}
                className={`bg-white rounded-xl shadow-sm p-6 border ${isPast ? "border-gray-200 opacity-70" : "border-gray-100"}`}
              >
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                    <p className="text-gray-600 mt-1">📍 {event.location}</p>
                    <p className="text-gray-600">
                      📅{" "}
                      {new Date(event.startAt).toLocaleDateString("en-GB", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {new Date(event.startAt).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      –{" "}
                      {new Date(event.endAt).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Organized by {event.volunteerOwner.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-semibold ${remaining === 0 ? "text-red-600" : "text-green-700"}`}
                    >
                      {event._count.scheduledRequests} / {event.capacity}
                    </div>
                    <div className="text-gray-400 text-sm">items scheduled</div>
                    {isPast && <div className="text-gray-400 text-sm mt-1">Past event</div>}
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/volunteer/events/${event.id}`}
                    className="text-green-700 hover:underline font-medium"
                  >
                    View / Edit →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
