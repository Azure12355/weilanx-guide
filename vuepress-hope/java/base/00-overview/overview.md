---
title: Java 概述
icon: ri:book-2-line
order: 1
category: Java基础
tag: 概述
description: Java 语言起源、特点、技术体系及运行机制
---

# Java 概述

Java 是一门**面向对象**的编程语言，不仅吸收了 C++ 语言的各种优点，还摒弃了 C++ 里难以理解的多继承、指针等概念。

## Java 发展史

```mermaid
timeline
    title Java 发展历程
    1991 : Oak 语言诞生
    1995 : Java 正式发布
    1998 : JDK 1.2 集合框架 JIT
    2004 : JDK 5.0 泛型 枚举 注解 自动装箱 for-each 可变参数
    2011 : Java 7 try-with-resources 钻石操作符
    2014 : Java 8 Lambda Stream API Optional 新日期API
    2017 : Java 9 模块系统 JShell
    2018 : Java 11 LTS HTTP Client 本地变量类型推断
    2021 : Java 17 LTS Record Sealed Classes 文本块 模式匹配
    2023 : Java 21 LTS 虚拟线程 字符串模板 模式匹配增强
```

**重要版本特性**：

::: tabs

@tab JDK 5.0 (2004)

- 泛型（Generics）
- 枚举（Enum）
- 注解（Annotation）
- 自动装箱/拆箱
- for-each 循环
- 可变参数
- 静态导入

@tab Java 8 (2014)

- Lambda 表达式
- Stream API
- Optional 类
- 新日期时间 API
- 默认方法

@tab Java 17 (2021)

- Record 类
- 模式匹配
- Sealed Classes
- 文本块
- 增强 Switch

@tab Java 21+ (2023)

- 虚拟线程
- 字符串模板
- 模式匹配增强
- 作用域值
- 结构化并发

:::

## Java 主要特点

::: tabs

@tab 跨平台性

**Write Once, Run Anywhere**（一次编写，到处运行）

Java 通过 **JVM（Java 虚拟机）** 实现跨平台：

```mermaid
graph LR
    A[.java 源代码] -->|编译| B[.class 字节码]
    B --> C[JVM - Windows]
    B --> D[JVM - Linux]
    B --> E[JVM - macOS]
    C --> F[运行结果]
    D --> F
    E --> F
```

::: tip 核心机制
- **源代码** (.java) → **编译器** → **字节码** (.class)
- **字节码** → **JVM** → **机器码** → **执行**
:::

@tab 面向对象

Java 是纯面向对象语言，三大核心特性：

```mermaid
graph TD
    A[面向对象] --> B[封装 Encapsulation]
    A --> C[继承 Inheritance]
    A --> D[多态 Polymorphism]
    
    B --> B1[隐藏实现细节]
    B --> B2[数据安全]
    B --> B3[高内聚低耦合]
    
    C --> C1[代码复用]
    C --> C2[层次结构]
    C --> C3[is-a 关系]
    
    D --> D1[统一接口]
    D --> D2[灵活调用]
    D --> D3[运行时绑定]
```

@tab 自动内存管理

**GC（Garbage Collection）垃圾回收机制**

```mermaid
graph LR
    A[新对象创建] -->|堆内存| B[年轻代 Young Gen]
    B -->|存活| C[老年代 Old Gen]
    B -->|死亡| D[GC 回收]
    C -->|死亡| D
    D -->|释放| E[可用内存]
```

::: tip GC 优势
- **自动回收**：无需手动释放内存
- **防止内存泄漏**：自动检测无用对象
- **提高开发效率**：专注于业务逻辑
:::

@tab 健壮性

Java 设计注重**安全性**和**稳定性**：

| 特性 | 说明 |
|------|------|
| **强类型检查** | 编译时检测类型错误 |
| **数组边界检查** | 自动检测数组越界 |
| **无指针操作** | 避免内存非法访问 |
| **异常处理机制** | 优雅处理运行时错误 |
| **自动垃圾回收** | 防止内存泄漏 |

@tab 多线程

**内置多线程支持**

```java
// 创建线程的多种方式
// 1. 继承 Thread 类
class MyThread extends Thread {
    public void run() {
        // 线程执行代码
    }
}

// 2. 实现 Runnable 接口
class MyRunnable implements Runnable {
    public void run() {
        // 线程执行代码
    }
}
```

:::

## Java 技术体系

Java 平台包含三个主要版本：

```mermaid
graph TD
    A[Java 技术体系] --> B[Java SE]
    A --> C[Java EE]
    A --> D[Java ME]
    
    B --> B1[标准版]
    B --> B2[桌面应用]
    B --> B3[基础核心]
    B --> B4[其他版本基础]
    
    C --> C1[企业版]
    C --> C2[Web 应用]
    C --> C3[分布式系统]
    C --> C4[基于 Java SE]
    
    D --> D1[微型版]
    D --> D2[移动设备]
    D --> D3[嵌入式系统]
    D --> D4[简化版 Java SE]
```

### Java SE（Java Standard Edition）

**标准版**，是 Java 技术的核心和基础：

| 内容 | 说明 |
|------|------|
| **核心语法** | 基本数据类型、运算符、流程控制 |
| **面向对象** | 类、对象、继承、多态、接口 |
| **核心类库** | 集合、IO、线程、网络编程 |
| **基础 API** | String、Math、日期时间等 |

**应用场景**：桌面应用程序、基础框架开发

