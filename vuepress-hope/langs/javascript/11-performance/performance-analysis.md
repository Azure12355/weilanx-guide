---
title: 性能分析
icon: ri:bar-chart-line
order: 4
---

# 性能分析

性能分析是识别和解决性能瓶颈的关键步骤。

## Chrome DevTools

### Performance 面板

```javascript
// Performance 面板：分析运行时性能

// 使用步骤
// 1. 打开 DevTools → Performance
// 2. 点击 Record
// 3. 执行要分析的操作
// 4. 点击 Stop
// 5. 分析结果

// 关键指标解读

// FPS（Frames Per Second）：帧率
// - 目标：60 FPS（16.67ms/frame）
// - < 30 FPS：明显卡顿
// - < 20 FPS：严重卡顿

// CPU：CPU 使用时间
// - 蓝色：HTML 解析
// - 黄色：JavaScript 执行
// - 紫色：样式计算
// - 绿色：重排重绘
// - 灰色：空闲时间

// Heap：堆内存使用
// - 监控内存增长
// - 识别内存泄漏

// Network：网络请求
// - 请求时间线
// - 请求大小
// - 瀑布图

// 在代码中添加标记
performance.mark('app-start');

async function initApp() {
    performance.mark('data-fetch-start');
    const data = await fetchData();
    performance.mark('data-fetch-end');

    performance.mark('render-start');
    renderApp(data);
    performance.mark('render-end');

    performance.measure('data-fetch', 'data-fetch-start', 'data-fetch-end');
    performance.measure('render', 'render-start', 'render-end');
    performance.measure('app-init', 'app-start', 'render-end');
}

initApp().then(() => {
    performance.mark('app-end');
    performance.measure('total', 'app-start', 'app-end');

    // 获取测量结果
    const measures = performance.getEntriesByType('measure');
    measures.forEach(measure => {
        console.log(`${measure.name}: ${measure.duration.toFixed(2)}ms`);
    });
});
```

### Memory 面板

```javascript
// Memory 面板：分析内存使用

// 堆快照（Heap Snapshot）
// 1. 选择 Heap Snapshot
// 2. 点击 Take Snapshot
// 3. 分析内存分布

// 关键指标

// Shallow Size：对象本身占用大小
// Retained Size：对象及其引用占用大小

// 内存泄漏检测
// 1. 拍摄初始快照
// 2. 执行操作（如打开/关闭页面）
// 3. 强制 GC（DevTools）
// 4. 再次拍摄快照
// 5. 对比两个快照

// Allocation Sampling：内存分配采样
// - 记录内存分配
// - 识别频繁分配的函数

// Allocation Timeline：内存分配时间线
// - 实时监控内存分配
// - 识别内存峰值

// 使用代码监控内存
function measureMemory() {
    if (!performance.memory) {
        console.log('Memory API not supported');
        return;
    }

    const used = performance.memory.usedJSHeapSize / 1024 / 1024;
    const total = performance.memory.totalJSHeapSize / 1024 / 1024;
    const limit = performance.memory.jsHeapSizeLimit / 1024 / 1024;

    console.log(`Memory: ${used.toFixed(2)} MB / ${total.toFixed(2)} MB (${limit.toFixed(2)} MB limit)`);
}

// 定期检查
setInterval(measureMemory, 5000);
```

## 性能分析工具

### Lighthouse

```bash
# Lighthouse：自动化性能测试

# 安装
npm install -g lighthouse

# 运行测试
lighthouse https://example.com

# 指定选项
lighthouse https://example.com \
  --only-categories=performance,accessibility,best-practices,seo \
  --throttling-method=devtools

# 输出格式
lighthouse https://example.com \
  --output=html \
  --output-path=./report.html

# JSON 输出
lighthouse https://example.com \
  --output=json \
  --output-path=./report.json

# 在 CI 中使用
npm install -D @lhci/cli

// lighthouserc.js
module.exports = {
    ci: {
        collect: {
            url: ['http://localhost:3000'],
            numberOfRuns: 3
        },
        assert: {
            assertions: {
                'categories:performance': ['error', { minScore: 0.9 }],
                'categories:accessibility': ['error', { minScore: 0.9 }],
                'categories:best-practices': ['error', { minScore: 0.9 }],
                'categories:seo': ['error', { minScore: 0.9 }]
            }
        }
    }
};

// package.json
{
  "scripts": {
    "lhci": "lhci autorun"
  }
}
```

