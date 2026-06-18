# 协作开发指南

> travel-planner 项目团队协作规范。最后更新：2026-06-18

---

## 协作模式概览

本项目通过 **GitHub + WorkBuddy AI 团队** 双轨协作：

| 层级 | 工具 | 用途 |
|------|------|------|
| **代码协作** | GitHub | 版本控制、PR Review、分支管理 |
| **AI 协作** | WorkBuddy Team | AI Agent 分角色执行任务（前端/测试/数据） |
| **任务管理** | WorkBuddy Tasks | 任务分配、进度追踪、依赖管理 |
| **知识沉淀** | `.workbuddy/memory/` | 项目经验、决策记录、问题排查手册 |

---

## 角色与权限

### 人类成员

| 角色 | 权限 | 职责 |
|------|------|------|
| **管理员 (Owner)** | 仓库设置、分支保护、Pages 配置 | 最终决策、部署审批 |
| **编辑者 (Write)** | push、创建 PR、合并 PR | 代码开发、内容编辑 |
| **查看者 (Read)** | 查看代码、提 Issue | 反馈建议、Bug 报告 |

### AI Agent（WorkBuddy 团队内）

| Agent | 角色 | 职责范围 |
|-------|------|----------|
| `fe-dev` | 前端开发 | HTML/CSS/JS 代码编写、地图集成、响应式适配 |
| `qa-tester` | 质量测试 | 跨浏览器/设备验证、瓦片加载检测、性能检查 |
| `poi-research` | 数据调研 | POI 信息收集、交通/住宿数据验证、图片素材 |

> AI Agent 由 WorkBuddy 的 Team 功能管理，人类成员通过 GitHub 协作。

---

## Git 工作流

### 分支策略

```
main          ← 生产分支，GitHub Pages 自动部署
  ├── feat/*  ← 功能分支（新目的地、新特性）
  ├── fix/*   ← 修复分支（Bug、瓦片、兼容性）
  └── docs/*  ← 文档分支
```

### 开发流程

```bash
# 1. 从 main 拉最新
git checkout main && git pull

# 2. 创建功能分支
git checkout -b feat/new-destination

# 3. 开发 + 提交
git add -A && git commit -m "feat: 新增XX目的地行程页"

# 4. 推送并创建 PR
git push -u origin feat/new-destination
# → 在 GitHub 创建 Pull Request

# 5. Code Review → 合并到 main → 自动部署
```

### Commit 规范

```
feat: 新增功能/目的地
fix: 修复 Bug
style: 样式调整
refactor: 代码重构
docs: 文档更新
```

---

## 冲突处理

### 代码冲突

1. **预防**：开发前 `git pull`，小步提交
2. **检测**：`git merge` 或 PR 页面自动提示
3. **解决**：
   - 配置文件（`main.js` PAGES 数组）：手动合并，保持按字母/区域排序
   - 行程 HTML：各自独立文件，基本不会冲突
   - 共享 CSS：通过设计 tokens 变量减少直接样式冲突

### 数据冲突

- POI 数据在同一个 HTML 文件内 → 建议不同目的地创建独立文件
- 共享配置（导航、页脚）→ 修改 `main.js` 前先沟通

---

## 版本历史与回滚

### 查看历史

```bash
git log --oneline -20          # 最近 20 条提交
git log -p destinations/xxx.html  # 查看某文件变更历史
```

### 回滚操作

```bash
# 回滚单个文件到某版本
git checkout <commit-hash> -- destinations/xxx.html

# 回滚整个仓库（谨慎）
git revert <commit-hash>

# GitHub 网页端：Commit 页面 → "Browse files" → 查看历史版本快照
```

GitHub 自动保留所有提交记录，无需额外配置。

---

## 任务分配机制

### 创建任务

在 WorkBuddy 对话中直接描述需求，AI 会自动：

1. 拆解为子任务（TaskCreate）
2. 分配角色 Agent
3. 追踪进度（TaskUpdate）

### 任务优先级

| 优先级 | 标签 | 示例 |
|--------|------|------|
| 🔴 P0 | 阻断性 | 地图不显示、部署失败 |
| 🟠 P1 | 重要 | 新目的地页面、响应式适配 |
| 🟡 P2 | 一般 | 文案优化、样式微调 |
| 🟢 P3 | 可选 | 动效增强、SEO |

---

## 沟通规范

### 在 WorkBuddy 中

- **@Agent 名称**：在对话中召唤特定 AI Agent
- **直接描述需求**：如"修复曼谷地图瓦片"、"新增巴厘岛行程"
- **附截图**：遇到渲染问题直接贴截图，提高诊断效率

### 在 GitHub 中

- **Issue**：Bug 报告、功能建议
- **PR Comment**：代码审查意见
- **PR Description**：说明改动内容和验证方法

---

## 新手入职 Checklist

- [ ] 克隆仓库 `git clone https://github.com/wuyuyang001-oss/travel-planner.git`
- [ ] 阅读 `DEPLOY.md` 了解本地预览方法
- [ ] 阅读 `.workbuddy/memory/MEMORY.md` 了解项目经验
- [ ] 了解目录结构和新增目的地流程
- [ ] 配置 Git 用户信息
- [ ] 确认 GitHub 仓库权限（联系管理员）
