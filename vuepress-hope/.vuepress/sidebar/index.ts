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
          text: "学习路线",
          icon: "ri:map-2-line",
          link: "/java/base/",
        },
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
      icon: "ri:information-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/cpp/00-overview",
      children: [
        "cpp-overview.md",
        "cpp-env.md",
      ],
    },
    {
      text: "C++ 基础语法",
      icon: "ri:code-s-slash-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/cpp/01-basics",
      children: [
        "cpp-basic-syntax.md",
        "cpp-pointer-reference.md",
      ],
    },
    {
      text: "核心概念",
      icon: "ri:focus-3-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/cpp/02-core-concepts",
      children: [
        {
          text: "核心概念总览",
          icon: "ri:menu-2-line",
          link: "/langs/cpp/02-core-concepts/README.md",
        },
        {
          text: "指针与引用",
          icon: "ri:cursor-line",
          link: "/langs/cpp/02-core-concepts/pointers-references.md",
        },
        {
          text: "内存管理",
          icon: "ri:database-2-line",
          link: "/langs/cpp/02-core-concepts/memory-management.md",
        },
        {
          text: "const 与 constexpr",
          icon: "ri:lock-line",
          link: "/langs/cpp/02-core-concepts/const-constexpr.md",
        },
        {
          text: "函数",
          icon: "ri:function-line",
          link: "/langs/cpp/02-core-concepts/functions.md",
        },
        {
          text: "命名空间",
          icon: "ri:layout-grid-line",
          link: "/langs/cpp/02-core-concepts/namespaces.md",
        },
      ],
    },
    {
      text: "面向对象编程",
      icon: "ri:git-branch-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/cpp/03-oop",
      children: [
        {
          text: "OOP 总览",
          icon: "ri:menu-2-line",
          link: "/langs/cpp/03-oop/README.md",
        },
        {
          text: "类与对象",
          icon: "ri:shape-line",
          link: "/langs/cpp/03-oop/class-object.md",
        },
        {
          text: "继承",
          icon: "ri:git-branch-line",
          link: "/langs/cpp/03-oop/inheritance.md",
        },
        {
          text: "多态",
          icon: "ri:shuffle-line",
          link: "/langs/cpp/03-oop/polymorphism.md",
        },
        {
          text: "运算符重载",
          icon: "ri:calculator-line",
          link: "/langs/cpp/03-oop/operator-overloading.md",
        },
      ],
    },
    {
      text: "进阶特性",
      icon: "ri:lightbulb-flash-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/cpp/04-advanced",
      children: [
        {
          text: "进阶特性总览",
          icon: "ri:menu-2-line",
          link: "/langs/cpp/04-advanced/README.md",
        },
        {
          text: "模板",
          icon: "ri:code-box-line",
          link: "/langs/cpp/04-advanced/templates.md",
        },
        {
          text: "异常处理",
          icon: "ri:alert-line",
          link: "/langs/cpp/04-advanced/exceptions.md",
        },
        {
          text: "预处理器",
          icon: "ri:code-s-slash-line",
          link: "/langs/cpp/04-advanced/preprocessor.md",
        },
      ],
    },
    {
      text: "STL 标准库",
      icon: "ri:book-mark-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/cpp/05-stl",
      children: [
        {
          text: "STL 概述",
          icon: "ri:file-list-3-line",
          link: "/langs/cpp/05-stl/overview.md",
        },
        {
          text: "容器",
          icon: "fa6-solid:box-archive",
          collapsible: true,
          prefix: "/langs/cpp/05-stl/01-containers",
          children: [
            {
              text: "容器知识体系",
              icon: "ri:node-tree",
              link: "/langs/cpp/05-stl/01-containers/container-system.md",
            },
            {
              text: "序列容器",
              icon: "fa6-solid:arrow-right-long",
              link: "/langs/cpp/05-stl/01-containers/sequence.md",
            },
            {
              text: "关联容器",
              icon: "fa6-solid:sitemap",
              link: "/langs/cpp/05-stl/01-containers/associative.md",
            },
            {
              text: "无序容器",
              icon: "fa6-solid:shuffle",
              link: "/langs/cpp/05-stl/01-containers/unordered.md",
            },
          ],
        },
        {
          text: "迭代器",
          icon: "ri:repeat-2-line",
          link: "/langs/cpp/05-stl/02-iterators/iterators.md",
        },
        {
          text: "算法",
          icon: "fa6-solid:microchip",
          collapsible: true,
          prefix: "/langs/cpp/05-stl/03-algorithms",
          children: [
            {
              text: "查询算法",
              icon: "fa6-solid:magnifying-glass",
              link: "/langs/cpp/05-stl/03-algorithms/query.md",
            },
            {
              text: "修改算法",
              icon: "fa6-solid:pen-to-square",
              link: "/langs/cpp/05-stl/03-algorithms/modification.md",
            },
            {
              text: "数值算法",
              icon: "fa6-solid:calculator",
              link: "/langs/cpp/05-stl/03-algorithms/numeric.md",
            },
          ],
        },
        {
          text: "函数对象",
          icon: "fa6-solid:code-branch",
          link: "/langs/cpp/05-stl/04-function-objects/functors.md",
        },
        {
          text: "STL 标准库速查",
          icon: "ri:book-2-line",
          collapsible: true,
          expanded: false,
          prefix: "/langs/cpp/05-stl/99-reference",
          children: [
            {
              text: "序列容器",
              icon: "fa6-solid:layer-group",
              collapsible: true,
              children: [
                {
                  text: "std::vector",
                  icon: "fa6-solid:arrow-up-right-dots",
                  link: "/langs/cpp/05-stl/99-reference/vector.md",
                },
                {
                  text: "std::deque",
                  icon: "fa6-solid:arrows-left-right-to-line",
                  link: "/langs/cpp/05-stl/99-reference/deque.md",
                },
                {
                  text: "std::array",
                  icon: "fa6-solid:table-cells",
                  link: "/langs/cpp/05-stl/99-reference/array.md",
                },
                {
                  text: "std::list",
                  icon: "fa6-solid:arrow-right-arrow-left",
                  link: "/langs/cpp/05-stl/99-reference/list.md",
                },
                {
                  text: "std::forward_list",
                  icon: "fa6-solid:arrow-right-long",
                  link: "/langs/cpp/05-stl/99-reference/forward_list.md",
                },
                {
                  text: "std::string",
                  icon: "fa6-solid:font",
                  link: "/langs/cpp/05-stl/99-reference/string.md",
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
                  link: "/langs/cpp/05-stl/99-reference/set.md",
                },
                {
                  text: "std::multiset",
                  icon: "fa6-solid:circle-nodes",
                  link: "/langs/cpp/05-stl/99-reference/multiset.md",
                },
                {
                  text: "std::map",
                  icon: "fa6-solid:sitemap",
                  link: "/langs/cpp/05-stl/99-reference/map.md",
                },
                {
                  text: "std::multimap",
                  icon: "fa6-solid:sitemap",
                  link: "/langs/cpp/05-stl/99-reference/multimap.md",
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
                  link: "/langs/cpp/05-stl/99-reference/unordered_set.md",
                },
                {
                  text: "std::unordered_multiset",
                  icon: "fa6-solid:braille",
                  link: "/langs/cpp/05-stl/99-reference/unordered_multiset.md",
                },
                {
                  text: "std::unordered_map",
                  icon: "fa6-solid:hashtag",
                  link: "/langs/cpp/05-stl/99-reference/unordered_map.md",
                },
                {
                  text: "std::unordered_multimap",
                  icon: "fa6-solid:hashtag",
                  link: "/langs/cpp/05-stl/99-reference/unordered_multimap.md",
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
                  link: "/langs/cpp/05-stl/99-reference/stack.md",
                },
                {
                  text: "std::queue",
                  icon: "fa6-solid:people-line",
                  link: "/langs/cpp/05-stl/99-reference/queue.md",
                },
                {
                  text: "std::priority_queue",
                  icon: "fa6-solid:arrow-down-1-9",
                  link: "/langs/cpp/05-stl/99-reference/priority_queue.md",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      text: "现代 C++",
      icon: "ri:flashlight-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/cpp/06-modern",
      children: [
        {
          text: "现代 C++ 总览",
          icon: "ri:menu-2-line",
          link: "/langs/cpp/06-modern/README.md",
        },
        {
          text: "现代 C++ 入门",
          icon: "ri:star-line",
          link: "/langs/cpp/06-modern/cpp-modern.md",
        },
      ],
    },
    {
      text: "并发编程",
      icon: "ri:git-merge-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/cpp/07-concurrency",
      children: [
        {
          text: "并发编程总览",
          icon: "ri:menu-2-line",
          link: "/langs/cpp/07-concurrency/README.md",
        },
      ],
    },
    {
      text: "实战项目",
      icon: "ri:code-box-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/cpp/08-practice",
      children: [
        {
          text: "项目总览",
          icon: "ri:menu-2-line",
          link: "/langs/cpp/08-practice/README.md",
        },
      ],
    },
  ],

  "/langs/python/": [
    {
      text: "Python 概述",
      icon: "logos:python",
      link: "/langs/python/",
    },
    {
      text: "概述与环境",
      icon: "ri:information-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/00-overview",
      children: [
        {
          text: "概述与环境总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/00-overview/README.md",
        },
        {
          text: "Python 概述",
          icon: "ri:book-2-line",
          link: "/langs/python/00-overview/py-overview.md",
        },
        {
          text: "环境安装配置",
          icon: "ri:download-cloud-2-line",
          link: "/langs/python/00-overview/py-env.md",
        },
        {
          text: "Hello World",
          icon: "ri:hand-coin-line",
          link: "/langs/python/00-overview/hello-world.md",
        },
      ],
    },
    {
      text: "基础语法",
      icon: "ri:code-s-slash-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/01-basics",
      children: [
        {
          text: "基础语法总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/01-basics/README.md",
        },
        {
          text: "变量与数据类型",
          icon: "ri:database-2-line",
          link: "/langs/python/01-basics/variables.md",
        },
        {
          text: "运算符",
          icon: "ri:calculator-line",
          link: "/langs/python/01-basics/operators.md",
        },
        {
          text: "流程控制",
          icon: "ri:flow-chart",
          link: "/langs/python/01-basics/control-flow.md",
        },
        {
          text: "字符串操作",
          icon: "ri:font-size-2",
          link: "/langs/python/01-basics/strings.md",
        },
      ],
    },
    {
      text: "数据结构",
      icon: "ri:layout-grid-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/02-data-structures",
      children: [
        {
          text: "数据结构总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/02-data-structures/README.md",
        },
        {
          text: "列表",
          icon: "ri:list-ordered",
          link: "/langs/python/02-data-structures/lists.md",
        },
        {
          text: "元组",
          icon: "ri:link",
          link: "/langs/python/02-data-structures/tuples.md",
        },
        {
          text: "字典",
          icon: "ri:book-mark-line",
          link: "/langs/python/02-data-structures/dicts.md",
        },
        {
          text: "集合",
          icon: "ri:checkbox-blank-circle-line",
          link: "/langs/python/02-data-structures/sets.md",
        },
      ],
    },
    {
      text: "函数式编程",
      icon: "ri:function-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/03-functional",
      children: [
        {
          text: "函数式编程总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/03-functional/README.md",
        },
        {
          text: "函数",
          icon: "ri:function-line",
          link: "/langs/python/03-functional/functions.md",
        },
        {
          text: "Lambda 表达式",
          icon: "ri:lightbulb-line",
          link: "/langs/python/03-functional/lambda.md",
        },
        {
          text: "装饰器",
          icon: "ri:artboard-line",
          link: "/langs/python/03-functional/decorators.md",
        },
        {
          text: "生成器与迭代器",
          icon: "ri:refresh-line",
          link: "/langs/python/03-functional/generators.md",
        },
      ],
    },
    {
      text: "面向对象编程",
      icon: "ri:git-branch-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/04-oop",
      children: [
        {
          text: "OOP 总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/04-oop/README.md",
        },
        {
          text: "类与对象",
          icon: "ri:shape-line",
          link: "/langs/python/04-oop/classes.md",
        },
        {
          text: "继承",
          icon: "ri:git-branch-line",
          link: "/langs/python/04-oop/inheritance.md",
        },
        {
          text: "多态与封装",
          icon: "ri:shuffle-line",
          link: "/langs/python/04-oop/polymorphism.md",
        },
        {
          text: "魔术方法",
          icon: "ri:magic-line",
          link: "/langs/python/04-oop/magic-methods.md",
        },
        {
          text: "元类与属性",
          icon: "ri:settings-4-line",
          link: "/langs/python/04-oop/metaclasses.md",
        },
      ],
    },
    {
      text: "进阶特性",
      icon: "ri:lightbulb-flash-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/05-advanced",
      children: [
        {
          text: "进阶特性总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/05-advanced/README.md",
        },
        {
          text: "异常处理",
          icon: "ri:alert-line",
          link: "/langs/python/05-advanced/exceptions.md",
        },
        {
          text: "文件与 IO",
          icon: "ri:file-text-line",
          link: "/langs/python/05-advanced/files.md",
        },
        {
          text: "上下文管理器",
          icon: "ri:brackets-line",
          link: "/langs/python/05-advanced/context-managers.md",
        },
        {
          text: "模块与包",
          icon: "ri:package-line",
          link: "/langs/python/05-advanced/modules.md",
        },
      ],
    },
    {
      text: "并发编程",
      icon: "ri:git-merge-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/06-concurrency",
      children: [
        {
          text: "并发编程总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/06-concurrency/README.md",
        },
        {
          text: "多线程",
          icon: "ri:team-line",
          link: "/langs/python/06-concurrency/threading.md",
        },
        {
          text: "多进程",
          icon: "ri:cpu-line",
          link: "/langs/python/06-concurrency/multiprocessing.md",
        },
        {
          text: "异步编程",
          icon: "ri:refresh-line",
          link: "/langs/python/06-concurrency/asyncio.md",
        },
        {
          text: "并发工具",
          icon: "ri:tools-line",
          link: "/langs/python/06-concurrency/concurrent-futures.md",
        },
      ],
    },
    {
      text: "测试与调试",
      icon: "ri:bug-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/07-testing",
      children: [
        {
          text: "测试与调试总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/07-testing/README.md",
        },
        {
          text: "单元测试",
          icon: "ri:test-tube-line",
          link: "/langs/python/07-testing/unit-testing.md",
        },
        {
          text: "调试技巧",
          icon: "ri:search-eye-line",
          link: "/langs/python/07-testing/debugging.md",
        },
        {
          text: "性能分析",
          icon: "ri:speed-line",
          link: "/langs/python/07-testing/profiling.md",
        },
        {
          text: "代码质量",
          icon: "ri:shield-check-line",
          link: "/langs/python/07-testing/code-quality.md",
        },
      ],
    },
    {
      text: "Web 开发",
      icon: "ri:global-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/08-web",
      children: [
        {
          text: "Web 开发总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/08-web/README.md",
        },
        {
          text: "Flask 框架",
          icon: "simple-icons:flask",
          link: "/langs/python/08-web/flask.md",
        },
        {
          text: "Django 框架",
          icon: "simple-icons:django",
          link: "/langs/python/08-web/django.md",
        },
        {
          text: "FastAPI",
          icon: "simple-icons:fastapi",
          link: "/langs/python/08-web/fastapi.md",
        },
        {
          text: "数据库操作",
          icon: "ri:database-2-line",
          link: "/langs/python/08-web/database.md",
        },
      ],
    },
    {
      text: "数据科学",
      icon: "ri:bar-chart-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/09-data-science",
      children: [
        {
          text: "数据科学总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/09-data-science/README.md",
        },
        {
          text: "NumPy",
          icon: "simple-icons:numpy",
          link: "/langs/python/09-data-science/numpy.md",
        },
        {
          text: "Pandas",
          icon: "simple-icons:pandas",
          link: "/langs/python/09-data-science/pandas.md",
        },
        {
          text: "数据可视化",
          icon: "ri:pie-chart-line",
          link: "/langs/python/09-data-science/visualization.md",
        },
        {
          text: "数据获取",
          icon: "ri:download-cloud-2-line",
          link: "/langs/python/09-data-science/data-acquisition.md",
        },
      ],
    },
    {
      text: "机器学习",
      icon: "ri:brain-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/10-ml",
      children: [
        {
          text: "机器学习总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/10-ml/README.md",
        },
        {
          text: "Scikit-learn",
          icon: "simple-icons:scikitlearn",
          link: "/langs/python/10-ml/scikit-learn.md",
        },
        {
          text: "PyTorch",
          icon: "simple-icons:pytorch",
          link: "/langs/python/10-ml/pytorch.md",
        },
        {
          text: "TensorFlow",
          icon: "simple-icons:tensorflow",
          link: "/langs/python/10-ml/tensorflow.md",
        },
        {
          text: "机器学习流程",
          icon: "ri:git-pull-request-line",
          link: "/langs/python/10-ml/ml-pipeline.md",
        },
      ],
    },
    {
      text: "自动化",
      icon: "ri:robot-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/11-automation",
      children: [
        {
          text: "自动化总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/11-automation/README.md",
        },
        {
          text: "脚本编程",
          icon: "ri:terminal-box-line",
          link: "/langs/python/11-automation/scripting.md",
        },
        {
          text: "网络爬虫",
          icon: "ri:global-line",
          link: "/langs/python/11-automation/web-scraping.md",
        },
        {
          text: "GUI 自动化",
          icon: "ri:mouse-line",
          link: "/langs/python/11-automation/gui-automation.md",
        },
        {
          text: "自动化工具",
          icon: "ri:tools-line",
          link: "/langs/python/11-automation/automation-tools.md",
        },
      ],
    },
    {
      text: "Python 高级",
      icon: "ri:rocket-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/12-advanced-python",
      children: [
        {
          text: "Python 高级总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/12-advanced-python/README.md",
        },
        {
          text: "描述器协议",
          icon: "ri:stack-line",
          link: "/langs/python/12-advanced-python/descriptors.md",
        },
        {
          text: "元类编程",
          icon: "ri:code-box-line",
          link: "/langs/python/12-advanced-python/metaclasses.md",
        },
        {
          text: "反射与动态",
          icon: "ri:magic-line",
          link: "/langs/python/12-advanced-python/reflection.md",
        },
        {
          text: "高级协程",
          icon: "ri:refresh-line",
          link: "/langs/python/12-advanced-python/advanced-async.md",
        },
      ],
    },
    {
      text: "工程实践",
      icon: "ri:build-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/13-engineering",
      children: [
        {
          text: "工程实践总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/13-engineering/README.md",
        },
        {
          text: "项目结构",
          icon: "ri:folder-line",
          link: "/langs/python/13-engineering/project-structure.md",
        },
        {
          text: "依赖管理",
          icon: "ri:links-line",
          link: "/langs/python/13-engineering/dependency-management.md",
        },
        {
          text: "打包发布",
          icon: "ri:upload-cloud-line",
          link: "/langs/python/13-engineering/packaging.md",
        },
        {
          text: "容器化部署",
          icon: "simple-icons:docker",
          link: "/langs/python/13-engineering/docker.md",
        },
      ],
    },
    {
      text: "实战项目",
      icon: "ri:code-box-line",
      collapsible: true,
      expanded: false,
      prefix: "/langs/python/14-practice",
      children: [
        {
          text: "项目总览",
          icon: "ri:menu-2-line",
          link: "/langs/python/14-practice/README.md",
        },
      ],
    },
  ],
});
