import { PostListSkeleton } from "@/components/PostCardSkeleton";

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex gap-2 animate-pulse">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
        <div className="w-16 h-10 bg-indigo-200 rounded-lg" />
      </div>
      <div className="mt-6">
        <PostListSkeleton count={5} />
      </div>
    </div>
  );
}
