---
title: 测试调试总结
icon: ri:check-double-line
order: 4
---

# 测试调试总结

测试和调试是保证代码质量和稳定性的核心技能。

## 测试策略

### 测试金字塔

```javascript
// 测试金字塔：测试分层策略

//        /\
//       /E2E\        端到端测试（少量）
//      /------\
//     /Integration\  集成测试（适量）
//    /------------\
//   /   Unit Tests  \ 单元测试（大量）
//  /----------------\

// 单元测试：70%
// - 快速执行
// - 隔离测试
// - 易于维护

// 集成测试：20%
// - 测试模块交互
// - 端到端流程
// - 需要真实环境

// 端到端测试：10%
// - 用户视角
// - 完整流程
// - 慢但真实
```

### TDD 与 BDD

```javascript
// TDD（测试驱动开发）
// 红绿重构循环

// 1. Red：编写失败的测试
test('add: should add two numbers', () => {
    expect(add(1, 2)).toBe(3);  // 失败：函数未实现
});

// 2. Green：实现最小功能
function add(a, b) {
    return 3;  // 通过测试
}

// 3. Refactor：重构代码
function add(a, b) {
    return a + b;  // 正确实现
}

// BDD（行为驱动开发）
// describe/should 语法
describe('Calculator', () => {
    it('should add two numbers', () => {
        const calc = new Calculator();
        calc.add(2);
        calc.add(3);
        calc.result.should.equal(5);
    });
});
```

## CI/CD 集成

### 自动化测试

```yaml
# GitHub Actions：自动化测试

# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm test

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### 测试覆盖率

```javascript
// 测试覆盖率配置

// Jest 配置
// jest.config.js
module.exports = {
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.test.{js,jsx}',
        '!src/**/*.spec.{js,jsx}',
        '!src/**/__tests__/**'
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    coverageReporters: [
        'text',
        'lcov',
        'html'
    ]
};

// 运行覆盖率测试
// npm run test:coverage

// 覆盖率报告
// -----------|---------|----------|---------|---------|-------------------
// File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
// -----------|---------|----------|---------|---------|-------------------
// All files  |   92.5  |    87.5  |   100   |   92.5  |
//  math.js   |   100   |   100    |   100   |   100   |
//  utils.js  |   85    |    75    |   100   |   85    | 15,25
// -----------|---------|----------|---------|---------|-------------------
```

## 调试工作流

### 系统化调试

```javascript
// 调试工作流程

// 1. 重现问题
function reproduceIssue() {
    // 编写最小复现用例
    const input = { /* 触发问题的输入 */ };
    const result = process(input);
    console.log('Result:', result);
}

// 2. 添加日志
function debugLog() {
    console.group('Debug Info');
    console.log('Input:', input);
    console.log('State:', state);
    console.log('Variables:', { var1, var2, var3 });
    console.groupEnd();
}

// 3. 设置断点
function breakpoint() {
    debugger;  // 在关键位置暂停
}

// 4. 检查变量
function inspectVariables() {
    console.table([
        { variable: 'input', value: input, type: typeof input },
        { variable: 'state', value: state, type: typeof state },
        { variable: 'result', value: result, type: typeof result }
    ]);
}

// 5. 单步执行
// 使用 DevTools 单步执行，观察变量变化

// 6. 定位问题
// 找到导致错误的具体代码行

// 7. 修复问题
function fixIssue() {
    // 修复代码
}

// 8. 验证修复
function verifyFix() {
    // 确认问题已解决
    // 添加测试防止回归
}
```

### 远程调试

```javascript
// 远程调试：调试服务器代码

// Node.js 调试模式
// node --inspect app.js

// Chrome DevTools 连接
// 1. 打开 chrome://inspect
// 2. 点击 "inspect"
// 3. 连接到 Node.js 进程

// VS Code 远程调试
// .vscode/launch.json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Remote",
  "address": "localhost",
  "port": 9229,
  "remoteRoot": "/app/",
  "localRoot": "${workspaceFolder}"
}

// 浏览器远程调试
// 启动 Chrome 时添加参数
// chrome --remote-debugging-port=9222
```

## 性能分析

### 性能剖析

```javascript
// 性能剖析：识别性能瓶颈

// CPU Profiling
// 1. DevTools → Performance
// 2. 点击 Record
// 3. 执行操作
// 4. 停止记录
// 5. 分析火焰图

