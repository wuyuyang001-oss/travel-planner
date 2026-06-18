# HANDOFF.md — 新马泰旅游网站项目交接文档

> **给你的话**：我是上一轮对话的 Agent。读完这份文档，你就能无缝接手这个项目——所有核心代码、踩过的坑、架构决策、部署流程全部在这。项目已推送到 GitHub Pages 生产环境，真人协作走 GitHub PR 流程。

---

## 一、项目速览

| 项目 | 详情 |
|------|------|
| **仓库** | `wuyuyang001-oss/travel-planner` (public) |
| **线上地址** | https://wuyuyang001-oss.github.io/travel-planner/ |
| **本地路径** | `outputs/travel-site/` |
| **技术栈** | 纯静态 HTML/CSS/JS，Leaflet.js 地图，无构建工具 |
| **部署** | GitHub Pages，`git push` 后 30s 自动生效 |
| **设计风格** | Stripe 风 — 柔光渐变 `#635bff` 主色、大圆角 12px 卡片、系统字体栈 |
| **用户** | 小y，偏好简体中文，简洁直接，遇到问题会贴截图 |

## 二、目录结构与文件说明

```
travel-site/
├── index.html                           # 首页 — 目的地导航门户，2 张卡片（新马泰 + More Soon）
├── sitemap.html                         # 站点地图，列出所有已发布目的地
├── DEPLOY.md                            # 部署指南（GitHub Pages / Netlify / Vercel）
├── COLLABORATION.md                     # 真人协作规范（Git 工作流、角色权限、冲突处理）
├── HANDOFF.md                           # ← 你正在看的文件
├── css/style.css                        # 共享样式：设计 tokens、导航栏、页脚、首页卡片
├── js/main.js                           # 共享脚本：导航栏/页脚自动注入（data-page 属性驱动）
├── destinations/
│   └── singapore-malaysia-thailand.html # 新马泰 7 天行程（Leaflet 地图 + 35 POI）
└── assets/                              # 静态资源目录（预留，空）
```

### 关键文件架构原则

- **行程页 CSS/JS 内联**：每个 `destinations/xxx.html` 是自包含的叶子页面，不依赖外部 CSS/JS（除了 Leaflet CDN）
- **公共部分抽离**：导航栏、页脚、设计 tokens 在 `style.css` + `main.js`，通过 `data-page` 属性自动注入
- **全部相对路径**：兼容 `file://` 本地双击预览 和 `http://` 线上访问

## 三、新增目的地流程（5 步，1:1 照做）

```
1. 创建 destinations/xxx.html            ← 参考 singapore-malaysia-thailand.html 模板
2. 在 js/main.js PAGES 数组注册导航项      ← 格式: { path, title, flag }
3. 在 index.html 卡片网格添加卡片          ← 格式: <a class="dest-card"> 包裹
4. 在 sitemap.html 添加条目               ← 格式: <li><a>
5. git add -A && git commit -m "feat: ..." && git push
```

## 四、地图系统 — 最核心也是最容易出事的模块

### 4.1 为什么用 Leaflet 而不是腾讯地图

**结论：腾讯地图 API 不能用，Leaflet 是唯一选择。**

原因链：
- 试过腾讯地图 JSAPI GL → 完全不渲染
- Puppeteer 抓包发现腾讯 Key 返回 `oversea_map: { enable: 0 }` → 用户 Key 权限不支持海外瓦片
- 切 Leaflet 后一切正常

### 4.2 当前瓦片源配置（生产环境，不要改）

```javascript
// 多级回退，防国内 GFW 封锁
var TILE_PROVIDERS = [
  { url: 'https://server.arcgisonline.com/ArcGIS/.../tile/{z}/{y}/{x}', ... },  // ← 主源
  { url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', ... },        // ← 回退
  { url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', ... }                 // ← 最后回退
];
// tileerror 事件自动切下一个源
```

**关键注意事项**：
- ESRI URL 格式是 `{z}/{y}/{x}` (y 在前！)，OSM 是 `{z}/{x}/{y}`，千万别写反
- `tile.openstreetmap.org` 在国内手机网络被 GFW 封锁 → 所以 ESRI 是主源
- CartoDB (basemaps.cartocdn.com) 在曼谷区域覆盖不全 → 已弃用
- 不要删除回退链！国内不同运营商对不同 CDN 的可达性不一样

### 4.3 地图渲染故障修复全记录

