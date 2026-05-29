import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",

  // 编程语言
  {
    text: "编程语言",
    icon: "ri:code-box-line",
    prefix: "/langs/",
    link: "/langs/",
    children: [
      {
        text: "Java",
        icon: "ri:java-fill",
        link: "/langs/java/",
      },
      {
        text: "Python",
        icon: "simple-icons:python",
        link: "/langs/python/",
      },
      {
        text: "JavaScript",
        icon: "simple-icons:javascript",
        link: "/langs/javascript/",
      },
      {
        text: "Go",
        icon: "simple-icons:go",
        link: "/langs/go/",
      },
      {
        text: "C++",
        icon: "simple-icons:cplusplus",
        link: "/langs/cpp/",
      },
      {
        text: "Rust",
        icon: "simple-icons:rust",
        link: "/langs/rust/",
      },
    ],
  },

  {
    text: "Java攻城狮",
    icon: "ri:java-fill",
    prefix: "/java/",
    link: "/java/",
    children: [
      {
        text: "Java基础篇",
        icon: "ri:lightbulb-line",
        prefix: "base/",
        link: "/java/base/"
      },
      {
        text: "Java进阶篇",
        icon: "ri:rocket-line",
        prefix: "high/",
        link: "/java/high/"
      },
      {
        text: "JUC并发编程",
        icon: "ri:cpu-line",
        prefix: "high/",
        link: "/java/juc/"
      },
      {
        text: "JVM虚拟机",
        icon: "ri:hard-drive-2-line",
        prefix: "high/",
        link: "/java/jvm/"
      },
    ],
  },

  {
    text: "剑指offer",
    icon: "ri:sword-line",
    prefix: "/algo/",
    link: "/algo/",
    children: [
      {
        text: "LeetCode题单",
        icon: "ri:map-2-line",
        prefix: "/algo/",
        link: "/algo/manual/"
      },
      {
        text: "LeetCode Hot100",
        icon: "ri:fire-line",
        prefix: "/algo/",
        link: "/algo/hot/"
      },
      {
        text: "code top",
        icon: "ri:sword-line",
        prefix: "/algo/",
        link: "/algo/codetop/"
      },
    ],
  },

  {
    text: "计算机基础",
    icon: "ri:server-line",
    prefix: "/408/",
    link: "/408/",
    children: [
      {
        text: "数据结构",
        icon: "ri:node-tree",
        prefix: "/408/",
        link: "/408/ds/"
      },
      {
        text: "计算机组成原理",
        icon: "ri:cpu-line",
        prefix: "/408/",
        link: "/408/co/"
      },
      {
        text: "操作系统",
        icon: "ri:terminal-box-line",
        prefix: "/408",
        link: "/408/os/"
      },
      {
        text: "计算机网络",
        icon: "ri:global-line",
        prefix: "/408",
        link: "/408/cn/"
      },
    ],
  },

  {
    text: "开源教程",
    icon: "ri:open-source-line",
    link: "/tutorials/",
  },

  {
    text: "蔚蓝博客",
    icon: "ri:quill-pen-line",
    link: "https://blog.weilanx.com",
  },
]);
