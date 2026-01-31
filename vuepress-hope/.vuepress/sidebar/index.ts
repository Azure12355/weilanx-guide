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
          text: "一、Java 概述与环境",
          icon: "ri:information-line",
          collapsible: true,
          expanded: false,
          prefix: "/java/base/00-overview",
          children: [
            {
              text: "Java 概述",
              icon: "ri:book-2-line",
              link: "/java/base/00-overview/overview.md",
            },
            {
              text: "JDK 安装配置",
              icon: "ri:download-cloud-2-line",
              link: "/java/base/00-overview/jdk-install.md",
            },
            {
              text: "Hello World",
              icon: "ri:hand-coin-line",
              link: "/java/base/00-overview/hello-world.md",
            },
          ],
        },
        {
          text: "二、基础语法",
          icon: "ri:code-s-slash-line",
          collapsible: true,
          expanded: false,
          prefix: "/java/base/01-syntax",
          children: [
            {
              text: "变量与数据类型",
              icon: "ri:database-2-line",
              link: "/java/base/01-syntax/variables.md",
            },
            {
              text: "运算符",
              icon: "ri:calculator-line",
              link: "/java/base/01-syntax/operators.md",
            },
            {
              text: "流程控制",
              icon: "ri:flow-chart",
              link: "/java/base/01-syntax/control-flow.md",
            },
            {
              text: "关键字",
              icon: "ri:key-2-line",
              link: "/java/base/01-syntax/keywords.md",
            },
          ],
        },
        {
          text: "三、面向对象基础",
          icon: "ri:git-merge-line",
          collapsible: true,
          expanded: false,
          prefix: "/java/base/02-oop",
          children: [
            {
              text: "类与对象",
              icon: "ri:shape-line",
              link: "/java/base/02-oop/class-object.md",
            },
            {
              text: "封装",
              icon: "ri:lock-2-line",
              link: "/java/base/02-oop/encapsulation.md",
            },
            {
              text: "继承",
              icon: "ri:git-branch-line",
              link: "/java/base/02-oop/inheritance.md",
            },
            {
              text: "多态",
              icon: "ri:shuffle-line",
              link: "/java/base/02-oop/polymorphism.md",
            },
            {
              text: "抽象类与接口",
              icon: "ri:stack-line",
              link: "/java/base/02-oop/abstract-interface.md",
            },
            {
              text: "内部类",
              icon: "ri:inbox-line",
              link: "/java/base/02-oop/inner-class.md",
            },
          ],
        },
        {
          text: "四、数组与字符串",
          icon: "ri:layout-grid-line",
          collapsible: true,
          expanded: false,
          prefix: "/java/base/03-array-string",
          children: [
            {
              text: "数组",
              icon: "ri:layout-grid-line",
              link: "/java/base/03-array-string/array.md",
            },
            {
              text: "String 类",
              icon: "ri:font-size-2",
              link: "/java/base/03-array-string/string.md",
            },
            {
              text: "StringBuilder/StringBuffer",
              icon: "ri:edit-box-line",
              link: "/java/base/03-array-string/string-builder.md",
            },
          ],
        },
        {
          text: "五、集合框架",
          icon: "ri:folder-3-line",
          collapsible: true,
          expanded: false,
          prefix: "/java/base/04-collections",
          children: [
            {
              text: "集合概述",
              icon: "ri:map-pin-line",
              link: "/java/base/04-collections/overview.md",
            },
            {
              text: "Collection 接口",
              icon: "ri:node-tree",
              link: "/java/base/04-collections/collection.md",
            },
            {
              text: "List 集合",
              icon: "ri:list-ordered",
              link: "/java/base/04-collections/list.md",
            },
            {
              text: "Set 集合",
              icon: "ri:checkbox-blank-circle-line",
              link: "/java/base/04-collections/set.md",
            },
            {
              text: "Map 集合",
              icon: "ri:map-2-line",
              link: "/java/base/04-collections/map.md",
            },
            {
              text: "Collections 工具类",
              icon: "ri:tools-line",
              link: "/java/base/04-collections/collections-util.md",
            },
          ],
        },
        {
          text: "六、异常处理",
          icon: "ri:alert-line",
          collapsible: true,
          expanded: false,
          prefix: "/java/base/05-exception",
          children: [
            {
              text: "异常概述",
              icon: "ri:error-warning-line",
              link: "/java/base/05-exception/exception-overview.md",
            },
            {
              text: "try-catch-finally",
              icon: "ri:shield-check-line",
              link: "/java/base/05-exception/try-catch.md",
            },
            {
              text: "抛出异常",
              icon: "ri:send-plane-fill",
              link: "/java/base/05-exception/throw-throws.md",
            },
            {
              text: "自定义异常",
              icon: "ri:settings-3-line",
              link: "/java/base/05-exception/custom-exception.md",
            },
          ],
        },
        {
          text: "七、IO 流",
          icon: "ri:exchange-line",
          collapsible: true,
          expanded: false,
          prefix: "/java/base/06-io",
          children: [
            {
              text: "File 类",
              icon: "ri:file-line",
              link: "/java/base/06-io/file-class.md",
            },
            {
              text: "字节流",
              icon: "ri:bits-line",
              link: "/java/base/06-io/byte-stream.md",
            },
            {
              text: "字符流",
              icon: "ri:text",
              link: "/java/base/06-io/char-stream.md",
            },
            {
              text: "缓冲流",
              icon: "ri:speed-line",
              link: "/java/base/06-io/buffered-stream.md",
            },
            {
              text: "对象流",
              icon: "ri:box-3-line",
              link: "/java/base/06-io/object-stream.md",
            },
            {
              text: "NIO 入门",
              icon: "ri:flashlight-line",
              link: "/java/base/06-io/nio.md",
            },
          ],
        },
        {
          text: "八、多线程基础",
          icon: "ri:team-line",
          collapsible: true,
          expanded: false,
          prefix: "/java/base/07-thread",
          children: [
            {
              text: "线程概述",
              icon: "ri:road-map-line",
              link: "/java/base/07-thread/thread-overview.md",
            },
            {
              text: "线程创建",
              icon: "ri:add-circle-line",
              link: "/java/base/07-thread/thread-create.md",
            },
            {
              text: "线程生命周期",
              icon: "ri-refresh-line",
              link: "/java/base/07-thread/thread-lifecycle.md",
            },
            {
              text: "线程同步",
              icon: "ri:lock-line",
              link: "/java/base/07-thread/thread-sync.md",
            },
            {
              text: "线程通信",
              icon: "ri:chat-3-line",
              link: "/java/base/07-thread/thread-communication.md",
            },
          ],
        },
        {
          text: "九、常用类与 API",
          icon: "ri:apps-line",
          collapsible: true,
          expanded: false,
          prefix: "/java/base/08-common-api",
          children: [
            {
              text: "包装类",
              icon: "ri:box-3-line",
              link: "/java/base/08-common-api/wrapper-class.md",
            },
            {
              text: "日期时间",
              icon: "ri:time-line",
              link: "/java/base/08-common-api/datetime.md",
            },
            {
              text: "枚举",
              icon: "ri:list-check",
              link: "/java/base/08-common-api/enum.md",
            },
            {
              text: "注解",
              icon: "ri-price-tag-3-line",
              link: "/java/base/08-common-api/annotation.md",
            },
          ],
        },
        {
          text: "十、泛型与反射",
          icon: "ri:lightbulb-flash-line",
          collapsible: true,
          expanded: false,
          prefix: "/java/base/09-generic-reflection",
          children: [
            {
              text: "泛型概述",
              icon: "ri:question-line",
              link: "/java/base/09-generic-reflection/generic-overview.md",
            },
            {
              text: "泛型类、接口、方法",
              icon: "ri:function-line",
              link: "/java/base/09-generic-reflection/generic-detail.md",
            },
            {
              text: "通配符",
              icon: "ri:asterisk",
              link: "/java/base/09-generic-reflection/wildcard.md",
            },
            {
              text: "反射机制",
              icon: "ri:reflection-line",
              link: "/java/base/09-generic-reflection/reflection.md",
            },
          ],
        },
        {
          text: "十一、网络编程",
          icon: "ri:global-line",
          collapsible: true,
          expanded: false,
          prefix: "/java/base/10-network",
          children: [
            {
              text: "网络基础",
              icon: "ri:router-line",
              link: "/java/base/10-network/network-overview.md",
            },
            {
              text: "UDP 通信",
              icon: "ri:send-plane-line",
              link: "/java/base/10-network/udp.md",
            },
            {
              text: "TCP 通信",
              icon: "ri:exchange-funds-line",
              link: "/java/base/10-network/tcp.md",
            },
          ],
        },
        {
          text: "十二、Lambda 与 Stream",
          icon: "ri:magic-line",
          collapsible: true,
          expanded: false,
          prefix: "/java/base/11-lambda-stream",
          children: [
            {
              text: "Lambda 表达式",
              icon: "ri:function-line",
              link: "/java/base/11-lambda-stream/lambda.md",
            },
            {
              text: "Stream API",
              icon: "ri:flow-chart",
              link: "/java/base/11-lambda-stream/stream.md",
            },
            {
              text: "Optional 类",
              icon: "ri:shield-check-line",
              link: "/java/base/11-lambda-stream/optional.md",
            },
          ],
        },
        {
          text: "十三、设计模式入门",
          icon: "ri:layout-2-line",
          collapsible: true,
          expanded: false,
          prefix: "/java/base/12-design-patterns",
          children: [
            {
              text: "设计模式概述",
              icon: "ri:book-open-line",
              link: "/java/base/12-design-patterns/overview.md",
            },
            {
              text: "单例模式",
              icon: "ri:user-star-line",
              link: "/java/base/12-design-patterns/singleton.md",
            },
            {
              text: "工厂模式",
              icon: "ri:building-4-line",
              link: "/java/base/12-design-patterns/factory.md",
            },
            {
              text: "观察者模式",
              icon: "ri:eye-line",
              link: "/java/base/12-design-patterns/observer.md",
            },
          ],
        },
        {
          text: "附录",
          icon: "ri:appendix",
          collapsible: true,
          expanded: false,
          prefix: "/java/base/13-appendix",
          children: [
            {
              text: "Java 常用方法",
              icon: "ri:bookmark-line",
              link: "/java/base/13-appendix/common-methods.md",
            },
            {
              text: "正则表达式",
              icon: "ri:regex",
              link: "/java/base/13-appendix/regex.md",
            },
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
              text: "序列容器",
              icon: "fa6-solid:layer-group",
              collapsible: true,
              children: [
                {
                  text: "std::vector",
                  icon: "fa6-solid:arrow-up-right-dots",
                  link: "/langs/cpp/03-stl/99-reference/vector.md",
                },
                {
                  text: "std::deque",
                  icon: "fa6-solid:arrows-left-right-to-line",
                  link: "/langs/cpp/03-stl/99-reference/deque.md",
                },
                {
                  text: "std::array",
                  icon: "fa6-solid:table-cells",
                  link: "/langs/cpp/03-stl/99-reference/array.md",
                },
                {
                  text: "std::list",
                  icon: "fa6-solid:arrow-right-arrow-left",
                  link: "/langs/cpp/03-stl/99-reference/list.md",
                },
                {
                  text: "std::forward_list",
                  icon: "fa6-solid:arrow-right-long",
                  link: "/langs/cpp/03-stl/99-reference/forward_list.md",
                },
                {
                  text: "std::string",
                  icon: "fa6-solid:font",
                  link: "/langs/cpp/03-stl/99-reference/string.md",
                },
              ],
            },
            {
              text: "关联容器",
              icon: "fa6-solid:sitemap",
              collapsible: true,
              children: [
                {
                  text: "std::set",
                  icon: "fa6-solid:circle-nodes",
                  link: "/langs/cpp/03-stl/99-reference/set.md",
                },
                {
                  text: "std::multiset",
                  icon: "fa6-solid:circle-nodes",
                  link: "/langs/cpp/03-stl/99-reference/multiset.md",
                },
                {
                  text: "std::map",
                  icon: "fa6-solid:sitemap",
                  link: "/langs/cpp/03-stl/99-reference/map.md",
                },
                {
                  text: "std::multimap",
                  icon: "fa6-solid:sitemap",
                  link: "/langs/cpp/03-stl/99-reference/multimap.md",
                },
              ],
            },
            {
              text: "无序容器",
              icon: "fa6-solid:shuffle",
              collapsible: true,
              children: [
                {
                  text: "std::unordered_set",
                  icon: "fa6-solid:braille",
                  link: "/langs/cpp/03-stl/99-reference/unordered_set.md",
                },
                {
                  text: "std::unordered_multiset",
                  icon: "fa6-solid:braille",
                  link: "/langs/cpp/03-stl/99-reference/unordered_multiset.md",
                },
                {
                  text: "std::unordered_map",
                  icon: "fa6-solid:hashtag",
                  link: "/langs/cpp/03-stl/99-reference/unordered_map.md",
                },
                {
                  text: "std::unordered_multimap",
                  icon: "fa6-solid:hashtag",
                  link: "/langs/cpp/03-stl/99-reference/unordered_multimap.md",
                },
              ],
            },
            {
              text: "容器适配器",
              icon: "fa6-solid:boxes-stacked",
              collapsible: true,
              children: [
                {
                  text: "std::stack",
                  icon: "fa6-solid:layer-group",
                  link: "/langs/cpp/03-stl/99-reference/stack.md",
                },
                {
                  text: "std::queue",
                  icon: "fa6-solid:people-line",
                  link: "/langs/cpp/03-stl/99-reference/queue.md",
                },
                {
                  text: "std::priority_queue",
                  icon: "fa6-solid:arrow-down-1-9",
                  link: "/langs/cpp/03-stl/99-reference/priority_queue.md",
                },
              ],
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
