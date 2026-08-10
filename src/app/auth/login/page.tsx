"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type LoginMethod = "email" | "phone";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [method, setMethod] = useState<LoginMethod>("email");

  // 邮箱登录
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 手机号登录
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const registered = searchParams.get("registered");

  // 邮箱登录
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  // 发送验证码
  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError("请输入手机号");
      return;
    }
    setLoading(true);
    setError("");

    const formattedPhone = phone.startsWith("+") ? phone : `+86${phone}`;

    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setOtpSent(true);
    setLoading(false);
    // 倒计时60秒
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 验证码登录
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formattedPhone = phone.startsWith("+") ? phone : `+86${phone}`;

    const { error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: "sms",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  // GitHub 登录
  const handleGithubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-center mb-2">👤 登录 PCL找搭子</h1>
        <p className="text-sm text-gray-400 text-center mb-6">登录后可以发帖和留言</p>

        {registered && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg mb-4">
            ✅ 注册成功！请登录
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</div>
        )}

        {/* 登录方式切换 */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => { setMethod("email"); setError(""); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              method === "email"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📧 邮箱登录
          </button>
          <button
            onClick={() => { setMethod("phone"); setError(""); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              method === "phone"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📱 手机号登录
          </button>
        </div>

        {/* 邮箱登录表单 */}
        {method === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition disabled:opacity-50"
            >
              {loading ? "登录中..." : "邮箱登录"}
            </button>
          </form>
        )}

        {/* 手机号登录表单 */}
        {method === "phone" && (
          <form onSubmit={handlePhoneLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={otpSent}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-50 disabled:text-gray-400"
                  placeholder="请输入手机号"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpSent && countdown > 0}
                  className="shrink-0 px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? `${countdown}s` : otpSent ? "重新发送" : "获取验证码"}
                </button>
              </div>
            </div>
            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">验证码</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 tracking-widest text-center text-lg"
                  placeholder="输入6位验证码"
                />
                <p className="text-xs text-gray-400 mt-1">验证码已发送到 {phone}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !otpSent}
              className="w-full py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition disabled:opacity-50"
            >
              {loading ? "登录中..." : "验证码登录"}
            </button>
            {!otpSent && (
              <p className="text-xs text-gray-400 text-center">点击"获取验证码"后输入收到的验证码</p>
            )}
          </form>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-400">
            <span className="bg-white px-3">或</span>
          </div>
        </div>

        <button
          onClick={handleGithubLogin}
          className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          GitHub 登录
        </button>

        <p className="text-xs text-gray-400 text-center mt-6">
          还没有账号？
          <Link href="/auth/register" className="text-indigo-500 hover:text-indigo-600 ml-1">
            注册 →
          </Link>
        </p>

        <p className="text-xs text-gray-400 text-center mt-2">
          忘记密码？
          <Link href="/auth/forgot-password" className="text-indigo-500 hover:text-indigo-600 ml-1">
            重置密码 →
          </Link>
        </p>
      </div>
    </div>
  );
}
