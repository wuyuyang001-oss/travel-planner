# TravelSite 部署指南

## 📦 项目结构

```
travel-site/
├── index.html                           # 首页 — 目的地导航门户
├── sitemap.html                         # 站点地图 — 所有页面索引
├── DEPLOY.md                            # 本文档
├── css/
│   └── style.css                        # 全局共享样式 (Stripe 风格)
├── js/
│   └── main.js                          # 全局共享脚本 (导航栏/页脚)
├── destinations/
│   └── singapore-malaysia-thailand.html # 新马泰行程规划页
└── assets/                              # 图片等静态资源 (按需添加)
```

## 🚀 部署方式

### 方式一：GitHub Pages（推荐 · 免费）

1. **创建 GitHub 仓库**
   ```bash
   cd travel-site
   git init
   git add .
   git commit -m "初始化：旅行规划静态站点"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/travel-site.git
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 打开仓库 → Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `main` / 目录: `/ (root)`
   - 点击 Save

3. **访问**
   ```
   https://<你的用户名>.github.io/travel-site/
   ```

4. **自定义域名（可选）**
   - Settings → Pages → Custom domain
   - 填入你的域名（如 `travel.example.com`）
   - 在 DNS 中添加 CNAME 记录指向 `<你的用户名>.github.io`

---

### 方式二：Netlify（推荐 · 免费 · 拖拽部署）

1. 将整个 `travel-site/` 文件夹**拖拽**到 [app.netlify.com/drop](https://app.netlify.com/drop)

2. 自动部署完成，获得 `https://xxx-xxx-xxx.netlify.app` 链接

3. 后续更新：重新拖拽文件夹，或连接 Git 仓库自动部署

---

### 方式三：Vercel（免费）

```bash
npm i -g vercel
cd travel-site
vercel
# 按提示登录，选择默认配置即可
```

---

### 方式四：CloudStudio（WorkBuddy 内置）

如果你的 WorkBuddy 连接了云研发环境，可以直接使用 `cloudstudio-deploy` skill 将 `travel-site/` 目录部署到云端。

---

## 🔧 技术说明

- **纯静态**：无需 Node.js、PHP 等服务端，所有页面为静态 HTML
- **零依赖**（运行时）：所有 CSS/JS 引用均使用相对路径，Leaflet 地图通过 CDN 按需加载
- **本地预览**：直接双击 `index.html` 即可在浏览器中打开（地图功能需通过 HTTP 服务预览）
- **跨平台**：所有路径使用正斜杠 `/`，Windows / macOS / Linux 均兼容

### 本地 HTTP 预览（地图功能需要）

```bash
cd travel-site
python3 -m http.server 8080
# 打开 http://localhost:8080
```

---

## ➕ 新增目的地

1. 在 `destinations/` 下创建新的 `xxx.html`
2. 在 `js/main.js` 的 `PAGES` 数组中注册导航项
3. 在 `index.html` 的目的地卡片网格中添加卡片
4. 在 `sitemap.html` 中添加页面列表项
5. 提交并推送 → 自动部署

---

## 📝 文件修改记录

| 日期 | 变更 |
|------|------|
| 2026-06-17 | 初始版本：首页、新马泰行程、站点地图 |
