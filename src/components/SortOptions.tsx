"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const SORT_OPTIONS = [
  { value: "newest", label: "最新发布", icon: "🕐" },
  { value: "oldest", label: "最早发布", icon: "📜" },
] as const;

export default function SortOptions({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = useCallback(
    (sort: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (sort === "newest") {
        params.delete("sort");
      } else {
        params.set("sort", sort);
      }
      const qs = params.toString();
      router.push(qs ? `/?${qs}` : "/");
    },
    [router, searchParams]
  );

  return (
    <div className="flex items-center gap-1">
      {SORT_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleSortChange(opt.value)}
          className={`px-3 py-1 rounded-md text-xs font-medium transition ${
            currentSort === opt.value
              ? "bg-indigo-100 text-indigo-700"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`}
        >
          {opt.icon} {opt.label}
        </button>
      ))}
    </div>
  );
}
