"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { BOOST_OPTIONS, VIP_OPTIONS } from "@/lib/pricing";

type PayMethod = "wechat" | "alipay";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  orderType: "boost" | "vip";
  postId?: string;
}

export default function PaymentModal({
  open,
  onClose,
  orderType,
  postId,
}: PaymentModalProps) {
  const supabase = createClient();
  const [payMethod, setPayMethod] = useState<PayMethod>("wechat");
  const [boostDays, setBoostDays] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handlePay = async () => {
    setLoading(true);
    setError("");

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setError("请先登录");
        setLoading(false);
        return;
      }

      const body: Record<string, any> = {
        order_type: orderType,
        pay_method: payMethod,
      };

      if (orderType === "boost") {
        body.post_id = postId;
        body.boost_days = boostDays;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "创建订单失败");
        setLoading(false);
        return;
      }

      // 跳转到支付页面
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "支付失败");
      setLoading(false);
    }
  };

  const currentPrice =
    orderType === "boost"
      ? BOOST_OPTIONS.find((o) => o.days === boostDays)?.price || 0
      : VIP_OPTIONS[0].price;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-xl w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {orderType === "boost" ? "📌 帖子置顶" : "👑 开通VIP"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* 置顶天数选择 */}
        {orderType === "boost" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择置顶时长
            </label>
            <div className="grid grid-cols-3 gap-2">
              {BOOST_OPTIONS.map((opt) => (
                <button
                  key={opt.days}
                  onClick={() => setBoostDays(opt.days)}
                  className={`py-3 px-2 rounded-lg border-2 text-center transition ${
                    boostDays === opt.days
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-indigo-200 text-gray-600"
                  }`}
                >
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-lg font-bold mt-1">¥{opt.price}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VIP 说明 */}
        {orderType === "vip" && (
          <div className="mb-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-100">
            <div className="text-center mb-2">
              <span className="text-2xl">👑</span>
              <span className="text-lg font-bold text-amber-700 ml-2">
                月度VIP
              </span>
            </div>
            <div className="text-sm text-amber-600 space-y-1">
              <p>✨ 无限发帖数量</p>
              <p>✨ 帖子优先展示</p>
              <p>✨ 专属VIP标识</p>
              <p>✨ 个人主页高亮</p>
            </div>
            <div className="text-center mt-3">
              <span className="text-2xl font-bold text-amber-700">
                ¥{VIP_OPTIONS[0].price}
              </span>
              <span className="text-sm text-amber-500">/月</span>
            </div>
          </div>
        )}

        {/* 支付方式选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            支付方式
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPayMethod("wechat")}
              className={`py-3 px-4 rounded-lg border-2 text-center transition flex items-center justify-center gap-2 ${
                payMethod === "wechat"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-green-200 text-gray-600"
              }`}
            >
              <span className="text-xl">💚</span>
              <span className="text-sm font-medium">微信支付</span>
            </button>
            <button
              onClick={() => setPayMethod("alipay")}
              className={`py-3 px-4 rounded-lg border-2 text-center transition flex items-center justify-center gap-2 ${
                payMethod === "alipay"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-blue-200 text-gray-600"
              }`}
            >
              <span className="text-xl">💙</span>
              <span className="text-sm font-medium">支付宝</span>
            </button>
          </div>
        </div>

        {/* 支付按钮 */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full py-3 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            "处理中..."
          ) : (
            <>
              {payMethod === "wechat" ? "💚" : "💙"} 立即支付 ¥
              {currentPrice.toFixed(2)}
            </>
          )}
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          支付由虎皮椒提供安全保障
        </p>
      </div>
    </div>
  );
}
