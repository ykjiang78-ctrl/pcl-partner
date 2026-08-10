"use client";

import { createClient } from "@/lib/supabase-client";
import { useUser } from "./SupabaseProvider";
import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function NotificationBell() {
  const { user } = useUser();
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("id, type, post_id, title, body, is_read, created_at, actor:actor_id(id, nickname, avatar_url)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(8);

      if (data) {
        setNotifications(data as Notification[]);
        setUnreadCount(data.filter((n: any) => !n.is_read).length);
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    // 兜底轮询（部分环境下 realtime 不可用）
    const interval = setInterval(fetchNotifications, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [user, supabase]);

  // 打开面板时标记全部已读
  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);
    setUnreadCount(0);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
  };

  if (!user) return null;

  const typeIcon = (type: string) =>
    type === "follow" ? "🤝" : type === "system" ? "📌" : "💬";

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowPanel(!showPanel);
          if (!showPanel) markAllRead();
        }}
        className="relative w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/15 transition text-white/80 hover:text-white"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowPanel(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 card z-50 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                🔔 通知
              </h3>
              <Link
                href="/notifications"
                onClick={() => setShowPanel(false)}
                className="text-xs text-indigo-500 hover:text-indigo-600"
              >
                查看全部
              </Link>
            </div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">
                暂无新通知
              </div>
            ) : (
              notifications.map((n) => {
                const actor = n.actor?.[0];
                return (
                  <Link
                  key={n.id}
                  href={n.post_id ? `/posts/${n.post_id}` : `/profile/${user.id}`}
                  onClick={() => setShowPanel(false)}
                  className="block px-3 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base shrink-0">
                      {actor?.avatar_url ? (
                        <img src={actor.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                      ) : (
                        handleIcon(n.type)
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        <strong className="text-indigo-600 dark:text-indigo-400">
                          {actor?.nickname || "有人"}
                        </strong>{" "}
                        {n.title || "有新动态"}
                      </p>
                    </div>
                  </div>
                  {!n.is_read && <span className="ml-6 inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-1" />}
                </Link>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

function handleIcon(type: string) {
  return <span className="text-base">{type === "follow" ? "🤝" : "💬"}</span>;
}