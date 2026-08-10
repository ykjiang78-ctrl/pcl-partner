import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import GradientButton from "@/components/ui/GradientButton";

const GUIDE = [
  {
    step: "01",
    icon: "👤",
    title: "注册登录",
    desc: "使用邮箱或手机号注册，也可以用 GitHub 一键登录，立刻拥有自己的账号。",
  },
  {
    step: "02",
    icon: "🔍",
    title: "搜索或浏览",
    desc: "在首页搜索游戏名称、浏览热门标签，或用内置筛选找到符合要求的帖子。",
  },
  {
    step: "03",
    icon: "📝",
    title: "发帖找搭子",
    desc: "填写游戏、人数、联系时段等信息，一键发布邀请，让全网玩家看到你。",
  },
  {
    step: "04",
    icon: "💬",
    title: "留言开黑",
    desc: "看到感兴趣的帖子就去留言，联系对方敲定时间，一起愉快开黑。",
  },
];

const FAQ = [
  {
    q: "如何联系发布者？",
    a: "在帖子详情页可以直接看到发布者留下的联系方式（QQ / 微信 / Discord 等），点击复制按钮即可。",
  },
  {
    q: "发帖收费吗？",
    a: "普通发帖完全免费。如果你希望帖子置顶展示，可以选择付费置顶服务。",
  },
  {
    q: "会员有什么好处？",
    a: "VIP 会员享有专属紫色标识、帖子优先展示、个人主页高亮等特权，让你的邀约更容易被看到。",
  },
  {
    q: "遇到不当内容怎么办？",
    a: "你可以点击帖子下方「举报」按钮提交举报，我们会在审核后及时处理。",
  },
  {
    q: "支持哪些登录方式？",
    a: "支持邮箱 + 密码登录、手机号验证码登录，以及 GitHub 第三方登录。",
  },
];

export const metadata = { title: "帮助中心 | PCL找搭子" };

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SectionHeading
        icon="🆘"
        title="帮助中心"
        subtitle="新手上路指南与常见问题"
      />

      {/* 使用指南 */}
      <SectionHeading icon="🧭" title="如何找搭子" subtitle="四步开启你的联机之旅" align="left" />

      <div className="space-y-3">
        {GUIDE.map((g, i) => (
          <Reveal key={g.title} delay={i * 50}>
            <div className="card p-5 flex items-start gap-4">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-2xl shadow-glow">
                {g.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="chip bg-indigo-100 text-indigo-600">第 {g.step} 步</span>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">{g.title}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{g.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <SectionHeading icon="❓" title="常见问题" align="left" />
        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 40}>
              <details className="card p-4 group">
                <summary className="cursor-pointer font-semibold text-gray-800 dark:text-gray-100 list-none flex items-center justify-between">
                  {f.q}
                  <span className="text-gray-400 transition-transform group-open:rotate-45">➕</span>
                </summary>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="mt-12 text-center">
        <p className="text-gray-400 mb-4">还有问题没解决？</p>
        <GradientButton href="/feedback">提交反馈</GradientButton>
      </Reveal>
    </div>
  );
}