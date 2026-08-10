"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Link from "next/link";

const CATEGORIES = [
  { value: "general", label: "通用建议", icon: "💡" },
  { value: "bug", label: "问题反馈", icon: "🐞" },
  { value: "feature", label: "功能建议", icon: "🚀" },
  { value: "other", label: "其他", icon: "✉️" },
];

export default function FeedbackPage() {
  const supabase = createClient();
  const [category, setCategory] = useState("general");
  const [content, setContent] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setError("请先登录后再提交反馈");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("feedback").insert({
      user_id: userData.user.id,
      category,
      content: content.trim(),
      contact: contact.trim() || null,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="card p-12">
          <p className="text-6xl mb-4">🎉</p>
          <h1 className="text-2xl font-bold mb-2">感谢你的反馈！</h1>
          <p className="text-gray-400 mb-6">我们已收到你的建议，会认真审阅并持续改进平台</p>
          <Link
            href="/"
            className="btn btn-primary px-8 py-3 rounded-full"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <SectionHeading
        icon="💌"
        title="意见反馈"
        subtitle="你的每一条建议都会让平台变得更好"
      />

      <Reveal>
        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-none p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              反馈类型
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`py-3 rounded-xl border-2 text-sm font-medium transition ${
                    category === c.value
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600"
                      : "border-gray-200 text-gray-500 hover:border-indigo-200 dark:border-gray-600 dark:text-gray-400"
                  }`}
                >
                  <span className="block text-xl mb-1">{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              反馈内容 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              maxLength={500}
              placeholder="请描述你的建议、遇到的问题或想新增的功能..."
              className="input resize-y"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{content.length}/500</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              联系方式（选填）
            </label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="input"
              placeholder="QQ / 微信 / 邮箱，便于我们回复你"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 rounded-xl"
          >
            {loading ? "提交中..." : "🚀 提交反馈"}
          </button>

          <p className="text-xs text-gray-400 text-center">
            提交即表示你同意我们的
            <Link href="/terms" className="text-indigo-500 hover:text-indigo-600 mx-1">
              社区规范
            </Link>
          </p>
        </form>
      </Reveal>
    </div>
  );
}