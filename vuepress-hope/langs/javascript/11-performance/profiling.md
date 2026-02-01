---
title: 性能分析
icon: ri-bar-chart-box-line
order: 5
---

# 性能分析

使用性能分析工具定位和解决性能瓶颈。

## Chrome DevTools

### Performance 面板

```javascript
// Performance 面板使用

// 1. 录制性能
// - 打开 DevTools
// - 切换到 Performance 面板
// - 点击 Record
// - 执行操作
// - 点击 Stop
// - 分析结果

// 2. 标记关键点
performance.mark('app-start');
// 应用初始化
performance.mark('app-ready');
performance.measure('startup', 'app-start', 'app-ready');

// 3. 用户标记
performance.measure('user-action', 'action-start', 'action-end');

// 示例：分析函数性能
function analyzeFunction() {
    performance.mark('func-start');

    // 执行操作
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
        sum += i;
    }

    performance.mark('func-end');
    performance.measure('function-execution', 'func-start', 'func-end');

    const measures = performance.getEntriesByName('function-execution');
    console.log(`Execution time: ${measures[0].duration}ms`);
}

analyzeFunction();
```

### Memory 面板

```javascript
// Memory 面板使用

// 1. 堆快照
// - Take Heap Snapshot
// - 查看对象分布
// - 查找内存泄漏

// 2. 分配时间线
// - Allocation sampling
// - 查看内存分配
// - 定位内存问题

// 3. 对比快照
// Snapshot 1
const snapshot1 = performance.memory;

// 执行操作
function createObjects() {
    const objects = [];
    for (let i = 0; i < 1000; i++) {
        objects.push({ id: i, data: new Array(100) });
    }
    return objects;
}

const result = createObjects();

// Snapshot 2
const snapshot2 = performance.memory;

// 对比差异

// 4. 检测分离的 DOM
// Detached DOM 节点仍占用内存
function createDetachedDOM() {
    const div = document.createElement('div');
    div.innerHTML = 'Detached';
    // 未添加到文档，但被引用
    return div;
}

const detached = createDetachedDOM();
// detached 占用内存但不可见
```

### Coverage 面板

```javascript
// Coverage 面板：代码覆盖率分析

// 1. JavaScript 覆盖率
// 查看哪些代码被执行
function usedCode() {
    console.log('This code is used');
}

function unusedCode() {
    console.log('This code is never used');
}

usedCode();  // 标记为已使用

// 2. CSS 覆盖率
// 查看哪些 CSS 规则被使用

// 3. 优化建议
// - 删除未使用的代码
// - 延迟加载非关键代码
// - 代码分割
```

## Node.js 性能分析

### Clinic.js

```bash
# Clinic.js：Node.js 性能分析工具

# 安装
npm install -g clinic

# Doctor：综合诊断
clinic doctor -- node app.js

# Flame：火焰图分析
clinic flame -- node app.js

# BubbleHeep：内存分析
clinic heapprofiler -- node app.js

# 使用示例
# 1. 启动分析
clinic doctor -- on-port 'PORT' -- node app.js

# 2. 访问应用
# 执行操作

# 3. 停止分析
# 生成报告
```

### V8 Profiler

```javascript
// V8 Profiler

// 1. 启动 Profiler
const profiler = require('v8-profiler-next');

profiler.startProfiling('CPU-profile');

// 执行操作
function cpuIntensiveTask() {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += Math.sqrt(i);
    }
    return result;
}

cpuIntensiveTask();

// 停止 Profiler
const profile = profiler.stopProfiling('CPU-profile');

// 保存结果
fs.writeFileSync('profile.cpuprofile', JSON.stringify(profile));

// 2. 分析结果
// 使用 Chrome DevTools 加载 profile.cpuprofile
```

## Lighthouse

### Lighthouse CI

