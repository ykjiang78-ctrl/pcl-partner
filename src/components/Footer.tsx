import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-100 dark:border-gray-700/50 bg-white/70 dark:bg-[#181825]/70 backdrop-blur mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-200">PCL找搭子</p>
              <p className="text-xs text-gray-400">端游联机平台 · 找到一起开黑的那个TA</p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-400">
            <Link href="/resources" className="hover:text-indigo-500 transition">资源下载</Link>
            <Link href="/about" className="hover:text-indigo-500 transition">关于我们</Link>
            <Link href="/help" className="hover:text-indigo-500 transition">帮助中心</Link>
            <Link href="/terms" className="hover:text-indigo-500 transition">社区规范</Link>
            <Link href="/feedback" className="hover:text-indigo-500 transition">意见反馈</Link>
            <Link href="/vip" className="hover:text-indigo-500 transition">VIP会员</Link>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700/50 text-center text-xs text-gray-400">
          © {year} PCL找搭子 · 用心连接每一个热爱游戏的你
        </div>
      </div>
    </footer>
  );
}
