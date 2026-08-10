import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import GradientButton from "@/components/ui/GradientButton";

const FEATURES = [
  {
    icon: "🔍",
    title: "精准搜搭子",
    desc: "按游戏名称、标题、热门标签快速筛选，秒级定位到你的联机搭子。",
  },
  {
    icon: "📝",
    title: "轻松发帖",
    desc: "选游戏、填人数、写要求，一键发布，全网玩家实时可见。",
  },
  {
    icon: "💬",
    title: "留言互动",
    desc: "在帖子下留言交流，敲定开黑时间，还能实时收到回复通知。",
  },
  {
    icon: "👑",
    title: "会员特权",
    desc: "开通VIP获得专属标识与优先展示，让你的帖子更容易被看到。",
  },
  {
    icon: "📌",
    title: "帖子置顶",
    desc: "付费置顶，让你的邀约固定在首页最显眼的位置。",
  },
  {
    icon: "❤️",
    title: "收藏关注",
    desc: "收藏感兴趣的帖子、关注合拍的玩家，随时跟进最新动态。",
  },
];

export const metadata = { title: "关于我们 | PCL找搭子" };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SectionHeading
        icon="🎮"
        title="关于 PCL找搭子"
        subtitle="一个专为端游联机玩家打造的开黑搭子平台"
      />

      <Reveal>
        <div className="card p-8 mb-10 text-center">
          <p className="text-2xl mb-4">🏆</p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto">
            PCL找搭子旨在解决端游玩家"想玩却没人一起"的痛点。
            无论你是想找个稳定的生存队友、一起上分的双排搭子，
            还是周末开黑的整支车队，这里都能帮你快速匹配到志同道合的伙伴。
          </p>
        </div>
      </Reveal>

      <SectionHeading icon="✨" title="平台特色" subtitle="我们为玩家准备了这些" />

      <div className="grid sm:grid-cols-2 gap-4">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 60}>
            <div className="card card-hover p-5 h-full">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12 text-center">
        <p className="text-gray-400 mb-4">加入我们，一起开黑畅玩</p>
        <div className="flex justify-center gap-3">
          <GradientButton href="/posts/new">立即发帖</GradientButton>
          <GradientButton href="/" variant="ghost">返回首页</GradientButton>
        </div>
      </Reveal>
    </div>
  );
}