| # | 症状 | 根因 | 修复 |
|---|------|------|------|
| 1 | 腾讯地图灰屏 | CSS flex 高度计算 | `position: absolute` 填满父容器 |
| 2 | localhost 正常，file:// 灰屏 | Key 域名白名单不匹配 | 启动 HTTP server |
| 3 | Leaflet 换上去还是灰屏 | overseas_map=0 | 彻底放弃腾讯，用 Leaflet |
| 4 | 曼谷区域灰色块 | CartoDB 覆盖不全 | 切 OSM 标准瓦片 |
| 5 | 手机上灰屏（第一轮） | flex column 下高度为 0 | `min-height:55%` + `flex:1 1 0` |
| 6 | 手机上灰屏（真正原因） | OSM 被 GFW 墙 | ESRI ArcGIS 做主源 |

### 4.4 手机端 CSS（复制即用，勿改）

```css
/* 桌面端 */
.map-panel { flex: 1; position: relative; overflow: hidden; min-height: 0; }
#mapContainer { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }

/* 手机端 ≤900px */
.main-layout { flex-direction: column; }
.timeline-panel { max-height: 45%; min-height: 0; }
.map-panel { flex: 1 1 0; min-height: 55%; }
```

### 4.5 手机端 JS（复制即用，勿改）

```javascript
// invalidateSize 分 5 次重试（延迟 200/400/400/400/400ms）
// window resize 防抖 250ms 后 invalidateSize
// window orientationchange 延迟 300ms 后 invalidateSize
// tileerror → 自动切下一个瓦片提供商
```

---

## 五、部署流程

```bash
cd outputs/travel-site
git status           # 确认改动
git add -A
git commit -m "feat: 描述你的改动"
git push             # → GitHub Pages 约 30s 自动部署
```

- 仓库通过 `gh repo create` 创建，Pages 通过 `gh api pages` 启用
- 不回滚操作：`git revert <hash>` 或 `git checkout <hash> -- <file>`
- 不要 force push，不要改 main 分支保护规则

---

## 六、真人协作指南

用户小y 想和朋友一起编辑 HTML。方案：走 GitHub 协作。

```
1. 小y 在 GitHub 仓库 Settings → Collaborators → Add people
2. 朋友接受邀请 → 获得 Write 权限
3. 朋友在 GitHub 网页端直接编辑 HTML → Commit → Create PR
4. 小y 在 PR 页面 Review → Merge → 自动部署
5. 有冲突？GitHub PR 页面点 "Resolve conflicts" 可视化解决
```

**不需要装任何软件**，全程浏览器操作。详见 `COLLABORATION.md`。

---

## 七、用户偏好速查

| 项目 | 设定 |
|------|------|
| 称呼 | 小y |
| 语言 | 简体中文 |
| 风格 | 简洁直接，不爱废话 |
| Python | 用 `python3` 而非 `python` |
| 调试 | 习惯贴截图，逐字段指导 |
| 当前关注 | 新马泰旅游网站 + 跨境电商早期调研 |
| 设计偏好 | Stripe 风格素雅渐变 |

---

## 八、本地工作区结构

```
/Users/wuyuyang/WorkBuddy/2026-06-17-17-00-48/
├── .workbuddy/
│   └── memory/
│       ├── 2026-06-18.md   ← 本日工作日志（appendix 格式）
│       └── MEMORY.md        ← 项目长期记忆（与本文档互补）
└── outputs/
    └── travel-site/         ← 项目根目录（即 git 仓库）
```

---

## 九、踩坑速查表

| 场景 | 错误操作 | 正确操作 |
|------|----------|----------|
| 地图不显示 | 怀疑 Leaflet 坏了 | 先查瓦片源是否可达（F12 Network） |
| 国内手机看不到 | 改 CSS | 先确认是不是瓦片被墙（换 ESRI 试） |
| 新增目的地后部署失败 | force push | 等 30s，Pages 有延迟 |
| 改 map-panel 高度 | 设固定 px | 用 `flex:1 1 0; min-height:55%` |
| 想改瓦片源 | 删掉回退链 | 加新源到数组前面，保留旧源做回退 |
| 用户说"看不到" | 直接改代码 | 先让用户贴截图，确认是灰屏/空白/报错哪一类 |

---

## 十、如果仍然卡住

1. **先读** `.workbuddy/memory/MEMORY.md` — 项目长期记忆
2. **再读** `.workbuddy/memory/2026-06-18.md` — 本日完整工作记录
3. **参考** `COLLABORATION.md` — 真人协作规范
4. **最后手段**：让用户重新描述需求，不要假设

---

_这份文档由上一轮对话 Agent 生成于 2026-06-18。你在读它的时候，说明交接成功。_
