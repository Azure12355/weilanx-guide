---
title: E2E 测试
icon: ri-eye-line
order: 4
---

# E2E 测试

端到端测试模拟真实用户场景，验证整个应用从前端到后端的完整流程。

## E2E 测试概述

### 测试金字塔

```javascript
// 测试金字塔

┌─────────────────────────────────────┐
│         E2E Tests (少量)            │  端到端测试
│        模拟真实用户场景               │
├─────────────────────────────────────┤
│      Integration Tests (适量)        │  集成测试
│      测试组件/模块交互                │
├─────────────────────────────────────┤
│       Unit Tests (大量)              │  单元测试
│       测试独立函数/组件               │
└─────────────────────────────────────┘

// 比例建议
// E2E Tests: 10%
// Integration Tests: 30%
// Unit Tests: 60%
```

### E2E 测试特点

```javascript
// E2E 测试 vs 单元测试

// 单元测试
test('should add two numbers', () => {
    expect(add(1, 2)).toBe(3);
});

// E2E 测试
test('user can complete checkout flow', async () => {
    // 1. 访问网站
    await page.goto('https://shop.example.com');

    // 2. 浏览商品
    await page.click('.product-1');
    await page.click('.add-to-cart');

    // 3. 查看购物车
    await page.click('.cart-icon');

    // 4. 结账
    await page.click('.checkout-button');
    await page.fill('#email', 'user@example.com');
    await page.fill('#address', '123 Main St');
    await page.click('.place-order');

    // 5. 验证订单确认
    await expect(page.locator('.order-confirmation')).toBeVisible();
});
```

## Playwright

### 基础用法

```javascript
// Playwright E2E 测试

import { test, expect } from '@playwright/test';

// 基础测试
test('has title', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example/);
});

// 交互测试
test('click button', async ({ page }) => {
    await page.goto('https://example.com');
    await page.click('button#submit');
    await expect(page.locator('.success')).toBeVisible();
});

// 表单填写
test('fill form', async ({ page }) => {
    await page.goto('https://example.com/contact');

    await page.fill('#name', 'Alice');
    await page.fill('#email', 'alice@example.com');
    await page.fill('#message', 'Hello!');

    await page.click('button[type="submit"]');

    await expect(page.locator('.success-message'))
        .toContainText('Thank you for your message');
});
```

### 选择器

```javascript
// Playwright 选择器

import { test, expect } from '@playwright/test';

test('selectors', async ({ page }) => {
    await page.goto('https://example.com');

    // 1. CSS 选择器
    await page.click('.submit-button');
    await page.click('#user-name');
    await page.click('button[type="submit"]');

    // 2. 文本选择器
    await page.click('text=Submit');
    await page.click('text="Sign In"');

    // 3. XPath 选择器
    await page.click('//button[@type="submit"]');

    // 4. data-testid 选择器（推荐）
    await page.click('[data-testid="submit-button"]');

    // 5. 组合选择器
    await page.click('nav >> text=Login');
    await page.click('.menu >> text=Settings');

    // 6. 布局选择器
    await expect(page.locator('.button')).toBeVisible();
    await expect(page.locator('.input')).toBeEditable();
    await expect(page.locator('.checkbox')).toBeChecked();

    // 7. 过滤器
    await page.locator('.item').filter({ hasText: 'Special' }).click();
    await page.locator('.button').getByText('Submit').click();
});
```

### 等待策略

```javascript
// 等待元素

import { test, expect } from '@playwright/test';

test('waits', async ({ page }) => {
    await page.goto('https://example.com');

    // 1. 自动等待（默认）
    await page.click('.button');  // 自动等待按钮可见、可点击

    // 2. 等待导航
    await Promise.all([
        page.waitForNavigation(),
        page.click('a')
    ]);

    // 3. 等待选择器
    await page.waitForSelector('.loaded');
    await page.waitForSelector('.success', { state: 'visible' });

    // 4. 等待函数
    await page.waitForFunction(() => {
        return window.appState === 'ready';
    });

    // 5. 等待响应
    await page.waitForResponse(resp =>
        resp.url().includes('/api/data') && resp.status() === 200
    );

    // 6. 等待超时
    await page.waitForTimeout(1000);

    // 7. 等待加载状态
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
});
```

