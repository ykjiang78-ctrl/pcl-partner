"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const GAME_ICONS: Record<string, string> = {
  我的世界: "⛏️",
  Minecraft: "⛏️",
  泰拉瑞亚: "🌳",
  CS2: "🔫",
  CS: "🔫",
  原神: "🌟",
  瓦罗兰特: "🎯",
  Valorant: "🎯",
  英雄联盟: "⚔️",
  LOL: "⚔️",
  绝地求生: "🪖",
  PUBG: "🪖",
  Apex: "🤖",
  GTA: "🚗",
  方舟: "🦕",
  饥荒: "🔥",
  星露谷: "🌾",
  双人成行: "🤝",
  胡闹厨房: "🍳",
  糖豆人: "🏃",
};

function getGameIcon(game: string): string {
  return GAME_ICONS[game] || "🎮";
}

export default function GameTags({
  games,
  selectedGame,
}: {
  games: string[];
  selectedGame: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagClick = useCallback(
    (game: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (selectedGame === game) {
        params.delete("game");
      } else {
        params.set("game", game);
      }
      const qs = params.toString();
      router.push(qs ? `/?${qs}` : "/");
    },
    [router, searchParams, selectedGame]
  );

  if (games.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {games.map((game) => {
        const isActive = selectedGame === game;
        return (
          <button
            key={game}
            onClick={() => handleTagClick(game)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive
                ? "bg-indigo-500 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            <span>{getGameIcon(game)}</span>
            <span>{game}</span>
          </button>
        );
      })}
      {selectedGame && (
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("game");
            const qs = params.toString();
            router.push(qs ? `/?${qs}` : "/");
          }}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-gray-400 hover:text-gray-600 transition"
        >
          ✕ 清除筛选
        </button>
      )}
    </div>
  );
}
