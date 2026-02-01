---
title: 测试基础
icon: ri:test-tube-line
order: 1
---

# 测试基础

测试是保证代码质量和稳定性的重要手段。

## 测试类型

### 单元测试

```javascript
// 单元测试：测试最小可测试单元

// 示例：测试数学函数
// math.js
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

export function multiply(a, b) {
    return a * b;
}

// 测试文件
// math.test.js
import { add, subtract, multiply } from './math';

describe('Math utilities', () => {
    // 测试加法
    test('add: should add two numbers', () => {
        expect(add(1, 2)).toBe(3);
        expect(add(-1, 1)).toBe(0);
    });

    // 测试减法
    test('subtract: should subtract two numbers', () => {
        expect(subtract(5, 3)).toBe(2);
        expect(subtract(0, 5)).toBe(-5);
    });

    // 测试乘法
    test('multiply: should multiply two numbers', () => {
        expect(multiply(2, 3)).toBe(6);
        expect(multiply(-2, 3)).toBe(-6);
    });
});

// 运行测试
// npm test
```

### 集成测试

```javascript
// 集成测试：测试多个模块协作

// 示例：测试 API + 数据库
// api.test.js
import request from 'supertest';
import { app } from './app';
import { Database } from './database';

describe('User API Integration', () => {
    let db;

    beforeAll(async () => {
        db = new Database();
        await db.connect();
    });

    afterAll(async () => {
        await db.disconnect();
    });

    beforeEach(async () => {
        await db.clear();
    });

    test('POST /users: should create user', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({ name: 'Alice', age: 25 })
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('Alice');

        // 验证数据库
        const user = await db.findUser(response.body.id);
        expect(user).toBeTruthy();
    });

    test('GET /users/:id: should return user', async () => {
        const created = await db.createUser({ name: 'Bob' });

        const response = await request(app)
            .get(`/api/users/${created.id}`)
            .expect(200);

        expect(response.body.name).toBe('Bob');
    });
});
```

### 端到端测试

```javascript
// 端到端测试：测试完整用户流程

// 示例：测试用户注册流程
// e2e/register.test.js
import { test, expect } from '@playwright/test';

test.describe('User Registration', () => {
    test('should register new user', async ({ page }) => {
        await page.goto('/register');

        // 填写表单
        await page.fill('[name="username"]', 'alice');
        await page.fill('[name="email"]', 'alice@example.com');
        await page.fill('[name="password"]', 'password123');

        // 提交表单
        await page.click('button[type="submit"]');

        // 验证结果
        await expect(page).toHaveURL('/dashboard');
        await expect(page.locator('h1')).toContainText('Welcome, alice');
    });

    test('should show error for existing email', async ({ page }) => {
        await page.goto('/register');

        await page.fill('[name="email"]', 'existing@example.com');
        await page.fill('[name="password"]', 'password123');
        await page.click('button[type="submit"]');

        // 验证错误消息
        await expect(page.locator('.error')).toContainText('Email already exists');
    });
});
```

## 测试框架

### Jest

```javascript
// Jest：流行的 JavaScript 测试框架

// 安装
// npm install -D jest

// 配置
// jest.config.js
module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/**/*.test.js'
    ],
    testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)+(spec|test).js'
    ]
};

// 基本测试
// math.test.js
const { add, subtract } = require('./math');

describe('Math', () => {
    test('add: adds two numbers', () => {
        expect(add(1, 2)).toBe(3);
    });

    test('subtract: subtracts two numbers', () => {
        expect(subtract(5, 3)).toBe(2);
    });
});

// 运行测试
// npx jest
// npx jest math.test.js
// npx jest --watch
```

### Vitest

```javascript
// Vitest：快速的 Vite 原生测试框架

// 安装
// npm install -D vitest

// 配置
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom'
    }
});

// 使用（与 Jest 兼容）
// math.test.js
import { describe, test, expect } from 'vitest';
import { add, subtract } from './math';

describe('Math', () => {
    test('add: adds two numbers', () => {
        expect(add(1, 2)).toBe(3);
    });
});

// 运行测试
// npx vitest
// npx vitest run
```

## 断言库

### Expect API

```javascript
// Expect API：断言库

// 相等性
expect(1 + 1).toBe(2);           // 严格相等 (===)
expect({ name: 'Alice' }).toEqual({ name: 'Alice' });  // 深度相等
expect([1, 2, 3]).toStrictEqual([1, 2, 3]);  // 严格深度相等

// 真值性
expect(true).toBeTruthy();
expect(false).toBeFalsy();
expect(null).toBeNull();
expect(undefined).toBeUndefined();

// 比较大小
expect(10).toBeGreaterThan(5);
expect(5).toBeLessThan(10);
expect(5).toBeGreaterThanOrEqual(5);
expect(5).toBeLessThanOrEqual(5);

// 包含
expect('Hello World').toContain('World');
expect([1, 2, 3]).toContain(2);
expect({ name: 'Alice', age: 25 }).toHaveProperty('name');

// 匹配
expect('hello').toMatch(/h.llo/);
expect({ name: 'Alice' }).toMatchObject({ name: 'Alice' });

// 抛出异常
expect(() => {
    throw new Error('Error!');
}).toThrow('Error');

expect(() => {
    throw new Error('Error!');
}).toThrow(Error);

// 异步
// Promise
return Promise.resolve('value').resolves.toBe('value');
return Promise.reject('error').rejects.toThrow();

// async/await
test('async test', async () => {
    const data = await fetchData();
    expect(data).toBe('value');
});
```

