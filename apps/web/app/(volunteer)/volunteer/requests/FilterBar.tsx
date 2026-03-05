"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { STATUS_LABELS, CATEGORY_LABELS } from "@/lib/domain/repair-request";

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/volunteer/requests?${params.toString()}`);
  }

  return (
    <div className="flex gap-3 flex-wrap mb-6">
      <select
        defaultValue={searchParams.get("status") || ""}
        onChange={(e) => handleChange("status", e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All Statuses</option>
        {Object.entries(STATUS_LABELS).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <select
        defaultValue={searchParams.get("category") || ""}
        onChange={(e) => handleChange("category", e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All Categories</option>
        {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <a
        href="/volunteer/requests"
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
      >
        Clear Filters
      </a>
    </div>
  );
}