### Page Object Model

```javascript
// Page Object Model

// pages/LoginPage.js
export class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('[data-testid="login-button"]');
        this.errorMessage = page.locator('.error-message');
    }

    async goto() {
        await this.page.goto('/login');
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }
}

// tests/login.spec.js
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('user can login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('alice', 'password123');

    await expect(page).toHaveURL('/dashboard');
});

test('shows error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('alice', 'wrong-password');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid credentials');
});
```

### API 测试

```javascript
// API Testing with Playwright

import { test, expect } from '@playwright/test';

test('API response validation', async ({ request }) => {
    // GET 请求
    const response = await request.get('https://api.example.com/users/1');

    expect(response.status()).toBe(200);

    const user = await response.json();
    expect(user).toHaveProperty('id', 1);
    expect(user).toHaveProperty('name');

    // POST 请求
    const createResponse = await request.post('https://api.example.com/users', {
        data: {
            name: 'Alice',
            email: 'alice@example.com'
        }
    });

    expect(createResponse.status()).toBe(201);

    // PUT 请求
    const updateResponse = await request.put('https://api.example.com/users/1', {
        data: { name: 'Alice Updated' }
    });

    expect(updateResponse.status()).toBe(200);

    // DELETE 请求
    const deleteResponse = await request.delete('https://api.example.com/users/1');
    expect(deleteResponse.status()).toBe(204);
});
```

### 视觉回归测试

```javascript
// Visual Regression Testing

import { test, expect } from '@playwright/test';

test('visual comparison', async ({ page }) => {
    await page.goto('https://example.com');

    // 整页截图对比
    await expect(page).toHaveScreenshot('homepage.png');

    // 元素截图对比
    await expect(page.locator('.header')).toHaveScreenshot('header.png');

    // 忽略特定区域
    await expect(page).toHaveScreenshot('page-with-ignored.png', {
        mask: [page.locator('.dynamic-content'), page.locator('.timestamp')]
    });

    // 响应式截图
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('mobile.png');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page).toHaveScreenshot('desktop.png');
});
```

## Cypress

### 基础用法

```javascript
// Cypress E2E 测试

// 基础测试
describe('My First Test', () => {
    it('visits the app', () => {
        cy.visit('/');
        cy.contains('h1', 'Welcome');
    });

    it('clicks button', () => {
        cy.visit('/');
        cy.get('button').click();
        cy.url().should('include', '/dashboard');
    });
});

// 链式调用
describe('Form submission', () => {
    it('submits form successfully', () => {
        cy.visit('/contact');

        cy.get('#name')
            .type('Alice')
            .should('have.value', 'Alice');

        cy.get('#email')
            .type('alice@example.com')
            .should('have.value', 'alice@example.com');

        cy.get('button[type="submit"]')
            .click()
            .should('be.disabled');

        cy.get('.success-message')
            .should('be.visible')
            .and('contain', 'Thank you');
    });
});
```

### 自定义命令

```javascript
// Custom Commands

// cypress/support/commands.js
Cypress.Commands.add('login', (username, password) => {
    cy.request({
        method: 'POST',
        url: '/api/login',
        body: { username, password }
    }).then((response) => {
        window.localStorage.setItem('token', response.body.token);
    });
});

Cypress.Commands.add('getDataTestById', (id) => {
    return cy.get(`[data-testid="${id}"]`);
});

// 使用
describe('Custom commands', () => {
    beforeEach(() => {
        cy.login('alice', 'password123');
    });

    it('uses custom command', () => {
        cy.getDataTestById('submit-button').click();
    });
});
```

### API 测试

