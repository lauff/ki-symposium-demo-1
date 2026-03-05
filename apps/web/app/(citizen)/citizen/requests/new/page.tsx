"use client";

import { useState } from "react";
import Link from "next/link";
import { createRequestAction } from "@/lib/actions/repair-request.actions";
import { CATEGORY_LABELS } from "@/lib/domain/repair-request";

export default function NewRequestPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await createRequestAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // redirect happens in server action on success
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/citizen/requests" className="text-green-700 hover:underline">
          ← Back to My Requests
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">New Repair Request</h1>
        <p className="text-gray-500 mb-6">Tell us about the item you need repaired.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              name="title"
              type="text"
              required
              minLength={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Broken toaster"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a category...</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              required
              minLength={10}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe the problem in detail. What happened? When did it break?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photos (optional)
            </label>
            <input
              name="photos"
              type="file"
              multiple
              accept="image/*"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-gray-400 text-sm mt-1">
              Upload photos of the broken item to help volunteers assess it.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-700 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
            <Link
              href="/citizen/requests"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 text-lg text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
