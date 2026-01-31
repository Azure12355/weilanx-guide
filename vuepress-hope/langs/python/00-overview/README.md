---
title: Python 概述与环境
icon: ri:information-line
order: 1
---

# Python 概述与环境

了解 Python 语言的历史、特点，搭建开发环境。

## 学习内容

<VPCard
  title="Python 概述"
  desc="Python 语言历史、版本演进、应用领域"
  logo="https://api.iconify.design/ri/book-2-line.svg"
  link="/langs/python/00-overview/py-overview.md"
/>

<VPCard
  title="环境安装配置"
  desc="Python 安装、虚拟环境、IDE 配置"
  logo="https://api.iconify.design/ri/download-cloud-2-line.svg"
  link="/langs/python/00-overview/py-env.md"
/>

<VPCard
  title="Hello World"
  desc="第一个 Python 程序"
  logo="https://api.iconify.design/ri/hand-coin-line.svg"
  link="/langs/python/00-overview/hello-world.md"
/>

## Python 版本时间线

```mermaid
timeline
    title Python 版本演进
    1991 : Python 0.9.0 : Guido 发布初版
    2000 : Python 2.0 : 列表推导式、垃圾回收
    2008 : Python 3.0 : 重大重构、不兼容 2.x
    2011 : Python 3.2 : argparse、concurrent.futures
    2015 : Python 3.5 : async/await、类型提示
    2018 : Python 3.7 : dataclass、breakpoint()
    2020 : Python 3.9 : 字符合并运算符、类型提示改进
    2022 : Python 3.11 : 性能提升、异常组
    2024 : Python 3.13 : 实验性 JIT、REPL 改进
```

## 开发工具推荐

::: tabs

@tab IDE

- **PyCharm**：功能强大的 Python IDE
- **VS Code**：轻量级，插件丰富
- **Jupyter**：数据科学交互式开发

@tab 包管理

- **pip**：官方包管理器
- **conda**：跨平台包管理
- **poetry**：现代依赖管理工具

@tab 虚拟环境

- **venv**：内置虚拟环境
- **virtualenv**：第三方虚拟环境
- **conda env**：Conda 环境管理

:::
