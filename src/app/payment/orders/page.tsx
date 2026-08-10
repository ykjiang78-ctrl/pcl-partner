"use client";

import { createClient } from "@/lib/supabase-client";
import { useUser } from "@/components/SupabaseProvider";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  id: string;
  trade_order_id: string;
  order_type: "boost" | "vip";
  amount: number;
  pay_method: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  metadata: Record<string, any>;
}

export default function OrderHistoryPage() {
  const { user } = useUser();
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setOrders(data || []);
      setLoading(false);
    };

    fetchOrders();
  }, [user, supabase]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🔒</p>
        <p className="text-gray-400 mb-4">请先登录查看订单</p>
        <Link
          href="/auth/login"
          className="btn btn-primary px-8 py-3 rounded-full"
        >
          去登录 →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">📋 订单记录</h1>

      {loading ? (
        <div className="text-center py-8 text-gray-400">加载中...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p>暂无订单记录</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="card card-hover p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {order.order_type === "boost" ? "📌 置顶" : "👑 VIP"}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.status === "paid"
                        ? "bg-green-50 text-green-600"
                        : order.status === "pending"
                        ? "bg-yellow-50 text-yellow-600"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {order.status === "paid"
                      ? "已支付"
                      : order.status === "pending"
                      ? "待支付"
                      : order.status === "failed"
                      ? "失败"
                      : "已退款"}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-700">
                  ¥{Number(order.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  {order.pay_method === "wechat" ? "💚 微信" : "💙 支付宝"} ·{" "}
                  {new Date(order.created_at).toLocaleString("zh-CN")}
                </span>
                <span className="text-gray-300">
                  {order.trade_order_id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
