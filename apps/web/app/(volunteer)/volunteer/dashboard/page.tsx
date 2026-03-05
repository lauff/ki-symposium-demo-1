import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllRequests } from "@/lib/services/repair-request.service";
import { getUpcomingEvents } from "@/lib/services/repair-event.service";
import Link from "next/link";

export default async function VolunteerDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [requests, events] = await Promise.all([getAllRequests(), getUpcomingEvents(1)]);

  const statusCounts = requests.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const nextEvent = events[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Volunteer Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
          <div className="text-4xl font-bold text-gray-800">{requests.length}</div>
          <div className="text-gray-500 mt-1">Total Requests</div>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-sm p-6 text-center border border-blue-100">
          <div className="text-4xl font-bold text-blue-700">{statusCounts.SUBMITTED || 0}</div>
          <div className="text-blue-600 mt-1">Submitted</div>
        </div>
        <div className="bg-orange-50 rounded-xl shadow-sm p-6 text-center border border-orange-100">
          <div className="text-4xl font-bold text-orange-700">{statusCounts.IN_REPAIR || 0}</div>
          <div className="text-orange-600 mt-1">In Repair</div>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm p-6 text-center border border-green-100">
          <div className="text-4xl font-bold text-green-700">{statusCounts.REPAIRED || 0}</div>
          <div className="text-green-600 mt-1">Repaired</div>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Requests by Status</h2>
          <div className="space-y-3">
            {[
              { status: "SUBMITTED", label: "Submitted", color: "bg-blue-500" },
              { status: "REVIEWED", label: "Reviewed", color: "bg-yellow-500" },
              { status: "SCHEDULED", label: "Scheduled", color: "bg-purple-500" },
              { status: "IN_REPAIR", label: "In Repair", color: "bg-orange-500" },
              { status: "REPAIRED", label: "Repaired", color: "bg-green-500" },
              { status: "NOT_REPAIRABLE", label: "Not Repairable", color: "bg-red-500" },
              { status: "CANCELLED", label: "Cancelled", color: "bg-gray-400" },
            ].map(({ status, label, color }) => (
              <div key={status} className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-gray-700 flex-1">{label}</span>
                <span className="font-semibold text-gray-800">{statusCounts[status] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Next Event</h2>
          {nextEvent ? (
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{nextEvent.title}</h3>
              <p className="text-gray-600 mt-1">📍 {nextEvent.location}</p>
              <p className="text-gray-600 mt-1">
                📅{" "}
                {new Date(nextEvent.startAt).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-600 mt-1">
                Capacity: {nextEvent._count.scheduledRequests} / {nextEvent.capacity} items
              </p>
              <Link
                href={`/volunteer/events/${nextEvent.id}`}
                className="mt-4 inline-block bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
              >
                View Event
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 mb-3">No upcoming events.</p>
              <Link
                href="/volunteer/events/new"
                className="text-green-700 hover:underline font-medium"
              >
                Create an event →
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Link
          href="/volunteer/requests"
          className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800"
        >
          View All Requests
        </Link>
        <Link
          href="/volunteer/events/new"
          className="bg-white border border-green-700 text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50"
        >
          Create New Event
        </Link>
      </div>
    </div>
  );
}
