"use client";

import { useState } from "react";
import Link from "next/link";
import { createEventAction } from "@/lib/actions/repair-event.actions";

export default function NewEventPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    // Convert datetime-local to ISO string
    const startAt = new Date(formData.get("startAt") as string).toISOString();
    const endAt = new Date(formData.get("endAt") as string).toISOString();
    formData.set("startAt", startAt);
    formData.set("endAt", endAt);
    const result = await createEventAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/volunteer/events" className="text-green-700 hover:underline">
          ← Back to Events
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Event</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
            <input
              name="title"
              type="text"
              required
              minLength={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Spring Repair Café"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input
              name="location"
              type="text"
              required
              minLength={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Community Hall, Main St 1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date &amp; Time *
              </label>
              <input
                name="startAt"
                type="datetime-local"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date &amp; Time *
              </label>
              <input
                name="endAt"
                type="datetime-local"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity *</label>
            <input
              name="capacity"
              type="number"
              required
              min={1}
              defaultValue={20}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-700 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
            <Link
              href="/volunteer/events"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 font-semibold hover:bg-gray-50 text-lg text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
