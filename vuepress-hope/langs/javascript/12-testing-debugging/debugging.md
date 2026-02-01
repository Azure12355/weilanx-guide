---
title: 调试技巧
icon: ri:bug-line
order: 3
---

# 调试技巧

调试是定位和修复代码错误的关键技能。

## Console 调试

### 基本输出

```javascript
// Console API：调试输出

// console.log：一般输出
console.log('Hello');
console.log('User:', user);
console.log('Count:', count, 'Total:', total);

// console.error：错误输出（红色）
console.error('Error:', error);
console.error('Failed to fetch data');

// console.warn：警告输出（黄色）
console.warn('Deprecated API');
console.warn('Unexpected value:', value);

// console.info：信息输出（蓝色）
console.info('Process started');

// console.table：表格输出
console.table([
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 }
]);

// console.group：分组输出
console.group('User Data');
console.log('Name:', user.name);
console.log('Age:', user.age);
console.groupEnd();

// console.count：计数
console.count('click');
console.count('click');
console.count('click');
// click: 1
// click: 2
// click: 3

// console.countReset：重置计数
console.countReset('click');

// console.time：计时
console.time('operation');
// ... 操作
console.timeEnd('operation');
// operation: 123.45ms

// console.trace：堆栈跟踪
function trace() {
    console.trace('Trace');
}
trace();
// Trace
//   at trace (file.js:2)
//   at anonymous (file.js:6)
```

### 高级输出

```javascript
// 高级 Console 功能

// 格式化输出
console.log(
    'User: %s, Age: %d, Active: %b',
    'Alice',
    25,
    true
);
// User: Alice, Age: 25, Active: true

// CSS 样式
console.log(
    '%cHello %cWorld',
    'color: blue; font-size: 20px',
    'color: red; font-size: 20px'
);

// 对象展开
console.dir(document.body, { depth: null });

// 断言
console.assert(1 === 2, '1 should equal 2');
// Assertion failed: 1 should equal 2

// 条件日志
const debug = true;
if (debug) {
    console.log('Debug info:', data);
}
// 或
console.debug('Debug info:', data);

// 清除控制台
console.clear();
```

## 断点调试

### Chrome DevTools

```javascript
// Chrome DevTools 断点调试

// debugger 语句
function calculateSum(a, b) {
    debugger;  // 程序在此处暂停
    return a + b;
}

// 使用步骤
// 1. 打开 DevTools（F12）
// 2. 切换到 Sources 面板
// 3. 在代码行号上点击设置断点
// 4. 刷新页面或触发代码
// 5. 使用控制按钮：
//    - Resume：继续执行
//    - Step Over：单步跳过
//    - Step Into：单步进入
//    - Step Out：单步跳出

// 条件断点
// 右键行号 → Add conditional breakpoint
// 输入条件：i === 5
for (let i = 0; i < 10; i++) {
    debugger;  // 只在 i === 5 时暂停
}

// 日志断点
// 右键行号 → Add logpoint
// 输入：console.log('User:', user)
// 不会暂停代码，只输出日志
```

### VS Code 调试

```json
// VS Code 调试配置
// .vscode/launch.json

{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/app.js"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Launch TypeScript",
      "program": "${workspaceFolder}/src/app.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Process",
      "port": 9229
    }
  ]
}

// 使用步骤
// 1. 设置断点（点击行号旁）
// 2. 按 F5 或点击调试按钮
// 3. 选择配置
// 4. 程序在断点处暂停
// 5. 查看变量、调用堆栈、监视表达式
```

## 错误处理

### Try-Catch

```javascript
// try-catch：捕获同步错误

try {
    const result = riskyOperation();
    console.log(result);
} catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
}

// finally：总是执行
try {
    const data = JSON.parse(jsonString);
} catch (error) {
    console.error('Parse error:', error);
} finally {
    console.log('Cleanup');
}

// 错误类型
try {
    // 可能抛出错误的代码
} catch (error) {
    if (error instanceof TypeError) {
        console.error('Type error:', error);
    } else if (error instanceof RangeError) {
        console.error('Range error:', error);
    } else if (error instanceof SyntaxError) {
        console.error('Syntax error:', error);
    } else {
        console.error('Unknown error:', error);
    }
}

// 抛出错误
function validateAge(age) {
    if (typeof age !== 'number') {
        throw new TypeError('Age must be a number');
    }
    if (age < 0 || age > 150) {
        throw new RangeError('Age must be between 0 and 150');
    }
}

// 自定义错误
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

throw new ValidationError('Invalid input');
```