```bash
# Lighthouse CI

# 安装
npm install -D @lhci/cli
npm install -D lighthouse

# lighthousrc.js 配置
module.exports = {
    ci: {
        collect: {
            startServerCommand: 'npm run serve',
            url: ['http://localhost:3000'],
            numberOfRuns: 3
        },
        assert: {
            assertions: {
                'categories:performance': ['error', { minScore: 0.9 }],
                'categories:accessibility': ['warn', { minScore: 0.9 }],
                'categories:best-practices': ['warn', { minScore: 0.9 }],
                'categories:seo': ['warn', { minScore: 0.9 }],
            }
        },
        upload: {
            target: 'temporary-public-storage'
        }
    }
};

# 运行
lhci autorun
```

### 自定义审计

```javascript
// 自定义 Lighthouse 审计

// lighthouse-custom.js
const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse(url) {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = {
        logLevel: 'info',
        output: 'json',
        onlyCategories: ['performance'],
        port: chrome.port
    };

    const runnerResult = await lighthouse(url, options);
    await chrome.kill();

    return runnerResult;
}

// 使用
runLighthouse('https://example.com')
    .then(results => {
        fs.writeFileSync('report.json', JSON.stringify(results, null, 2));
        console.log('Performance score:', results.categories.performance.score * 100);
    });
```

## 性能监控

### User Timing API

```javascript
// User Timing API

// 1. 标记测量点
performance.mark('mark-fetch-start');
await fetch('/api/data');
performance.mark('mark-fetch-end');
performance.measure('fetch-data', 'mark-fetch-start', 'mark-fetch-end');

// 2. 获取测量结果
const measures = performance.getEntriesByType('measure');
measures.forEach(measure => {
    console.log(`${measure.name}: ${measure.duration}ms`);
});

// 3. 自定义指标
function trackCustomMetric(name, fn) {
    performance.mark(`${name}-start`);
    const result = fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const measure = performance.getEntriesByName(name)[0];
    return { result, duration: measure.duration };
}

// 使用
const { result, duration } = trackCustomMetric('data-processing', () => {
    return expensiveOperation();
});

console.log(`Processed in ${duration}ms`);

// 4. PerformanceObserver
const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
        console.log(`${entry.name}: ${entry.duration}ms`);
    });
});

observer.observe({ entryTypes: ['measure'] });
```

### Resource Timing API

```javascript
// Resource Timing API

// 1. 监控资源加载
window.addEventListener('load', () => {
    const resources = performance.getEntriesByType('resource');

    resources.forEach(resource => {
        console.log(`Resource: ${resource.name}`);
        console.log(`Duration: ${resource.duration}ms`);
        console.log(`Size: ${resource.transferSize} bytes`);

        // 详细时间
        console.log(`DNS: ${resource.domainLookupEnd - resource.domainLookupStart}ms`);
        console.log(`TCP: ${resource.connectEnd - resource.connectStart}ms`);
        console.log(`TTFB: ${resource.responseStart - resource.requestStart}ms`);
        console.log(`Download: ${resource.responseEnd - resource.responseStart}ms`);
    });
});

// 2. 分析慢资源
const slowResources = resources.filter(r => r.duration > 1000);
console.log('Slow resources:', slowResources.map(r => r.name));

// 3. 资源大小统计
const totalSize = resources.reduce((sum, r) => sum + r.transferSize, 0);
console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
```

## 性能基准

### Web Vitals

```javascript
// Web Vitals：核心性能指标

// 1. LCP (Largest Contentful Paint)
import { getLCP } from 'web-vitals';

getLCP(console.log);

// 2. FID (First Input Delay)
import { getFID } from 'web-vitals';

getFID(console.log);

// 3. CLS (Cumulative Layout Shift)
import { getCLS } from 'web-vitals';

getCLS(console.log);

// 4. 综合监控
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);

// 5. 发送到分析服务
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
getLCP(sendToAnalytics);
```

### RAIL 模型

