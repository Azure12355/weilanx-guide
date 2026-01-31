# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**蔚蓝空间栈 (Weilan Space Stack)** - 基于 VuePress 2 的编程知识库文档/博客网站，主要涵盖 Java、算法、计算机基础等内容。

- **在线地址**: https://guide.weilanx.com
- **GitHub**: azure12355/weilanx-guide
- **主题**: vuepress-theme-hope 2.0.0-rc.101
- **作者**: 蔚蓝Lynx

## 官方文档参考

项目包含完整的 VuePress 主题和插件官方文档（位于 `docs/` 目录），是配置和开发的重要参考：

- **主题文档**: `docs/theme/` - vuepress-theme-hope 主题完整文档
- **Markdown 增强**: `docs/md-enhance/` - Markdown 语法扩展
- **组件库**: `docs/components/` - 内置组件使用说明
- **灯箱插件**: `docs/lightgallery/` - 图片灯箱功能

## 目录结构

```
vuepress/
├── docs/                         # 官方文档目录
│   ├── components/               # vuepress-plugin-components 文档
│   ├── lightgallery/             # vuepress-plugin-lightgallery 文档
│   ├── md-enhance/               # vuepress-plugin-md-enhance 文档
│   └── theme/                    # vuepress-theme-hope 主题文档
├── vuepress-hope/                # 源码目录 (内容根目录)
│   ├── .vuepress/                # VuePress 配置
│   │   ├── config.ts            # 站点基础配置
│   │   ├── theme.ts             # 主题/插件配置
│   │   ├── navbar/              # 导航栏配置
│   │   │   └── index.ts         # 导航栏结构定义
│   │   ├── sidebar/             # 侧边栏配置
│   │   │   └── index.ts         # 侧边栏结构定义
│   │   ├── public/              # 静态资源 (图片、favicon)
│   │   │   └── icons/           # SVG 图标文件
│   │   └── styles/              # 自定义 SCSS 样式
│   ├── index.md                 # 首页
│   ├── langs/                   # 编程语言总览
│   │   ├── java/                # Java 相关
│   │   ├── python/              # Python 相关
│   │   ├── javascript/          # JavaScript 相关
│   │   ├── go/                  # Go 相关
│   │   ├── cpp/                 # C++ 相关
│   │   └── rust/                # Rust 相关
│   ├── java/                    # Java 攻城狮板块
│   ├── algo/                    # 算法 (占位)
│   └── 408/                     # 计算机基础 (占位)
└── package.json
```

## 常用命令

```bash
# 开发服务器 (带缓存)
pnpm dev

# 开发服务器 (清除缓存)
pnpm clean-dev

# 生产构建
pnpm build

# 更新 VuePress 包
pnpm update-package
```

## 关键架构说明

### 源码目录
- **内容位于 `vuepress-hope/`**，而非项目根目录
- **构建输出**: `vuepress-hope/.vuepress/dist/`

### 配置文件
- **config.ts**: 基础配置、bundler (Vite + SCSS)
- **theme.ts**: 主题设置、Markdown 扩展、插件配置
- **navbar/index.ts**: 顶部导航栏结构
- **sidebar/index.ts**: 左侧侧边栏导航

### 导航结构
内容按主要板块组织：
- **编程语言** (`/langs/`): Java、Python、JavaScript、Go、C++、Rust
- **Java攻城狮** (`/java/`): Java基础、进阶、JUC、JVM
- **剑指offer** (`/algo/`): LeetCode 刷题
- **计算机基础** (`/408/`): 数据结构、计组、操作系统、网络

### 图标系统
使用 Iconify，默认前缀 `fa6-solid:`。常用图标集：
- `ri:` (Remix Icon)
- `logos:` (各类 Logo)
- `devicon-plain:` (开发技术图标)
- `famicons:`, `streamline-sharp:`, `file-icons:`, `game-icons:`, `heroicons:`, `lsicon:` 等

格式示例：`icon: "ri:java-fill"` 或简写 `icon: "lightbulb"` (使用默认前缀)

## VuePress Theme Hope 功能

### Markdown 增强语法