### Java EE（Java Enterprise Edition）

**企业版**，用于构建企业级应用：

| 内容 | 说明 |
|------|------|
| **Web 开发** | Servlet、JSP |
| **框架技术** | Spring、Spring Boot、MyBatis |
| **分布式** | Web Services、RESTful API |
| **消息队列** | JMS |
| **事务管理** | JTA |

**应用场景**：企业级后端系统、大型网站、微服务

### Java ME（Java Micro Edition）

**微型版**，用于嵌入式和移动设备：

::: info 当前状态
Java ME 已逐渐被 **Android**（基于 Java 但非 Java ME）和其他技术取代
:::

## JDK vs JRE vs JVM

```mermaid
graph TD
    A[JDK Java Development Kit] --> B[JRE Java Runtime Environment]
    B --> C[JVM Java Virtual Machine]
    
    A --> A1[开发工具 javac, jar, jdb]
    A --> A2[核心类库 rt.jar, tools.jar]
    A --> B
    A --> C
    
    B --> B1[运行类库 Java API]
    B --> C
    
    C --> C1[类加载器]
    C --> C2[字节码验证器]
    C --> C3[JIT 编译器]
    C --> C4[垃圾回收器]
    C --> C5[内存管理]
```

| 组件 | 全称 | 说明 |
|------|------|------|
| **JDK** | Java Development Kit | Java 开发工具包，**包含 JRE** |
| **JRE** | Java Runtime Environment | Java 运行环境，**包含 JVM** |
| **JVM** | Java Virtual Machine | Java 虚拟机，**核心运行引擎** |

::: tip 选择建议
- **开发 Java 程序**：安装 JDK
- **仅运行 Java 程序**：安装 JRE
- **学习 Java**：安装 JDK
:::

## Java 运行机制

### 编译与执行流程

```mermaid
sequenceDiagram
    participant Dev as 开发者
    participant File as .java 源文件
    participant Javac as javac 编译器
    participant Class as .class 字节码
    participant JVM as JVM 虚拟机
    participant HW as 硬件
    
    Dev->>File: 编写源代码
    File->>Javac: javac HelloWorld.java
    Javac->>Class: 编译生成字节码
    Class->>JVM: java HelloWorld
    JVM->>JVM: 类加载
    JVM->>JVM: 字节码验证
    JVM->>JVM: JIT 编译
    JVM->>HW: 执行机器码
    HW->>Dev: 输出结果
```

### JVM 工作原理

```mermaid
flowchart TD
    A[.class 字节码] --> B[类加载器 Class Loader]
    B --> C[方法区 Method Area]
    B --> D[堆内存 Heap]
    
    E[执行引擎] --> F[解释器 Interpreter]
    E --> G[JIT 编译器 Just-In-Time]
    E --> H[GC 垃圾回收]
    
    C --> E
    D --> E
    
    G --> I[本地方法接口 JNI]
    I --> J[本地方法库 Native Library]
```

| 组件 | 功能 |
|------|------|
| **类加载器** | 负责加载 .class 文件到内存 |
| **方法区** | 存储类信息、常量、静态变量 |
| **堆内存** | 存储对象实例 |
| **栈内存** | 存储方法调用和局部变量 |
| **程序计数器** | 记录当前执行的字节码位置 |
| **本地方法栈** | 为 native 方法服务 |

## Java 应用领域

```mermaid
mindmap
  root((Java 应用领域))
    Web开发
      企业后台
      电商平台
      内容管理
    移动开发
      Android应用
      跨平台应用
    大数据
      Hadoop
      Spark
      Flink
    云计算
      微服务
      Docker
      Kubernetes
    嵌入式
      智能家居
      IoT设备
    桌面应用
      IDE工具
      办公软件
```

## 为什么选择 Java？

::: tabs

@tab 优势

| 优势 | 说明 |
|------|------|
| :hexagon-badge: **跨平台** | 一次编写，到处运行 |
| :dizzy: **面向对象** | 代码结构清晰，易于维护 |
| :shield-check: **安全性** | 内置安全机制，防止恶意代码 |
| :battery-charging: **高性能** | JIT 编译器优化执行效率 |
| :robot: **自动化** | GC 自动管理内存 |
| :team: **生态丰富** | 海量开源库和框架 |
| :line-clamp: **多线程** | 内置并发支持 |
| :scale: **可扩展** | 适用于从小型到大型的项目 |

@tab 劣势

| 劣势 | 说明 |
|------|------|
| :hourglass: **启动较慢** | JVM 需要初始化 |
| :memory: **内存占用** | 相对 C/C++ 更高 |
| :chart-line: **执行速度** | 略低于编译型语言 |
| :file-code: **代码冗长** | 语法相对繁琐 |

:::

## 小结

::: tip 核心要点

1. **Java 是一门面向对象的编程语言**
2. **核心特点**：跨平台、面向对象、自动内存管理、健壮性、多线程
3. **技术体系**：Java SE（标准版）、Java EE（企业版）、Java ME（微型版）
4. **运行机制**：源代码 → 字节码 → JVM → 机器码
5. **三大组件**：JDK（开发工具包）、JRE（运行环境）、JVM（虚拟机）

:::

::: info 下一步
- [JDK 安装配置](/java/base/00-overview/jdk-install.md) - 搭建开发环境
- [Hello World](/java/base/00-overview/hello-world.md) - 编写第一个 Java 程序
:::
