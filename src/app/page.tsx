import { createServerSupabase, getUser } from "@/lib/supabase-server";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";
import GameTags from "@/components/GameTags";
import SortOptions from "@/components/SortOptions";
import LoadMoreButton from "@/components/LoadMoreButton";
import LandingHero from "@/components/LandingHero";
import AnnouncementBanner from "@/components/ui/AnnouncementBanner";
import StatCard from "@/components/ui/StatCard";
import SectionHeading from "@/components/ui/SectionHeading";
import GameCard from "@/components/ui/GameCard";

const PAGE_SIZE = 10;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; game?: string; sort?: string; page?: string }>;
}) {
  const user = await getUser();
  const { q, game, sort, page } = await searchParams;
  const currentPage = parseInt(page || "1");

  const supabase = await createServerSupabase();

  const ascending = sort === "oldest";

  // 获取总数
  let countQuery = supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  if (q) {
    countQuery = countQuery.or(`game.ilike.%${q.replace(/[%_\\]/g, "\\$&")}%,title.ilike.%${q.replace(/[%_\\]/g, "\\$&")}%`);
  }
  if (game) {
    countQuery = countQuery.ilike("game", `%${game.replace(/[%_\\]/g, "\\$&")}%`);
  }
  const { count } = await countQuery;

  let query = supabase
    .from("posts")
    .select("*, profiles!posts_user_id_fkey(nickname, avatar_url, is_vip, vip_expires_at), post_likes:post_likes!post_id(count)")
    .order("created_at", { ascending })
    .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);

  if (q) {
    query = query.or(`game.ilike.%${q.replace(/[%_\\]/g, "\\$&")}%,title.ilike.%${q.replace(/[%_\\]/g, "\\$&")}%`);
  }

  if (game) {
    query = query.ilike("game", `%${game.replace(/[%_\\]/g, "\\$&")}%`);
  }

  const { data: posts } = await query;

  // 获取活跃置顶
  const { data: activeBoosts } = await supabase
    .from("post_boosts")
    .select("post_id, created_at")
    .gt("expires_at", new Date().toISOString());

  const boostedPostIds = new Set(activeBoosts?.map((b: any) => b.post_id) || []);

  // 排序：置顶帖优先，然后按时间
  const sortedPosts = (posts || []).sort((a: any, b: any) => {
    const aBoosted = boostedPostIds.has(a.id);
    const bBoosted = boostedPostIds.has(b.id);
    if (aBoosted !== bBoosted) return aBoosted ? -1 : 1;
    if (ascending) {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // 获取热门游戏标签
  const { data: gameStats } = await supabase
    .from("posts")
    .select("game")
    .order("created_at", { ascending: false });

  // 统计游戏出现次数
  const gameCount: Record<string, number> = {};
  gameStats?.forEach((p: any) => {
    if (p.game) {
      gameCount[p.game] = (gameCount[p.game] || 0) + 1;
    }
  });
  const topGames = Object.entries(gameCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name]) => name);

  const currentSort = sort === "oldest" ? "oldest" : "newest";
  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 0;

  // 统计数据
  let totalUsers = 0;
  try {
    const { count: userCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
    totalUsers = userCount ?? 0;
  } catch {
    totalUsers = 0;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* 首页首屏 */}
      <LandingHero topGames={topGames} postCount={count || 0} />

      {/* 数据统计 */}
      <section className="mt-6">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard icon="🎮" label="合作邀约" value={count || 0} gradient="from-indigo-500 to-purple-500" />
          <StatCard icon="👥" label="注册玩家" value={totalUsers} gradient="from-purple-500 to-fuchsia-500" delay={80} />
          <StatCard icon="🎯" label="热门游戏" value={topGames.length || 0} gradient="from-violet-500 to-pink-500" delay={160} />
        </div>
      </section>

      {/* 公告 */}
      <div className="mt-6">
        <AnnouncementBanner />
      </div>

      {/* 热门游戏展示 */}
      {topGames.length > 0 && (
        <section className="mt-10">
          <SectionHeading icon="🔥" title="热门游戏" subtitle="大家都在找的搭子游戏" />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {topGames.slice(0, 6).map((g, i) => (
              <GameCard key={g} game={g} count={gameCount[g]} />
            ))}
          </div>
        </section>
      )}

      {/* 浏览帖子 */}
      <section id="browse" className="mt-10 scroll-mt-20">
        <SectionHeading icon="💬" title="找搭子专区" subtitle="发布或浏览最新的联机邀约" align="left" />

        <SearchBar initialQuery={q || ""} />

        <div className="mt-3">
          <GameTags games={topGames} selectedGame={game || null} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {count || 0} 条帖子
          </p>
          <SortOptions currentSort={currentSort} />
        </div>

        <div className="mt-4 space-y-3">
          {!sortedPosts || sortedPosts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-5xl mb-4">📭</p>
              <p>{q || game ? "没有找到匹配的帖子" : "还没有帖子"}</p>
              {user ? (
                <a href="/posts/new" className="text-indigo-500 hover:text-indigo-600 underline mt-2 inline-block">
                  去发布第一个帖子 →
                </a>
              ) : (
                <a href="/auth/login" className="text-indigo-500 hover:text-indigo-600 underline mt-2 inline-block">
                  登录后发帖
                </a>
              )}
            </div>
          ) : (
            sortedPosts.map((post: any) => {
              const likeCount = Array.isArray(post.post_likes)
                ? post.post_likes[0]?.count ?? 0
                : 0;
              return (
                <PostCard
                  key={post.id}
                  post={{ ...post, like_count: likeCount }}
                  isBoosted={boostedPostIds.has(post.id)}
                />
              );
            })
          )}
        </div>

        {totalPages > 1 && (
          <LoadMoreButton
            currentPage={currentPage}
            totalPages={totalPages}
            q={q || null}
            game={game || null}
            sort={sort || null}
          />
        )}
      </section>

      {/* 底部 CTA */}
      <section className="mt-12 mb-4">
        <div className="card gradient p-8 text-center card-hover"
          style={{ backgroundImage: "linear-gradient(135deg, #6366f1, #8b5cf6 50%, #d946ef)" }}
        >
          <h2 className="text-2xl font-bold text-white">还没找到开黑的 TA 吗？</h2>
          <p className="text-white/80 mt-2 text-sm">
            发一条找搭子帖子，全网玩家都能看到，快来看看有没有你的菜
          </p>
          <div className="mt-5">
            <a href="/posts/new" className="btn bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-all">
              ✨ 免费发帖找搭子
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