```javascript
// API Testing with Cypress

describe('API Tests', () => {
    it('gets user data', () => {
        cy.request('/api/users/1')
            .its('body')
            .should('have.property', 'id', 1)
            .and('have.property', 'name');
    });

    it('creates new user', () => {
        cy.request('POST', '/api/users', {
            name: 'Alice',
            email: 'alice@example.com'
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('id');
        });
    });

    it('handles errors', () => {
        cy.request({
            method: 'GET',
            url: '/api/users/999',
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.have.property('error');
        });
    });
});
```

### 网络拦截

```javascript
// Network Interception

describe('Network interception', () => {
    it('stubs API response', () => {
        cy.intercept('GET', '/api/users', {
            fixture: 'users.json'
        }).as('getUsers');

        cy.visit('/');
        cy.wait('@getUsers');

        cy.get('.user-list').should('contain', 'Alice');
    });

    it('modifies API response', () => {
        cy.intercept('GET', '/api/users', (req) => {
            req.reply((res) => {
                res.body.users.push({ id: 999, name: 'Test User' });
            });
        }).as('getUsers');

        cy.visit('/');
        cy.wait('@getUsers');
    });

    it('waits for API call', () => {
        cy.intercept('POST', '/api/login').as('login');

        cy.visit('/login');
        cy.get('#username').type('alice');
        cy.get('#password').type('password');
        cy.get('button').click();

        cy.wait('@login').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
    });
});
```

## 测试场景

### 用户注册流程

```javascript
// 用户注册流程测试

import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
    test('successful registration', async ({ page }) => {
        await page.goto('/register');

        // 填写注册表单
        await page.fill('#username', 'newuser');
        await page.fill('#email', 'newuser@example.com');
        await page.fill('#password', 'SecurePass123!');
        await page.fill('#confirm-password', 'SecurePass123!');

        // 同意条款
        await page.check('#terms');

        // 提交
        await page.click('button[type="submit"]');

        // 验证跳转
        await expect(page).toHaveURL('/welcome');

        // 验证成功消息
        await expect(page.locator('.success-message'))
            .toContainText('Registration successful');

        // 验证邮件
        // 实际项目中需要访问邮箱或使用测试邮箱服务
    });

    test('validation errors', async ({ page }) => {
        await page.goto('/register');

        // 提交空表单
        await page.click('button[type="submit"]');

        // 验证错误消息
        await expect(page.locator('#username-error'))
            .toContainText('Username is required');

        await expect(page.locator('#email-error'))
            .toContainText('Email is required');

        // 测试无效邮箱
        await page.fill('#email', 'invalid-email');
        await page.click('button[type="submit"]');

        await expect(page.locator('#email-error'))
            .toContainText('Invalid email format');
    });
});
```

### 购物车流程

```javascript
// 购物车流程测试

import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Flow', () => {
    test('add to cart', async ({ page }) => {
        await page.goto('/products');

        // 添加商品到购物车
        await page.click('[data-product-id="1"] .add-to-cart');

        // 验证购物车图标更新
        await expect(page.locator('.cart-count'))
            .toContainText('1');

        // 查看购物车
        await page.click('.cart-icon');

        // 验证商品在购物车中
        await expect(page.locator('.cart-item'))
            .toHaveCount(1);

        await expect(page.locator('.cart-item .product-name'))
            .toContainText('Product 1');
    });

    test('checkout flow', async ({ page }) => {
        await page.goto('/products');

        // 添加多个商品
        await page.click('[data-product-id="1"] .add-to-cart');
        await page.click('[data-product-id="2"] .add-to-cart');

        // 进入购物车
        await page.click('.cart-icon');

        // 验证商品数量和总价
        await expect(page.locator('.cart-item')).toHaveCount(2);

        const totalText = await page.locator('.cart-total').textContent();
        const total = parseFloat(totalText.replace('$', ''));
        expect(total).toBeGreaterThan(0);

        // 结账
        await page.click('.checkout-button');

        // 填写配送信息
        await page.fill('#shipping-name', 'Alice');
        await page.fill('#shipping-address', '123 Main St');
        await page.fill('#shipping-city', 'New York');
        await page.fill('#shipping-zip', '10001');

        // 选择支付方式
        await page.click('[data-testid="credit-card"]');

        // 填写支付信息
        await page.fill('#card-number', '4242424242424242');
        await page.fill('#card-expiry', '12/25');
        await page.fill('#card-cvc', '123');

        // 提交订单
        await page.click('.place-order-button');

        // 验证订单确认
        await expect(page).toHaveURL('/order-confirmation');

        await expect(page.locator('.order-number'))
            .toBeVisible();

        await expect(page.locator('.confirmation-message'))
            .toContainText('Thank you for your order');
    });
});
```

