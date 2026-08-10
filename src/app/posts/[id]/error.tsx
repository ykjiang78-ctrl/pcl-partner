"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <p className="text-7xl mb-4">😵</p>
      <h1 className="text-2xl font-bold mb-3">帖子加载失败</h1>
      <p className="text-gray-400 mb-6 text-sm">{error.message || "发生了未知错误"}</p>
      <button
        onClick={reset}
        className="inline-block px-6 py-2.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
      >
        🔄 重试
      </button>
    </div>
  );
}
