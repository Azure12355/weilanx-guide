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
    link: /java/base/
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

<!-- 1. 理念卡片 (Philosophy Section) -->
<div class="section-container fade-in-up" style="animation-delay: 0.2s;">
  <div class="philosophy-card">
    <div class="philosophy-header">
      <span class="badge">Stationmaster's Log</span>
      <span class="date">EST. 2024</span>
    </div>
    <div class="philosophy-content">
      <div class="avatar-wrapper">
        <img src="/avatar.jpg" alt="Weilan" class="avatar">
      </div>
      <div class="text-wrapper">
        <h3>你好，我是 <span class="gradient-text">蔚蓝 (Weilan)</span></h3>
        <p>在这个算法与噪音并存的时代，我依然相信<b>深度阅读</b>与<b>系统化思考</b>的力量。</p>
        <p>「蔚蓝空间栈」不仅是技术的堆砌，更是对 <span class="highlight">代码美学</span> 与 <span class="highlight">工程逻辑</span> 的极致追求。在这里，我们抵抗浮躁，重构边界，探索技术的星辰大海。</p>
      </div>
    </div>
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

  /* 
  * ==========================================
  * 1. 全局变量定义 (Design Tokens)
  * ==========================================
  */
.vp-project-home {
    --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    
    /* 亮色模式玻璃参数 */
    --glass-bg-light: rgba(255, 255, 255, 0.65);
    --glass-border-light: rgba(255, 255, 255, 0.5);
    --glass-shadow-light: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
    --card-gradient-light: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4));
    
    /* 暗色模式玻璃参数 */
    --glass-bg-dark: rgba(20, 20, 20, 0.6);
    --glass-border-dark: rgba(255, 255, 255, 0.08);
    --glass-shadow-dark: 0 20px 50px 0 rgba(0, 0, 0, 0.5);
    --card-gradient-dark: linear-gradient(135deg, rgba(30,30,30,0.8), rgba(20,20,20,0.4));
    
    /* 品牌色 */
    --text-gradient: linear-gradient(90deg, #007FFF, #00C6FF);
    --highlight-bg: rgba(0, 127, 255, 0.1);
    --highlight-color: #007FFF;
}

/* 
 * 暗黑模式下的变量重写 
 * 选择器含义：当 HTML 处于暗黑模式 且 在主页内部时
 */
html[data-theme="dark"] .vp-project-home {
    /* 暗色模式玻璃参数 */
    --glass-bg-dark: rgba(20, 20, 20, 0.6);
    --glass-border-dark: rgba(255, 255, 255, 0.08);
    --glass-shadow-dark: 0 20px 50px 0 rgba(0, 0, 0, 0.5);
    --card-gradient-dark: linear-gradient(135deg, rgba(30,30,30,0.8), rgba(20,20,20,0.4));
}

/* 
 * ==========================================
 * 2. 动态背景逻辑 - 仅限主页显示
 * ==========================================
 */

/* 关键逻辑：利用 .vp-project-home 创建一个伪元素来承载背景 */
/* 这样当路由切换到非主页时，该类名消失，背景也随之自动销毁 */
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
  pointer-events: none;
}

/* 隐藏主页默认的背景色，让伪元素透出来 */
.vp-project-home.project {
   background: transparent !important;
}

/* 强制清除可能的全局背景干扰 */
body {
  background: none !important; 
}
#app, .theme-container, .vp-page {
  background: transparent !important;
}

/* 
  * ==========================================
  * 3. 组件核心 CSS
  * ==========================================
  */

/* 容器限制 */
.section-container {
    width: 100%;
}

/* 动画关键帧 */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

/* 卡片主体 */
.philosophy-card {
    /* 玻璃拟态核心 */
    background: var(--card-gradient-light);
    backdrop-filter: blur(20px) saturate(180%); /* 模糊 + 饱和度提升 */
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
    
    border-radius: 24px;
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
    
    /* 入场动画 */
    opacity: 0;
    animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    color: #333; /* 亮色模式文字颜色 */
    transition: all 0.3s ease;
}

/* 头部标签栏 */
.philosophy-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.6;
    font-weight: 600;
    user-select: none;
}

/* 内容布局 */
.philosophy-content {
    display: flex;
    gap: 2rem;
    align-items: center;
}

/* 头像区域 */
.avatar-wrapper {
    flex-shrink: 0;
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    /* 头像边框光环 */
    border: 4px solid rgba(255,255,255,0.3);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 悬停时头像的趣味互动 */
.philosophy-card:hover .avatar {
    transform: rotate(12deg) scale(1.1);
    border-color: rgba(255,255,255,0.6);
}

/* 文本排版 */
.text-wrapper h3 {
    margin: 0 0 1rem 0;
    font-size: 1.8rem;
    font-weight: 800;
    line-height: 1.2;
}

.text-wrapper p {
    font-size: 1.05rem;
    line-height: 1.7;
    opacity: 0.9;
    margin-bottom: 0.8rem;
    margin-top: 0;
}

/* 渐变文字特效 */
.gradient-text {
    background: var(--text-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
    display: inline-block;
}

/* 高亮标记 */
.highlight {
    color: var(--highlight-color);
    font-weight: 600;
    background: var(--highlight-bg);
    padding: 2px 6px;
    border-radius: 4px;
    transition: background 0.3s;
}

/* 
  * ==========================================
  * 4. 暗黑模式适配 (Dark Mode)
  * ==========================================
  */
[data-theme="dark"] .philosophy-card {
    background: var(--card-gradient-dark);
    border: 1px solid rgba(255, 255, 255, 0.1); /* 更细微的边框 */
    box-shadow: var(--glass-shadow-dark);
    color: #f0f0f0; /* 文字变白 */
}

[data-theme="dark"] .avatar {
    border-color: rgba(255,255,255,0.1);
}

[data-theme="dark"] .philosophy-card:hover .avatar {
    border-color: rgba(255,255,255,0.3);
}

/* 
  * ==========================================
  * 5. 移动端适配
  * ==========================================
  */
@media (max-width: 768px) {
    .philosophy-content {
        flex-direction: column;
        text-align: center;
    }
    
    .text-wrapper h3 {
        font-size: 1.5rem;
    }
    
    .philosophy-card {
        padding: 1.5rem;
    }
}

/* 
  * 演示用按钮样式 (不需要复制到项目中)
  */
.toggle-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    background: rgba(0,0,0,0.8);
    color: white;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    backdrop-filter: blur(10px);
    z-index: 100;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
[data-theme="dark"] .toggle-btn {
    background: rgba(255,255,255,0.9);
    color: black;
}
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

.vp-hero-info-wrapper {
  margin-top: 50px
}

</style>