### 登录认证流程

```javascript
// 登录认证流程测试

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('successful login', async ({ page }) => {
        await page.fill('#email', 'user@example.com');
        await page.fill('#password', 'password123');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('/dashboard');

        await expect(page.locator('.user-greeting'))
            .toContainText('Welcome back');
    });

    test('failed login with invalid credentials', async ({ page }) => {
        await page.fill('#email', 'user@example.com');
        await page.fill('#password', 'wrong-password');
        await page.click('button[type="submit"]');

        await expect(page.locator('.error-message'))
            .toContainText('Invalid email or password');

        await expect(page).toHaveURL('/login');
    });

    test('logout', async ({ page }) => {
        // 先登录
        await page.fill('#email', 'user@example.com');
        await page.fill('#password', 'password123');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('/dashboard');

        // 登出
        await page.click('.user-menu');
        await page.click('[data-testid="logout-button"]');

        await expect(page).toHaveURL('/login');
    });

    test('password reset flow', async ({ page }) => {
        await page.click('[data-testid="forgot-password"]');

        await expect(page).toHaveURL('/forgot-password');

        await page.fill('#email', 'user@example.com');
        await page.click('button[type="submit"]');

        await expect(page.locator('.success-message'))
            .toContainText('Password reset email sent');

        // 实际项目中需要访问邮箱获取重置链接
    });

    test('remember me functionality', async ({ page }) => {
        // 勾选"记住我"
        await page.fill('#email', 'user@example.com');
        await page.fill('#password', 'password123');
        await page.check('#remember-me');
        await page.click('button[type="submit"]');

        // 验证设置了 cookie
        const cookies = await page.context().cookies();
        const rememberMeCookie = cookies.find(c => c.name === 'remember_token');
        expect(rememberMeCookie).toBeDefined();

        // 关闭并重新打开浏览器
        await page.context().close();

        // 验证仍然登录
        const newPage = await page.context().newPage();
        await newPage.goto('/dashboard');
        await expect(newPage.locator('.user-greeting')).toBeVisible();
    });
});
```

## 最佳实践

::: tip E2E 测试建议

1. **测试关键流程** - 用户核心路径
2. **使用 Page Object** - 提高可维护性
3. **避免测试细节** - 关注业务逻辑
4. **独立运行** - 测试之间不依赖
5. **快速反馈** - 并行执行测试

:::

```javascript
// ✅ 推荐做法

// 1. 使用 data-testid
<button data-testid="submit-button">Submit</button>
page.click('[data-testid="submit-button"]');

// 2. Page Object Model
class LoginPage {
    async login(username, password) {
        await this.page.fill('#username', username);
        await this.page.fill('#password', password);
        await this.page.click('[data-testid="login-button"]');
    }
}

// 3. 等待具体条件
await expect(page.locator('.success')).toBeVisible();

// 4. 使用 fixtures
test.use({ viewport: { width: 1920, height: 1080 } });

// 5. 并行执行
// playwright.config.js
module.exports = {
    workers: 4,
    fullyParallel: true
};

// ❌ 不推荐做法

// 1. 使用 CSS 类名
page.click('.btn-primary');  // 可能变化

// 2. 硬编码延迟
await page.waitForTimeout(5000);  // 不稳定

// 3. 测试实现细节
test('uses useState', () => {
    // 不应该测试 React hooks
});

// 4. 测试之间依赖
test('test 1 creates data', () => {
    // 创建数据
});

test('test 2 uses data', () => {
    // 依赖 test 1
});
```

::: v-pre

[单元测试](./unit-testing.md) → [代码规范](./linting.md)

:::
