import { createServerSupabase, getUser } from "@/lib/supabase-server";
import PostCard from "@/components/PostCard";
import ProfileEditForm from "@/components/ProfileEditForm";
import VipBadge from "@/components/VipBadge";
import VipPurchaseButton from "@/components/VipPurchaseButton";
import FollowButton from "@/components/FollowButton";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getUser();
  const supabase = await createServerSupabase();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles!posts_user_id_fkey(nickname, avatar_url, is_vip, vip_expires_at)")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  // 获取收藏的帖子
  let favoritePosts: any[] = [];
  if (currentUser?.id === id) {
    const { data: favs } = await supabase
      .from("favorites")
      .select("post_id, posts:posts(*, profiles!posts_user_id_fkey(nickname, avatar_url, is_vip, vip_expires_at))")
      .eq("user_id", id)
      .order("created_at", { ascending: false });
    favoritePosts = favs?.map((f: any) => f.posts).filter(Boolean) || [];
  }

  const joinedDate = new Date(profile.created_at).toLocaleDateString("zh-CN");
  const isOwnProfile = currentUser?.id === id;

  // 关注数据
  let followerCount = 0;
  let followingCount = 0;
  try {
    const { count: flCount } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", id);
    followerCount = flCount ?? 0;

    const { count: fgCount } = await supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", id);
    followingCount = fgCount ?? 0;
  } catch {
    // follows 表未创建时忽略
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="card card-hover p-6 mb-6">
        <div className="flex items-center gap-4">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full border-2 border-indigo-100 object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl text-white">👤</div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{profile.nickname || "匿名用户"}</h1>
              <VipBadge expiresAt={profile.vip_expires_at} showText />
            </div>
            <p className="text-sm text-gray-400">加入于 {joinedDate}</p>
            {profile.bio && <p className="text-sm text-gray-500 mt-1">{profile.bio}</p>}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span><strong className="text-gray-700 dark:text-gray-100">{followingCount}</strong> 关注</span>
              <span><strong className="text-gray-700 dark:text-gray-100">{followerCount}</strong> 粉丝</span>
            </div>
          </div>
          {(
            <FollowButton profileId={id} currentUserId={currentUser?.id} />
          )}
        </div>
      </div>

      {isOwnProfile && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">✏️ 编辑资料</h2>
            <VipPurchaseButton
              isVip={profile.is_vip || false}
              vipExpiresAt={profile.vip_expires_at || null}
            />
          </div>
          <ProfileEditForm userId={id} />
        </div>
      )}

      <h2 className="font-semibold text-gray-700 mb-3">
        发布的帖子 ({posts?.length || 0})
      </h2>

      <div className="space-y-3 mb-8">
        {!posts || posts.length === 0 ? (
          <p className="text-sm text-gray-300 text-center py-8">还没有发过帖子</p>
        ) : (
          posts.map((post: any) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {isOwnProfile && (
        <>
          <h2 className="font-semibold text-gray-700 mb-3">
            ❤️ 收藏的帖子 ({favoritePosts.length})
          </h2>
          <div className="space-y-3 mb-8">
            {favoritePosts.length === 0 ? (
              <p className="text-sm text-gray-300 text-center py-8">还没有收藏帖子</p>
            ) : (
              favoritePosts.map((post: any) => <PostCard key={post.id} post={post} />)
            )}
          </div>

          <div className="text-center">
            <Link
              href="/payment/orders"
              className="text-sm text-indigo-500 hover:text-indigo-600"
            >
              📋 查看订单记录 →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
