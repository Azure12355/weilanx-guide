import { defineUserConfig } from "vuepress";
import { viteBundler } from '@vuepress/bundler-vite'; // 记得引入这个

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "蔚蓝空间栈",
      description: "一个专注于高效学习的网站",
    },
  },

  bundler: viteBundler({
    viteOptions: {
      build: {
        // 设置 chunk 大小警告限制（单位：KB）
        chunkSizeWarningLimit: 1000,
        // 启用 CSS 代码分割
        cssCodeSplit: true,
        // 目标浏览器
        target: 'es2015',
        // 关闭 sourcemap 以减少内存占用
        sourcemap: false,
      },
      // 减少 CSS 预处理的内存占用
      css: {
        preprocessorOptions: {
          scss: {
            silenceDeprecations: ['legacy-js-api', 'if-function', 'import'],
            quietDeps: true,
          },
        },
      },
      // 优化依赖预构建
      optimizeDeps: {
        include: [
          'vue',
          'vuepress',
          '@vuepress/bundler-vite',
          'vuepress-theme-hope',
        ],
      },
    },
  }),

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
