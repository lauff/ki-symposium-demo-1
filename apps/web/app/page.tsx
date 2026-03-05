import Link from "next/link";
import { getUpcomingEvents } from "@/lib/services/repair-event.service";
import { remainingCapacity } from "@/lib/domain/repair-event";

export default async function HomePage() {
  let events: Awaited<ReturnType<typeof getUpcomingEvents>> = [];
  try {
    events = await getUpcomingEvents(3);
  } catch {
    // DB not available without running postgres
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-green-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Repair Café</h1>
          <p className="text-xl mb-8 opacity-90">
            Bring your broken items. Our skilled volunteers will help fix them — for free. Together
            we reduce waste and build community.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register"
              className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-50"
            >
              Submit a Repair Request
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-800"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Upcoming Repair Events
        </h2>
        {events.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No upcoming events scheduled yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event) => {
              const remaining = remainingCapacity(event.capacity, event._count.scheduledRequests);
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-1">📍 {event.location}</p>
                  <p className="text-gray-600 mb-1">
                    📅{" "}
                    {new Date(event.startAt).toLocaleDateString("en-GB", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-600 mb-4">
                    🕐{" "}
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
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${remaining === 0 ? "text-red-600" : "text-green-700"}`}
                    >
                      {remaining === 0 ? "Full" : `${remaining} spots left`}
                    </span>
                    <span className="text-gray-400 text-sm">Capacity: {event.capacity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2">1. Submit</h3>
              <p className="text-gray-600">Describe your broken item and what needs fixing.</p>
            </div>
            <div>
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">2. Match</h3>
              <p className="text-gray-600">A volunteer reviews your request and claims it.</p>
            </div>
            <div>
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">3. Repair</h3>
              <p className="text-gray-600">Bring your item to the event. We fix it together!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
