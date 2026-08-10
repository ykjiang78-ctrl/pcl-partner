"use client";

import { createClient } from "@/lib/supabase-client";
import { useUser } from "@/components/SupabaseProvider";
import { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

interface Notification {
  id: string;
  type: string;
  post_id: string | null;
  title: string | null;
  body: string | null;
  is_read: boolean;
  created_at: string;
  actor?: { nickname: string | null; avatar_url: string | null }[] | null;
}

export default function NotificationsPage() {
  const { user } = useUser();
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchAll = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("id, type, post_id, title, body, is_read, created_at, actor:actor_id(nickname, avatar_url)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setNotifications((data || []) as Notification[]);
      setLoading(false);
    };
    fetchAll();
  }, [user, supabase]);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.is_read);
    if (unread.length === 0) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unread.map((n) => n.id));
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    if (diff < 60_000) return "刚刚";
    if (diff < 3_600_000) return Math.floor(diff / 60_000) + "分钟前";
    if (diff < 86_400_000) return Math.floor(diff / 3_600_000) + "小时前";
    return new Date(date).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🔒</p>
        <p className="text-gray-400 mb-4">登录后即可查看通知</p>
        <Link href="/auth/login" className="btn btn-primary px-8 py-3 rounded-full">
          去登录
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <SectionHeading icon="🔔" title="通知中心" subtitle={`共 ${notifications.length} 条通知`} />

      {loading ? (
        <p className="text-center py-12 text-gray-400">加载中...</p>
      ) : notifications.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-5xl mb-4">🕊️</p>
          <p className="text-gray-400">暂无通知</p>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-3">
            <button
              onClick={markAllRead}
              className="text-xs text-indigo-500 hover:text-indigo-600"
            >
              ✅ 全部已读
            </button>
          </div>
          <div className="space-y-2">
            {notifications.map((n) => {
              const actor = n.actor?.[0];
              const icon = n.type === "follow" ? "🤝" : n.type === "system" ? "📌" : "💬";
              return (
                <Link
                  key={n.id}
                  href={n.post_id ? `/posts/${n.post_id}` : `/profile/${user.id}`}
                  onClick={() => markAsRead(n.id)}
                  className={`card card-hover p-4 flex items-start gap-3 ${
                    !n.is_read ? "border-indigo-200 bg-indigo-50/40 dark:bg-indigo-500/5" : ""
                  }`}
                >
                  <span className="text-2xl shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {actor?.avatar_url ? (
                        <img src={actor.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                      ) : null}
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        <strong className="text-indigo-600 dark:text-indigo-400">
                          {actor?.nickname || "系统"}
                        </strong>{" "}
                        {n.title || "有新动态"}
                      </p>
                    </div>
                    {n.body && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{n.body}</p>}
                    <p className="text-xs text-gray-300 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.is_read && (
                    <span className="shrink-0 w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                  )}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}