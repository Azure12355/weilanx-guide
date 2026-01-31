---
title: 测试与调试
icon: ri:bug-line
order: 8
---

# 测试与调试

学习 Python 测试框架、调试技巧和性能分析。

## 学习内容

<VPCard
  title="单元测试"
  desc="unittest、pytest、测试夹具、参数化测试"
  logo="https://api.iconify.design/ri/test-tube-line.svg"
  link="/langs/python/07-testing/unit-testing.md"
/>

<VPCard
  title="调试技巧"
  desc="pdb、breakpoint、IDE 调试、日志记录"
  logo="https://api.iconify.design/ri-search-eye-line.svg"
  link="/langs/python/07-testing/debugging.md"
/>

<VPCard
  title="性能分析"
  desc="cProfile、timeit、memory_profiler"
  logo="https://api.iconify.design/ri-speed-line.svg"
  link="/langs/python/07-testing/profiling.md"
/>

<VPCard
  title="代码质量"
  desc="pylint、flake8、mypy、black"
  logo="https://api.iconify.design/ri-shield-check-line.svg"
  link="/langs/python/07-testing/code-quality.md"
/>

## 测试金字塔

```
        /\
       /E2E\         端到端测试（少量）
      /------\
     /  集成  \       集成测试（适量）
    /----------\
   /   单元测试   \    单元测试（大量）
  /--------------\
```

## 调试工具对比

| 工具 | 用途 | 优点 |
|------|------|------|
| pdb | 命令行调试 | 无需IDE，服务器调试 |
| breakpoint() | 断点调试 | Python 3.7+ 内置 |
| logging | 日志记录 | 生产环境追踪 |
| pdb++ | 增强pdb | 语法高亮、tab补全 |
| ipdb | IPython集成 | 更好的交互体验 |

## 性能优化建议

::: tip 优化原则

1. **先测量，后优化**
2. **算法优先**：优化算法比优化代码更有效
3. **使用内置函数**：用 C 实现更快
4. **避免全局变量**：局部变量访问更快
5. **使用生成器**：节省内存
:::

::: warning 过早优化

> "过早优化是万恶之源" —— Donald Knuth

只在确定性能瓶颈后进行优化。
:::
