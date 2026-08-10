import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { createServerSupabase } from "@/lib/supabase-server";
import { generateTradeOrderId, buildPaymentUrl } from "@/lib/xunhupay";
import { getPrice } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { order_type, pay_method, post_id, boost_days } = body;

    // 验证参数
    if (!order_type || !pay_method) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    if (!["boost", "vip"].includes(order_type)) {
      return NextResponse.json({ error: "无效的订单类型" }, { status: 400 });
    }

    if (!["wechat", "alipay"].includes(pay_method)) {
      return NextResponse.json({ error: "无效的支付方式" }, { status: 400 });
    }

    // 置顶需要 post_id 和 boost_days
    if (order_type === "boost") {
      if (!post_id) {
        return NextResponse.json({ error: "缺少帖子ID" }, { status: 400 });
      }
      if (![1, 3, 7].includes(boost_days)) {
        return NextResponse.json({ error: "无效的置顶天数" }, { status: 400 });
      }

      // 验证帖子所有权
      const supabase = await createServerSupabase();
      const { data: post } = await supabase
        .from("posts")
        .select("id, user_id, title")
        .eq("id", post_id)
        .single();

      if (!post) {
        return NextResponse.json({ error: "帖子不存在" }, { status: 404 });
      }
      if (post.user_id !== user.id) {
        return NextResponse.json({ error: "只能置顶自己的帖子" }, { status: 403 });
      }
    }

    // 计算价格（服务端计算，不信任客户端）
    const metadata: Record<string, any> = {};
    if (order_type === "boost") {
      metadata.post_id = post_id;
      metadata.boost_days = boost_days;
    }

    const amount = getPrice(order_type, metadata);

    // 生成订单号
    const tradeOrderId = generateTradeOrderId();

    // 创建订单记录
    const supabase = await createServerSupabase();
    const { error: orderError } = await supabase.from("orders").insert({
      user_id: user.id,
      trade_order_id: tradeOrderId,
      order_type,
      amount,
      pay_method,
      status: "pending",
      metadata,
    });

    if (orderError) {
      console.error("创建订单失败:", orderError);
      return NextResponse.json({ error: "创建订单失败" }, { status: 500 });
    }

    // 构建支付标题
    const title =
      order_type === "boost"
        ? `PCL找搭子-帖子置顶${boost_days}天`
        : "PCL找搭子-月度VIP会员";

    // 构建支付URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const paymentUrl = buildPaymentUrl({
      tradeOrderId,
      totalFee: amount.toFixed(2),
      title,
      type: pay_method,
      notifyUrl: `${appUrl}/api/payment/webhook`,
      returnUrl: `${appUrl}/payment/result?trade_order_id=${tradeOrderId}`,
    });

    return NextResponse.json({
      url: paymentUrl,
      trade_order_id: tradeOrderId,
    });
  } catch (err: any) {
    console.error("创建订单异常:", err);
    return NextResponse.json(
      { error: err.message || "服务器错误" },
      { status: 500 }
    );
  }
}
