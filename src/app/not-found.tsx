import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <p className="text-7xl mb-4">🎮</p>
      <h1 className="text-3xl font-bold mb-3">404</h1>
      <p className="text-gray-400 mb-6">这个页面好像不存在，不如去找个搭子开黑吧！</p>
      <Link
        href="/"
        className="btn btn-primary px-8 py-3 rounded-full"
      >
        🏠 返回首页
      </Link>
    </div>
  );
}
