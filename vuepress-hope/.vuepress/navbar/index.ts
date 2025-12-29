import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "Java攻城狮",
    icon: "ri:java-fill",
    prefix: "/java/",
    link: "/java/",
    children: [
      {
        text: "Java基础篇",
        icon: "lightbulb",
        prefix: "base/",
        link: "/java/base/"
      },
      {
        text: "Java进阶篇",
        icon: "famicons:rocket-outline",
        prefix: "high/",
        link: "/java/high/"
      },
      {
        text: "JUC并发编程",
        icon: "streamline-sharp:computer-chip-1-remix",
        prefix: "high/",
        link: "/java/juc/"
      },
      {
        text: "JVM虚拟机",
        icon: "file-icons:virtualbox",
        prefix: "high/",
        link: "/java/jvm/"
      },
    ],
  },

  {
    text: "剑指offer",
    icon: "game-icons:pointy-sword",
    prefix: "/algo/",
    link: "/algo/",
    children: [
      {
        text: "LeetCode题单",
        icon: "uiw:map",
        prefix: "/algo/",
        link: "/algo/manual/"
      },
      {
        text: "LeetCode Hot100",
        icon: "el:fire",
        prefix: "/algo/",
        link: "/algo/hot/"
      },
      {
        text: "code top",
        icon: "hugeicons:sword-03",
        prefix: "/algo/",
        link: "/algo/codetop/"
      },
    ],
  },

  {
    text: "计算机基础",
    icon: "el:fire",
    prefix: "/408/",
    link: "/408/",
    children: [
      {
        text: "数据结构",
        icon: "lsicon:tree-filled",
        prefix: "/408/",
        link: "/408/ds/"
      },
      {
        text: "计算机组成原理",
        icon: "heroicons:cpu-chip-20-solid",
        prefix: "/408/",
        link: "/408/co/"
      },
      {
        text: "操作系统",
        icon: "devicon-plain:archlinux",
        prefix: "/408",
        link: "/408/os/"
      },
      {
        text: "计算机网络",
        icon: "streamline-ultimate:network-pin",
        prefix: "/408",
        link: "/408/cn/"
      },
    ],
  },

  {
    text: "VibeCoding",
    icon: "lightbulb",
    prefix: "/algo/",
    link: "/algo/",
    children: [
      {
        text: "Java基础篇",
        icon: "lightbulb",
        prefix: "base/",
        link: "/java/base/"
      },
      {
        text: "Java进阶篇",
        icon: "lightbulb",
        prefix: "high/",
        link: "/java/high/"
      },
      {
        text: "JUC并发编程",
        icon: "lightbulb",
        prefix: "high/",
        link: "/java/juc/"
      },
      {
        text: "JVM虚拟机",
        icon: "lightbulb",
        prefix: "high/",
        link: "/java/jvm/"
      },
    ],
  },
]);
