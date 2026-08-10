import { createServerSupabase, getUser } from "@/lib/supabase-server";
import PostEditForm from "@/components/PostEditForm";
import { notFound } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();
  const { id } = await params;

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-gray-400">
        <p className="text-5xl mb-4">🔒</p>
        <p>请先登录</p>
        <a href="/auth/login" className="text-indigo-500 hover:text-indigo-600 underline mt-2 inline-block">
          去登录 →
        </a>
      </div>
    );
  }

  const supabase = await createServerSupabase();
  const { data: post } = await supabase
    .from("posts")
    .select("id, user_id")
    .eq("id", id)
    .single();

  if (!post) notFound();

  if (post.user_id !== user.id) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-gray-400">
        <p className="text-5xl mb-4">🚫</p>
        <p>只能编辑自己的帖子</p>
        <a href="/" className="text-indigo-500 hover:text-indigo-600 underline mt-2 inline-block">
          返回首页 →
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">✏️ 编辑帖子</h1>
      <div className="card card-hover p-6">
        <PostEditForm postId={id} />
      </div>
    </div>
  );
}
