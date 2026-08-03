"use client";

import Link from "next/link";
import { useUser } from "./SupabaseProvider";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const { user } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-xl font-bold tracking-tight">
            🎮 PCL找搭子
          </Link>

          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
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
            {user ? (
              <>
                <Link href={`/profile/${user.id}`} className="py-1.5" onClick={() => setMenuOpen(false)}>
                  {user.user_metadata?.full_name || "用户"}
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left text-white/70 hover:text-white py-1.5">
                  退出登录
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="py-1.5" onClick={() => setMenuOpen(false)}>
                👤 登录 / 注册
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}