import Link from "next/link";

export default function GradientButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  disabled,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "white";
  className?: string;
  disabled?: boolean;
}) {
  const base =
    variant === "white"
      ? "bg-white text-indigo-600 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      : variant === "ghost"
      ? "btn-ghost bg-white/10 border border-white/25 text-white hover:bg-white/20"
      : "btn-primary";
  const cls = `inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${base} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}