```javascript
// RAIL 性能模型

// Response：响应时间
// 目标：< 100ms

// Animation：动画
// 目标：每帧 10ms

// Idle：空闲时间
// 目标：最大化空闲时间

// Load：加载
// 目标：< 1 秒

// 实现 RAIL 优化
class RAILMonitor {
    // Response：响应时间
    static measureResponse() {
        const start = performance.now();
        // 用户交互
        const end = performance.now();
        const responseTime = end - start;
        console.log(`Response time: ${responseTime}ms`);
        return responseTime < 100;
    }

    // Animation：动画帧率
    static measureAnimation(callback) {
        let frames = 0;
        let lastTime = performance.now();

        function measure() {
            const now = performance.now();
            frames++;

            if (now - lastTime >= 1000) {
                const fps = frames;
                console.log(`FPS: ${fps}`);
                frames = 0;
                lastTime = now;
            }

            if (callback()) {
                requestAnimationFrame(measure);
            }
        }

        requestAnimationFrame(measure);
    }

    // Idle：空闲时间
    static requestIdleCallback(callback, timeout) {
        const deadline = performance.now() + timeout;
        requestIdleCallback(
            () => callback(),
            { timeout }
        );
    }

    // Load：加载时间
    static measureLoad() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.fetchStart;
            console.log(`Load time: ${loadTime}ms`);
            return loadTime < 1000;
        });
    }
}
```

## 性能报告

### 生成报告

```javascript
// 性能报告生成

class PerformanceReport {
    constructor() {
        this.metrics = {};
    }

    async collect() {
        // 收集资源指标
        const resources = performance.getEntriesByType('resource');
        this.metrics.resources = {
            count: resources.length,
            totalSize: resources.reduce((sum, r) => sum + r.transferSize, 0),
            slowResources: resources.filter(r => r.duration > 1000)
        };

        // 收集导航指标
        const navigation = performance.getEntriesByType('navigation')[0];
        this.metrics.navigation = {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            loadComplete: navigation.loadEventEnd - navigation.fetchStart,
            domReady: navigation.domInteractive - navigation.fetchStart
        };

        // 收集自定义指标
        const measures = performance.getEntriesByType('measure');
        this.metrics.custom = measures.map(m => ({
            name: m.name,
            duration: m.duration
        }));
    }

    generate() {
        return {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            metrics: this.metrics,
            score: this.calculateScore()
        };
    }

    calculateScore() {
        // 简单评分算法
        let score = 100;

        // 资源数量
        if (this.metrics.resources.count > 100) score -= 10;

        // 总大小
        const sizeMB = this.metrics.resources.totalSize / 1024 / 1024;
        if (sizeMB > 2) score -= 20;

        // 慢资源
        if (this.metrics.resources.slowResources.length > 5) score -= 15;

        // 加载时间
        if (this.metrics.navigation.loadComplete > 3000) score -= 30;

        return Math.max(0, score);
    }
}

// 使用
const report = new PerformanceReport();
await report.collect();
console.log(report.generate());
```

## 最佳实践

::: tip 性能分析建议

1. **定期分析** - 建立性能监控机制
2. **设定基准** - 定义性能指标阈值
3. **优化前测量** - 先测量再优化
4. **持续监控** - 生产环境监控
5. **自动报告** - CI/CD 集成

:::

```javascript
// ✅ 推荐做法

// 1. 使用 Performance API
performance.mark('start');
// 操作
performance.mark('end');
performance.measure('operation', 'start', 'end');

// 2. 监控 Web Vitals
import { getLCP, getFID, getCLS } from 'web-vitals';
getLCP(sendToAnalytics);
getFID(sendToAnalytics);
getCLS(sendToAnalytics);

// 3. 使用 Lighthouse CI
npm run lighthouse

// 4. 性能预算
const budget = {
    resourceSizes: [{
        resourceType: 'script',
        budget: 200 * 1024  // 200KB
    }]
};

// 5. 定期分析
setInterval(() => {
    const report = new PerformanceReport();
    report.collect().then(() => {
        const data = report.generate();
        sendToAnalytics(data);
    });
}, 60000);  // 每分钟
```

::: v-pre

[代码优化](./optimization.md) → [测试与调试](../12-testing-debugging/README.md)

:::
