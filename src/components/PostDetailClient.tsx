"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FavoriteButton from "./FavoriteButton";
import ReportButton from "./ReportButton";
import BoostButton from "./BoostButton";
import VipBadge from "./VipBadge";
import LikeButton from "./LikeButton";

const PLATFORM_LABELS: Record<string, string> = {
  java: "Java版",
  bedrock: "基岩版",
  steam: "Steam",
  epic: "Epic",
  other: "其他",
};

export default function PostDetailClient({
  post,
  replies: initialReplies,
  userId,
}: {
  post: any;
  replies: any[];
  userId: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [replies, setReplies] = useState(initialReplies);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const timeAgo = getTimeAgo(post.created_at);
  const author = post.profiles;
  const isExpired = post.expires_at && new Date(post.expires_at) < new Date();

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !userId) return;
    setSending(true);

    const { data, error } = await supabase
      .from("replies")
      .insert({
        text: replyText.trim(),
        post_id: post.id,
        user_id: userId,
      })
      .select("*, profiles!replies_user_id_fkey(nickname, avatar_url)")
      .single();

    if (!error && data) {
      setReplies([...replies, data]);
      setReplyText("");
    }
    setSending(false);
  };

  const handleDeletePost = async () => {
    setDeleting(true);
    await supabase.from("posts").delete().eq("id", post.id);
    router.push("/");
    router.refresh();
  };

  const handleDeleteReply = async (replyId: string) => {
    await supabase.from("replies").delete().eq("id", replyId);
    setReplies(replies.filter((r: any) => r.id !== replyId));
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/posts/${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <a href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
        ← 返回列表
      </a>

      <div className={`card card-hover p-6 ${isExpired ? "opacity-70" : ""}`}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full font-medium">
            🎮 {post.game}
          </span>
          {post.platform && (
            <span className="inline-block bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded-full">
              {PLATFORM_LABELS[post.platform] || post.platform}
            </span>
          )}
          {post.game_version && (
            <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
              v{post.game_version}
            </span>
          )}
          {isExpired && (
            <span className="inline-block bg-gray-200 text-gray-400 text-xs px-2 py-0.5 rounded-full">
              ⏰ 已过期
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="text-xs text-gray-400 mb-4">🕐 {timeAgo} 发布</p>

        <div className="flex items-center gap-2 mb-4">
          {author?.avatar_url && (
            <img src={author.avatar_url} alt="" className="w-6 h-6 rounded-full" />
          )}
          <span className="text-sm text-gray-600">
            <span className="text-gray-400">发布者：</span>
            <a href={`/profile/${post.user_id}`} className="hover:text-indigo-600 transition">
              <strong>{author?.nickname || "匿名玩家"}</strong>
            </a>
          </span>
          <VipBadge expiresAt={author?.vip_expires_at} showText />
        </div>

        {/* 队伍信息 */}
        {post.max_players && (
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 mb-4 flex items-center gap-3">
            <span className="text-sm text-gray-500">👥 队伍</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 rounded-full h-2 transition-all"
                    style={{ width: `${Math.min(100, ((post.current_players || 0) / post.max_players) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-indigo-600">
                  {post.current_players || 0}/{post.max_players}
                </span>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-5">
          {post.description}
        </p>

        <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 mb-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">📞 联系方式</span>
          <div className="flex items-center gap-2">
            <span className="text-indigo-600 font-semibold">{post.contact}</span>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(post.contact);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {}
              }}
              className="text-xs text-gray-400 hover:text-indigo-500 transition"
            >
              {copied ? "✅" : "📋"}
            </button>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-3">
            <LikeButton
              postId={post.id}
              userId={userId}
              initialCount={post.post_likes_count || 0}
            />
            <FavoriteButton postId={post.id} userId={userId} />
            {userId !== post.user_id && (
              <ReportButton postId={post.id} userId={userId} />
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="text-xs text-gray-400 hover:text-indigo-500 transition"
            >
              {copied ? "✅ 已复制" : "🔗 分享"}
            </button>
            {userId === post.user_id && (
              <>
                <BoostButton
                  postId={post.id}
                  userId={userId!}
                  isBoosted={!!post.active_boost}
                  boostExpiresAt={post.active_boost?.expires_at}
                />
                <a
                  href={`/posts/${post.id}/edit`}
                  className="text-xs text-indigo-500 hover:text-indigo-600"
                >
                  ✏️ 编辑
                </a>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  🗑️ 删除
                </button>
              </>
            )}
          </div>
        </div>

        {/* 删除确认弹窗 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl">
              <h3 className="text-lg font-semibold mb-2">确认删除</h3>
              <p className="text-sm text-gray-500 mb-5">删除后无法恢复，确定要删除这条帖子吗？</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                >
                  取消
                </button>
                <button
                  onClick={handleDeletePost}
                  disabled={deleting}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition disabled:opacity-50"
                >
                  {deleting ? "删除中..." : "确认删除"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 回复区 */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            💬 留言 ({replies.length})
          </h3>

          <div className="space-y-3 mb-4">
            {replies.length === 0 ? (
              <p className="text-sm text-gray-300 py-3">还没有留言，来抢沙发吧 🛋️</p>
            ) : (
              replies.map((reply: any) => (
                <div key={reply.id} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0 group">
                  {reply.profiles?.avatar_url && (
                    <img src={reply.profiles.avatar_url} alt="" className="w-5 h-5 rounded-full mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <a href={`/profile/${reply.user_id}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                        {reply.profiles?.nickname || "匿名"}
                      </a>
                      <span className="text-xs text-gray-300">{getTimeAgo(reply.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-0.5">{reply.text}</p>
                  </div>
                  {userId === reply.user_id && (
                    <button
                      onClick={() => handleDeleteReply(reply.id)}
                      className="text-xs text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition shrink-0"
                    >
                      删除
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {userId ? (
            <form onSubmit={handleReply} className="flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="写句话..."
                maxLength={200}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button
                type="submit"
                disabled={sending || !replyText.trim()}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition disabled:opacity-50"
              >
                {sending ? "..." : "发送"}
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-400">
              <a href="/auth/login" className="text-indigo-500 hover:text-indigo-600">登录</a> 后可以留言
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  if (diff < 60_000) return "刚刚";
  if (diff < 3_600_000) return Math.floor(diff / 60_000) + "分钟前";
  if (diff < 86_400_000) return Math.floor(diff / 3_600_000) + "小时前";
  return new Date(date).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}
