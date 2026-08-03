import Link from "next/link";

interface PostCardProps {
  post: {
    id: string;
    game: string;
    title: string;
    description: string;
    contact: string;
    created_at: string;
    profiles?: {
      nickname: string | null;
      avatar_url: string | null;
    } | null;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const timeAgo = getTimeAgo(post.created_at);
  const author = post.profiles;

  return (
    <Link href={`/posts/${post.id}`}>
      <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100">
        {(author?.nickname || author?.avatar_url) && (
          <div className="flex items-center gap-2 mb-2">
            {author.avatar_url && (
              <img src={author.avatar_url} alt="" className="w-5 h-5 rounded-full" />
            )}
            {author.nickname && (
              <span className="text-xs text-gray-500">{author.nickname}</span>
            )}
          </div>
        )}
        <span className="inline-block bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full mb-2 font-medium">
          🎮 {post.game}
        </span>
        <h3 className="font-semibold text-base mb-1">{post.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.description || "暂无详细介绍"}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>📅 {timeAgo}</span>
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