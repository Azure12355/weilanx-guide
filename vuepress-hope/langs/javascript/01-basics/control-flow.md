---
title: 流程控制
icon: ri:flow-chart
order: 3
---

# 流程控制

流程控制语句决定了代码的执行顺序，是编程的核心逻辑。

## if...else 语句

### 基本语法

```javascript
// 基本 if 语句
if (条件) {
    // 条件为 true 时执行
}

// if...else 语句
if (条件) {
    // 条件为 true 时执行
} else {
    // 条件为 false 时执行
}

// if...else if...else 语句
if (条件1) {
    // 条件1为 true 时执行
} else if (条件2) {
    // 条件1为 false 且 条件2为 true 时执行
} else {
    // 所有条件都为 false 时执行
}
```

### 实际示例

```javascript
// 成绩判断
let score = 85;

if (score >= 90) {
    console.log('优秀');
} else if (score >= 80) {
    console.log('良好');
} else if (score >= 60) {
    console.log('及格');
} else {
    console.log('不及格');
}

// 登录验证
function login(username, password) {
    if (!username || !password) {
        return '请输入用户名和密码';
    }

    if (username === 'admin' && password === '123456') {
        return '登录成功';
    } else if (username === 'admin') {
        return '密码错误';
    } else {
        return '用户不存在';
    }
}

console.log(login('admin', '123456'));  // 登录成功
console.log(login('admin', 'wrong'));   // 密码错误
console.log(login('user', '123456'));   // 用户不存在
```

### 嵌套 if 语句

```javascript
// 复杂条件判断
function checkPermission(user, resource) {
    if (user) {
        if (user.isLoggedIn) {
            if (user.role === 'admin') {
                return '完全访问权限';
            } else if (user.role === 'user') {
                if (resource.isPublic) {
                    return '可以访问';
                } else {
                    return '权限不足';
                }
            }
        } else {
            return '请先登录';
        }
    } else {
        return '未登录';
    }
}

// 使用提前返回优化（推荐）
function checkPermissionOptimized(user, resource) {
    if (!user) return '未登录';
    if (!user.isLoggedIn) return '请先登录';
    if (user.role === 'admin') return '完全访问权限';
    if (user.role === 'user' && resource.isPublic) return '可以访问';
    return '权限不足';
}
```

## switch 语句

### 基本语法

```javascript
switch (表达式) {
    case 值1:
        // 代码块1
        break;
    case 值2:
        // 代码块2
        break;
    // 可以有更多 case
    default:
        // 默认代码块（没有匹配时执行）
}
```

### 实际示例

```javascript
// 星期判断
let day = 3;
let dayName;

switch (day) {
    case 1:
        dayName = '星期一';
        break;
    case 2:
        dayName = '星期二';
        break;
    case 3:
        dayName = '星期三';
        break;
    case 4:
        dayName = '星期四';
        break;
    case 5:
        dayName = '星期五';
        break;
    case 6:
        dayName = '星期六';
        break;
    case 7:
        dayName = '星期日';
        break;
    default:
        dayName = '无效的星期';
}

console.log(dayName);  // 星期三

// 简化写法（利用 case 穿透）
let dayType;
switch (day) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        dayType = '工作日';
        break;
    case 6:
    case 7:
        dayType = '周末';
        break;
    default:
        dayType = '未知';
}

// 简单计算器
function calculator(a, b, operator) {
    let result;
    switch (operator) {
        case '+':
            result = a + b;
            break;
        case '-':
            result = a - b;
            break;
        case '*':
            result = a * b;
            break;
        case '/':
            result = b !== 0 ? a / b : '除数不能为零';
            break;
        case '%':
            result = a % b;
            break;
        default:
            result = '未知运算符';
    }
    return result;
}

console.log(calculator(10, 5, '+'));  // 15
console.log(calculator(10, 5, '/'));  // 2
console.log(calculator(10, 0, '/'));  // 除数不能为零
```

### switch vs if...else

```javascript
// 使用 switch
let grade = 'A';
switch (grade) {
    case 'A': console.log('优秀'); break;
    case 'B': console.log('良好'); break;
    case 'C': console.log('及格'); break;
    default: console.log('不及格');
}

// 使用 if...else（更适合范围判断）
let score = 85;
if (score >= 90) {
    console.log('优秀');
} else if (score >= 80) {
    console.log('良好');
} else if (score >= 60) {
    console.log('及格');
} else {
    console.log('不及格');
}
```

