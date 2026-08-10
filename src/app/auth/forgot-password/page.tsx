"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-center mb-2">🔑 重置密码</h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          输入注册邮箱，我们将发送重置链接
        </p>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {sent ? (
          <div className="text-center py-4">
            <p className="text-3xl mb-3">📧</p>
            <h3 className="text-lg font-semibold mb-2">邮件已发送</h3>
            <p className="text-sm text-gray-400 mb-4">
              请检查你的邮箱 {email}，点击邮件中的链接重置密码
            </p>
            <Link
              href="/auth/login"
              className="text-indigo-500 hover:text-indigo-600 text-sm"
            >
              返回登录 →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="your@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition disabled:opacity-50"
            >
              {loading ? "发送中..." : "发送重置链接"}
            </button>
          </form>
        )}

        <p className="text-xs text-gray-400 text-center mt-6">
          想起密码了？
          <Link href="/auth/login" className="text-indigo-500 hover:text-indigo-600 ml-1">
            登录 →
          </Link>
        </p>
      </div>
    </div>
  );
}
