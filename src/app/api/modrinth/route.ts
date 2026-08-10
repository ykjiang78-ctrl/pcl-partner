import { NextRequest, NextResponse } from "next/server";

// Modrinth 公开搜索 API（无需鉴权，可选 Authorization 头提高限速）
// 路由：GET /api/modrinth?q=&type=&limit=&index=&version=
export const dynamic = "force-dynamic";

// 支持按类型筛选的 Modrinth 类型
// 注意：Modrinth 没有独立的 maps 类型 —— "map" 会降级为普遍搜索（不套 facets），见下
const SUPPORTED_BY = new Set([
  "mod",
  "modpack",
  "resourcepack",
  "shader",
  "datapack",
  "map",
]);

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 30;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  const rawType = (searchParams.get("type") || "").trim();
  const rawLimit = parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10);
  const rawPage = parseInt(searchParams.get("page") || "1", 10);
  const version = (searchParams.get("version") || "").trim();

  const limit = Math.min(Math.max(rawLimit || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const page = Math.max(rawPage || 1, 1);
  const offset = (page - 1) * limit;

  // 只有能被 Modrinth 直接筛类型的分类才带 facets；地图不带（Modrinth 无 maps 类型）
  const facetType = rawType && rawType !== "map" ? rawType : "";

  // 构造 Modrinth 查询参数
  const params = new URLSearchParams();
  if (q) params.set("query", q);
  params.set("limit", String(limit));
  params.set("offset", String(offset));
  params.set("index", "downloads");
  if (facetType) {
    params.set("facets", JSON.stringify([["project_type:" + facetType]]));
  }
  if (version) {
    // 版本过滤：Modrinth 用 versions 查询（允许多个用 ; 分隔）
    params.set("versions", `["${version}"]`);
  }

  const headers: Record<string, string> = {
    "User-Agent": "PCLPartner/0.1 (resource-navigation)",
    Accept: "application/json",
  };
  // Modrinth 建议使用 API Key（可空字符串）提高速率限制并在生产标识来源
  if (process.env.MODRINTH_API_KEY) {
    headers["Authorization"] = process.env.MODRINTH_API_KEY;
  }

  try {
    const res = await fetch(`https://api.modrinth.com/v2/search?${params.toString()}`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Modrinth 返回 ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const hits = (Array.isArray(data.hits) ? data.hits : []).map((h: any) => ({
      slug: h.slug,
      title: h.title,
      description: h.description || "",
      icon: h.icon_url || "",
      downloads: h.downloads || 0,
      follows: h.follows || 0,
      categories: h.categories || [],
      loader: (h.categories || []).find((c: string) =>
        ["forge", "fabric", "neoforge", "quilt"].includes(c)
      ),
      latestVersion: h.versions?.[0] || h.versions?.slice(-1)[0] || "",
      // map 类型无 Modrinth 对应 type，链接统一指向该资源的 mod 页
      url: `https://modrinth.com/${facetType || "mod"}/${h.slug}`,
    }));

    return NextResponse.json({
      hits,
      totalHits: data.total_hits ?? 0,
      limit,
      page,
      offset,
    });
  } catch (err: any) {
    console.error("Modrinth 搜索失败:", err);
    return NextResponse.json(
      { error: err.message || "获取 Modrinth 资源失败" },
      { status: 500 }
    );
  }
}