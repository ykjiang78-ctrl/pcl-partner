"use client";

import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type RegisterMethod = "email" | "phone";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [method, setMethod] = useState<RegisterMethod>("email");

  // 邮箱注册
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 手机号注册
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneName, setPhoneName] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 邮箱注册
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // 注册成功后创建profile
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        nickname: name,
        avatar_url: data.user.user_metadata?.avatar_url,
      });
    }

    router.push("/auth/login?registered=1");
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

  // 手机号注册
  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formattedPhone = phone.startsWith("+") ? phone : `+86${phone}`;

    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: "sms",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // 创建profile
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        nickname: phoneName.trim() || `玩家${phone.slice(-4)}`,
        phone: formattedPhone,
      });
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-center mb-2">📝 注册</h1>
        <p className="text-sm text-gray-400 text-center mb-6">创建你的 PCL找搭子 账号</p>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</div>
        )}

        {/* 注册方式切换 */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => { setMethod("email"); setError(""); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              method === "email"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📧 邮箱注册
          </button>
          <button
            onClick={() => { setMethod("phone"); setError(""); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
              method === "phone"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📱 手机号注册
          </button>
        </div>

        {/* 邮箱注册表单 */}
        {method === "email" && (
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="你的昵称"
              />
            </div>
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
                minLength={6}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="至少6位"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition disabled:opacity-50"
            >
              {loading ? "注册中..." : "注册"}
            </button>
          </form>
        )}

        {/* 手机号注册表单 */}
        {method === "phone" && (
          <form onSubmit={handlePhoneRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
              <input
                type="text"
                value={phoneName}
                onChange={(e) => setPhoneName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="你的昵称"
              />
            </div>
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
              {loading ? "注册中..." : "验证码注册"}
            </button>
            {!otpSent && (
              <p className="text-xs text-gray-400 text-center">点击"获取验证码"后输入收到的验证码</p>
            )}
          </form>
        )}

        <p className="text-xs text-gray-400 text-center mt-6">
          已有账号？
          <Link href="/auth/login" className="text-indigo-500 hover:text-indigo-600 ml-1">
            登录 →
          </Link>
        </p>
      </div>
    </div>
  );
}
