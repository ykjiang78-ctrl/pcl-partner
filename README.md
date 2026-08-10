# PCL找搭子 🎮

> 端游联机平台 — 找到一起开黑的那个TA

## 功能

- 🔍 **搜索筛选** — 按游戏名、标题搜索，热门游戏标签快速筛选
- 📝 **发帖找搭子** — 支持游戏平台、版本号、队伍人数、有效期
- 💬 **留言互动** — 帖子下方留言交流
- ❤️ **收藏帖子** — 收藏感兴趣的帖子，个人主页查看
- 🔔 **回复通知** — 实时通知有人回复你的帖子
- 📌 **帖子置顶** — 付费置顶帖子，优先展示（微信/支付宝）
- 👑 **VIP会员** — 专属标识，优先展示
- 👤 **个人资料** — 编辑昵称、上传头像、简介
- 📱 **手机号登录** — 支持邮箱和手机号验证码登录
- 🌙 **暗色模式** — 支持浅色/深色/跟随系统
- 📄 **分页浏览** — 帖子列表分页加载
- 🔗 **帖子分享** — 一键复制链接分享
- ⚠️ **举报功能** — 举报不当内容
- 🎒 **MC资源导航** — /resources 聚合 Modrinth / CurseForge / MC百科 / 苦力怕论坛下载入口，支持搜索、分类筛选、排序与 Modrinth 实时热门拉取

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth (邮箱 + 手机号 + GitHub OAuth)
- **支付**: 虎皮椒 (微信支付 + 支付宝)
- **存储**: Supabase Storage (头像上传)
- **样式**: Tailwind CSS v4
- **实时**: Supabase Realtime
- **部署**: Vercel

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 填入配置

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000 查看

## 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名 Key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务端密钥（webhook用） | ✅ |
| `XUNHUPAY_APP_ID` | 虎皮椒 AppID | ✅ |
| `XUNHUPAY_APP_SECRET` | 虎皮椒 AppSecret | ✅ |
| `XUNHUPAY_API_URL` | 虎皮椒 API 地址 | ❌ |
| `NEXT_PUBLIC_APP_URL` | 应用域名（回调URL用） | ✅ |
| `MODRINTH_API_KEY` | Modrinth 公开API Key（可选，用于提高限速并标识来源） | ❌ |

## 数据库初始化

在 Supabase SQL Editor 中执行 `supabase-init.sql` 文件，一键创建所有表、RLS 策略、Storage 配置和触发器。

包含的表：
- `profiles` — 用户资料
- `posts` — 帖子
- `replies` — 留言
- `favorites` — 收藏
- `reports` — 举报
- `orders` — 订单
- `post_boosts` — 置顶
- `user_memberships` — 会员

## 支付系统

### 付费功能

| 功能 | 价格 | 说明 |
|------|------|------|
| 帖子置顶1天 | ¥2.00 | 帖子排在首页最前 |
| 帖子置顶3天 | ¥5.00 | 帖子排在首页最前 |
| 帖子置顶7天 | ¥10.00 | 帖子排在首页最前 |
| 月度VIP | ¥15.00 | 专属标识+优先展示 |

### 支付流程

1. 用户选择功能 → 选择支付方式（微信/支付宝）
2. 创建订单 → 跳转虎皮椒支付页
3. 扫码支付 → 虎皮椒回调 webhook
4. 验签 → 更新订单 → 发货（置顶/开通VIP）
5. 用户跳回结果页 → 显示成功

### 安全

- Webhook 回调必须验签
- 订单金额服务端计算
- 幂等处理防止重复发货
- Service Role Key 仅服务端使用

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 部署
5. 在虎皮椒后台配置回调URL：`https://你的域名/api/payment/webhook`

## License

MIT
