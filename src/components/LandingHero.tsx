"use client";

import Reveal from "./ui/Reveal";
import GlowText from "./ui/GlowText";

// 首页游戏图标映射（用于展示热门游戏）
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

export default function LandingHero({
  topGames,
  postCount,
}: {
  topGames: string[];
  postCount: number;
}) {
  const gamePick = topGames
    .slice(0, 6)
    .map((g) => ({ name: g, icon: GAME_ICONS[g] || "🎮" }));

  return (
    <section className="relative overflow-hidden">
      {/* decorative floating emojis */}
      <div className="pointer-events-none absolute inset-0 select-none">
        {[
          { e: "🎮", t: "top-[8%] left-[6%]", s: "text-5xl", d: "animate-float" },
          { e: "🕹️", t: "top-[18%] right-[10%]", s: "text-4xl", d: "animate-float" },
          { e: "🎯", t: "bottom-[22%] left-[14%]", s: "text-3xl", d: "animate-float" },
          { e: "⚡", t: "bottom-[12%] right-[18%]", s: "text-4xl", d: "animate-float" },
        ].map((f, i) => (
          <span
            key={i}
            className={`absolute ${f.t} ${f.s} ${f.d} opacity-20`}
            style={{ animationDelay: `${i * 0.7}s` }}
          >
            {f.e}
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-4xl px-4 pt-14 sm:pt-20 pb-10 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 chip bg-white border border-indigo-100 text-indigo-600 shadow-sm mb-6">
            ✨ 端游联机找搭子平台
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight text-gray-900 dark:text-white">
            找到一起开黑的那个 <GlowText>TA</GlowText>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-4 text-base sm:text-lg text-gray-500 dark:text-gray-300 max-w-xl mx-auto">
            我的世界 / CS2 / 英雄联盟 / Apex… 无论玩什么，来这发布诉求，下一秒就有人陪你上分。
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#browse"
              className="btn btn-primary text-base px-8 py-3 rounded-full shine animate-pulse-glow"
            >
              🚀 立即找搭子
            </a>
            <a
              href="/posts/new"
              className="btn btn-ghost rounded-full text-base px-8 py-3 bg-white shadow-sm dark:bg-white/10"
            >
              📝 我要发帖
            </a>
          </div>
        </Reveal>

        {typeof postCount === "number" && (
          <Reveal delay={320}>
            <p className="mt-6 text-sm text-gray-400 dark:text-gray-500">
              已有 <span className="font-bold text-indigo-500">{postCount.toLocaleString()}</span>{" "}
              条合作邀约等你来配对
            </p>
          </Reveal>
        )}

        {gamePick.length > 0 && (
          <Reveal delay={400}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {gamePick.map((g) => (
                <a
                  key={g.name}
                  href={`/?game=${encodeURIComponent(g.name)}`}
                  className="inline-flex items-center gap-1.5 chip bg-white/70 border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:-translate-y-0.5 transition-all dark:bg-white/10 dark:border-gray-600 dark:text-gray-300"
                >
                  <span>{g.icon}</span>
                  {g.name}
                </a>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}