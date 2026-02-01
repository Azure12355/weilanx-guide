---
title: 单元测试
icon:ri-test-tube-fill
order: 2
---

# 单元测试

单元测试是对软件中最小可测试单元（函数、方法、类）进行检查和验证。

## 测试原则

### FIRST 原则

```javascript
// FIRST 单元测试原则

// Fast（快速）：测试应该快速执行
test('fast test', () => {
    expect(add(1, 2)).toBe(3);  // 毫秒级
});

// Independent（独立）：测试之间不依赖
test('independent test 1', () => {
    const result = operation1();
    expect(result).toBe('value1');
});

test('independent test 2', () => {
    const result = operation2();
    expect(result).toBe('value2');  // 不依赖 test 1
});

// Repeatable（可重复）：测试结果一致
test('repeatable test', () => {
    const date = new Date(2023, 0, 1);
    expect(date.getFullYear()).toBe(2023);  // 总是返回 2023
});

// Self-Validating（自验证）：测试自动通过/失败
test('self-validating test', () => {
    expect(isValidEmail('test@example.com')).toBe(true);  // 明确结果
});

// Timely（及时）：测试与代码同步编写
// TDD：测试驱动开发
// 1. 编写测试
// 2. 运行测试（失败）
// 3. 编写代码
// 4. 运行测试（通过）
```

### 测试覆盖率

```javascript
// 测试覆盖率指标

// 1. 行覆盖率（Line Coverage）
// 每行代码是否被执行
function calculate(a, b) {
    if (a > 0) {  // 行 2
        return a + b;  // 行 3
    } else {
        return a - b;  // 行 5
    }
}

// 测试
test('with positive a', () => {
    calculate(1, 2);  // 覆盖行 2, 3
});
// 行覆盖率：60% (3/5)

// 2. 分支覆盖率（Branch Coverage）
// 每个 if/else 分支是否被执行
test('with positive and negative a', () => {
    calculate(1, 2);   // true 分支
    calculate(-1, 2);  // false 分支
});
// 分支覆盖率：100%

// 3. 函数覆盖率（Function Coverage）
// 每个函数是否被调用
export function funcA() { }
export function funcB() { }

// 测试
test('functions', () => {
    funcA();  // funcA 覆盖
    // funcB 未调用
});
// 函数覆盖率：50%

// 4. 语句覆盖率（Statement Coverage）
// 每个语句是否被执行

// 配置 Jest 覆盖率
// jest.config.js
module.exports = {
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
```

## 测试组织

### 测试文件结构

```javascript
// 测试文件组织

// 方式 1：同目录
// src/
//   math.js
//   math.test.js

// 方式 2：__tests__ 目录
// src/
//   math.js
//   __tests__/
//     math.test.js

// 方式 3：test 目录
// src/
//   math.js
// test/
//   math.test.js

// 推荐方式 1 或 2
// 便于查找和维护
```

### Describe 嵌套

```javascript
// Describe 嵌套：组织测试层次

describe('UserService', () => {
    let userService;

    beforeEach(() => {
        userService = new UserService();
    });

    describe('createUser', () => {
        test('should create user with valid data', () => {
            const user = userService.createUser({
                name: 'Alice',
                email: 'alice@example.com'
            });
            expect(user).toHaveProperty('id');
            expect(user.name).toBe('Alice');
        });

        test('should throw error with invalid email', () => {
            expect(() => {
                userService.createUser({
                    name: 'Alice',
                    email: 'invalid-email'
                });
            }).toThrow('Invalid email');
        });

        describe('email validation', () => {
            test('should accept valid email', () => {
                // 测试有效邮箱
            });

            test('should reject empty email', () => {
                // 测试空邮箱
            });
        });
    });

    describe('getUser', () => {
        test('should return user by id', () => {
            // 测试代码
        });
    });
});
```

## 测试异步代码

### Promise 测试

```javascript
// Promise 测试

// 返回 Promise
test('should fetch user', () => {
    return userService.getUser(1)
        .then(user => {
            expect(user.name).toBe('Alice');
        });
});

// 使用 resolves/rejects
test('should fetch user', () => {
    return userService.getUser(1)
        .resolves.toHaveProperty('id', 1);
});

test('should handle error', () => {
    return userService.getUser(999)
        .rejects.toThrow('User not found');
});

// 使用 async/await
test('should fetch user', async () => {
    const user = await userService.getUser(1);
    expect(user.name).toBe('Alice');
});

test('should handle error', async () => {
    await expect(userService.getUser(999))
        .rejects.toThrow('User not found');
});
```

### 回调测试

```javascript
// 回调函数测试

// 使用 done
test('should fetch user with callback', (done) => {
    userService.getUser(1, (err, user) => {
        expect(err).toBeNull();
        expect(user.name).toBe('Alice');
        done();
    });
});

// 测试错误
test('should handle error', (done) => {
    userService.getUser(999, (err, user) => {
        expect(err).toBeTruthy();
        expect(user).toBeUndefined();
        done();
    });
});

// 使用 Promise 包装
function promisify(fn) {
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn(...args, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    };
}

test('promisified callback', async () => {
    const getUserAsync = promisify(userService.getUser);
    const user = await getUserAsync(1);
    expect(user.name).toBe('Alice');
});
```

### Timer 测试

```javascript
// Timer 测试

// 使用 Jest fake timers
jest.useFakeTimers();

test('should debounce function', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 1000);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(1);
});

test('should throttle function', () => {
    const fn = jest.fn();
    const throttledFn = throttle(fn, 1000);

    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(2);
});

// 清理
jest.useRealTimers();
```

## Mock 和 Spy

### Jest Mock

