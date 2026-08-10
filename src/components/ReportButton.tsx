"use client";

import { createClient } from "@/lib/supabase-client";
import { useState } from "react";

const REPORT_REASONS = [
  { value: "spam", label: "垃圾广告" },
  { value: "harassment", label: "骚扰辱骂" },
  { value: "inappropriate", label: "不当内容" },
  { value: "scam", label: "诈骗信息" },
  { value: "other", label: "其他" },
];

export default function ReportButton({ postId, userId }: { postId: string; userId: string | null }) {
  const supabase = createClient();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!userId || !reason) return;
    setLoading(true);

    const { error } = await supabase.from("reports").insert({
      post_id: postId,
      reporter_id: userId,
      reason,
      detail: detail.trim() || null,
    });

    if (!error) {
      setSubmitted(true);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setReason("");
    setDetail("");
    setSubmitted(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-xs text-gray-300 hover:text-gray-500 transition"
        title="举报"
      >
        ⚠️ 举报
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl">
            {submitted ? (
              <div className="text-center py-4">
                <p className="text-3xl mb-3">✅</p>
                <h3 className="text-lg font-semibold mb-2">举报已提交</h3>
                <p className="text-sm text-gray-400 mb-4">感谢你的反馈，我们会尽快处理</p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
                >
                  关闭
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">⚠️ 举报帖子</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">举报原因</label>
                    <div className="space-y-1.5">
                      {REPORT_REASONS.map((r) => (
                        <label key={r.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="reason"
                            value={r.value}
                            checked={reason === r.value}
                            onChange={(e) => setReason(e.target.value)}
                            className="text-indigo-500"
                          />
                          <span className="text-sm text-gray-600">{r.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">补充说明（可选）</label>
                    <textarea
                      value={detail}
                      onChange={(e) => setDetail(e.target.value)}
                      rows={2}
                      maxLength={200}
                      placeholder="描述具体情况..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-y"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !reason}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition disabled:opacity-50"
                  >
                    {loading ? "提交中..." : "提交举报"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
