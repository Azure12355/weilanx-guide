---
title: 断言与 Mock
icon: ri:test-tube-fill
order: 2
---

# 断言与 Mock

断言验证结果是否符合预期，Mock 模拟外部依赖。

## 断言库

### Chai

```javascript
// Chai：流行的断言库

// 安装
// npm install chai

// BDD 风格（expect/should）
import { expect } from 'chai';

// 相等性
expect(1 + 1).to.equal(2);
expect({ name: 'Alice' }).to.deep.equal({ name: 'Alice' });
expect([1, 2, 3]).to.eql([1, 2, 3]);

// 真值性
expect(true).to.be.true;
expect(false).to.be.false;
expect(null).to.be.null;
expect(undefined).to.be.undefined;

// 包含
expect('Hello World').to.include('World');
expect([1, 2, 3]).to.include(2);
expect({ name: 'Alice', age: 25 }).to.have.property('name');

// 比较大小
expect(10).to.be.above(5);
expect(5).to.be.below(10);
expect(5).to.be.at.least(5);
expect(5).to.be.at.most(5);

// 类型
expect('hello').to.be.a('string');
expect(123).to.be.a('number');
expect([1, 2, 3]).to.be.an('array');
expect(null).to.be.a('null');

// 否定
expect(1).to.not.equal(2);
expect(false).to.not.be.true;

// 链式调用
expect(user).to.be.an('object')
    .that.has.property('name', 'Alice')
    .that.has.property('age')
    .that.is.above(18);
```

### Assert

```javascript
// Node.js 内置 assert 模块

import assert from 'assert';

// 基本断言
assert.strictEqual(1 + 1, 2);
assert.deepStrictEqual({ a: 1 }, { a: 1 });

// 消息
assert.strictEqual(1 + 1, 2, '1 + 1 should equal 2');

// 异常
assert.throws(
    () => {
        throw new Error('Error!');
    },
    Error,
    'Should throw Error'
);

assert.doesNotThrow(() => {
    // 不抛出异常
});

// 异步
(async () => {
    await assert.rejects(
        async () => {
            throw new Error('Error!');
        },
        Error
    );

    await assert.doesNotReject(
        async () => {
            return 'value';
        }
    );
})();
```

## Mock 与 Stub

### Sinon.js

```javascript
// Sinon.js：Mock/Stub 库

// 安装
// npm install sinon

import sinon from 'sinon';

// Spy：监听函数调用
const callback = sinon.spy();

// 调用函数
callback('hello', 'world');

// 断言
assert(callback.calledOnce);
assert(callback.calledWith('hello', 'world'));
assert(callback.calledOnceWith('hello', 'world'));

// 获取调用信息
console.log(callback.firstCall.args);  // ['hello', 'world']
console.log(callback.callCount);        // 1

// Stub：替换函数
const user = {
    getName: () => 'Alice'
};

const stub = sinon.stub(user, 'getName').returns('Bob');

// 使用 stub
console.log(user.getName());  // 'Bob'

// 断言
assert(stub.calledOnce);
assert(stub.returned('Bob'));

// 恢复
stub.restore();

// Mock：模拟对象
const userMock = sinon.mock(user);

userMock.expects('getName').once().returns('Charlie');

// 调用
user.getName();

// 验证
userMock.verify();
userMock.restore();
```

### Fake Timer

```javascript
// Fake Timer：模拟时间

import sinon from 'sinon';

let clock;

beforeEach(() => {
    clock = sinon.useFakeTimers();
});

afterEach(() => {
    clock.restore();
});

test('should call callback after timeout', () => {
    const callback = sinon.spy();

    setTimeout(callback, 1000);

    // 快进时间
    clock.tick(1000);

    assert(callback.calledOnce);
});

test('should call callback every second', () => {
    const callback = sinon.spy();

    setInterval(callback, 1000);

    // 快进时间
    clock.tick(5000);

    assert(callback.callCount === 5);
});
```

## 模块 Mock

### Jest Mock

```javascript
// Jest Mock：模拟模块

// 自动 Mock
jest.mock('./api');

import { fetchUser } from './api';

test('fetchUser: should return user', async () => {
    // 设置 Mock 返回值
    fetchUser.mockResolvedValue({
        id: 1,
        name: 'Alice'
    });

    const user = await fetchUser(1);

    expect(user.name).toBe('Alice');
    expect(fetchUser).toHaveBeenCalledWith(1);
});

// Mock 实现
jest.mock('./api', () => ({
    fetchUser: jest.fn(() => ({
        id: 1,
        name: 'Alice'
    }))
}));

// 部分 Mock
import { fetchUser, fetchPosts } from './api';

jest.mock('./api', () => ({
    ...jest.requireActual('./api'),
    fetchUser: jest.fn(() => ({ id: 1, name: 'Alice' }))
}));

// fetchPosts 保持原实现，fetchUser 被 Mock
```

