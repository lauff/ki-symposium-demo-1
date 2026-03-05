import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllRequests } from "@/lib/services/repair-request.service";
import { STATUS_LABELS, CATEGORY_LABELS } from "@/lib/domain/repair-request";
import { claimRequestAction, unclaimRequestAction } from "@/lib/actions/repair-request.actions";
import Link from "next/link";
import { Suspense } from "react";
import { FilterBar } from "./FilterBar";

const STATUS_COLORS: Record<string, string> = {
  SUBMITTED: "bg-blue-100 text-blue-800",
  REVIEWED: "bg-yellow-100 text-yellow-800",
  SCHEDULED: "bg-purple-100 text-purple-800",
  IN_REPAIR: "bg-orange-100 text-orange-800",
  REPAIRED: "bg-green-100 text-green-800",
  NOT_REPAIRABLE: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-600",
};

export default async function VolunteerRequestsPage({
  searchParams,
}: {
  searchParams: { status?: string; category?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const requests = await getAllRequests({
    status: searchParams.status as import("@/lib/domain/repair-request").RepairStatus | undefined,
    category: searchParams.category as import("@/lib/domain/repair-request").RepairCategory | undefined,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Repair Requests</h1>

      <Suspense fallback={<div>Loading filters...</div>}>
        <FilterBar />
      </Suspense>

      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div className="flex-1">
                <Link
                  href={`/volunteer/requests/${req.id}`}
                  className="text-xl font-semibold text-gray-800 hover:text-green-700"
                >
                  {req.title}
                </Link>
                <div className="flex gap-3 mt-1 flex-wrap">
                  <span className="text-gray-500 text-sm">
                    {CATEGORY_LABELS[req.category as keyof typeof CATEGORY_LABELS]}
                  </span>
                  <span className="text-gray-400 text-sm">by {req.createdBy.name}</span>
                  {req.claimedBy && (
                    <span className="text-gray-500 text-sm">
                      • claimed by {req.claimedBy.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[req.status]}`}
                >
                  {STATUS_LABELS[req.status as keyof typeof STATUS_LABELS]}
                </span>
                {!req.claimedByVolunteerId ? (
                  <form
                    action={async () => {
                      "use server";
                      await claimRequestAction(req.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-green-700 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-800"
                    >
                      Claim
                    </button>
                  </form>
                ) : req.claimedByVolunteerId === session.user.id ? (
                  <form
                    action={async () => {
                      "use server";
                      await unclaimRequestAction(req.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-300"
                    >
                      Unclaim
                    </button>
                  </form>
                ) : null}
                <Link
                  href={`/volunteer/requests/${req.id}`}
                  className="text-green-700 hover:underline text-sm"
                >
                  View →
                </Link>
              </div>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="text-center text-gray-500 py-12">No requests found.</div>
        )}
      </div>
    </div>
  );
}
