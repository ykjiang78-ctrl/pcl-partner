import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ResourceCard from "@/components/ResourceCard";
import ResourceExplorer from "@/components/ResourceExplorer";
import { RESOURCE_CATEGORIES, RESOURCES } from "@/lib/mc-resources";

export const metadata = {
  title: "MC资源下载导航 | PCL找搭子",
  description:
    "我的世界模组、整合包、材质包、地图、光影、数据包聚合导航，搜索筛选，一键跳转 Modrinth、CurseForge、MC百科、苦力怕论坛下载。",
};

export default function ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <SectionHeading
        icon="🎒"
        title="Minecraft 资源导航"
        subtitle="模组 · 整合包 · 材质包 · 地图 · 光影 · 数据包 —— 支持搜索筛选，全部跳转原站下载"
      />

      {/* 来源站说明 */}
      <div className="mb-10">
        <SectionHeading
          icon="🌐"
          title="资源来自这些站点"
          subtitle="文件由原站托管分发，安全稳定，本站仅提供导航跳转"
          align="left"
        />
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: "🟣", name: "Modrinth", desc: "现代开源模组站，支持 Fabric / NeoForge，直链文件" },
            { icon: "🔥", name: "CurseForge", desc: "全球最大模组库，JEI / RLCraft 等几乎所有模组的源头" },
            { icon: "📖", name: "MC百科", desc: "最大中文 MOD 百科，附带下载入口与教程" },
            { icon: "👾", name: "苦力怕论坛 KLPBBS", desc: "中文社区下载主站，整合包与地图海量资源" },
          ].map((s, i) => (
            <Reveal key={s.name} delay={i * 40}>
              <div className="card p-4 flex items-start gap-3">
                <div className="text-2xl">{s.icon}</div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{s.name}</div>
                  <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* 交互区：搜索 / 筛选 / 原站直链 / Modrinth 动态页 */}
      <ResourceExplorer categories={RESOURCE_CATEGORIES} curated={RESOURCES} />
    </div>
  );
}