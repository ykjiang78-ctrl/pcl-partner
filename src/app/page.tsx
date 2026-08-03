import { createServerSupabase, getUser } from "@/lib/supabase-server";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await getUser();
  const { q } = await searchParams;

  const supabase = await createServerSupabase();

  let query = supabase
    .from("posts")
    .select("*, profiles!posts_user_id_fkey(nickname, avatar_url)")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`game.ilike.%${q}%,title.ilike.%${q}%`);
  }

  const { data: posts } = await query;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <SearchBar initialQuery={q || ""} />

      <div className="mt-6 space-y-3">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📭</p>
            <p>还没有帖子</p>
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
          posts.map((post: any) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}