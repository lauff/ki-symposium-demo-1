import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getRequestById } from "@/lib/services/repair-request.service";
import { STATUS_LABELS, CATEGORY_LABELS, canCitizenCancel } from "@/lib/domain/repair-request";
import { cancelRequestAction } from "@/lib/actions/repair-request.actions";
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

export default async function CitizenRequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const req = await getRequestById(params.id);
  if (!req || req.createdByUserId !== session.user.id) notFound();

  const cancellable = canCitizenCancel(req.status as Parameters<typeof canCitizenCancel>[0]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/citizen/requests" className="text-green-700 hover:underline">
          ← Back to My Requests
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-start flex-wrap gap-3 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{req.title}</h1>
          <span className={`px-4 py-2 rounded-full font-medium ${STATUS_COLORS[req.status]}`}>
            {STATUS_LABELS[req.status as keyof typeof STATUS_LABELS]}
          </span>
        </div>

        <div className="space-y-4 text-lg">
          <div>
            <span className="font-medium text-gray-600">Category:</span>{" "}
            <span className="text-gray-800">
              {CATEGORY_LABELS[req.category as keyof typeof CATEGORY_LABELS]}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Description:</span>
            <p className="text-gray-800 mt-1 whitespace-pre-wrap">{req.description}</p>
          </div>
          {req.claimedBy && (
            <div>
              <span className="font-medium text-gray-600">Volunteer:</span>{" "}
              <span className="text-gray-800">{req.claimedBy.name}</span>
            </div>
          )}
          {req.scheduledEvent && (
            <div>
              <span className="font-medium text-gray-600">Scheduled Event:</span>
              <p className="text-gray-800">
                {req.scheduledEvent.title} — {req.scheduledEvent.location}
              </p>
              <p className="text-gray-600">
                {new Date(req.scheduledEvent.startAt).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
          {req.notes && (
            <div>
              <span className="font-medium text-gray-600">Volunteer Notes:</span>
              <p className="text-gray-800 mt-1 bg-yellow-50 p-3 rounded-lg">{req.notes}</p>
            </div>
          )}
          {req.photos && req.photos.length > 0 && (
            <div>
              <span className="font-medium text-gray-600">Photos:</span>
              <div className="flex gap-3 mt-2 flex-wrap">
                {req.photos.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={url}
                    alt={`Photo ${i + 1}`}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
          <div>
            <span className="font-medium text-gray-600">Submitted:</span>{" "}
            <span className="text-gray-800">{new Date(req.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {cancellable && (
          <div className="mt-8 pt-6 border-t">
            <form
              action={async () => {
                "use server";
                await cancelRequestAction(req.id);
              }}
            >
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
              >
                Cancel Request
              </button>
            </form>
            <p className="text-gray-400 text-sm mt-2">
              You can cancel this request because it hasn&apos;t been scheduled yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