### WebPageTest

```bash
# WebPageTest：在线性能测试

# 访问 https://www.webpagetest.org

# 配置选项
# - 测试位置
// - 浏览器
// - 连接速度
// - 测试次数

# 关键指标

// FCP (First Contentful Paint)：首次内容绘制
// 目标：< 1.8s

// LCP (Largest Contentful Paint)：最大内容绘制
// 目标：< 2.5s

// TTI (Time to Interactive)：可交互时间
// 目标：< 3.8s

// Speed Index：速度指数
// 目标：< 3.4s

// TBT (Total Blocking Time)：总阻塞时间
// 目标：< 200ms

// CLS (Cumulative Layout Shift)：累积布局偏移
// 目标：< 0.1

// 使用 API 测试
curl "https://www.webpagetest.org/runtest.php?url=https://example.com&k=YOUR_API_KEY"
```

## 性能指标

### Core Web Vitals

```javascript
// Core Web Vitals：核心性能指标

// 使用 web-vitals 库测量
// npm install web-vitals

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// CLS (Cumulative Layout Shift)
getCLS((metric) => {
    console.log('CLS:', metric);
    // 目标：< 0.1
    // 良好：< 0.1
    // 需改进：0.1 - 0.25
    // 差：> 0.25
});

// FID (First Input Delay)
getFID((metric) => {
    console.log('FID:', metric);
    // 目标：< 100ms
    // 良好：< 100ms
    // 需改进：100ms - 300ms
    // 差：> 300ms
});

// FCP (First Contentful Paint)
getFCP((metric) => {
    console.log('FCP:', metric);
    // 目标：< 1.8s
    // 良好：< 1.8s
    // 需改进：1.8s - 3s
    // 差：> 3s
});

// LCP (Largest Contentful Paint)
getLCP((metric) => {
    console.log('LCP:', metric);
    // 目标：< 2.5s
    // 良好：< 2.5s
    // 需改进：2.5s - 4s
    // 差：> 4s
});

// TTFB (Time to First Byte)
getTTFB((metric) => {
    console.log('TTFB:', metric);
    // 目标：< 800ms
    // 良好：< 800ms
    // 需改进：800ms - 1800ms
    // 差：> 1800ms
});

// 发送到分析服务
function sendToAnalytics(metric) {
    const body = JSON.stringify(metric);
    const url = 'https://analytics.example.com/analytics';

    if (navigator.sendBeacon) {
        navigator.sendBeacon(url, body);
    } else {
        fetch(url, { body, method: 'POST', keepalive: true });
    }
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 自定义指标

```javascript
// 自定义性能指标

// API 响应时间
function measureAPIResponse(url) {
    const start = performance.now();

    return fetch(url)
        .then(response => {
            const end = performance.now();
            const duration = end - start;

            console.log(`API Response (${url}): ${duration.toFixed(2)}ms`);

            // 发送到分析服务
            sendMetric('api_response', {
                url,
                duration
            });

            return response;
        });
}

// 渲染时间
function measureRenderTime(componentName, renderFn) {
    performance.mark(`${componentName}-render-start`);

    const result = renderFn();

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            performance.mark(`${componentName}-render-end`);
            performance.measure(
                `${componentName}-render`,
                `${componentName}-render-start`,
                `${componentName}-render-end`
            );

            const measure = performance.getEntriesByName(`${componentName}-render`)[0];
            console.log(`${componentName} Render: ${measure.duration.toFixed(2)}ms`);
        });
    });

    return result;
}

// 使用
measureRenderTime('UserProfile', () => {
    renderUserProfile();
});

// 用户交互延迟
function measureInteractionDelay(eventName, handler) {
    return function(...args) {
        const start = performance.now();

        const result = handler.apply(this, args);

        requestAnimationFrame(() => {
            const end = performance.now();
            const delay = end - start;

            console.log(`${eventName} Delay: ${delay.toFixed(2)}ms`);

            sendMetric('interaction_delay', {
                event: eventName,
                delay
            });
        });

        return result;
    };
}

