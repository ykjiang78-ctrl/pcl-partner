// PCL找搭子 · Minecraft 资源导航数据
//
// 说明：本页面是「资源聚合导航」，不含任何自托管文件。每个条目携带指向
// Modrinth / CurseForge / MC百科 / 苦力怕论坛(KLPBBS) 等站点的下载链接，
// 由原站负责文件分发与带宽。链接均经手工核实（2026-08）。

export type ResourceCategory = "mod" | "modpack" | "map" | "shader" | "resourcepack" | "datapack";

export interface ResourceLink {
  /** 站点名，如 Modrinth / MC百科 / KLPBBS */
  label: string;
  /** 直链地址 */
  url: string;
  /** 该站的说明 */
  note?: string;
}

export interface McResource {
  id: string;
  name: string;
  category: ResourceCategory;
  /** 一句话介绍 */
  desc: string;
  /** 适用版本，如 "1.20.x" */
  versions: string;
  /** 加载器，如 Fabric / Forge / NeoForge */
  loader?: string;
  /** 图标 emoji */
  icon: string;
  /** 是否「热门前排」 */
  featured?: boolean;
  /** 下载直达（通常 1~2 个） */
  links: ResourceLink[];
}

export interface ResourceCategoryDef {
  key: ResourceCategory;
  label: string;
  icon: string;
  desc: string;
  /** 原站浏览/搜索入口 */
  browse: { label: string; url: string }[];
}

export const RESOURCE_CATEGORIES: ResourceCategoryDef[] = [
  {
    key: "mod",
    label: "模组 Mod",
    icon: "🧩",
    desc: "为原版增添玩法、科技、魔法、冒险等内容的模组。",
    browse: [
      { label: "Modrinth", url: "https://modrinth.com/mods" },
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/mc-mods" },
      { label: "MC百科", url: "https://www.mcmod.cn/modlist.html" },
      { label: "KLPBBS", url: "https://klpbbs.com/forum-140-1.html" },
    ],
  },
  {
    key: "modpack",
    label: "整合包 Modpack",
    icon: "📦",
    desc: "把多个模组打包好，一键开玩的一体化整合包。",
    browse: [
      { label: "Modrinth", url: "https://modrinth.com/modpacks" },
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/modpacks" },
      { label: "MC百科", url: "https://www.mcmod.cn/modpack.html" },
      { label: "KLPBBS", url: "https://klpbbs.com/forum-48-1.html" },
    ],
  },
  {
    key: "resourcepack",
    label: "材质包",
    icon: "🎨",
    desc: "改变游戏贴图与UI，呈现不同风格世界的材质包。",
    browse: [
      { label: "Modrinth", url: "https://modrinth.com/resourcepacks" },
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/texture-packs" },
      { label: "KLPBBS", url: "https://klpbbs.com/forum-141-1.html" },
    ],
  },
  {
    key: "map",
    label: "地图 Map",
    icon: "🗺️",
    desc: "解谜、跑酷、空岛、RPG、建筑等玩家制作的世界地图。",
    browse: [
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/worlds" },
      { label: "KLPBBS", url: "https://klpbbs.com/forum-139-1.html" },
    ],
  },
  {
    key: "shader",
    label: "光影 Shader",
    icon: "✨",
    desc: "开启逼真光影、体积光与水面反射的渲染着色器。",
    browse: [
      { label: "Modrinth", url: "https://modrinth.com/shaders" },
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/shaders" },
    ],
  },
  {
    key: "datapack",
    label: "数据包",
    icon: "🧠",
    desc: "不动模组即可改变玩法逻辑的数据包 / 指令包。",
    browse: [
      { label: "Modrinth", url: "https://modrinth.com/datapacks" },
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/data-packs" },
      { label: "MC百科", url: "https://www.mcmod.cn/modlist.html" },
    ],
  },
];

// 站名 -> 站点元信息（用于链上品牌化显示）
export const SOURCE_INFO: Record<string, { name: string; icon: string }> = {
  Modrinth: { name: "Modrinth", icon: "🟣" },
  CurseForge: { name: "CurseForge", icon: "🔥" },
  "MC百科": { name: "MC百科", icon: "📖" },
  KLPBBS: { name: "苦力怕论坛", icon: "👾" },
  蓝奏云: { name: "蓝奏云", icon: "💾" },
  官网: { name: "官网", icon: "🌐" },
};