### 异步错误

```javascript
// 异步错误处理

// Promise 错误
fetch('/api/data')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });

// async/await 错误
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;  // 重新抛出
    }
}

// 事件错误
eventEmitter.on('error', (error) => {
    console.error('Event error:', error);
});

// 未捕获的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 未捕获的异常
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // 生产环境应该优雅退出
    process.exit(1);
});
```

## 常见错误

### TypeError

```javascript
// TypeError：类型错误

// 无法读取 undefined 的属性
const obj = undefined;
console.log(obj.name);  // TypeError: Cannot read property 'name' of undefined

// 解决
if (obj && obj.name) {
    console.log(obj.name);
}

// 或使用可选链
console.log(obj?.name);

// 调用非函数
const fn = null;
fn();  // TypeError: fn is not a function

// 解决
if (typeof fn === 'function') {
    fn();
}

// 数组方法在非数组上调用
const notArray = 'string';
notArray.map(x => x * 2);  // TypeError: notArray.map is not a function

// 解决
if (Array.isArray(notArray)) {
    notArray.map(x => x * 2);
}
```

### ReferenceError

```javascript
// ReferenceError：引用错误

// 变量未声明
console.log(undefinedVariable);  // ReferenceError: undefinedVariable is not defined

// 解决
const undefinedVariable = 'value';
console.log(undefinedVariable);

// 或
let undefinedVariable;
console.log(undefinedVariable);

// 在声明前访问（TDZ）
console.log(variable);  // ReferenceError: Cannot access 'variable' before initialization
let variable = 'value';

// 解决
let variable = 'value';
console.log(variable);
```

### SyntaxError

```javascript
// SyntaxError：语法错误

// JSON 解析错误
const json = '{ invalid json }';
JSON.parse(json);  // SyntaxError: Unexpected token

// 解决
try {
    const data = JSON.parse(json);
} catch (error) {
    if (error instanceof SyntaxError) {
        console.error('Invalid JSON');
    }
}

// 模板字符串错误
const template = `Hello ${name`;  // 缺少结束 `
// 解决
const name = 'World';
const template = `Hello ${name}`;
```

### RangeError

```javascript
// RangeError：范围错误

// 数组长度无效
new Array(-1);  // RangeError: Invalid array length

// 解决
new Array(10);  // 有效

// toFixed 精度无效
(1.23).toFixed(100);  // RangeError: toFixed() digits argument must be between 0 and 100

// 解决
(1.23).toFixed(2);  // 有效

// 数组访问越界（不抛出错误，返回 undefined）
const arr = [1, 2, 3];
console.log(arr[100]);  // undefined

// 解决
if (index >= 0 && index < arr.length) {
    console.log(arr[index]);
}
```

## 调试最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用描述性日志
console.log('User data:', user);

// 2. 使用 console.group 分组
console.group('Fetch data');
console.log('URL:', url);
console.log('Options:', options);
console.groupEnd();

// 3. 使用条件断点
debugger;  // 条件：i === 5

// 4. 捕获并记录错误
try {
    riskyOperation();
} catch (error) {
    console.error('Operation failed:', error);
}

// 5. 使用 debugger 断点
function complexFunction() {
    debugger;  // 暂停执行
}

// 6. 使用性能分析
console.time('operation');
// ... 操作
console.timeEnd('operation');

// ❌ 不推荐做法

// 1. 过度使用 console.log
console.log('Step 1');
console.log('Step 2');
console.log('Step 3');
// 应使用断点调试

// 2. 忽略错误处理
riskyOperation();  // 可能抛出错误

// 3. 混淆错误
throw new Error('Error');  // 不提供详细信息

// 4. 生产环境保留调试代码
console.log('Debug:', data);
// 应移除或使用条件编译

// 5. 注释掉代码而非调试
// const data = fetchData();  // 临时注释
// 应使用断点或条件

// 6. 不使用断点，只用 console
function complexFunction(a, b, c) {
    console.log('a:', a);
    console.log('b:', b);
    console.log('c:', c);
    // 应使用断点查看变量
}
```

::: tip 调试技巧检查清单

- [ ] 使用 Console API
// 2. 设置断点调试
// 3. 使用 VS Code 调试
// 4. 正确处理错误
// 5. 了解常见错误类型
// 6. 遵循调试最佳实践

:::

::: tip 下一步

学习测试调试总结 → [测试调试总结](./testing-summary.md)
:::
