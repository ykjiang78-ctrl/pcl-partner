import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const TERMS = [
  {
    icon: "📜",
    title: "用户守则",
    items: [
      "请勿发布与他人在本平台无关的违法、违规内容。",
      "严禁发布诈骗、赌博、赌博相关、色情等不当信息。",
      "尊重其他玩家，不得进行骚扰、侮辱或恶意刷屏行为。",
      "请勿重复发布完全相同的帖子内容，以免影响社区秩序。",
    ],
  },
  {
    icon: "🤝",
    title: "关于找搭子",
    items: [
      "本平台仅提供信息发布与推荐服务，不参与玩家之间的实际交易或户外活动。",
      "请保护好你的个人信息，在与搭子交流过程中注意财产安全与人身安全。",
      "建议初次见面或线下约玩时选择公共场所，并告知亲友。",
    ],
  },
  {
    icon: "🛡️",
    title: "版权与内容",
    items: [
      "用户在平台上发布的内容（文字、图片等）版权归用户本人或相关权利人所有。",
      "平台有权删除违反规定的、不合适的或促进不良交流的内容。",
      "发现侵权内容或不当信息，可点击「举报」提交，我们将及时处理。",
    ],
  },
  {
    icon: "⚖️",
    title: "免责声明",
    items: [
      "本平台作为信息发布平台，不承担用户之间因交流、合作、交易等衍生的纠纷责任。",
      "未成年人请在监护人同意与陪同指导使用本平台及参与线上联机。",
      "平台服务如有调整，请以官网最新公告为准。",
    ],
  },
];

export const metadata = { title: "社区规范 | PCL找搭子" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SectionHeading
        icon="⚖️"
        title="社区规范"
        subtitle="共同维护一个友善、健康的找搭子社区"
      />

      <div className="space-y-5">
        {TERMS.map((sec, i) => (
          <Reveal key={sec.title} delay={i * 60}>
            <div className="card card-hover p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{sec.icon}</span>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {sec.title}
                </h2>
              </div>
              <ul className="space-y-2">
                {sec.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                  >
                    <span className="text-indigo-500 mt-0.5">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8 text-center text-xs text-gray-400">
        <p>感谢你选择 PCL找搭子，祝大家玩得开心！</p>
      </Reveal>
    </div>
  );
}