export const RESOURCES: McResource[] = [
  // ========== 模组 ==========
  {
    id: "sodium",
    name: "Sodium",
    category: "mod",
    desc: "新一代优化模组，大幅提升帧率、降低卡顿与内存占用，几乎是必装的性能核心。",
    versions: "1.16~1.21",
    loader: "Fabric / NeoForge",
    icon: "⚡",
    featured: true,
    links: [
      { label: "Modrinth", url: "https://modrinth.com/mod/sodium" },
      { label: "MC百科", url: "https://www.mcmod.cn/class/4551.html" },
    ],
  },
  {
    id: "jei",
    name: "JEI 物品管理器",
    category: "mod",
    desc: "Just Enough Items，把鼠标放到物品上即可查看全部配方与合成，合成表查找神器。",
    versions: "1.8 - 1.21",
    loader: "Forge / Fabric / NeoForge",
    icon: "🧰",
    featured: true,
    links: [
      { label: "Modrinth", url: "https://modrinth.com/mod/jei" },
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/mc-mods/jei" },
      { label: "MC百科", url: "https://www.mcmod.cn/class/459.html" },
    ],
  },
  {
    id: "ice-and-fire",
    name: "冰与火之歌",
    category: "mod",
    desc: "加入龙、独角兽、九头蛇等神话生物与史诗级盔甲神器，打造奇幻冒险世界。",
    versions: "1.16 - 1.21",
    loader: "Forge / NeoForge",
    icon: "🐉",
    featured: true,
    links: [
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/mc-mods/ice-and-fire-dragons" },
      { label: "MC百科", url: "https://www.mcmod.cn/class/683.html" },
    ],
  },
  {
    id: "create",
    name: "机械动力 Create",
    category: "mod",
    desc: "用齿轮与传动装置搭建自动化的机械工厂，红石自动化与造景联动的经典模组。",
    versions: "1.16 - 1.21",
    loader: "Forge / Fabric / NeoForge",
    icon: "⚙️",
    featured: true,
    links: [
      { label: "Modrinth", url: "https://modrinth.com/mod/create" },
      { label: "MC百科", url: "https://www.mcmod.cn/class/2021.html" },
    ],
  },
  {
    id: "tinkers",
    name: "匠魂 Tinkers' Construct",
    category: "mod",
    desc: "自定义打造专属工具与武器，铸造台铸造任意形态的神器装备。",
    versions: "1.7 - 1.20",
    loader: "Forge",
    icon: "🔨",
    links: [
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/mc-mods/tinkers-construct" },
      { label: "MC百科", url: "https://www.mcmod.cn/class/287.html" },
    ],
  },
  {
    id: "the-twilight-forest",
    name: "暮色森林",
    category: "mod",
    desc: "前往永恒的暮色维度，探索蘑菇森林、终极要塞与九头蛇巢穴。",
    versions: "1.16 - 1.21",
    loader: "Forge / NeoForge",
    icon: "🌲",
    links: [
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/mc-mods/the-twilight-forest" },
      { label: "MC百科", url: "https://www.mcmod.cn/class/1907.html" },
    ],
  },
  {
    id: "spark",
    name: "Spark",
    category: "mod",
    desc: "开盒性能分析工具，定位卡顿与内存占用瓶颈，多人生存推荐。",
    versions: "1.8 - 1.21",
    loader: "Fabric / Forge",
    icon: "📊",
    links: [
      { label: "Modrinth", url: "https://modrinth.com/mod/spark" },
      { label: "MC百科", url: "https://www.mcmod.cn/class/4628.html" },
    ],
  },
  {
    id: "journeymap",
    name: "旅行地图 JourneyMap",
    category: "mod",
    desc: "小地图与全球正投影地图，坐标标记、航点导航，联机探图必备。",
    versions: "1.8 - 1.21",
    loader: "Forge / Fabric / NeoForge",
    icon: "🧭",
    links: [
      { label: "Modrinth", url: "https://modrinth.com/mod/journeymap" },
      { label: "MC百科", url: "https://www.mcmod.cn/class/458.html" },
    ],
  },

  // ========== 整合包 ==========
  {
    id: "all-the-mods",
    name: "All the Mods",
    category: "modpack",
    desc: "集齐上千个热门模组的全能整合包，玩到停不下来。",
    versions: "1.12 - 1.21",
    loader: "Forge / NeoForge",
    icon: "🔮",
    featured: true,
    links: [
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/modpacks/all-the-mods" },
      { label: "MC百科", url: "https://www.mcmod.cn/modpack.html" },
    ],
  },
  {
    id: "rlcraft",
    name: "RLCraft",
    category: "modpack",
    desc: "超高难度的生存整合，掉落、坐骑、龙与升级难度拉满。",
    versions: "1.12",
    loader: "Forge",
    icon: "🔥",
    links: [
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/modpacks/rlcraft" },
    ],
  },
  {
    id: "原版增强",
    name: "原版增强整合",
    category: "modpack",
    desc: "在不破坏原版的前提下，加入优化、材质与背包管理等轻量增强模组。",
    versions: "1.20+",
    loader: "Forge / Fabric",
    icon: "🏠",
    links: [
      { label: "KLPBBS", url: "https://klpbbs.com/forum-48-1.html" },
    ],
  },

  // ========== 材质包 ==========
  {
    id: "faithful",
    name: "Faithful 32x",
    category: "resourcepack",
    desc: "最经典的原版风格高清材质，像素感十足又清晰锐利。",
    versions: "1.8 - 1.21",
    loader: "—",
    icon: "🎨",
    featured: true,
    links: [
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/texture-packs/faithful-32x" },
    ],
  },
  {
    id: "realistico",
    name: "Realistico",
    category: "resourcepack",
    desc: "照片级质感、PBR 视差与真实光照的写实材质包。",
    versions: "1.16 - 1.20",
    loader: "—",
    icon: "🖌️",
    links: [
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/texture-packs/realistico" },
    ],
  },
  {
    id: "糙-材质",
    name: "粗糙像素风材质",
    category: "resourcepack",
    desc: "国产像素风材质，适合主播与复古系玩法。",
    versions: "1.12 - 1.21",
    loader: "—",
    icon: "🧱",
    links: [{ label: "KLPBBS", url: "https://klpbbs.com/forum-141-1.html" }],
  },

  // ========== 地图 ==========
  {
    id: "skyblock",
    name: "空岛生存地图",
    category: "map",
    desc: "小小的漂浮岛屿上白手起家，从方块一步步建起自己的天空城。",
    versions: "1.12 - 1.21",
    icon: "🏝️",
    featured: true,
    links: [{ label: "CurseForge", url: "https://www.curseforge.com/minecraft/worlds" }],
  },
  {
    id: "解谜逃生地图包",
    name: "解谜·逃生地图",
    category: "map",
    desc: "房间逃脱与机关谜题合集，适合和搭子一起烧脑合作。",
    versions: "1.16 - 1.21",
    loader: "—",
    icon: "🔐",
    links: [{ label: "KLPBBS", url: "https://klpbbs.com/forum-139-1.html" }],
  },
  {
    id: "跑酷地图",
    name: "跑酷合集地图",
    category: "map",
    desc: "难度递进的跑酷地图，检验手速与跳跃判断。",
    versions: "1.13 - 1.21",
    loader: "—",
    icon: "🏃",
    links: [
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/worlds" },
      { label: "KLPBBS", url: "https://klpbbs.com/forum-139-1.html" },
    ],
  },

  // ========== 光影 ==========
  {
    id: "complementary",
    name: "Complementary",
    category: "shader",
    desc: "画质与性能平衡的写实光影，温暖色彩深受 PCL 玩家喜爱。",
    versions: "1.16 - 1.21",
    loader: "Iris / OptiFine",
    icon: "☀️",
    featured: true,
    links: [
      { label: "Modrinth", url: "https://modrinth.com/shader/complementary-unbound" },
      { label: "MC百科", url: "https://www.mcmod.cn/class/4266.html" },
    ],
  },
  {
    id: "bsl",
    name: "BSL Shaders",
    category: "shader",
    desc: "经典光影，色彩浓郁、泛光自然，极致优化的大气层次。",
    versions: "1.8 - 1.21",
    loader: "OptiFine / Iris",
    icon: "🌅",
    links: [
      { label: "CurseForge", url: "https://www.curseforge.com/minecraft/shaders" },
    ],
  },
  {
    id: "seus",
    name: "SEUS 光影",
    category: "shader",
    desc: "业界标杆级写实光影，真实天空、体积雾与全局光照。",
    versions: "1.8 - 1.20",
    loader: "OptiFine / Iris",
    icon: "🌌",
    links: [{ label: "CurseForge", url: "https://www.curseforge.com/minecraft/shaders" }],
  },

  // ========== 数据包 ==========
  {
    id: "vanilla-tweaks",
    name: "Vanilla Tweaks",
    category: "datapack",
    desc: "官方原汁原味小改进，刺绣、矿石、木桶、背等微调工具合集。",
    versions: "1.16 - 1.21",
    loader: "—",
    icon: "🧰",
    links: [{ label: "官网", url: "https://vanillatweaks.net/picker/datapacks/" }],
  },
  {
    id: "datapack-整合",
    name: "数据包玩法合集",
    category: "datapack",
    desc: "无需模组即可新增合成配方、自定义生成与玩法逻辑的数据包集合。",
    versions: "1.18 - 1.21",
    loader: "—",
    icon: "📜",
    links: [{ label: "MC百科", url: "https://www.mcmod.cn/modlist.html" }],
  },
];

export function getCategoryLabel(key: ResourceCategory): string {
  return RESOURCE_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}