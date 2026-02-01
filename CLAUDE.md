# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**蔚蓝空间栈 (Weilan Space Stack)** - 基于 VuePress 2 的编程知识库文档/博客网站，主要涵盖 Java、算法、计算机基础等内容。

- **在线地址**: https://spacex.weilanx.com
- **GitHub**: azure12355/weilanx-guide
- **主题**: vuepress-theme-hope 2.0.0-rc.101
- **作者**: 蔚蓝Lynx
- **部署平台**: 腾讯云 EdgeOne Pages

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
│   │   ├── dist/                # 构建输出 (不进入 git)
│   │   ├── .temp/               # 临时文件 (gitignore)
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
├── .edgeone/                    # EdgeOne Pages 配置
│   └── project.json             # 项目关联信息
├── deploy.sh                    # 部署脚本 (EdgeOne CLI)
├── edgeone.json                 # EdgeOne Pages 配置
├── package.json                 # 项目依赖
└── CLAUDE.md                    # 本文件
```

## 常用命令

```bash
# 开发服务器 (带缓存)
pnpm dev

# 开发服务器 (清除缓存)
pnpm clean-dev

# 生产构建
pnpm build

# 本地预览构建产物
pnpm serve

# 更新 VuePress 包
pnpm update-package

# 部署到 EdgeOne Pages (推荐)
pnpm deploy
```

## EdgeOne Pages 部署

### 部署方式

本项目使用 **EdgeOne CLI** 进行本地构建 + 直接上传部署。

### 快速部署

```bash
# 一键构建 + 部署
pnpm deploy
```

脚本会自动：
1. 清理旧的构建产物
2. 本地构建项目
3. 上传到 EdgeOne Pages

### 手动分步操作

```bash
# 1. 本地构建
pnpm build

# 2. 部署到 EdgeOne
edgeone pages deploy vuepress-hope/.vuepress/dist
```

### EdgeOne CLI 常用命令

```bash
# 登录 EdgeOne
edgeone login

# 查看当前登录信息
edgeone whoami

# 关联项目
edgeone pages link

# 部署
edgeone pages deploy [directory]
```

### 项目配置

- **项目名称**: spacex
- **项目 ID**: pages-hrd9zhqkxmye
- **部署类型**: Upload (直接上传)
- **环境**: Production

### 注意事项

1. **dist 不进入 git**: 构建产物不提交到仓库，减小仓库体积
2. **内存配置**: 构建时使用 `NODE_OPTIONS=--max-old-space-size=8192` (8GB)
3. **Node 版本**: 20.18.0

## 关键架构说明

### 源码目录
- **内容位于 `vuepress-hope/`**，而非项目根目录
- **构建输出**: `vuepress-hope/.vuepress/dist/`
- **dist 不进入 git**，使用 EdgeOne CLI 直接上传

### 配置文件
- **config.ts**: 基础配置、bundler (Vite + SCSS)
- **theme.ts**: 主题设置、Markdown 扩展、插件配置
- **navbar/index.ts**: 顶部导航栏结构
- **sidebar/index.ts**: 左侧侧边栏导航
- **edgeone.json**: EdgeOne Pages 部署配置

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

## Mermaid 图表注意事项

**重要**: Mermaid 语法使用方括号 `[]` 和括号 `()` 作为节点定义的特殊字符，在编写图表时需要特别注意。

### 节点形状语法

| 语法 | 节点形状 | 示例 |
|------|----------|------|
| `[text]` | 矩形 | `[节点]` |
| `[(text)]` | 圆角矩形（体育场形） | `[(节点)]` |
| `[[text]]` | 圆柱形 | `[[节点]]` |
| `{text}` | 菱形 | `{节点}` |
| `{{text}}` | 消息形状 | `{{节点}}` |

### 常见错误及解决方案

#### 错误 1: 节点标签中包含方括号

```mermaid
## ❌ 错误：String[] 会被误解析
C --> C4[String[] args: 参数]

## ✅ 正确：使用双引号包裹
C --> C4["String[] args: 参数"]

## ✅ 或使用中文描述
C --> C4["String数组 args: 参数"]
```

#### 错误 2: 节点标签中包含括号

```mermaid
## ❌ 错误：[(目标类型)] 会创建圆角矩形节点，后续内容无效
C --> C1[(目标类型) 值]

## ✅ 正确：使用双引号包裹
C --> C1["(目标类型) 值"]

## ✅ 或移除括号
C --> C1[目标类型 值]
```

#### 错误 3: 使用 HTML 标签换行

```mermaid
## ❌ 错误：<br/> 会导致语法错误
A[第一行<br/>第二行]

## ✅ 正确：使用空格或多个节点
A[第一行 第二行]
```

#### 错误 4: Timeline 中使用括号

```mermaid
## ❌ 错误：timeline 不支持括号
timeline
    title Java 发展历程
    1998 : JDK 1.2 (集合框架、JIT)

## ✅ 正确：移除括号
timeline
    title Java 发展历程
    1998 : JDK 1.2 集合框架 JIT
```

**Timeline 特殊限制**：
- 不支持使用括号 `()`
- 不支持使用方括号 `[]`
- 使用空格分隔多个项目
- 保持简洁，每行内容不要过长

#### 错误 5: 节点标签中包含引号

```mermaid
## ❌ 错误：引号导致解析错误
graph LR
    B --> B1[123 "Hello" true]

## ✅ 正确：使用双引号包裹或移除引号
graph LR
    B --> B1["整数123 字符串Hello 布尔值true"]
```

#### 错误 6: 节点标签中包含运算符

```mermaid
## ❌ 错误：|| 和 && 是 Mermaid 特殊字符
flowchart TD
    F[表达式1 || 表达式2] --> G{表达式1}
    A[表达式1 && 表达式2] --> B{表达式1}

## ✅ 正确：使用双引号包裹或中文描述
flowchart TD
    F["表达式1 或 表达式2"] --> G{表达式1}
    A["表达式1 与 表达式2"] --> B{表达式1}
```

### 最佳实践

1. **使用双引号包裹包含特殊字符的标签**
   ```mermaid
   A["包含特殊字符: <>()[]{}"]
   ```

2. **避免在 Mermaid 中使用 SVG 标签**
   - SVG 标签会导致 VuePress 编译错误
   - 应使用 Mermaid 自带的图表语法

3. **测试验证**
   - 修改后运行 `pnpm dev` 验证
   - 检查浏览器控制台是否有 Mermaid 错误
   - 确认图表正确渲染

### 已知错误案例

详细的错误记录和修复历史请参考项目根目录的 **[ERROR.md](/ERROR.md)** 文件。

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
