import { createServerSupabase, getUser } from "@/lib/supabase-server";
import PostCard from "@/components/PostCard";
import SectionHeading from "@/components/ui/SectionHeading";
import GradientButton from "@/components/ui/GradientButton";
import BoostButton from "@/components/BoostButton";
import Link from "next/link";

export const metadata = { title: "我的帖子 | PCL找搭子" };

export default async function MyPostsPage() {
  const user = await getUser();
  const supabase = await createServerSupabase();

  let posts: any[] = [];
  let boostedPostIds = new Set<string>();

  if (user) {
    const { data } = await supabase
      .from("posts")
      .select("*, profiles!posts_user_id_fkey(nickname, avatar_url, is_vip, vip_expires_at)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    posts = data || [];

    const { data: boosts } = await supabase
      .from("post_boosts")
      .select("post_id")
      .gt("expires_at", new Date().toISOString());
    boostedPostIds = new Set(boosts?.map((b: any) => b.post_id) || []);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <SectionHeading
        icon="📁"
        title="我的帖子"
        subtitle="管理你发布的所有找搭子邀约"
      />

      {!user ? (
        <div className="card p-12 text-center">
          <p className="text-5xl mb-4">🔒</p>
          <p className="text-gray-400 mb-4">登录后即可管理你的帖子</p>
          <div className="flex justify-center">
            <GradientButton href="/auth/login">去登录</GradientButton>
          </div>
        </div>
      ) : (
        <>
          {posts.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-gray-400 mb-4">你还没有发布过帖子</p>
              <div className="flex justify-center">
                <GradientButton href="/posts/new">发布第一篇帖子</GradientButton>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400">共 {posts.length} 条帖子</p>
                <Link
                  href="/posts/new"
                  className="text-xs text-indigo-500 hover:text-indigo-600 font-medium"
                >
                  ✚ 发新帖子
                </Link>
              </div>
              <div className="space-y-3">
                {posts.map((post: any) => (
                  <div key={post.id}>
                    <PostCard post={post} isBoosted={boostedPostIds.has(post.id)} />
                    <div className="flex items-center justify-end gap-3 px-2 mt-2">
                      <BoostButton
                        postId={post.id}
                        userId={user.id}
                        isBoosted={boostedPostIds.has(post.id)}
                      />
                      <Link
                        href={`/posts/${post.id}/edit`}
                        className="text-xs text-indigo-500 hover:text-indigo-600"
                      >
                        ✏️ 编辑
                      </Link>
                      <Link
                        href={`/posts/${post.id}`}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        👁️ 查看
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}