// Memory Profiling
// 1. DevTools → Memory
// 2. 拍摄堆快照
// 3. 执行操作
// 4. 再次拍摄快照
// 5. 对比差异

// 性能 API
performance.mark('operation-start');
// ... 操作
performance.mark('operation-end');
performance.measure('operation', 'operation-start', 'operation-end');

const measure = performance.getEntriesByName('operation')[0];
console.log(`Duration: ${measure.duration}ms`);
```

### 网络分析

```javascript
// 网络分析：监控网络请求

// Network 面板
// - 请求时间线
// - 请求大小
// - 响应状态
// - 瀑布图

// 监控请求
performance.getEntriesByType('resource').forEach(resource => {
    console.log(`${resource.name}: ${resource.duration}ms`);
});

// Resource Timing API
const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        console.log('Resource:', entry.name);
        console.log('Duration:', entry.duration);
        console.log('Size:', entry.transferSize);
    });
});

observer.observe({ entryTypes: ['resource'] });
```

## 错误监控

### 生产环境监控

```javascript
// 错误监控：捕获生产环境错误

// Sentry：错误监控服务
import * as Sentry from '@sentry/browser';

Sentry.init({
    dsn: 'YOUR_DSN',
    environment: process.env.NODE_ENV
});

// 捕获错误
try {
    // 可能出错的代码
} catch (error) {
    Sentry.captureException(error);
}

// 捕获消息
Sentry.captureMessage('User feedback', {
    level: 'info',
    extra: {
        feedback: 'Good experience'
    }
});

// 用户上下文
Sentry.setUser({
    id: '123',
    username: 'alice',
    email: 'alice@example.com'
});

// 自定义面包屑（ breadcrumbs ）
Sentry.addBreadcrumb({
    message: 'User clicked button',
    category: 'user',
    level: 'info'
});
```

### 日志管理

```javascript
// 日志管理：结构化日志

// Winston：日志库
import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// 使用
logger.info('User logged in', {
    userId: '123',
    username: 'alice'
});

logger.error('Failed to fetch data', {
    url: '/api/data',
    error: error.message
});

// Pino：高性能日志
import pino from 'pino';

const logger = pino({
    level: 'info',
    formatters: {
        level: (label) => {
            return { level: label };
        }
    }
});

logger.info({
    msg: 'User logged in',
    userId: '123'
});
```

## 最佳实践总结

### 测试清单

```javascript
// ✅ 测试最佳实践

// 1. 遵循测试金字塔
// - 大量单元测试
// - 适量集成测试
// - 少量 E2E 测试

// 2. 测试应该快速
// - 使用 Mock 隔离外部依赖
// - 避免真实网络请求
// - 并行运行测试

// 3. 测试应该独立
// - 每个测试独立运行
// - 不依赖其他测试
// - 清理副作用

// 4. 测试应该可维护
// - 清晰的测试名称
// - 良好的测试组织
// - 避免重复代码

// 5. 持续集成测试
// - 每次提交运行测试
// - 阻止合并失败测试
// - 自动生成覆盖率报告
```

### 调试清单

```javascript
// ✅ 调试最佳实践

// 1. 系统化调试流程
// - 重现问题
// - 添加日志
// - 设置断点
// - 定位问题
// - 修复验证

// 2. 使用正确工具
// - DevTools 断点调试
// - VS Code 集成调试
// - Console 输出分析
// - 性能分析工具

// 3. 良好的错误处理
// - 捕获异常
// - 记录错误
// - 友好提示
// - 错误监控

// 4. 防止错误发生
// - TypeScript 类型检查
// - ESLint 代码检查
// - 单元测试覆盖
// - Code Review

// 5. 记录调试过程
// - 文档化已知问题
// - 记录解决方案
// - 分享调试经验
```

::: tip 测试调试检查清单

- [ ] 遵循测试金字塔
- [ ] 编写可维护测试
- [ ] 使用 CI/CD 集成
- [ ] 系统化调试流程
- [ ] 使用正确工具
- [ ] 实施错误监控

:::

::: tip 测试调试回顾

恭喜！你已掌握测试调试的核心知识：

- [x] 测试基础
- [x] 断言与 Mock
- [x] 调试技巧
- [x] 测试调试总结

接下来学习设计模式 → [设计模式](../13-design-patterns/creational-patterns.md)
:::
