import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ResourceCard from "@/components/ResourceCard";
import {
  RESOURCE_CATEGORIES,
  RESOURCES,
  type ResourceCategory,
} from "@/lib/mc-resources";

export const metadata = {
  title: "MC资源下载导航 | PCL找搭子",
  description:
    "我的世界模组、整合包、材质包、地图、光影、数据包聚合导航，一键跳转 Modrinth、CurseForge、MC百科、苦力怕论坛下载。",
};

// 首页展示顺序；未列出的移到末尾
const CATEGORY_ORDER: ResourceCategory[] = [
  "mod",
  "modpack",
  "map",
  "shader",
  "resourcepack",
  "datapack",
];

const ORDER_INDEX = new Map(CATEGORY_ORDER.map((k, i) => [k, i]));

export default function ResourcesPage() {
  const orderedCategories = [...RESOURCE_CATEGORIES].sort(
    (a, b) => (ORDER_INDEX.get(a.key) ?? 99) - (ORDER_INDEX.get(b.key) ?? 99)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <SectionHeading
        icon="🎒"
        title="Minecraft 资源导航"
        subtitle="模组 · 整合包 · 材质包 · 地图 · 光影 · 数据包 —— 聚合中文与外站下载入口，全部跳转原站，免登录免下载"
      />

      {/* 分类浏览直达 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" id="categories">
        {CATEGORY_ORDER.map((key) => {
          const cat = RESOURCE_CATEGORIES.find((c) => c.key === key)!;
          const count = RESOURCES.filter((r) => r.category === key).length;
          return (
            <Reveal key={key} delay={0}>
              <a
                href={`#${key}`}
                className="card card-hover p-4 flex flex-col items-center text-center h-full"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {cat.label}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{count} 个精选</div>
              </a>
            </Reveal>
          );
        })}
      </div>

      {/* 资源来源站说明 */}
      <div className="mt-10">
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
                  <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    {s.name}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* 精选资源 */}
      <div className="mt-10">
      <SectionHeading
        icon="🎁"
        title="热门精选"
        subtitle="PCL 玩家最常用、最值得装的高质量资源"
      />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {RESOURCES.filter((r) => r.featured).map((r, i) => (
          <ResourceCard key={r.id} resource={r} index={i} />
        ))}
      </div>

      {/* 分类区块 */}
      <div className="mt-12 space-y-14">
        {orderedCategories.map((cat) => {
          const items = RESOURCES.filter((r) => r.category === cat.key);
          if (items.length === 0) return null;
          return (
            <section key={cat.key} id={cat.key} className="scroll-mt-20">
              <div className="flex flex-wrap items-end justify-between gap-3 mb-4 w-full">
                <SectionHeading
                  icon={cat.icon}
                  title={cat.label}
                  subtitle={cat.desc}
                  align="left"
                />
                <div className="flex flex-wrap gap-2 ml-auto shrink-0">
                  {cat.browse.map((b) => (
                    <a
                      key={b.label}
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-500 hover:text-indigo-600 border border-indigo-200 dark:border-indigo-500/40 px-3 py-1.5 rounded-full transition"
                    >
                      去 {b.label} 逛{cat.icon} ↗
                    </a>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {items.map((r, i) => (
                  <ResourceCard key={r.id} resource={r} index={i} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* 底部提示 */}
      <Reveal className="mt-12">
        <div className="card p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            本站仅做资源导航聚合，文件全部跳转到 Modrinth、CurseForge、MC百科、苦力怕论坛等原站下载。
            <br />
            使用 PCL2 / HMCL 等启动器时，可直接在启动器内置的「模组搜索」中按名称下载，体验更佳。
          </p>
        </div>
      </Reveal>
    </div>
  );
}