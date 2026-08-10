import { NextRequest, NextResponse } from "next/server";
import { verifyHash } from "@/lib/xunhupay";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    // 解析回调数据（虎皮椒发送 form-urlencoded）
    const formData = await request.formData();
    const callbackData: Record<string, string> = {};
    formData.forEach((value, key) => {
      callbackData[key] = value.toString();
    });

    // 验证签名
    const appSecret = process.env.XUNHUPAY_APP_SECRET || "";
    if (!verifyHash(callbackData, appSecret)) {
      console.error("Webhook 签名验证失败:", callbackData);
      return new NextResponse("hash fail", { status: 400 });
    }

    // 检查支付状态（OD = 订单成功）
    if (callbackData.status !== "OD") {
      console.log("Webhook 非成功状态:", callbackData.status);
      return new NextResponse("success", { status: 200 });
    }

    const tradeOrderId = callbackData.trade_order_id;
    const transactionId = callbackData.transaction_id || "";
    const totalFee = callbackData.total_fee || "";

    const supabase = createAdminClient();

    // 查询订单
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("trade_order_id", tradeOrderId)
      .single();

    if (orderError || !order) {
      console.error("Webhook 订单不存在:", tradeOrderId);
      return new NextResponse("order not found", { status: 200 });
    }

    // 幂等处理：已支付的不重复处理
    if (order.status === "paid") {
      return new NextResponse("success", { status: 200 });
    }

    // 验证金额
    if (totalFee && parseFloat(totalFee) !== parseFloat(order.amount)) {
      console.error(
        "Webhook 金额不匹配:",
        totalFee,
        "vs",
        order.amount
      );
      return new NextResponse("amount mismatch", { status: 400 });
    }

    // 更新订单状态
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "paid",
        transaction_id: transactionId,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Webhook 更新订单失败:", updateError);
      return new NextResponse("db error", { status: 500 });
    }

    // 根据订单类型发货
    if (order.order_type === "boost") {
      const metadata = order.metadata || {};
      const postId = metadata.post_id;
      const boostDays = metadata.boost_days || 1;

      if (postId) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + boostDays);

        const { error: boostError } = await supabase
          .from("post_boosts")
          .insert({
            post_id: postId,
            user_id: order.user_id,
            order_id: order.id,
            boost_days: boostDays,
            expires_at: expiresAt.toISOString(),
          });

        if (boostError) {
          console.error("Webhook 创建置顶失败:", boostError);
        }
      }
    } else if (order.order_type === "vip") {
      // 查看是否已有活跃会员
      const { data: existingMembership } = await supabase
        .from("user_memberships")
        .select("*")
        .eq("user_id", order.user_id)
        .eq("status", "active")
        .single();

      const expiresAt = new Date();
      if (existingMembership && new Date(existingMembership.expires_at) > new Date()) {
        // 续费：在现有到期时间上延长
        expiresAt.setTime(new Date(existingMembership.expires_at).getTime());
      }
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Upsert 会员记录
      const { error: vipError } = await supabase
        .from("user_memberships")
        .upsert({
          user_id: order.user_id,
          order_id: order.id,
          plan: "monthly",
          status: "active",
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

      if (vipError) {
        console.error("Webhook 创建会员失败:", vipError);
      }

      // 更新 profiles 表
      await supabase
        .from("profiles")
        .update({
          is_vip: true,
          vip_expires_at: expiresAt.toISOString(),
        })
        .eq("id", order.user_id);
    }

    return new NextResponse("success", { status: 200 });
  } catch (err: any) {
    console.error("Webhook 处理异常:", err);
    return new NextResponse("error", { status: 500 });
  }
}
