export default function GlowText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`text-gradient ${className}`}>{children}</span>;
}