### Vitest Mock

```javascript
// Vitest Mock：模拟模块

// vi.mock
vi.mock('./api', () => ({
    fetchUser: vi.fn(() => ({ id: 1, name: 'Alice' }))
}));

import { fetchUser } from './api';

test('fetchUser: should return user', async () => {
    const user = await fetchUser(1);

    expect(user.name).toBe('Alice');
    expect(fetchUser).toHaveBeenCalledWith(1);
});

// Mock 实现
import { vi } from 'vitest';

const mockFn = vi.fn((msg) => `Mocked: ${msg}`);
expect(mockFn('hello')).toBe('Mocked: hello');

// Mock 返回值
const mockFn = vi.fn();
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('async value');
mockFn.mockRejectedValue(new Error('error'));

// Mock 清除
afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
});
```

## 测试替身

### Test Double

```javascript
// Test Double：测试替身

// Dummy：占位对象
function createUser(dummy) {
    return { id: 1, name: 'Alice' };
}

const dummy = {};
const user = createUser(dummy);

// Stub：替换行为
const userStub = {
    getName: () => 'Stubbed Name'
};

// Spy：监听调用
const userSpy = {
    getName: () => 'Alice'
};

sinon.spy(userSpy, 'getName');
userSpy.getName();
console.log(userSpy.getName.called);

// Mock：验证行为
const userMock = {
    getName: () => 'Alice'
};

sinon.mock(userMock).expects('getName').once();
userMock.getName();
userMock.verify();

// Fake：简化实现
class FakeDatabase {
    constructor() {
        this.users = [];
    }

    async findUser(id) {
        return this.users.find(u => u.id === id);
    }

    async createUser(user) {
        this.users.push(user);
        return user;
    }
}

// 使用 Fake
const fakeDb = new FakeDatabase();
await fakeDb.createUser({ id: 1, name: 'Alice' });
const user = await fakeDb.findUser(1);
expect(user.name).toBe('Alice');
```

## 异步测试

### Promise 测试

```javascript
// Promise 测试

// 返回 Promise
test('async test', () => {
    return Promise.resolve('value').resolves.toBe('value');
});

// 使用 async/await
test('async test', async () => {
    const value = await Promise.resolve('value');
    expect(value).toBe('value');
});

// 测试异常
test('should throw error', async () => {
    await expect(Promise.reject('error')).rejects.toThrow();
});

// 测试超时
test('should timeout', async () => {
    await expect(
        new Promise(resolve => setTimeout(resolve, 2000))
    ).resolves.toBeTruthy();
}, {
    timeout: 1000  // 超时设置
});
```

### 回调测试

```javascript
// 回调测试

// done 模式
test('callback test', (done) => {
    fetchData((data) => {
        expect(data).toBe('value');
        done();  // 通知测试完成
    });
});

// Promise 化回调
test('callback test', () => {
    return new Promise((resolve) => {
        fetchData((data) => {
            expect(data).toBe('value');
            resolve();
        });
    });
});
```

## 断言与 Mock 最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用清晰的断言消息
assert.strictEqual(1 + 1, 2, '1 + 1 should equal 2');

// 2. 只 Mock 必要的部分
jest.mock('./api', () => ({
    ...jest.requireActual('./api'),
    fetchUser: jest.fn()
}));

// 3. 清理 Mock
afterEach(() => {
    jest.clearAllMocks();
});

// 4. 使用 Spy 监听而非替换
const spy = sinon.spy(obj, 'method');

// 5. 验证调用
assert(spy.calledWith(expectedArg));

// 6. 使用 Fake 替代复杂依赖
const fakeDb = new FakeDatabase();

// ❌ 不推荐做法

// 1. 过度 Mock
jest.mock('./api');
jest.mock('./utils');
jest.mock('./config');

// 2. 不清理 Mock
test('test 1', () => {
    jest.fn();
});
// Mock 影响后续测试

// 3. Mock 实现，不验证行为
const stub = sinon.stub().returns('value');
// 没有验证调用

// 4. 测试 Mock 实现
test('should call mock', () => {
    mockFn.mockReturnValue('value');
    expect(mockFn()).toBe('value');
    // 测试的是 Mock，不是真实逻辑

// 5. 过度使用 Spy
const spy = sinon.spy(obj, 'method');
// 应该用 Stub 替换行为
```

::: tip 断言与 Mock 检查清单

- [ ] 掌握断言库
// 2. 使用 Mock/Stub
// 3. 模拟外部依赖
// 4. 测试异步代码
// 5. 清理测试环境

:::

::: tip 下一步

学习调试技巧 → [调试技巧](./debugging.md)
:::
