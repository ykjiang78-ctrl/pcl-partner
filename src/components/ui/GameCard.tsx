"use client";

import { useRouter } from "next/navigation";
import Reveal from "./Reveal";

const FALLBACK_ICONS = ["🎮", "🕹️", "⭐", "🔥", "🚀", "🎯", "🧩", "🛡️"];

export default function GameCard({
  game,
  icon,
  count,
}: {
  game: string;
  icon?: string;
  count?: number;
}) {
  const router = useRouter();
  const fallback = FALLBACK_ICONS[
    Math.abs(hash(game)) % FALLBACK_ICONS.length
  ];
  const displayIcon = icon || fallback;

  return (
    <Reveal>
      <button
        onClick={() => router.push(`/?game=${encodeURIComponent(game)}`)}
        className="group card card-hover shine w-full p-4 flex flex-col items-center text-center"
      >
        <div className="text-3xl mb-2 transition-transform group-hover:scale-125">
          {displayIcon}
        </div>
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {game}
        </div>
        {typeof count === "number" && (
          <div className="text-xs text-gray-400 mt-0.5">{count} 条帖子</div>
        )}
      </button>
    </Reveal>
  );
}

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}