"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const PLATFORMS = [
  { value: "java", label: "Java版" },
  { value: "bedrock", label: "基岩版" },
  { value: "steam", label: "Steam" },
  { value: "epic", label: "Epic" },
  { value: "other", label: "其他" },
];

export default function PostEditForm({ postId }: { postId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [game, setGame] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [contact, setContact] = useState("");
  const [platform, setPlatform] = useState("");
  const [gameVersion, setGameVersion] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [currentPlayers, setCurrentPlayers] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("posts")
        .select("game, title, description, contact, platform, game_version, max_players, current_players")
        .eq("id", postId)
        .single();

      if (data) {
        setGame(data.game || "");
        setTitle(data.title || "");
        setDesc(data.description || "");
        setContact(data.contact || "");
        setPlatform(data.platform || "");
        setGameVersion(data.game_version || "");
        setMaxPlayers(data.max_players?.toString() || "");
        setCurrentPlayers(data.current_players?.toString() || "");
      }
      setFetching(false);
    };
    fetchPost();
  }, [postId, supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase
      .from("posts")
      .update({
        game: game.trim(),
        title: title.trim(),
        description: desc.trim(),
        contact: contact.trim(),
        platform: platform || null,
        game_version: gameVersion.trim() || null,
        max_players: maxPlayers ? parseInt(maxPlayers) : null,
        current_players: currentPlayers ? parseInt(currentPlayers) : null,
      })
      .eq("id", postId);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(`/posts/${postId}`);
    router.refresh();
  }

  if (fetching) {
    return (
      <div className="text-center py-8 text-gray-400">加载中...</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          游戏名称 <span className="text-red-400">*</span>
        </label>
        <input
          value={game}
          onChange={(e) => setGame(e.target.value)}
          required
          placeholder="例如：我的世界、泰拉瑞亚、CS2..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
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

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition disabled:opacity-50"
        >
          {loading ? "保存中..." : "💾 保存修改"}
        </button>
      </div>
    </form>
  );
}
