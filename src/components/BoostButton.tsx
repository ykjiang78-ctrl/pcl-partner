"use client";

import { useState } from "react";
import PaymentModal from "./PaymentModal";

interface BoostButtonProps {
  postId: string;
  userId: string;
  isBoosted: boolean;
  boostExpiresAt?: string;
}

export default function BoostButton({
  postId,
  userId,
  isBoosted,
  boostExpiresAt,
}: BoostButtonProps) {
  const [showPayment, setShowPayment] = useState(false);

  if (isBoosted && boostExpiresAt) {
    const expiresDate = new Date(boostExpiresAt).toLocaleDateString("zh-CN", {
      month: "numeric",
      day: "numeric",
    });
    return (
      <span className="text-xs text-amber-500 font-medium">
        📌 已置顶至 {expiresDate}
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowPayment(true)}
        className="text-xs text-amber-500 hover:text-amber-600 font-medium"
      >
        📌 置顶帖子
      </button>
      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        orderType="boost"
        postId={postId}
      />
    </>
  );
}