::: tip 选择建议

- **switch**：匹配具体的值
- **if...else**：范围判断、复杂条件

:::

## 三元运算符

### 基本语法

```javascript
// 语法：条件 ? 表达式1 : 表达式2
let result = 条件 ? 值1 : 值2;
```

### 实际示例

```javascript
// 简单条件赋值
let age = 18;
let status = age >= 18 ? '成年' : '未成年';
console.log(status);  // 成年

// 嵌套三元运算符
let score = 85;
let grade = score >= 90 ? 'A' :
            score >= 80 ? 'B' :
            score >= 70 ? 'C' : 'D';
console.log(grade);  // B

// 函数参数默认值（简化版）
function greet(name) {
    return name ? `Hello, ${name}!` : 'Hello, Guest!';
}
console.log(greet('Alice'));  // Hello, Alice!
console.log(greet());         // Hello, Guest!

// 安全访问
let user = { name: 'Alice' };
let userName = user ? user.name : '未知用户';
console.log(userName);  // Alice

// 使用可选链更简洁
let userName2 = user?.name ?? '未知用户';
```

## 逻辑运算符流程控制

### 短路求值

```javascript
// 逻辑与（&&）：第一个为 false，返回第一个；否则返回第二个
console.log(0 && 'hello');    // 0
console.log(1 && 'hello');    // 'hello'
console.log(true && {});      // {}
console.log(false && 'x');    // false

// 逻辑或（||）：第一个为 true，返回第一个；否则返回第二个
console.log(0 || 'hello');    // 'hello'
console.log(1 || 'hello');    // 1
console.log(null || 'default'); // 'default'
console.log('value' || 'default'); // 'value'

// 实际应用：默认值
function setName(name) {
    name = name || 'Guest';
    console.log(`Hello, ${name}!`);
}
setName();         // Hello, Guest!
setName('Alice');  // Hello, Alice!

// 条件执行
// 逻辑与：条件为 true 时执行
let isLoggedIn = true;
isLoggedIn && console.log('欢迎回来！');

// 逻辑或：条件为 false 时执行
let data = null;
let result = data || fetchData();
```

### 空值合并（??）

```javascript
// 只在 null 或 undefined 时使用默认值
let value = null ?? 'default';    // 'default'
let value2 = undefined ?? 'default'; // 'default'
let value3 = 0 ?? 'default';      // 0
let value4 = '' ?? 'default';     // ''
let value5 = false ?? 'default';  // false

// 实际应用：配置对象
function createChart(options) {
    const config = {
        width: options.width ?? 400,
        height: options.height ?? 300,
        title: options.title ?? '图表',
        showLegend: options.showLegend ?? true
    };
    console.log(config);
}

createChart({ width: 500, title: '销售图表' });
// { width: 500, height: 300, title: '销售图表', showLegend: true }
```

## 提前返回（Early Return）

### 优化嵌套条件

```javascript
// ❌ 不推荐：深层嵌套
function processUser(user) {
    if (user) {
        if (user.isActive) {
            if (user.hasPermission) {
                // 执行操作
                return '操作成功';
            } else {
                return '没有权限';
            }
        } else {
            return '用户未激活';
        }
    } else {
        return '用户不存在';
    }
}

// ✅ 推荐：提前返回
function processUserOptimized(user) {
    if (!user) return '用户不存在';
    if (!user.isActive) return '用户未激活';
    if (!user.hasPermission) return '没有权限';

    // 执行操作
    return '操作成功';
}
```

### 优势

1. **减少嵌套**：代码更易读
2. **清晰逻辑**：边界条件优先处理
3. **易于维护**：每个条件独立

## 条件语句最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用严格相等
if (x === 5) { }

// 2. 简单条件用三元运算符
const max = a > b ? a : b;

// 3. 复杂条件拆分
const isValidUser = user && user.isActive;
const hasPermission = user && user.role === 'admin';
if (isValidUser && hasPermission) { }

// 4. 提前返回
function process(data) {
    if (!data) return null;
    if (!data.isValid) return null;
    // 处理数据
}

// 5. 使用对象字面量替代 switch（简单情况）
function getGrade(score) {
    return {
        90: 'A',
        80: 'B',
        70: 'C'
    }[Math.floor(score / 10) * 10] || 'D';
}
```

```javascript
// ❌ 不推荐做法

