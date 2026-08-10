"use client";

import { createClient } from "@/lib/supabase-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FollowButton({
  profileId,
  currentUserId,
}: {
  profileId: string;
  currentUserId?: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // 自己的主页不显示关注按钮
  if (currentUserId === profileId) return null;

  useEffect(() => {
    if (!currentUserId) return;
    const check = async () => {
      const { data } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", currentUserId)
        .eq("following_id", profileId)
        .single();
      setIsFollowing(!!data);
    };
    check();
  }, [profileId, currentUserId, supabase]);

  const handleFollow = async () => {
    if (!currentUserId) {
      setShowLogin(true);
      return;
    }
    setLoading(true);
    try {
      if (isFollowing) {
        await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", profileId);
        setIsFollowing(false);
      } else {
        await supabase
          .from("follows")
          .insert({ follower_id: currentUserId, following_id: profileId });
        setIsFollowing(true);
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all disabled:opacity-50 ${
          isFollowing
            ? "btn-ghost"
            : "btn-primary"
        }`}
      >
        {isFollowing ? "✔ 已关注" : "+ 关注"}
      </button>

      {showLogin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="card p-6 max-w-sm mx-4 text-center">
            <p className="text-4xl mb-3">🔒</p>
            <h3 className="text-lg font-semibold mb-2">登录后才能关注</h3>
            <p className="text-sm text-gray-400 mb-5">关注后即可第一时间看到 TA 的最新帖子</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogin(false)}
                className="flex-1 py-2 btn-ghost rounded-lg text-sm"
              >
                取消
              </button>
              <button
                onClick={() => router.push("/auth/login")}
                className="flex-1 py-2 btn-primary rounded-lg text-sm"
              >
                去登录
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}