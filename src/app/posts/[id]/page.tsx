import { createServerSupabase, getUser } from "@/lib/supabase-server";
import PostDetailClient from "@/components/PostDetailClient";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();
  const { id } = await params;
  const supabase = await createServerSupabase();

  // 获取帖子
  const { data: post } = await supabase
    .from("posts")
    .select("*, profiles!posts_user_id_fkey(nickname, avatar_url)")
    .eq("id", id)
    .single();

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">
        <p className="text-5xl mb-4">🔍</p>
        <p>帖子不存在或已被删除</p>
        <a href="/" className="text-indigo-500 hover:text-indigo-600 underline mt-2 inline-block">
          返回首页
        </a>
      </div>
    );
  }

  // 获取留言
  const { data: replies } = await supabase
    .from("replies")
    .select("*, profiles!replies_user_id_fkey(nickname, avatar_url)")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  return (
    <PostDetailClient
      post={post}
      replies={replies || []}
      userId={user?.id || null}
    />
  );
}