// 1. 使用相等而非严格相等
if (x == 5) { }

// 2. 深层嵌套
if (a) {
    if (b) {
        if (c) {
            // ...
        }
    }
}

// 3. 复杂的条件表达式
if ((a && b) || (c && d) || (e && f)) { }

// 4. 重复的条件判断
if (user.role === 'admin') {
    // 代码
}
if (user.role === 'admin') {
    // 更多代码
}
// 应该用 if...else
```

## 真值与假值

### 假值列表

以下值在布尔上下文中会被视为 `false`：

```javascript
// 6 个假值
false      // 布尔 false
0          // 数字 0
-0         // 负零
0n         // BigInt 0
""         // 空字符串
null       // null
undefined  // undefined
NaN        // Not a Number

// 示例
console.log(Boolean(false));     // false
console.log(Boolean(0));         // false
console.log(Boolean(""));        // false
console.log(Boolean(null));      // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN));       // false
```

### 真值列表

**除了假值列表中的值，其他所有值都是真值**：

```javascript
// 真值示例
console.log(Boolean(true));       // true
console.log(Boolean(1));          // true
console.log(Boolean(-1));         // true
console.log(Boolean(3.14));       // true
console.log(Boolean("hello"));    // true
console.log(Boolean("0"));        // true（字符串 "0" 是真值！）
console.log(Boolean("false"));    // true
console.log(Boolean([]));         // true（空数组是真值！）
console.log(Boolean({}));         // true（空对象是真值！）
console.log(Boolean(function(){})); // true
```

::: warning 常见陷阱

```javascript
// ❌ 错误判断数组是否为空
let arr = [];
if (arr) {
    console.log('数组有元素');  // 会执行！空数组是真值
}

// ✅ 正确判断
if (arr.length > 0) {
    console.log('数组有元素');
}

// ❌ 错误判断对象是否为空
let obj = {};
if (obj) {
    console.log('对象有属性');  // 会执行！空对象是真值
}

// ✅ 正确判断
if (Object.keys(obj).length > 0) {
    console.log('对象有属性');
}
```

:::

## 综合示例

```javascript
// 用户认证系统
class AuthService {
    constructor() {
        this.users = [
            { username: 'admin', password: '123456', role: 'admin' },
            { username: 'user', password: '123456', role: 'user' }
        ];
    }

    login(username, password) {
        // 参数验证
        if (!username || !password) {
            return { success: false, message: '请输入用户名和密码' };
        }

        // 查找用户
        const user = this.users.find(u => u.username === username);

        // 验证用户
        if (!user) {
            return { success: false, message: '用户不存在' };
        }

        if (user.password !== password) {
            return { success: false, message: '密码错误' };
        }

        // 返回成功
        return {
            success: true,
            message: '登录成功',
            user: { username: user.username, role: user.role }
        };
    }

    checkPermission(user, resource, action) {
        // 提前返回
        if (!user) return { allowed: false, reason: '未登录' };
        if (!user.role) return { allowed: false, reason: '无效用户' };

        // 管理员完全权限
        if (user.role === 'admin') {
            return { allowed: true };
        }

        // 普通用户权限
        if (user.role === 'user') {
            // 公开资源
            if (resource.isPublic) {
                return { allowed: true };
            }
            // 自己的资源
            if (resource.owner === user.username) {
                return { allowed: true };
            }
            // 只读权限
            if (action === 'read') {
                return { allowed: true };
            }
        }

        return { allowed: false, reason: '权限不足' };
    }
}

// 使用示例
const auth = new AuthService();

console.log(auth.login('admin', '123456'));
// { success: true, message: '登录成功', user: { username: 'admin', role: 'admin' } }

console.log(auth.login('admin', 'wrong'));
// { success: false, message: '密码错误' }

const user = { username: 'admin', role: 'admin' };
const resource = { name: 'document', isPublic: false };
console.log(auth.checkPermission(user, resource, 'write'));
// { allowed: true }
```

::: tip 流程控制检查清单

- [ ] 使用严格相等（===）
- [ ] 避免深层嵌套，使用提前返回
- [ ] 简单条件用三元运算符
- [ ] 复杂条件用 if...else
- [ ] 匹配值用 switch
- [ ] 注意真值假值陷阱
- [ ] 使用对象字面量优化多重条件

:::
