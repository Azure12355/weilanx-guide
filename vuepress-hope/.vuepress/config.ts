import { defineUserConfig } from "vuepress";
import { viteBundler } from '@vuepress/bundler-vite'; // 记得引入这个

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  // Preconnect to Iconify CDN for faster icon resolution (HTTPS handshake + DNS)
  // covers ri:* and simple-icons:* — both fetched via api.iconify.design
  head: [
    ["link", { rel: "preconnect", href: "https://api.iconify.design" }],
    ["link", { rel: "dns-prefetch", href: "https://api.iconify.design" }],
    ["link", { rel: "preconnect", href: "https://api.simplesvg.com" }],
    ["link", { rel: "preconnect", href: "https://api.unisvg.com" }],
  ],

  locales: {
    "/": {
      lang: "zh-CN",
      title: "蔚蓝空间栈",
      description: "一个专注于高效学习的网站",
    },
  },

  bundler: viteBundler({
    viteOptions: {
      css: {
        preprocessorOptions: {
          scss: {
            // 屏蔽具体的警告类型，截图里是 [if-function]
            silenceDeprecations: ['legacy-js-api', 'if-function', 'import'],
            // 或者直接简单粗暴，忽略依赖包中的警告
            quietDeps: true,
          },
        },
      },
    },
  }),

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
