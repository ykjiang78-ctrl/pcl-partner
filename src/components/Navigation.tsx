"use client";

import Link from "next/link";
import { useUser } from "./SupabaseProvider";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import VipPurchaseButton from "./VipPurchaseButton";

export default function Navigation() {
  const { user } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [vipInfo, setVipInfo] = useState<{ is_vip: boolean; vip_expires_at: string | null } | null>(null);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // 获取 VIP 状态
  useEffect(() => {
    if (!user) {
      setVipInfo(null);
      return;
    }
    const fetchVip = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("is_vip, vip_expires_at")
        .eq("id", user.id)
        .single();
      if (data) setVipInfo(data);
    };
    fetchVip();
  }, [user]);

  return (
    <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-xl font-bold tracking-tight">
            🎮 PCL找搭子
          </Link>

          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <NotificationBell />
            <Link href="/resources" className="text-sm text-white/75 hover:text-amber-300 transition">
              🎒 资源
            </Link>
            <Link href="/vip" className="text-xs text-white/75 hover:text-amber-300 transition">
              👑 VIP
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <VipPurchaseButton
                  isVip={vipInfo?.is_vip || false}
                  vipExpiresAt={vipInfo?.vip_expires_at || null}
                />
                <Link
                  href="/posts/new"
                  className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md transition font-medium"
                >
                  ✏️ 发帖
                </Link>
                <Link
                  href={`/profile/${user.id}`}
                  className="flex items-center gap-2 hover:text-indigo-200 transition"
                >
                  {user.user_metadata?.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt=""
                      className="w-7 h-7 rounded-full border border-white/30"
                    />
                  )}
                  <span className="text-sm font-medium">
                    {user.user_metadata?.full_name || user.email?.split("@")[0] || "用户"}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-md transition"
                >
                  退出
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm bg-white/15 hover:bg-white/25 px-4 py-1.5 rounded-md transition"
              >
                👤 登录
              </Link>
            )}
          </div>

          <button
            className="sm:hidden text-white/80 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden pb-3 flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 py-1.5">
              <ThemeToggle />
            </div>
            {user ? (
              <>
                <div className="py-1.5">
                  <VipPurchaseButton
                    isVip={vipInfo?.is_vip || false}
                    vipExpiresAt={vipInfo?.vip_expires_at || null}
                  />
                </div>
                <Link href="/posts/new" className="py-1.5" onClick={() => setMenuOpen(false)}>
                  ✏️ 发帖
                </Link>
                <Link href="/resources" className="py-1.5" onClick={() => setMenuOpen(false)}>
                  🎒 资源下载
                </Link>
                <Link href="/my-posts" className="py-1.5" onClick={() => setMenuOpen(false)}>
                  📁 我的帖子
                </Link>
                <Link href="/favorites" className="py-1.5" onClick={() => setMenuOpen(false)}>
                  ❤️ 我的收藏
                </Link>
                <Link href="/notifications" className="py-1.5" onClick={() => setMenuOpen(false)}>
                  🔔 通知中心
                </Link>
                <Link href="/vip" className="py-1.5" onClick={() => setMenuOpen(false)}>
                  👑 VIP会员
                </Link>
                <Link href={`/profile/${user.id}`} className="py-1.5" onClick={() => setMenuOpen(false)}>
                  {user.user_metadata?.full_name || "用户"}
                </Link>
                <Link href="/payment/orders" className="py-1.5" onClick={() => setMenuOpen(false)}>
                  📋 订单记录
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left text-white/70 hover:text-white py-1.5">
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="py-1.5" onClick={() => setMenuOpen(false)}>
                  👤 登录 / 注册
                </Link>
                <Link href="/help" className="py-1.5" onClick={() => setMenuOpen(false)}>
                  🆘 帮助中心
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
