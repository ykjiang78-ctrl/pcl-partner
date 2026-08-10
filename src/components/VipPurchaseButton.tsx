"use client";

import { useState } from "react";
import PaymentModal from "./PaymentModal";

interface VipPurchaseButtonProps {
  isVip: boolean;
  vipExpiresAt?: string | null;
}

export default function VipPurchaseButton({
  isVip,
  vipExpiresAt,
}: VipPurchaseButtonProps) {
  const [showPayment, setShowPayment] = useState(false);
  const isActive = vipExpiresAt && new Date(vipExpiresAt) > new Date();

  if (isActive) {
    const expiresDate = new Date(vipExpiresAt!).toLocaleDateString("zh-CN", {
      month: "long",
      day: "numeric",
    });
    return (
      <span className="text-xs text-amber-500 font-medium">
        👑 VIP至{expiresDate}
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowPayment(true)}
        className="text-xs bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2.5 py-1 rounded-full font-medium hover:from-amber-500 hover:to-yellow-600 transition shadow-sm"
      >
        👑 开通VIP
      </button>
      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        orderType="vip"
      />
    </>
  );
}
