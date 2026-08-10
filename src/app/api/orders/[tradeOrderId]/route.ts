import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tradeOrderId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { tradeOrderId } = await params;

    const supabase = await createServerSupabase();
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("trade_order_id", tradeOrderId)
      .eq("user_id", user.id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err: any) {
    console.error("查询订单异常:", err);
    return NextResponse.json(
      { error: err.message || "服务器错误" },
      { status: 500 }
    );
  }
}
