import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getRequestsByUser } from "@/lib/services/repair-request.service";
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

export default async function CitizenRequestsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const requests = await getRequestsByUser(session.user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Repair Requests</h1>
        <Link
          href="/citizen/requests/new"
          className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800"
        >
          + New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🔧</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No requests yet</h2>
          <p className="text-gray-500 mb-6">Submit your first repair request to get started!</p>
          <Link
            href="/citizen/requests/new"
            className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800"
          >
            Submit a Request
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Link key={req.id} href={`/citizen/requests/${req.id}`}>
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100 cursor-pointer">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{req.title}</h3>
                    <p className="text-gray-500 mt-1">
                      {CATEGORY_LABELS[req.category as keyof typeof CATEGORY_LABELS]}
                    </p>
                    {req.scheduledEvent && (
                      <p className="text-gray-500 text-sm mt-1">
                        📅 Scheduled: {req.scheduledEvent.title} on{" "}
                        {new Date(req.scheduledEvent.startAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[req.status]}`}
                  >
                    {STATUS_LABELS[req.status as keyof typeof STATUS_LABELS]}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-3">
                  Submitted {new Date(req.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
