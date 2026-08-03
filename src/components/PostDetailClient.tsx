"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const timeAgo = getTimeAgo(post.created_at);
  const author = post.profiles;

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
    if (!confirm("确定删除这条帖子吗？")) return;
    await supabase.from("posts").delete().eq("id", post.id);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <a href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
        ← 返回列表
      </a>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <span className="inline-block bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full mb-3 font-medium">
          🎮 {post.game}
        </span>
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="text-xs text-gray-400 mb-4">🕐 {timeAgo} 发布</p>

        <div className="flex items-center gap-2 mb-4">
          {author?.avatar_url && (
            <img src={author.avatar_url} alt="" className="w-6 h-6 rounded-full" />
          )}
          <span className="text-sm text-gray-600">
            <span className="text-gray-400">发布者：</span>
            <strong>{author?.nickname || "匿名玩家"}</strong>
          </span>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-5">
          {post.description}
        </p>

        <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 mb-6 flex justify-between items-center">
          <span className="text-sm text-gray-500">📞 联系方式</span>
          <span className="text-indigo-600 font-semibold">{post.contact}</span>
        </div>

        {userId === post.user_id && (
          <div className="mb-4">
            <button
              onClick={handleDeletePost}
              className="text-xs text-red-400 hover:text-red-600"
            >
              删除帖子
            </button>
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
                <div key={reply.id} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
                  {reply.profiles?.avatar_url && (
                    <img src={reply.profiles.avatar_url} alt="" className="w-5 h-5 rounded-full mt-0.5" />
                  )}
                  <div>
                    <span className="text-xs font-semibold text-indigo-600">
                      {reply.profiles?.nickname || "匿名"}
                    </span>
                    <span className="text-xs text-gray-300 ml-2">{getTimeAgo(reply.created_at)}</span>
                    <p className="text-sm text-gray-700 mt-0.5">{reply.text}</p>
                  </div>
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