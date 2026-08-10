export default function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-full bg-gray-200" />
        <div className="w-16 h-3 rounded bg-gray-200" />
      </div>
      <div className="w-20 h-5 rounded-full bg-indigo-50 mb-2" />
      <div className="w-3/4 h-5 rounded bg-gray-200 mb-1" />
      <div className="w-full h-4 rounded bg-gray-100 mb-3" />
      <div className="flex items-center justify-between">
        <div className="w-16 h-3 rounded bg-gray-100" />
        <div className="w-20 h-3 rounded bg-gray-100" />
      </div>
    </div>
  );
}

export function PostListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
