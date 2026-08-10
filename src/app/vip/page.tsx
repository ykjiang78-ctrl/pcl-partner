"use client";

import { useState } from "react";
import { useUser } from "@/components/SupabaseProvider";
import PaymentModal from "@/components/PaymentModal";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import GlowText from "@/components/ui/GlowText";
import Link from "next/link";

const VIP_BENEFITS = [
  { icon: "🚀", title: "帖子优先展示", desc: "你的帖子在同时间帖子中排在最前，曝光率直接翻倍" },
  { icon: "👑", title: "专属 VIP 标识", desc: "昵称旁显示金色 VIP 徽章，彰显你的身份" },
  { icon: "📈", title: "个人主页高亮", desc: "个人资料页展示 VIP 身份，更容易被信任" },
  { icon: "⚡", title: "更快的匹配", desc: "优先被其他玩家看到，开黑组队快人一步" },
  { icon: "💎", title: "专属标识颜色", desc: "个人卡片采用高贵金色渐变，脱颖而出" },
  { icon: "🔔", title: "优先通知", desc: "第一时间收到你关注玩家的最新动态" },
];

const BOOST_PREVIEW = [
  { days: "1天", price: "¥2.00", icon: "📌" },
  { days: "3天", price: "¥5.00", icon: "📌" },
  { days: "7天", price: "¥10.00", icon: "📌" },
];

export default function VipPage() {
  const { user, loading } = useUser();
  const [showVipPayment, setShowVipPayment] = useState(false);
  const [showBoostPayment, setShowBoostPayment] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SectionHeading
        icon="👑"
        title={<>VIP <GlowText>会员特权</GlowText></>}
        subtitle="升级会员，让你的找搭子之旅更顺畅"
      />

      {/* VIP 卡片 */}
      <Reveal>
        <div className="card p-8 text-center overflow-hidden relative"
          style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #d946ef 120%)" }}
        >
          <div className="absolute top-0 left-0 h-full w-24 bg-white/10 blur-2xl -skew-x-12" />
          <div className="relative">
            <span className="badge-gradient invert">👑 月度会员</span>
            <div className="text-5xl font-bold text-white mt-3">
              ¥15<span className="text-lg text-white/80">/月</span>
            </div>
            <p className="text-white/85 text-sm mt-1">一次性开通享受 30 天 VIP 特权</p>
            <div className="mt-6">
              <button
                onClick={() => setShowVipPayment(true)}
                className="btn bg-white text-amber-700 font-bold px-10 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-all"
              >
                👑 立即开通 VIP
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* VIP 权益 */}
      <div className="mt-10">
        <SectionHeading icon="🎁" title="会员专属权益" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VIP_BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 50}>
              <div className="card card-hover p-5 h-full text-center">
                <div className="text-3xl mb-2">{b.icon}</div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{b.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* 置顶服务 */}
      <div className="mt-12">
        <SectionHeading icon="📌" title="帖子置顶服务" subtitle="让每一条邀约都被看见" />
        <div className="grid sm:grid-cols-3 gap-4">
          {BOOST_PREVIEW.map((b, i) => (
            <Reveal key={b.days} delay={i * 60}>
              <div className="card card-hover p-6 text-center h-full">
                <div className="text-3xl mb-2">{b.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">置顶 {b.days}</h3>
                <div className="text-2xl font-bold text-indigo-500 mt-2">{b.price}</div>
                <p className="text-xs text-gray-400 mt-1">帖子在首页最前展示</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6 text-center">
          <button
            onClick={() => setShowBoostPayment(true)}
            className="btn btn-primary px-10 py-3 rounded-full"
          >
            📌 我要置顶帖子
          </button>
          <p className="text-xs text-gray-400 mt-3">
            置顶需用户已发布帖子，先到「我的帖子」选择需要置顶的内容
          </p>
        </Reveal>
      </div>

      <Reveal className="mt-12 text-center text-sm text-gray-400">
        {!user && !loading && (
          <Link href="/auth/login" className="text-indigo-500 hover:text-indigo-600">
            登录后
          </Link>
        )}
        {user ? "开通即享，马上体验 VIP 特权" : " 即可购买会员与置顶服务"}
      </Reveal>

      <PaymentModal
        open={showVipPayment}
        onClose={() => setShowVipPayment(false)}
        orderType="vip"
      />
      <PaymentModal
        open={showBoostPayment}
        onClose={() => setShowBoostPayment(false)}
        orderType="boost"
      />
    </div>
  );
}