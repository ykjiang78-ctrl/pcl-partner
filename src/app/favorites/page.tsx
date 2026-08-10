import { createServerSupabase, getUser } from "@/lib/supabase-server";
import PostCard from "@/components/PostCard";
import SectionHeading from "@/components/ui/SectionHeading";
import GradientButton from "@/components/ui/GradientButton";

export const metadata = { title: "我的收藏 | PCL找搭子" };

export default async function FavoritesPage() {
  const user = await getUser();
  const supabase = await createServerSupabase();

  let favoritePosts: any[] = [];

  if (user) {
    const { data: favs } = await supabase
      .from("favorites")
      .select("post_id, posts:posts(*, profiles!posts_user_id_fkey(nickname, avatar_url, is_vip, vip_expires_at))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    favoritePosts = favs?.map((f: any) => f.posts).filter(Boolean) || [];
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <SectionHeading
        icon="❤️"
        title="我的收藏"
        subtitle="你收藏过的每一份开黑邀约"
      />

      {!user ? (
        <div className="card p-12 text-center">
          <p className="text-5xl mb-4">🔒</p>
          <p className="text-gray-400 mb-4">登录后即可查看你的收藏</p>
          <div className="flex justify-center">
            <GradientButton href="/auth/login">去登录</GradientButton>
          </div>
        </div>
      ) : favoritePosts.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-5xl mb-4">🤍</p>
          <p className="text-gray-400 mb-4">还没有收藏任何帖子</p>
          <div className="flex justify-center">
            <GradientButton href="/">去逛逛</GradientButton>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">共 {favoritePosts.length} 条收藏</p>
          {favoritePosts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}