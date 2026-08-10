"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PLATFORMS = [
  { value: "java", label: "Java版" },
  { value: "bedrock", label: "基岩版" },
  { value: "steam", label: "Steam" },
  { value: "epic", label: "Epic" },
  { value: "other", label: "其他" },
];

const POPULAR_GAMES = [
  "我的世界", "Minecraft", "泰拉瑞亚", "CS2", "原神",
  "瓦罗兰特", "Valorant", "英雄联盟", "LOL", "绝地求生",
  "PUBG", "Apex", "GTA5", "方舟", "饥荒",
  "星露谷", "双人成行", "胡闹厨房", "糖豆人", "永劫无间",
  "幻兽帕鲁", "七日杀", "森林", "恐鬼症", "致命公司",
];

const EXPIRY_OPTIONS = [
  { value: "1", label: "1天" },
  { value: "3", label: "3天" },
  { value: "7", label: "7天" },
  { value: "30", label: "30天" },
  { value: "0", label: "长期有效" },
];

export default function PostForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [game, setGame] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [contact, setContact] = useState("");
  const [platform, setPlatform] = useState("");
  const [gameVersion, setGameVersion] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [currentPlayers, setCurrentPlayers] = useState("");
  const [expiry, setExpiry] = useState("7");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setError("请先登录");
      setLoading(false);
      return;
    }

    // 计算过期时间
    let expiresAt = null;
    if (expiry !== "0") {
      const d = new Date();
      d.setDate(d.getDate() + parseInt(expiry));
      expiresAt = d.toISOString();
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        game: game.trim(),
        title: title.trim(),
        description: desc.trim(),
        contact: contact.trim(),
        user_id: userData.user.id,
        platform: platform || null,
        game_version: gameVersion.trim() || null,
        max_players: maxPlayers ? parseInt(maxPlayers) : null,
        current_players: currentPlayers ? parseInt(currentPlayers) : null,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(`/posts/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>
      )}

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          游戏名称 <span className="text-red-400">*</span>
        </label>
        <input
          value={game}
          onChange={(e) => { setGame(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          required
          placeholder="例如：我的世界、泰拉瑞亚、CS2..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        {showSuggestions && game.length > 0 && (
          <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {POPULAR_GAMES.filter((g) =>
              g.toLowerCase().includes(game.toLowerCase())
            ).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => { setGame(g); setShowSuggestions(false); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                🎮 {g}
              </button>
            ))}
            {POPULAR_GAMES.filter((g) =>
              g.toLowerCase().includes(game.toLowerCase())
            ).length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-400">没有匹配的游戏，直接输入即可</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">游戏平台</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            <option value="">选择平台</option>
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">游戏版本</label>
          <input
            value={gameVersion}
            onChange={(e) => setGameVersion(e.target.value)}
            placeholder="例如：1.20.1"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          帖子标题 <span className="text-red-400">*</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="例如：找个小伙伴一起玩原版生存"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">详细介绍</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={4}
          placeholder="写写你的要求、联机时段、游戏风格..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">队伍人数</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={currentPlayers}
              onChange={(e) => setCurrentPlayers(e.target.value)}
              min="1"
              placeholder="已有"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <span className="text-gray-400">/</span>
            <input
              type="number"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              min="1"
              placeholder="需要"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">例如：已有1人 / 需要4人</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">有效期</label>
          <select
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            {EXPIRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          联系方式 <span className="text-red-400">*</span>
        </label>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          placeholder="QQ号 / 微信号 / Discord..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition disabled:opacity-50"
      >
        {loading ? "发布中..." : "✨ 发布帖子"}
      </button>
    </form>
  );
}
