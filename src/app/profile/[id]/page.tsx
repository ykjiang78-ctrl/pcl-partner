import { createServerSupabase } from "@/lib/supabase-server";
import PostCard from "@/components/PostCard";
import { notFound } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles!posts_user_id_fkey(nickname, avatar_url)")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  const joinedDate = new Date(profile.created_at).toLocaleDateString("zh-CN");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full border-2 border-indigo-100" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl">👤</div>
          )}
          <div>
            <h1 className="text-xl font-bold">{profile.nickname || "匿名用户"}</h1>
            <p className="text-sm text-gray-400">加入于 {joinedDate}</p>
            {profile.bio && <p className="text-sm text-gray-500 mt-1">{profile.bio}</p>}
          </div>
        </div>
      </div>

      <h2 className="font-semibold text-gray-700 mb-3">
        发布的帖子 ({posts?.length || 0})
      </h2>

      <div className="space-y-3">
        {!posts || posts.length === 0 ? (
          <p className="text-sm text-gray-300 text-center py-8">还没有发过帖子</p>
        ) : (
          posts.map((post: any) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}