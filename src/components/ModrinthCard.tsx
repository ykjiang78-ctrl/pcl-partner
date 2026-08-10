"use client";

import Reveal from "@/components/ui/Reveal";

export interface ModrinthHit {
  slug: string;
  title: string;
  description: string;
  icon: string;
  downloads: number;
  follows: number;
  loader?: string;
  categories: string[];
  latestVersion: string;
  url: string;
}

function fmt(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "k";
  return String(n);
}

const LOADER_LABEL: Record<string, string> = {
  forge: "Forge",
  fabric: "Fabric",
  neoforge: "NeoForge",
  quilt: "Quilt",
};

export default function ModrinthCard({
  hit,
  index = 0,
}: {
  hit: ModrinthHit;
  index?: number;
}) {
  const loader = hit.loader ? (LOADER_LABEL[hit.loader] ?? hit.loader) : "";

  return (
    <Reveal delay={Math.min(index, 5) * 50}>
      <div className="card card-hover shine p-5 h-full">
        <div className="flex items-start gap-3">
          {hit.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hit.icon}
              alt=""
              loading="lazy"
              className="w-12 h-12 rounded-2xl shrink-0 object-cover border border-gray-100 dark:border-[#313244]"
            />
          ) : (
            <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center text-2xl shadow-glow">
              🧩
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">{hit.title}</h3>
              <span className="chip bg-green-50 text-green-600 dark:text-green-300">Modrinth</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              {loader && (
                <span className="chip bg-emerald-50 text-emerald-600 dark:text-emerald-300">
                  {loader}
                </span>
              )}
              {hit.latestVersion && (
                <span className="chip bg-gray-100 text-gray-500">📌 {hit.latestVersion}</span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-3 line-clamp-2">
          {hit.description}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>⬇️ {fmt(hit.downloads)} 下载</span>
          <span>⭐ {fmt(hit.follows)} 收藏</span>
        </div>

        <div className="mt-3">
          <a
            href={hit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white text-gray-600 border border-gray-200 hover:border-emerald-300 hover:text-emerald-600 transition dark:bg-[#181825] dark:border-[#313244] dark:text-gray-300"
          >
            🟣 去 Modrinth 下载↗
          </a>
        </div>
      </div>
    </Reveal>
  );
}