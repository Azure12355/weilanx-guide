---
home: true
icon: house
title: 首页
heroImage: /logo.svg
heroText: 蔚蓝空间栈 SpaceX
heroFullScreen: false
tagline: 沉淀深度思考，重构技术边界。专注于沉浸式编程学习，构建后端架构与全栈思维的知识体系。

# 标题下方按钮
actions:
  - text: 开启学习之旅
    link: /java/
    type: primary
  - text: 关于蔚蓝
    link: https://www.weilanx.com/about
    type: secondary

# Features 配置
features:
  - title: Java 后端核心
    icon: map
    details: 深入 JVM 字节码与 JUC 并发编程，剖析 Spring 全家桶源码，构建高可用的分布式微服务架构。
  
  - title: 架构设计思维
    icon: sitemap
    details: 从单体到云原生，探讨 DDD 领域驱动设计、高并发系统演进及中间件（Redis/MQ/ZK）的深度实践。
  
  - title: AI 与未来编程
    icon: brain
    details: 拥抱 AIGC 时代，实战 LLM 大模型应用开发、Prompt Engineering 及 Python 数据分析自动化。
  
  - title: 全栈开发视野
    icon: code
    details: 打通前后端壁垒，掌握 Vue3/React 现代前端技术，培养独立完成复杂系统的全栈工程能力。

copyright: false
footer: >
  Made with ❤️ by <a href="https://github.com/Azure12355" target="_blank">蔚蓝 Weilan</a> | 
  <a href="/about/">关于我</a>
footerHtml: true
---

<!-- 1. 站长寄语 -->
<div class="hint-container note custom-note">
  <p class="hint-container-title" style="font-size: 1.2rem; margin-bottom: 10px;">站长寄语</p>
  <div class="note-content">
    <p>你好，我是 <span class='heighlight'>蔚蓝 (Weilan)</span>，一名热衷于技术探索的后端开发者。</p>
    <p>在这个信息碎片化的时代，「蔚蓝空间栈」旨在抵抗浮躁，建立一个<span class='heighlight'>体系化、可复盘</span>的个人知识库。代码不仅是工具，更是逻辑与艺术的结合。希望这里的每一行文字，都能为你带来新的视角。</p>
  </div>
</div>

<br/>

<!-- 2. 知识星图 (原生 Grid 卡片) -->
### 🧭 知识星图

这里是我正在维护的核心技术专栏，点击卡片即可直达：

<div class="custom-projects-grid">
  
  <a href="/zh/java/" class="custom-card">
    <div class="card-content">
      <h3>Java 进阶之路</h3>
      <p>夯实基础，挑战底层原理</p>
    </div>
  </a>

  <a href="/zh/python/" class="custom-card">
    <div class="card-content">
      <h3>Python & AI 实验室</h3>
      <p>自动化脚本与大模型实战</p>
    </div>
  </a>

  <a href="/zh/arch/" class="custom-card">
    <div class="card-content">
      <h3>架构师视角</h3>
      <p>设计模式与系统设计</p>
    </div>
  </a>

  <a href="/zh/frontend/" class="custom-card">
    <div class="card-content">
      <h3>前端/全栈</h3>
      <p>Vuepress 搭建与前端美学</p>
    </div>
  </a>

  <a href="/zh/tools/" class="custom-card">
    <div class="card-content">
      <h3>工具与效率</h3>
      <p>Git、Docker 与开发利器</p>
    </div>
  </a>

  <a href="/zh/blog/" class="custom-card">
    <div class="card-content">
      <h3>蔚蓝随笔</h3>
      <p>生活感悟与非技术杂谈</p>
    </div>
  </a>

</div>

<!-- 3. 社交链接 -->
<br/>
<br/>

<div align="center">

### 联系作者

如果你对我的文章感兴趣，或者想进行技术交流：

<a href="https://github.com/Azure12355" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-Weilan-181717?style=for-the-badge&logo=github" alt="GitHub">
</a>
&nbsp;
<a href="mailto:your-email@example.com">
  <img src="https://img.shields.io/badge/Email-联系我-D14836?style=for-the-badge&logo=gmail" alt="Email">