```javascript
// Jest Mock

// Mock 函数
const mockFn = jest.fn();
mockFn('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(1);

// Mock 返回值
mockFn.mockReturnValue('value');
expect(mockFn()).toBe('value');

// Mock Promise 返回值
mockFn.mockResolvedValue({ data: 'value' });
await expect(mockFn()).resolves.toEqual({ data: 'value' });

// Mock 实现
mockFn.mockImplementation((a, b) => a + b);
expect(mockFn(1, 2)).toBe(3);

// Spy 方法
const userService = {
    getUser: jest.fn().mockResolvedValue({ id: 1, name: 'Alice' })
};

test('should call getUser', async () => {
    const user = await userService.getUser(1);
    expect(userService.getUser).toHaveBeenCalledWith(1);
    expect(user).toEqual({ id: 1, name: 'Alice' });
});
```

### Spy

```javascript
// Spy：监听函数调用

// 监听现有方法
const calculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
};

const addSpy = jest.spyOn(calculator, 'add');
calculator.add(1, 2);

expect(addSpy).toHaveBeenCalledWith(1, 2);
expect(addSpy).toHaveReturnedWith(3);

// 恢复原始方法
addSpy.mockRestore();
```

### 模块 Mock

```javascript
// 模块 Mock

// Mock 整个模块
jest.mock('./api');
import { fetchUser } from './api';

test('should mock fetchUser', async () => {
    fetchUser.mockResolvedValue({ id: 1, name: 'Alice' });
    const user = await fetchUser(1);
    expect(user).toEqual({ id: 1, name: 'Alice' });
});

// 部分 Mock
jest.mock('./fs', () => {
    const originalModule = jest.requireActual('./fs');
    return {
        ...originalModule,
    readFileSync: jest.fn().mockReturnValue('mocked content')
    };
});

// Mock 返回值
import { readFile } from './fs';
readFile.mockReturnValue('mocked content');
```

## 快照测试

### 基本用法

```javascript
// 快照测试：验证输出一致性

// 组件快照
import renderer from 'react-test-renderer';
import Button from './Button';

test('Button snapshot', () => {
    const tree = renderer.create(<Button />).toJSON();
    expect(tree).toMatchSnapshot();
});

// 数据快照
test('user data snapshot', () => {
    const user = {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        createdAt: new Date('2023-01-01')
    };
    expect(user).toMatchSnapshot();
});

// 内联快照
test('inline snapshot', () => {
    const data = { foo: 'bar' };
    expect(data).toMatchInlineSnapshot(`
        Object {
          "foo": "bar",
        }
    `);
});
```

### 快照更新

```javascript
// 快照更新策略

// 1. 更新快照
// npm test -- -u

// 2. 交互式更新
// npm test -- --watch
// 按 i 更新快照

// 3. 属性快照（忽略特定字段）
test('user snapshot with timers', () => {
    const user = {
        id: Math.random(),
        createdAt: new Date(),
        name: 'Alice'
    };
    expect(user).toMatchSnapshot({
        createdAt: expect.any(Date),
        id: expect.any(Number)
    });
});
```

## 参数化测试

### 测试数据驱动

```javascript
// 参数化测试：多组数据运行同一测试

// 方式 1：test.each
describe.each([
    [1, 2, 3],
    [2, 3, 5],
    [5, 5, 10],
    [10, -5, 5]
])('add(%i, %i) = %i', (a, b, expected) => {
    test(`returns ${expected}`, () => {
        expect(add(a, b)).toBe(expected);
    });
});

// 方式 2：使用对象
describe.each`
    a    | b    | expected
    ${1}  | ${2} | ${3}
    ${2}  | ${3} | ${5}
    ${5}  | ${5} | ${10}
`('add($a, $b) = $expected', ({ a, b, expected }) => {
    test('returns expected sum', () => {
        expect(add(a, b)).toBe(expected);
    });
});

// 方式 3：表格方式
describe.each`
    input     | expected
    ${'hello'} | ${'HELLO'}
    ${'world'} | ${'WORLD'}
`('toUpperCase($input) = $expected', ({ input, expected }) => {
    test('converts to uppercase', () => {
        expect(input.toUpperCase()).toBe(expected);
    });
});
```

## 最佳实践

::: tip 单元测试建议

1. **测试行为** - 不测试实现细节
2. **一个断言** - 每个测试一个断言
3. **独立性** - 测试之间不依赖
4. **可读性** - 清晰的测试名称
5. **及时更新** - 代码更新时同步更新

:::

```javascript
// ✅ 推荐做法

// 1. 测试行为，不是实现
test('should return user name', () => {
    expect(user.getName()).toBe('Alice');
});

// 2. 单一职责
test('should validate email format', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
});

test('should reject empty email', () => {
    expect(isValidEmail('')).toBe(false);
});

// 3. 使用 beforeEach
beforeEach(() => {
    // 重置状态
});

// 4. 清理副作用
afterEach(() => {
    jest.clearAllMocks();
});

// 5. 描述性名称
test('calculatePrice: should apply discount for premium users', () => {
    // 测试代码
});

// ❌ 不推荐做法

// 1. 测试实现
test('should use forEach loop', () => {
    // 不应该测试如何实现
});

// 2. 多个断言
test('user', () => {
    expect(user.getName()).toBe('Alice');
    expect(user.getAge()).toBe(25);
    expect(user.getEmail()).toBe('alice@example.com');
});

// 3. 测试依赖
test('test 2', () => {
    expect(globalValue).toBe(1);  // 依赖 test 1
});

// 4. 复杂逻辑
test('complex test', () => {
    // 太多逻辑，难以维护
});
```

::: v-pre

[测试基础](./testing-basics.md) → [E2E 测试](./e2e-testing.md)

:::
