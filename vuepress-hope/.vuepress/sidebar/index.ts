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

  "/langs/": [
    {
      text: "编程语言总览",
      icon: "ri:code-box-line",
      link: "/langs/",
    },
    {
      text: "Java",
      icon: "ri:java-fill",
      link: "/langs/java/",
    },
    {
      text: "Python",
      icon: "logos:python",
      link: "/langs/python/",
    },
    {
      text: "JavaScript",
      icon: "logos:javascript",
      link: "/langs/javascript/",
    },
    {
      text: "Go",
      icon: "logos:go",
      link: "/langs/go/",
    },
    {
      text: "C++",
      icon: "devicon-plain:cplusplus",
      link: "/langs/cpp/",
    },
    {
      text: "Rust",
      icon: "devicon-plain:rust",
      link: "/langs/rust/",
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

  "/langs/cpp/": [
    {
      text: "C++ 概述",
      icon: "devicon-plain:cplusplus",
      link: "/langs/cpp/",
    },
    {
      text: "C++ 概述与环境",
      icon: "devicon-plain:cplusplus",
      collapsible: true,
      expanded: false,
      prefix: "/langs/cpp/00-overview",
      children: [
        "cpp-overview.md",
        "cpp-env.md",
      ],
    },
    {
      text: "C++ 基础",
      icon: "devicon-plain:cplusplus",
      collapsible: true,
      expanded: false,
      prefix: "/langs/cpp/01-basics",
      children: [
        "cpp-basic-syntax.md",
        "cpp-pointer-reference.md",
      ],
    },
    {
      text: "C++ 进阶",
      icon: "devicon-plain:cplusplus",
      collapsible: true,
      expanded: false,
      prefix: "/langs/cpp/02-advanced",
      children: [
        "cpp-oop.md",
      ],
    },
    {
      text: "STL 标准库",
      icon: "devicon-plain:cplusplus",
      collapsible: true,
      expanded: false,
      prefix: "/langs/cpp/03-stl",
      children: [
        {
          text: "STL 概述",
          icon: "ri:file-list-3-line",
          link: "/langs/cpp/03-stl/overview.md",
        },
        {
          text: "容器",
          icon: "fa6-solid:box-archive",
          collapsible: true,
          prefix: "/langs/cpp/03-stl/01-containers",
          children: [
            {
              text: "容器知识体系",
              icon: "ri:node-tree",
              link: "/langs/cpp/03-stl/01-containers/container-system.md",
            },
            {
              text: "序列容器",
              icon: "fa6-solid:arrow-right-long",
              link: "/langs/cpp/03-stl/01-containers/sequence.md",
            },
            {
              text: "关联容器",
              icon: "fa6-solid:sitemap",
              link: "/langs/cpp/03-stl/01-containers/associative.md",
            },
            {
              text: "无序容器",
              icon: "fa6-solid:shuffle",
              link: "/langs/cpp/03-stl/01-containers/unordered.md",
            },
          ],
        },
        {
          text: "迭代器",
          icon: "ri:repeat-2-line",
          link: "/langs/cpp/03-stl/02-iterators/iterators.md",
        },
        {
          text: "算法",
          icon: "fa6-solid:microchip",
          collapsible: true,
          prefix: "/langs/cpp/03-stl/03-algorithms",
          children: [
            {
              text: "查询算法",
              icon: "fa6-solid:magnifying-glass",
              link: "/langs/cpp/03-stl/03-algorithms/query.md",
            },
            {
              text: "修改算法",
              icon: "fa6-solid:pen-to-square",
              link: "/langs/cpp/03-stl/03-algorithms/modification.md",
            },
            {
              text: "数值算法",
              icon: "fa6-solid:calculator",
              link: "/langs/cpp/03-stl/03-algorithms/numeric.md",
            },
          ],
        },
        {
          text: "函数对象",
          icon: "fa6-solid:code-branch",
          link: "/langs/cpp/03-stl/04-function-objects/functors.md",
        },
        {
          text: "STL 标准库速查",
          icon: "ri:book-mark-line",
          collapsible: true,
          expanded: false,
          prefix: "/langs/cpp/03-stl/99-reference",
          children: [
            {
              text: "std::vector",
              icon: "fa6-solid:layer-group",
              link: "/langs/cpp/03-stl/99-reference/vector.md",
            },
            {
              text: "std::string",
              icon: "fa6-solid:font",
              link: "/langs/cpp/03-stl/99-reference/string.md",
            },
            {
              text: "std::map",
              icon: "fa6-solid:sitemap",
              link: "/langs/cpp/03-stl/99-reference/map.md",
            },
          ],
        },
      ],
    },
    {
      text: "现代 C++",
      icon: "devicon-plain:cplusplus",
      collapsible: true,
      expanded: false,
      prefix: "/langs/cpp/05-modern",
      children: [
        "cpp-modern.md",
      ],
    },
  ],
});