#### 内容类
- **提示容器** (`::: tip`, `::: warning`, `::: danger`, `::: info`, `::: note`)
- **选项卡** (`<tabs>`, `<tab>`)
- **代码组** (`<code-tabs>`, `<code-tab>`)
- **脚注** (`[^text]` 定义，`[^text]` 引用）
- **任务列表** (`- [ ]` 任务，`- [x]` 完成)

#### 样式类
- **自定义对齐** (`::: center`, `::: right`, `::: left`)
- **自定义属性** (`{#id}`, `.class`)
- **标记** (`==text==`)
- **上下角标** (`H~2~O`, `X^2^`)
- **剧透** (`::: spoiler`)
- **GFM 警告** (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!IMPORTANT]`)

#### 代码类
- **代码演示** (`::: demo`)
- **Playground** (Vue/React/Sandpack)
- **代码组** (`<code-tabs>`)

#### 图表类
- **Chart.js** (`::: chart`)
- **Echarts** (`::: echarts`)
- **Flowchart** (`::: flowchart`)
- **Mermaid** (`::: mermaid`)
- **PlantUML** (`::: plantuml`)

#### 其他
- **数学公式** (KaTeX/MathJax，需额外配置)
- **Reveal.js** 幻灯片 (`::: revealjs`)
- **导入文件** (`<!-- @include: -->`)

### 内置组件

#### VPCard 卡片组件

用于展示项目、语言等卡片内容。

```markdown
<VPCard
  title="标题"
  desc="描述文字"
  logo="/icons/logo.svg"
  link="/path/to/page"
  background="rgba(253, 230, 138, 0.15)"
/>
```

**属性说明**：
- `title` (必填): 卡片标题
- `desc`: 卡片描述
- `logo`: 卡片图标（支持图片路径或 Iconify 图标名）
- `link`: 卡片链接
- `background`: 背景颜色（支持 CSS 变量自动适配暗黑模式）
- `color`: 字体颜色

**响应式卡片容器**：
```markdown
<div class="vp-card-container">
  <VPCard ... />
  <VPCard ... />
</div>
```

#### Badge 徽章组件

```markdown
<Badge type="tip">提示</Badge>
<Badge type="warning">警告</Badge>
<Badge type="danger">危险</Badge>
```

#### 其他组件
- `VPBanner`: 横幅组件
- `ArtPlayer`: 视频播放器
- `BiliBili`: B站视频嵌入
- `PDF`: PDF 预览
- `YouTube`: YouTube 视频嵌入

### Frontmatter 配置

```yaml
---
title: 页面标题
icon: 图标名称
order: 排序序号
category: 分类
tag: 标签
permalink: 自定义链接
description: 页面描述
---
```

### 内容组织
- 使用数字编号目录：`00-overview`, `01-syntax`, `03-array`
- Frontmatter 通常包含：`title`, `icon`
- 侧边栏支持 `"structure"` 自动从目录生成
- 使用 `prefix` 配置子目录前缀

## SCSS 配置
- 已屏蔽的警告：`legacy-js-api`, `if-function`, `import`
- `quietDeps: true` 忽略依赖包警告

## 已启用的 Markdown 扩展

align, attrs, codeTabs, component, demo, figure, gfm, imgLazyload, imgSize, include, mark, plantuml, spoiler, stylize, sub/sup, tabs, tasklist, vPre

## 部署

- GitHub Actions 在推送到 `main` 分支时自动部署到 `gh-pages` 分支
- 部署目录：`vuepress-hope/.vuepress/dist/`
- 内存配置：`NODE_OPTIONS=--max-old-space-size=8192`

## 官方文档快速参考

### 主题功能
- **博客功能**: 文章列表、时间线、文章信息
- **UI 组件**: 导航栏、侧边栏、面包屑、页脚
- **主题定制**: 暗黑模式、主题色、布局样式
- **高级功能**: 加密页面、访问统计、PWA、搜索、评论

### 插件功能
- **components**: 徽章、卡片、视频播放器、代码演示
- **md-enhance**: 图表、数学公式、选项卡、提示容器
- **lightgallery**: 图片灯箱查看（注意许可证要求）

查看 `docs/` 目录获取完整的官方文档和示例代码。
