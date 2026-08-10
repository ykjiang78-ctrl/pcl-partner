"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const tradeOrderId = searchParams.get("trade_order_id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    if (!tradeOrderId) {
      setLoading(false);
      return;
    }

    const pollOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${tradeOrderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
          if (data.order?.status === "paid") {
            setLoading(false);
            return;
          }
        }
      } catch {
        // ignore
      }

      setPollCount((prev) => {
        if (prev >= 15) {
          // 30秒超时
          setLoading(false);
          return prev;
        }
        return prev + 1;
      });
    };

    pollOrder();
    const interval = setInterval(pollOrder, 2000);
    return () => clearInterval(interval);
  }, [tradeOrderId]);

  if (!tradeOrderId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">❓</p>
        <h1 className="text-2xl font-bold mb-3">缺少订单信息</h1>
        <Link
          href="/"
          className="text-indigo-500 hover:text-indigo-600 underline"
        >
          返回首页
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <h1 className="text-xl font-bold mb-2">等待支付结果...</h1>
        <p className="text-sm text-gray-400">正在确认支付状态，请稍候</p>
      </div>
    );
  }

  if (order?.status === "paid") {
    const isBoost = order.order_type === "boost";
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h1 className="text-2xl font-bold mb-2">支付成功！</h1>
        <p className="text-gray-500 mb-6">
          {isBoost
            ? "你的帖子已置顶，将优先展示给其他玩家"
            : "VIP已开通，享受专属特权吧！"}
        </p>
        <div className="flex gap-3 justify-center">
          {isBoost && order.metadata?.post_id ? (
            <Link
              href={`/posts/${order.metadata.post_id}`}
              className="px-6 py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
            >
              查看帖子
            </Link>
          ) : (
            <Link
              href={`/profile/${order.user_id}`}
              className="px-6 py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
            >
              我的资料
            </Link>
          )}
          <Link
            href="/"
            className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">⏰</p>
      <h1 className="text-2xl font-bold mb-2">支付结果确认中</h1>
      <p className="text-gray-400 mb-6 text-sm">
        如果已完成支付，系统会在几秒内自动确认。你也可以稍后在订单记录中查看。
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/payment/orders"
          className="px-6 py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
        >
          查看订单
        </Link>
        <Link
          href="/"
          className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
