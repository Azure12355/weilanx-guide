---
title: 行为型模式
icon: ri:git-branch-line
order: 3
---

# 行为型模式

行为型模式关注对象之间的通信和职责分配。

## 观察者模式

### 基本实现

```javascript
// 观察者模式：一对多依赖关系

// Subject（主题）
class NewsAgency {
    constructor() {
        this.subscribers = [];
        this.news = null;
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    unsubscribe(subscriber) {
        this.subscribers = this.subscribers.filter(s => s !== subscriber);
    }

    notify() {
        this.subscribers.forEach(subscriber => {
            subscriber.update(this.news);
        });
    }

    publishNews(news) {
        this.news = news;
        this.notify();
    }
}

// Observer（观察者）
class Subscriber {
    constructor(name) {
        this.name = name;
    }

    update(news) {
        console.log(`${this.name} received: ${news}`);
    }
}

// 使用
const agency = new NewsAgency();

const alice = new Subscriber('Alice');
const bob = new Subscriber('Bob');

agency.subscribe(alice);
agency.subscribe(bob);

agency.publishNews('Breaking news: JavaScript is awesome!');
// Alice received: Breaking news: JavaScript is awesome!
// Bob received: Breaking news: JavaScript is awesome!
```

### EventEmitter

```javascript
// EventEmitter：Node.js 事件系统

const EventEmitter = require('events');

class NewsAgency extends EventEmitter {
    publishNews(news) {
        this.emit('news', news);
    }
}

// 使用
const agency = new NewsAgency();

agency.on('news', (news) => {
    console.log(`Subscriber received: ${news}`);
});

agency.once('breaking', (news) => {
    console.log(`Breaking news: ${news}`);
});

agency.publishNews('Regular news');
// Subscriber received: Regular news

agency.publishNews('Breaking news');
// Subscriber received: Breaking news
// Breaking news: Breaking news

agency.publishNews('Breaking news');
// Subscriber received: Breaking news
// （once 只触发一次）
```

## 策略模式

### 基本实现

```javascript
// 策略模式：算法族封装

// 策略接口
class PaymentStrategy {
    pay(amount) {
        throw new Error('Must implement pay');
    }
}

// 具体策略
class CreditCardPayment extends PaymentStrategy {
    pay(amount) {
        console.log(`Paid ${amount} via Credit Card`);
    }
}

class PayPalPayment extends PaymentStrategy {
    pay(amount) {
        console.log(`Paid ${amount} via PayPal`);
    }
}

class WeChatPayment extends PaymentStrategy {
    pay(amount) {
        console.log(`Paid ${amount} via WeChat Pay`);
    }
}

// Context（上下文）
class ShoppingCart {
    constructor() {
        this.items = [];
        this.paymentStrategy = null;
    }

    setPaymentStrategy(strategy) {
        this.paymentStrategy = strategy;
    }

    addItem(item) {
        this.items.push(item);
    }

    checkout() {
        const total = this.items.reduce((sum, item) => sum + item.price, 0);
        this.paymentStrategy.pay(total);
    }
}

// 使用
const cart = new ShoppingCart();
cart.addItem({ name: 'Book', price: 50 });
cart.addItem({ name: 'Pen', price: 10 });

// 选择支付策略
cart.setPaymentStrategy(new CreditCardPayment());
cart.checkout();  // Paid 60 via Credit Card

// 切换策略
cart.setPaymentStrategy(new WeChatPayment());
cart.checkout();  // Paid 60 via WeChat Pay
```

### 应用场景

```javascript
// 应用场景：验证策略

// 验证策略
class ValidationStrategy {
    validate(value) {
        throw new Error('Must implement validate');
    }
}

class EmailValidation extends ValidationStrategy {
    validate(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}

class PhoneValidation extends ValidationStrategy {
    validate(phone) {
        const regex = /^\d{11}$/;
        return regex.test(phone);
    }
}

// Context
class Validator {
    setStrategy(strategy) {
        this.strategy = strategy;
    }

    validate(value) {
        return this.strategy.validate(value);
    }
}

// 使用
const validator = new Validator();

validator.setStrategy(new EmailValidation());
console.log(validator.validate('alice@example.com'));  // true
console.log(validator.validate('invalid-email'));      // false

validator.setStrategy(new PhoneValidation());
console.log(validator.validate('12345678901'));       // true
console.log(validator.validate('123'));               // false
```

