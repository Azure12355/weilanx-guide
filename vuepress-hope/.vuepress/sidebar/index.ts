import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/demo/": [
    {
      text: "案例",
      icon: "laptop-code",
      prefix: "demo/",
      link: "demo/",
      children: "structure",
    },
    {
      text: "文档",
      icon: "book",
      prefix: "guide/",
      children: "structure",
    },
    {
      text: "幻灯片",
      icon: "person-chalkboard",
      link: "https://ecosystem.vuejs.press/zh/plugins/markdown/revealjs/demo.html",
    },
    {
      text: "Java基础篇",
      icon: "book",
      prefix: "java/",
      children: "structure",
    },
  ],
  "/java/": [
    {
      text: "Java 基础篇",
      icon: "lineicons:java",
      prefix: "base/",
      collapsible: true,
      expanded: false,
      children: [
        {
            text: "一、Java 概述&环境安装",
            collapsible: true,
            expanded: false,
            prefix: "/java/base/00-overview",
            children: [
                "java-overview.md",
                "jdk-install.md"
            ],
        },
        {
            text: "二、Java 基础语法",
            collapsible: true,
            expanded: false,
            prefix: "/java/base/01-syntax",
            children: [
                "java-keyword.md", 
                "java-exception.md"
            ],
        },
        {
            text: "三、Java 数组",
            collapsible: true,
            expanded: false,
            prefix: "/java/base/03-array",
            children: [
                "java-array.md", 
            ],
        },
        {
            text: "附录",
            collapsible: true,
            expanded: false,
            prefix: "/java/base/appendix",
            children: [
                "java-math.md", 
                "java-regex.md"
            ],
        },
      ]
    },
    {
      text: "Java进阶篇",
      icon: "book",
      prefix: "java/high/",
      children: "structure",
    },
  ],
});
