"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResourceCard from "./ResourceCard";
import ModrinthCard from "./ModrinthCard";
import type { McResource, ResourceCategoryDef } from "@/lib/mc-resources";

const PAGE_SIZE = 10;
const MODRINTH_PAGE_SIZE = 6;

const TYPE_FILTER: Record<ResourceCategoryDef["key"], string> = {
  mod: "mod",
  modpack: "modpack",
  resourcepack: "resourcepack",
  shader: "shader",
  datapack: "datapack",
  map: "map", // Modrinth 无 maps 类型，API 层会降级为不全类型搜索
};

export default function ResourceExplorer({
  categories,
  curated,
}: {
  categories: ResourceCategoryDef[];
  curated: McResource[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const cat = (searchParams.get("cat") || "") as McResource["category"] | "";
  const sort = (searchParams.get("sort") || "downloads") as string;
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10) || 1, 1);

  const activeCat = cat ? categories.find((c) => c.key === cat) : undefined;

  // —— 精选（静态）过滤与排序 ——
  const filteredCurated = useMemo(() => {
    let list = curated.filter((r) => {
      const matchQ =
        !q || r.name.toLowerCase().includes(q.toLowerCase()) || r.desc.toLowerCase().includes(q.toLowerCase());
      const matchCat = !cat || r.category === cat;
      return matchQ && matchCat;
    });
    if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, "zh"));
    } else if (sort === "version") {
      list = [...list].sort((a, b) => b.versions.localeCompare(a.versions));
    }
    return list;
  }, [curated, q, cat, sort]);

  const totalCuratedPages = Math.max(Math.ceil(filteredCurated.length / PAGE_SIZE), 1);
  const clampPage = Math.min(page, totalCuratedPages);
  const pageCurated = filteredCurated.slice((clampPage - 1) * PAGE_SIZE, clampPage * PAGE_SIZE);

  // —— Modrinth 动态拉取 ——
  const [remoteHits, setRemoteHits] = useState<any[]>([]);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteError, setRemoteError] = useState("");

  const needModrinth = useMemo(() => {
    // 当筛选的是 Modrinth 有类型支持的分类，或用户主动搜索时，展示动态结果
    const supported = cat === "" || cat === "mod" || cat === "modpack" || cat === "resourcepack" || cat === "shader" || cat === "datapack";
    return supported;
  }, [cat]);

  const fetchModrinth = useCallback(async () => {
    if (!needModrinth) {
      setRemoteHits([]);
      return;
    }
    setRemoteLoading(true);
    setRemoteError("");
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (cat) params.set("type", TYPE_FILTER[cat]);
      params.set("limit", String(MODRINTH_PAGE_SIZE));
      const res = await fetch(`/api/modrinth?${params.toString()}`);
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || "Modrinth 请求失败");
      }
      const j = await res.json();
      setRemoteHits(j.hits || []);
    } catch (e: any) {
      setRemoteError(e.message || "加载失败");
      setRemoteHits([]);
    } finally {
      setRemoteLoading(false);
    }
  }, [needModrinth, q, cat]);

  useEffect(() => {
    fetchModrinth();
  }, [fetchModrinth]);

  // —— URL 更新工具 ——
  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === "") params.delete(k);
        else params.set(k, v);
      });
      router.push(`/resources?${params.toString()}`);
    },
    [router, searchParams]
  );

  const featured = curated.filter((r) => r.featured);
  const showFeatured = !q && !cat && sort === "downloads";

  return (
    <div>
      {/* 控制条：搜索 / 分类 / 排序 / 原站直链 */}
      <div className="card p-4 space-y-3">
        {/* 搜索框 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            updateParams({ q: String(fd.get("q") || ""), page: null });
          }}
          className="flex gap-2"
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="🔍 搜索资源名称或关键词…"
            className="flex-1 input"
          />
          <button type="submit" className="btn btn-primary">
            🔍 搜索
          </button>
          {q && (
            <button
              type="button"
              onClick={() => updateParams({ q: null, page: null })}
              className="btn btn-ghost whitespace-nowrap"
            >
              ✕ 清除
            </button>
          )}
        </form>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400">分类：</span>
          {[{ key: "" as const, label: "全部", icon: "🗂️" }, ...categories].map((c) => {
            const active = (!cat && c.key === "") || (cat === c.key);
            return (
              <button
                key={c.key || "all"}
                onClick={() => updateParams({ cat: c.key || null, page: null })}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  active
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
                }`}
              >
                <span>{c.icon}</span>
                {c.label}
              </button>
            );
          })}
        </div>

        {/* 排序 + 原站直链 */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">排序：</span>
            {[
              { k: "downloads", label: "下载量" },
              { k: "name", label: "名称" },
              { k: "version", label: "版本" },
            ].map((s) => (
              <button
                key={s.k}
                onClick={() => updateParams({ sort: s.k, page: null })}
                className={`text-xs px-3 py-1.5 rounded-full transition ${
                  sort === s.k
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">原站直链：</span>
            {(() => {
              const catDef = activeCat;
              const browse = catDef?.browse || [
                { label: "Modrinth", url: "https://modrinth.com/mods" },
              ];
              return browse.map((b) => (
                <a
                  key={b.label}
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-500 hover:text-indigo-600 border border-indigo-200 dark:border-indigo-500/40 px-3 py-1.5 rounded-full transition"
                >
                  {b.label} ↗
                </a>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* 热门精选：只在默认浏览时展示 */}
      {showFeatured && featured.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span>🎁</span> 热门精选
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {featured.slice(0, 4).map((r, i) => (
              <ResourceCard key={r.id} resource={r} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Modrinth 动态资源 */}
      {needModrinth && (showFeatured || q || cat) && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-2">
            <span>🟣</span> Modrinth 热门资源
            <span className="text-xs text-gray-400 font-normal">（实时 · 文件托管于 Modrinth 官方 CDN）</span>
          </h3>
          {remoteLoading && <p className="text-sm text-gray-400 py-6 text-center animate-pulse">正在拉取 Modrinth 最新资源…</p>}
          {remoteError && <p className="text-sm text-amber-500 py-4">⚠️ {remoteError}</p>}
          {!remoteLoading && !remoteError && remoteHits.length === 0 && (
            <p className="text-sm text-gray-400 py-4">未匹配到 Modrinth 资源</p>
          )}
          {remoteHits.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              {remoteHits.map((h: any, i) => (
                <ModrinthCard key={h.slug} hit={h} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 精选/静态资源列表 */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span>📚</span> 精选资源
          <span className="text-xs text-gray-400 font-normal">共 {filteredCurated.length} 个</span>
        </h3>
        {pageCurated.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">🕳️</p>
            <p>没有找到匹配的资源</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {pageCurated.map((r, i) => (
              <ResourceCard key={r.id} resource={r} index={i} />
            ))}
          </div>
        )}

        {/* 分页 */}
        {totalCuratedPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <PageBtn
              disabled={clampPage <= 1}
              onClick={() => updateParams({ page: clampPage > 1 ? String(clampPage - 1) : null })}
            >
              ← 上一页
            </PageBtn>
            <span className="text-xs text-gray-400">
              {clampPage} / {totalCuratedPages}
            </span>
            <PageBtn
              disabled={clampPage >= totalCuratedPages}
              onClick={() => updateParams({ page: String(clampPage + 1) })}
            >
              下一页 →
            </PageBtn>
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <div className="mt-10">
        <div className="card p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            本站仅做资源导航聚合，文件全部跳转到 Modrinth、CurseForge、MC百科、苦力怕论坛等原站下载。
            <br />
            使用 PCL2 / HMCL 等启动器时，可直接在启动器内置的「模组搜索」中按名称下载，体验更佳。
          </p>
        </div>
      </div>
    </div>
  );
}

function PageBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
    >
      {children}
    </button>
  );
}