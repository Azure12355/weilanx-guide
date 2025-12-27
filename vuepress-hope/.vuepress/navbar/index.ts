import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "Java攻城狮",
    icon: "lightbulb",
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

  {
    text: "剑指offer",
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

  {
    text: "计算机基础",
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
