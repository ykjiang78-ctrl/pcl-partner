import { md5 } from "./md5";

const XUNHUPAY_API_URL = process.env.XUNHUPAY_API_URL || "https://api.xunhupay.com/payment/do.html";
const XUNHUPAY_APP_ID = process.env.XUNHUPAY_APP_ID || "";
const XUNHUPAY_APP_SECRET = process.env.XUNHUPAY_APP_SECRET || "";

/**
 * 生成虎皮椒签名
 * 1. 将所有非空参数按 key 字母升序排列
 * 2. 拼接为 key1=value1&key2=value2&... 格式
 * 3. 末尾追加 &key=AppSecret
 * 4. MD5 得到 hash
 */
export function generateHash(
  params: Record<string, string>,
  appSecret: string
): string {
  const sortedKeys = Object.keys(params)
    .filter((key) => key !== "hash" && params[key] !== "")
    .sort();

  const queryString = sortedKeys
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const stringToSign = queryString + "&key=" + appSecret;
  return md5(stringToSign);
}

/**
 * 验证虎皮椒回调签名
 */
export function verifyHash(
  callbackData: Record<string, string>,
  appSecret: string
): boolean {
  const receivedHash = callbackData.hash;
  if (!receivedHash) return false;

  const computedHash = generateHash(callbackData, appSecret);
  return computedHash === receivedHash;
}

/**
 * 生成内部订单号
 * 格式: PCL-{timestamp36}-{6位随机}
 */
export function generateTradeOrderId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `PCL-${ts}-${rand}`;
}

/**
 * 构建虎皮椒支付URL
 */
export function buildPaymentUrl(options: {
  tradeOrderId: string;
  totalFee: string;
  title: string;
  type: "wechat" | "alipay";
  notifyUrl: string;
  returnUrl: string;
}): string {
  const params: Record<string, string> = {
    version: "1.1",
    appid: XUNHUPAY_APP_ID,
    trade_order_id: options.tradeOrderId,
    total_fee: options.totalFee,
    title: options.title,
    time: Math.floor(Date.now() / 1000).toString(),
    notify_url: options.notifyUrl,
    return_url: options.returnUrl,
    nonce_str: Math.random().toString(36).slice(2, 14),
    type: options.type,
  };

  // 生成签名
  params.hash = generateHash(params, XUNHUPAY_APP_SECRET);

  // 构建完整URL
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  return `${XUNHUPAY_API_URL}?${queryString}`;
}