### 自定义匹配器

```javascript
// 自定义匹配器

// 扩展 Expect
expect.extend({
    toBeWithinRange(received, floor, ceiling) {
        const pass = received >= floor && received <= ceiling;
        if (pass) {
            return {
                message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
                pass: true
            };
        } else {
            return {
                message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
                pass: false
            };
        }
    }
});

// 使用
test('random number', () => {
    const random = Math.random() * 10;
    expect(random).toBeWithinRange(0, 10);
});
```

## 测试钩子

### 生命周期钩子

```javascript
// 测试钩子：管理测试生命周期

describe('Database Tests', () => {
    let db;

    // 所有测试前执行一次
    beforeAll(async () => {
        db = new Database();
        await db.connect();
        console.log('Database connected');
    });

    // 所有测试后执行一次
    afterAll(async () => {
        await db.disconnect();
        console.log('Database disconnected');
    });

    // 每个测试前执行
    beforeEach(async () => {
        await db.clear();
        console.log('Database cleared');
    });

    // 每个测试后执行
    afterEach(async () => {
        await db.reset();
        console.log('Database reset');
    });

    test('should create user', async () => {
        const user = await db.createUser({ name: 'Alice' });
        expect(user).toHaveProperty('id');
    });

    test('should find user', async () => {
        const created = await db.createUser({ name: 'Bob' });
        const found = await db.findUser(created.id);
        expect(found.name).toBe('Bob');
    });
});
```

### 分组和跳过

```javascript
// 分组和跳过测试

// describe：测试套件
describe('Math', () => {
    describe('add', () => {
        test('positive numbers', () => {
            expect(add(1, 2)).toBe(3);
        });

        test('negative numbers', () => {
            expect(add(-1, -2)).toBe(-3);
        });
    });
});

// only：只运行此测试
test.only('this test will run', () => {
    expect(true).toBe(true);
});

test('this test will not run', () => {
    expect(true).toBe(false);
});

// skip：跳过此测试
test.skip('this test is skipped', () => {
    expect(true).toBe(false);
});

// todo：待实现测试
test.todo('add floating point numbers');

// 条件跳过
test.skip('browser test', () => {
    // 在 Node.js 环境跳过
    if (typeof window === 'undefined') {
        test.skip();
    }
});

// 并发测试
test.concurrent('concurrent test 1', async () => {
    // 并发执行
});

test.concurrent('concurrent test 2', async () => {
    // 并发执行
});
```

## 测试最佳实践

```javascript
// ✅ 推荐做法

// 1. 测试应该独立
test('test 1', () => {
    // 不依赖其他测试
});

// 2. 一个测试一个断言
test('should return user name', () => {
    expect(user.getName()).toBe('Alice');
});

// 3. 测试应该清晰
test('add: should return sum of two numbers', () => {
    expect(add(1, 2)).toBe(3);
});

// 4. 使用描述性名称
describe('UserService.createUser', () => {
    it('should create user with valid data', () => {
        // 测试代码
    });
});

// 5. 测试边界情况
test('should handle empty array', () => {
    expect(getFirst([])).toBeUndefined();
});

// 6. 使用 beforeEach 重置
beforeEach(() => {
    // 重置状态
});

// ❌ 不推荐做法

// 1. 测试之间有依赖
test('test 1', () => {
    global.value = 1;
});

test('test 2', () => {
    expect(global.value).toBe(1);  // 依赖 test 1
});

// 2. 一个测试多个断言
test('user', () => {
    expect(user.getName()).toBe('Alice');
    expect(user.getAge()).toBe(25);
    expect(user.getEmail()).toBe('alice@example.com');
    // 难以定位失败
});

// 3. 测试实现细节
test('should use internal method', () => {
    // 不应该测试内部实现
});

// 4. 不测试边界情况
test('should add numbers', () => {
    expect(add(1, 2)).toBe(3);
    // 没有测试 0、负数、浮点数等
});

// 5. 忘记清理
test('should create file', () => {
    createFile('test.txt');
    // 没有清理，影响其他测试
});
```

::: tip 测试基础检查清单

- [ ] 了解测试类型
- [ ] 掌握测试框架
- [ ] 使用断言库
// 4. 使用测试钩子
// 5. 遵循测试最佳实践

:::

::: tip 下一步

学习断言与 Mock → [断言与 Mock](./assertions-mocking.md)
:::
