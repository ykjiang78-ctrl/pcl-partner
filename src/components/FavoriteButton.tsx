"use client";

import { createClient } from "@/lib/supabase-client";
import { useState, useEffect } from "react";

export default function FavoriteButton({ postId, userId }: { postId: string; userId: string | null }) {
  const supabase = createClient();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const checkFav = async () => {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();
      setIsFav(!!data);
    };
    checkFav();
  }, [postId, userId, supabase]);

  const toggleFav = async () => {
    if (!userId) return;
    setLoading(true);

    if (isFav) {
      await supabase
        .from("favorites")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);
      setIsFav(false);
    } else {
      await supabase
        .from("favorites")
        .insert({ post_id: postId, user_id: userId });
      setIsFav(true);
    }
    setLoading(false);
  };

  if (!userId) return null;

  return (
    <button
      onClick={toggleFav}
      disabled={loading}
      className="text-xs transition hover:scale-110 disabled:opacity-50"
      title={isFav ? "取消收藏" : "收藏"}
    >
      {isFav ? "❤️" : "🤍"}
    </button>
  );
}
