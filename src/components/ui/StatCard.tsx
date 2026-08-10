"use client";

import { useEffect, useRef } from "react";
import Reveal from "./Reveal";

export default function StatCard({
  icon,
  label,
  value,
  suffix = "",
  gradient = "from-indigo-500 to-purple-500",
  delay = 0,
}: {
  icon: string;
  label: string;
  value: number;
  suffix?: string;
  gradient?: string;
  delay?: number;
}) {
  const countRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = countRef.current;
    if (!el) return;
    const start = performance.now();
    const duration = 1100;
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * value).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <Reveal delay={delay}>
      <div className="card card-hover p-5 text-center h-full">
        <div className="text-2xl mb-2">{icon}</div>
        <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          <span
            className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            <span ref={countRef}>0</span>
            {suffix}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-1">{label}</div>
      </div>
    </Reveal>
  );
}