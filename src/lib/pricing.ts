/**
 * 价格配置
 * 服务端使用，不信任客户端传入的价格
 */
export const PRICES = {
  boost: {
    1: 2.0, // 置顶1天 ¥2
    3: 5.0, // 置顶3天 ¥5
    7: 10.0, // 置顶7天 ¥10
  },
  vip: {
    monthly: 15.0, // 月度VIP ¥15
  },
} as const;

export const BOOST_OPTIONS = [
  { days: 1, price: PRICES.boost[1], label: "1天" },
  { days: 3, price: PRICES.boost[3], label: "3天" },
  { days: 7, price: PRICES.boost[7], label: "7天" },
] as const;

export const VIP_OPTIONS = [
  {
    plan: "monthly" as const,
    price: PRICES.vip.monthly,
    label: "月度会员",
    duration: 30,
  },
] as const;

/**
 * 根据订单类型和参数获取价格
 */
export function getPrice(
  orderType: "boost" | "vip",
  metadata?: { boost_days?: number; plan?: string }
): number {
  if (orderType === "boost") {
    const days = metadata?.boost_days;
    if (days === 1 || days === 3 || days === 7) {
      return PRICES.boost[days];
    }
    throw new Error(`Invalid boost_days: ${days}`);
  }
  if (orderType === "vip") {
    return PRICES.vip.monthly;
  }
  throw new Error(`Invalid order_type: ${orderType}`);
}