## 命令模式

### 基本实现

```javascript
// 命令模式：请求封装为对象

// Command（命令）
class Command {
    execute() {
        throw new Error('Must implement execute');
    }

    undo() {
        throw new Error('Must implement undo');
    }
}

// Concrete Command（具体命令）
class LightOnCommand extends Command {
    constructor(light) {
        this.light = light;
    }

    execute() {
        this.light.on();
    }

    undo() {
        this.light.off();
    }
}

class LightOffCommand extends Command {
    constructor(light) {
        this.light = light;
    }

    execute() {
        this.light.off();
    }

    undo() {
        this.light.on();
    }
}

// Receiver（接收者）
class Light {
    on() {
        console.log('Light is on');
    }

    off() {
        console.log('Light is off');
    }
}

// Invoker（调用者）
class RemoteControl {
    constructor() {
        this.command = null;
        this.history = [];
    }

    setCommand(command) {
        this.command = command;
    }

    pressButton() {
        this.command.execute();
        this.history.push(this.command);
    }

    pressUndo() {
        const command = this.history.pop();
        if (command) {
            command.undo();
        }
    }
}

// 使用
const light = new Light();
const remote = new RemoteControl();

const onCommand = new LightOnCommand(light);
const offCommand = new LightOffCommand(light);

remote.setCommand(onCommand);
remote.pressButton();  // Light is on

remote.setCommand(offCommand);
remote.pressButton();  // Light is off

remote.pressUndo();     // Light is on
```

### 宏命令

```javascript
// 宏命令：组合命令

class MacroCommand extends Command {
    constructor() {
        this.commands = [];
    }

    add(command) {
        this.commands.push(command);
    }

    execute() {
        this.commands.forEach(command => command.execute());
    }

    undo() {
        // 反向撤销
        for (let i = this.commands.length - 1; i >= 0; i--) {
            this.commands[i].undo();
        }
    }
}

// 使用
const macro = new MacroCommand();

macro.add(new LightOnCommand(light));
macro.add(new LightOffCommand(light));

macro.execute();
// Light is on
// Light is off

macro.undo();
// Light is on
// Light is off
```

## 责任链模式

### 基本实现

```javascript
// 责任链模式：传递请求直到被处理

// Handler（处理者）
class SupportHandler {
    constructor() {
        this.next = null;
    }

    setNext(handler) {
        this.next = handler;
        return handler;
    }

    handle(request) {
        if (this.next) {
            return this.next.handle(request);
        }
        return null;
    }
}

// Concrete Handler（具体处理者）
class Level1Support extends SupportHandler {
    handle(request) {
        if (request.level === 1) {
            return `Level 1 handled: ${request.message}`;
        }
        return super.handle(request);
    }
}

class Level2Support extends SupportHandler {
    handle(request) {
        if (request.level === 2) {
            return `Level 2 handled: ${request.message}`;
        }
        return super.handle(request);
    }
}

class Level3Support extends SupportHandler {
    handle(request) {
        if (request.level === 3) {
            return `Level 3 handled: ${request.message}`;
        }
        return super.handle(request);
    }
}

// 使用
const level1 = new Level1Support();
const level2 = new Level2Support();
const level3 = new Level3Support();

// 构建责任链
level1.setNext(level2).setNext(level3);

// 测试
console.log(level1.handle({ level: 1, message: 'Simple issue' }));
// Level 1 handled: Simple issue

console.log(level1.handle({ level: 2, message: 'Complex issue' }));
// Level 2 handled: Complex issue

console.log(level1.handle({ level: 3, message: 'Critical issue' }));
// Level 3 handled: Critical issue
```

### 应用场景

