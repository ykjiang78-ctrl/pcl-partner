"use client";

import { createClient } from "@/lib/supabase-client";
import { useState, useEffect } from "react";

export default function LikeButton({
  postId,
  userId,
  initialCount = 0,
}: {
  postId: string;
  userId: string | null;
  initialCount?: number;
}) {
  const supabase = createClient();
  const [isLiked, setIsLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const checkLike = async () => {
      const { data } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();
      setIsLiked(!!data);
    };
    checkLike();
  }, [postId, userId, supabase]);

  const toggleLike = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      if (isLiked) {
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);
        setIsLiked(false);
        setCount((c) => Math.max(0, c - 1));
      } else {
        await supabase
          .from("post_likes")
          .insert({ post_id: postId, user_id: userId });
        setIsLiked(true);
        setCount((c) => c + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    // 未登录显示点赞数但不响应
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <span className="text-sm">👍</span>
        {count > 0 && <span>{count}</span>}
      </span>
    );
  }

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`inline-flex items-center gap-1 text-xs transition hover:scale-110 disabled:opacity-50 ${
        isLiked ? "text-indigo-500 dark:text-indigo-400 font-medium" : "text-gray-500 dark:text-gray-400"
      }`}
      title={isLiked ? "取消点赞" : "点赞"}
    >
      <span className="text-sm">{isLiked ? "👍" : "👍🏻"}</span>
      {count > 0 && <span>{count}</span>}
    </button>
  );
}