import Reveal from "./Reveal";

export default function SectionHeading({
  icon,
  title,
  subtitle,
  align = "center",
}: {
  icon?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const alignCls = align === "center" ? "text-center" : "text-left";
  return (
    <Reveal className={`${alignCls} mb-8`}>
      {icon && <div className="text-3xl mb-2">{icon}</div>}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}