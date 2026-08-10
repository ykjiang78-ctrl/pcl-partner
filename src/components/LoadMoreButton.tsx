"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function LoadMoreButton({
  currentPage,
  totalPages,
  q,
  game,
  sort,
}: {
  currentPage: number;
  totalPages: number;
  q: string | null;
  game: string | null;
  sort: string | null;
}) {
  const router = useRouter();

  const buildUrl = useCallback(
    (page: number) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (game) params.set("game", game);
      if (sort) params.set("sort", sort);
      if (page > 1) params.set("page", page.toString());
      const qs = params.toString();
      return qs ? `/?${qs}` : "/";
    },
    [q, game, sort]
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-6 pb-4">
      {currentPage > 1 && (
        <button
          onClick={() => router.push(buildUrl(currentPage - 1))}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition"
        >
          ← 上一页
        </button>
      )}
      <span className="text-xs text-gray-400">
        {currentPage} / {totalPages}
      </span>
      {currentPage < totalPages && (
        <button
          onClick={() => router.push(buildUrl(currentPage + 1))}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
        >
          下一页 →
        </button>
      )}
    </div>
  );
}