// 使用
button.addEventListener('click', measureInteractionDelay('button-click', handleClick));
```

## 性能优化建议

### 优化清单

```javascript
// 性能优化清单

// 1. 加载性能
// - 使用代码分割
// - 懒加载组件
// - 预加载关键资源
// - 压缩资源文件
// - 使用 CDN

// 2. 运行时性能
// - 避免强制同步布局
// - 减少重排重绘
// - 使用虚拟列表
// - 防抖节流
// - Web Worker

// 3. 内存性能
// - 避免内存泄漏
// - 使用对象池
// - 懒加载数据
// - 清理引用

// 4. 网络性能
// - 减少 HTTP 请求
// - 使用 HTTP/2
// - 启用压缩
// - 缓存策略
// - CDN 加速

// 5. 渲染性能
// - CSS 优化
// - 减少 DOM 节点
// - 使用 transform 代替 top/left
// - 使用 will-change
// - GPU 加速
```

### 性能监控

```javascript
// 实时性能监控

class PerformanceMonitor {
    constructor() {
        this.metrics = [];
    }

    measure(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();

        const duration = end - start;
        this.metrics.push({ name, duration, timestamp: Date.now() });

        return result;
    }

    async measureAsync(name, fn) {
        const start = performance.now();
        const result = await fn();
        const end = performance.now();

        const duration = end - start;
        this.metrics.push({ name, duration, timestamp: Date.now() });

        return result;
    }

    getStats(name) {
        const filtered = this.metrics.filter(m => m.name === name);
        if (filtered.length === 0) return null;

        const durations = filtered.map(m => m.duration);
        return {
            count: durations.length,
            min: Math.min(...durations),
            max: Math.max(...durations),
            avg: durations.reduce((a, b) => a + b) / durations.length,
            p95: this.percentile(durations, 95)
        };
    }

    percentile(arr, p) {
        const sorted = arr.slice().sort((a, b) => a - b);
        const index = Math.ceil((p / 100) * sorted.length) - 1;
        return sorted[index];
    }

    report() {
        const names = [...new Set(this.metrics.map(m => m.name))];
        const report = {};

        names.forEach(name => {
            report[name] = this.getStats(name);
        });

        return report;
    }
}

// 使用
const monitor = new PerformanceMonitor();

// 监控函数
const result = monitor.measure('data-processing', () => {
    return processData();
});

// 监控异步函数
const data = await monitor.measureAsync('api-fetch', () => {
    return fetch('/api/data').then(r => r.json());
});

// 获取统计
console.log(monitor.getStats('api-fetch'));
// {
//   count: 100,
//   min: 45.2,
//   max: 234.5,
//   avg: 87.3,
//   p95: 156.7
// }

// 生成报告
console.log(monitor.report());
```

## 性能分析最佳实践

```javascript
// ✅ 推荐做法

// 1. 定期进行性能测试
// - 每次发布前
// - 每周自动测试
// - 性能回归检测

// 2. 监控关键指标
// - Core Web Vitals
// - 自定义业务指标
// - API 响应时间

// 3. 设置性能预算
{
  "budgets": [
    {
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 200
        },
        {
          "resourceType": "stylesheet",
          "budget": 50
        }
      ]
    }
  ]
}

// 4. 使用性能分析工具
// - Chrome DevTools
// - Lighthouse
// - WebPageTest

// 5. 持续优化
// - 识别瓶颈
// - 优化热点
// - 验证效果

// ❌ 不推荐做法

// 1. 忽略性能测试
// - 不进行性能测试
// - 不关注性能指标

// 2. 盲目优化
// - 不测量就优化
// - 过早优化

// 3. 忽视用户体验
// - 只关注技术指标
// - 不考虑实际体验

// 4. 一次性优化
// - 不持续监控
// - 不持续改进
```

::: tip 性能分析检查清单

- [ ] 使用 Chrome DevTools
- [ ] 监控 Core Web Vitals
// 3. 设置性能预算
// 4. 使用自动化工具
// 5. 持续监控优化

:::

::: tip 性能优化回顾

恭喜！你已掌握性能优化的核心知识：

- [x] 性能基础
- [x] 异步优化
- [x] 内存优化
- [x] 性能分析

接下来学习测试调试 → [测试调试](../12-testing-debugging/testing-basics.md)
:::