</a>

<p style="margin-top: 20px; opacity: 0.6; font-size: 0.9rem;">
<i>"Stay Hungry, Stay Foolish."</i>
</p>

</div>

<!-- 
  ========================================================
  核心 CSS：仅主页显示动态背景 + 路由切换自动销毁
  ========================================================
-->
<style>
/* --- 1. 动态背景仅在主页显示 --- */

/* 关键逻辑：利用 .home 类 (VuePress 主页独有) 创建一个伪元素来承载背景 */
/* 这样当路由切换到非主页时，.home 类消失，背景也随之消失 */
.vp-project-home::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1; /* 放在最底层 */
  background: url('/bg.svg') no-repeat center center;
  background-size: cover;
  pointer-events: none; /* 防止遮挡点击 */
}

/* 隐藏主页默认的背景色，让伪元素透出来 */
.vp-project-home.project {
   background: transparent !important;
}

/* --- 2. 通用样式修正 (为了防止 body 背景残留) --- */
body {
  background: none !important; /* 强制清除 body 全局背景 */
}

#app, .theme-container, .vp-page {
  background: transparent !important;
}

/* --- 3. 亮色模式 (Light Mode) --- */
.vp-navbar {
  background-color: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.vp-feature-item, 
.custom-card, 
.hint-container.custom-note {
  background-color: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  color: #333;
}

.note-content {
  font-size: 18px; 
  line-height: 1.8;
}

/* --- 4. 暗黑模式 (Dark Mode) --- */

/* 导航栏 */
html[data-theme="dark"] .vp-navbar {
  background-color: rgba(27, 27, 31, 0.4) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 仅在主页 (.home) 下，暗黑模式加一个黑色半透明遮罩 */
/* 这样可以防止 SVG 背景太亮刺眼 */
html[data-theme="dark"] .vp-project-home::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3); /* 30% 黑色遮罩 */
  z-index: -1; /* 放在背景之上，内容之下 */
  pointer-events: none;
}

html[data-theme="dark"] .vp-feature-item, 
html[data-theme="dark"] .custom-card, 
html[data-theme="dark"] .hint-container.custom-note {
  background-color: rgba(27, 27, 31, 0.4) !important; 
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  color: #eee !important;
}

html[data-theme="dark"] .vp-feature-item h2,
html[data-theme="dark"] .vp-feature-item p,
html[data-theme="dark"] .custom-card h3,
html[data-theme="dark"] .custom-card p,
html[data-theme="dark"] .hint-container .hint-container-title,
html[data-theme="dark"] .note-content {
  color: #f0f0f0 !important;
}

html[data-theme="dark"] .vp-feature-item p {
   color: #ccc !important;
}

/* 悬停效果 */
.vp-feature-item:hover, .custom-card:hover {
  transform: translateY(-5px);
}
html:not([data-theme="dark"]) .vp-feature-item:hover, 
html:not([data-theme="dark"]) .custom-card:hover {
  background-color: rgba(255, 255, 255, 0.9) !important;
}
html[data-theme="dark"] .vp-feature-item:hover, 
html[data-theme="dark"] .custom-card:hover {
  background-color: rgba(40, 40, 40, 0.8) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}

/* --- 5. 布局修正 --- */
.vp-features {
  display: grid !important;
  gap: 20px;
}
@media (min-width: 1200px) {
  .vp-features {
    grid-template-columns: repeat(4, 1fr) !important;
  }
}
@media (max-width: 1199px) and (min-width: 768px) {
  .vp-features {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
@media (max-width: 767px) {
  .vp-features {
    grid-template-columns: 1fr !important;
  }
}

.custom-projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.custom-card {
  display: flex;
  align-items: center;
  padding: 20px;
  text-decoration: none !important;
}

.card-icon {
  font-size: 2.5rem;
  margin-right: 15px;
}

.card-content h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.card-content p {
  margin: 5px 0 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.heighlight {
  color: #0d7fda;
  font-weight: bolder;
}
</style>