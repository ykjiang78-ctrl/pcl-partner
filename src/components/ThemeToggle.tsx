"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;

    const applyTheme = (t: "light" | "dark") => {
      root.classList.toggle("dark", t === "dark");
    };

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mq.matches ? "dark" : "light");
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      applyTheme(theme);
    }
  }, [theme, mounted]);

  const cycleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={cycleTheme}
      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/15 transition text-white/80 hover:text-white"
      title={theme === "light" ? "浅色模式" : theme === "dark" ? "深色模式" : "跟随系统"}
    >
      {theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "💻"}
    </button>
  );
}