```javascript
// 应用场景：错误处理

class ErrorHandler {
    constructor() {
        this.next = null;
    }

    setNext(handler) {
        this.next = handler;
        return handler;
    }

    handle(error) {
        if (this.next) {
            return this.next.handle(error);
        }
        console.error('Unhandled error:', error);
    }
}

class TypeErrorHandler extends ErrorHandler {
    handle(error) {
        if (error instanceof TypeError) {
            console.error('Type Error:', error.message);
            return true;
        }
        return super.handle(error);
    }
}

class ReferenceErrorHandler extends ErrorHandler {
    handle(error) {
        if (error instanceof ReferenceError) {
            console.error('Reference Error:', error.message);
            return true;
        }
        return super.handle(error);
    }
}

// 使用
const typeHandler = new TypeErrorHandler();
const refHandler = new ReferenceErrorHandler();

typeHandler.setNext(refHandler);

try {
    const obj = null;
    obj.method();
} catch (error) {
    typeHandler.handle(error);
}
// Type Error: Cannot read property 'method' of null
```

## 状态模式

### 基本实现

```javascript
// 状态模式：对象内部状态改变行为

// State（状态）
class State {
    handle(context) {
        throw new Error('Must implement handle');
    }
}

// Concrete State（具体状态）
class ReadyState extends State {
    handle(context) {
        console.log('Ready: Waiting for order');
        context.setState(new CookingState());
    }
}

class CookingState extends State {
    handle(context) {
        console.log('Cooking: Preparing food');
        context.setState(new ReadyState());
    }
}

// Context（上下文）
class Restaurant {
    constructor() {
        this.state = new ReadyState();
    }

    setState(state) {
        this.state = state;
    }

    request() {
        this.state.handle(this);
    }
}

// 使用
const restaurant = new Restaurant();

restaurant.request();  // Ready: Waiting for order
restaurant.request();  // Cooking: Preparing food
restaurant.request();  // Ready: Waiting for order
```

### 应用场景

```javascript
// 应用场景：订单状态

class Order {
    constructor() {
        this.state = new PendingState();
    }

    setState(state) {
        this.state = state;
    }

    process() {
        this.state.process(this);
    }
}

class PendingState {
    process(order) {
        console.log('Order is pending');
        order.setState(new ProcessingState());
    }
}

class ProcessingState {
    process(order) {
        console.log('Order is processing');
        order.setState(new ShippedState());
    }
}

class ShippedState {
    process(order) {
        console.log('Order has been shipped');
        order.setState(new DeliveredState());
    }
}

class DeliveredState {
    process(order) {
        console.log('Order has been delivered');
        // 最终状态
    }
}

// 使用
const order = new Order();

order.process();  // Order is pending
order.process();  // Order is processing
order.process();  // Order has been shipped
order.process();  // Order has been delivered
```

## 行为型模式最佳实践

```javascript
// ✅ 推荐做法

// 1. 观察者：事件驱动
class EventEmitter {
    on(event, handler) {
        // 注册监听
    }
    emit(event, data) {
        // 触发事件
    }
}

// 2. 策略：算法封装
class Strategy {
    execute() {
        // 算法实现
    }
}

// 3. 命令：操作封装
class Command {
    execute() {
        // 执行命令
    }
    undo() {
        // 撤销命令
    }
}

// 4. 责任链：请求传递
class Handler {
    handle(request) {
        // 处理或传递
    }
}

// 5. 状态：行为切换
class Context {
    setState(state) {
        this.state = state;
    }
}

// ❌ 不推荐做法

// 1. 观察者过度订阅
// 性能问题

// 2. 策略过于简单
// 不需要模式

// 3. 命令不提供撤销
// 无法回退

// 4. 责任链过长
// 性能影响

// 5. 状态过多
// 难以维护
```

::: tip 行为型模式检查清单

- [ ] 理解观察者模式
// 2. 掌握策略模式
// 3. 使用命令模式
// 4. 了解责任链模式
// 5. 使用状态模式
// 6. 选择合适模式

:::

::: tip 设计模式回顾

恭喜！你已掌握设计模式的核心知识：

- [x] 创建型模式
- [x] 结构型模式
- [x] 行为型模式

接下来学习实战项目 → [实战项目](../14-practice/todo-app.md)
:::
