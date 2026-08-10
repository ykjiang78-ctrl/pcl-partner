import Link from "next/link";
import VipBadge from "./VipBadge";

const PLATFORM_LABELS: Record<string, string> = {
  java: "Java版",
  bedrock: "基岩版",
  steam: "Steam",
  epic: "Epic",
  other: "其他",
};

interface PostCardProps {
  post: {
    id: string;
    game: string;
    title: string;
    description: string;
    contact: string;
    created_at: string;
    platform?: string | null;
    game_version?: string | null;
    max_players?: number | null;
    current_players?: number | null;
    expires_at?: string | null;
    like_count?: number | null;
    post_likes?: { user_id: string }[];
    profiles?: {
      nickname: string | null;
      avatar_url: string | null;
      is_vip?: boolean | null;
      vip_expires_at?: string | null;
    } | null;
  };
  isBoosted?: boolean;
}

export default function PostCard({ post, isBoosted }: PostCardProps) {
  const timeAgo = getTimeAgo(post.created_at);
  const author = post.profiles;
  const isExpired = post.expires_at && new Date(post.expires_at) < new Date();
  const likeCount = post.like_count ?? post.post_likes?.length ?? 0;

  return (
    <Link href={`/posts/${post.id}`}>
      <div className={`card card-hover p-5 border ${isBoosted ? "border-amber-200 bg-amber-50/30 dark:bg-amber-500/5" : ""} ${isExpired ? "opacity-60" : ""}`}>
        {(author?.nickname || author?.avatar_url) && (
          <div className="flex items-center gap-2 mb-2">
            {author.avatar_url && (
              <img src={author.avatar_url} alt="" className="w-5 h-5 rounded-full" />
            )}
            {author.nickname && (
              <span className="text-xs text-gray-500">{author.nickname}</span>
            )}
            <VipBadge expiresAt={author?.vip_expires_at} />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {isBoosted && (
            <span className="inline-block bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
              📌 置顶
            </span>
          )}
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full font-medium">
            🎮 {post.game}
          </span>
          {post.platform && (
            <span className="inline-block bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded-full">
              {PLATFORM_LABELS[post.platform] || post.platform}
            </span>
          )}
          {post.game_version && (
            <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
              v{post.game_version}
            </span>
          )}
          {isExpired && (
            <span className="inline-block bg-gray-200 text-gray-400 text-xs px-2 py-0.5 rounded-full">
              已过期
            </span>
          )}
        </div>
        <h3 className="font-semibold text-base mb-1">{post.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.description || "暂无详细介绍"}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span>📅 {timeAgo}</span>
            {likeCount > 0 && <span className="text-pink-500">👍 {likeCount}</span>}
            {post.max_players && (
              <span className="text-indigo-500">
                👥 {post.current_players || 0}/{post.max_players}
              </span>
            )}
          </div>
          <span className="text-indigo-500 font-medium">📞 {post.contact}</span>
        </div>
      </div>
    </Link>
  );
}

function getTimeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  if (diff < 60_000) return "刚刚";
  if (diff < 3_600_000) return Math.floor(diff / 60_000) + "分钟前";
  if (diff < 86_400_000) return Math.floor(diff / 3_600_000) + "小时前";
  return new Date(date).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}
