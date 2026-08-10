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
      <h1 className="text-2xl font-bold mb-3">出错了</h1>
      <p className="text-gray-400 mb-6 text-sm">{error.message || "发生了未知错误"}</p>
      <button
        onClick={reset}
        className="btn btn-primary px-8 py-3 rounded-full"
      >
        🔄 重试
      </button>
    </div>
  );
}
