interface VipBadgeProps {
  expiresAt?: string | null;
  showText?: boolean;
}

export default function VipBadge({ expiresAt, showText = false }: VipBadgeProps) {
  const isActive = expiresAt && new Date(expiresAt) > new Date();

  if (!isActive) return null;

  return (
    <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
      👑 {showText ? "VIP" : ""}
    </span>
  );
}
