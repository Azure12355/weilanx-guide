---
title: 行为型模式
icon: ri:flow-chart
order: 3
---

# 行为型模式

行为型模式关注对象之间的通信、职责划分和算法的封装。

## 观察者模式

### 基本实现

```javascript
// 观察者模式：定义对象间的一对多依赖关系

// 主题（被观察者）
class Subject {
    constructor() {
        this.observers = [];
        this.state = null;
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notify() {
        this.observers.forEach(observer => observer.update(this.state));
    }

    setState(state) {
        this.state = state;
        this.notify();
    }
}

// 观察者
class Observer {
    constructor(name) {
        this.name = name;
    }

    update(state) {
        console.log(`${this.name} received update:`, state);
    }
}

// 使用
const subject = new Subject();

const observer1 = new Observer('Observer 1');
const observer2 = new Observer('Observer 2');

subject.subscribe(observer1);
subject.subscribe(observer2);

subject.setState({ message: 'Hello Observers!' });
// Observer 1 received update: { message: 'Hello Observers!' }
// Observer 2 received update: { message: 'Hello Observers!' }

subject.unsubscribe(observer1);

subject.setState({ message: 'Second update' });
// 只有 Observer 2 收到通知
```

### 发布订阅

```javascript
// 发布订阅模式：解耦发布者和订阅者

class EventBus {
    constructor() {
        this.events = {};
    }

    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    publish(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }

    unsubscribe(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
}

// 使用
const bus = new EventBus();

// 订阅事件
bus.subscribe('user:login', (user) => {
    console.log(`User logged in: ${user.name}`);
});

bus.subscribe('user:login', (user) => {
    console.log(`Sending welcome email to ${user.email}`);
});

bus.subscribe('user:logout', (user) => {
    console.log(`User logged out: ${user.name}`);
});

// 发布事件
bus.publish('user:login', { name: 'Alice', email: 'alice@example.com' });
// User logged in: Alice
// Sending welcome email to alice@example.com

bus.publish('user:logout', { name: 'Alice' });
// User logged out: Alice
```

### 实际应用

```javascript
// 实际应用：Vue 响应式原理（简化版）

class Dep {
    constructor() {
        this.subscribers = new Set();
    }

    depend() {
        if (activeEffect) {
            this.subscribers.add(activeEffect);
        }
    }

    notify() {
        this.subscribers.forEach(effect => effect());
    }
}

let activeEffect = null;

function watchEffect(effect) {
    activeEffect = effect;
    effect();
    activeEffect = null;
}

class ReactiveObject {
    constructor(value) {
        this.value = value;
        this.dep = new Dep();
    }

    get() {
        this.dep.depend();
        return this.value;
    }

    set(newValue) {
        if (newValue !== this.value) {
            this.value = newValue;
            this.dep.notify();
        }
    }
}

// 使用
const count = new ReactiveObject(0);

watchEffect(() => {
    console.log('Count is:', count.get());
});
// Count is: 0

count.set(1);
// Count is: 1

count.set(2);
// Count is: 2
```

## 策略模式

### 基本实现

```javascript
// 策略模式：定义算法族，分别封装，让它们可以互相替换

// 策略接口
class PaymentStrategy {
    pay(amount) {
        throw new Error('Must implement');
    }
}

// 具体策略
class CreditCardPayment extends PaymentStrategy {
    constructor(cardNumber, cvv, expiry) {
        super();
        this.cardNumber = cardNumber;
        this.cvv = cvv;
        this.expiry = expiry;
    }

    pay(amount) {
        console.log(`Paid $${amount} with credit card ending in ${this.cardNumber.slice(-4)}`);
        return { success: true, transactionId: 'CC-' + Date.now() };
    }
}

class PayPalPayment extends PaymentStrategy {
    constructor(email, password) {
        super();
        this.email = email;
        this.password = password;
    }

    pay(amount) {
        console.log(`Paid $${amount} with PayPal account ${this.email}`);
        return { success: true, transactionId: 'PP-' + Date.now() };
    }
}

class WeChatPayment extends PaymentStrategy {
    constructor(openId) {
        super();
        this.openId = openId;
    }

    pay(amount) {
        console.log(`Paid ¥${amount} with WeChat Pay`);
        return { success: true, transactionId: 'WX-' + Date.now() };
    }
}

// 上下文
class ShoppingCart {
    constructor() {
        this.items = [];
        this.paymentStrategy = null;
    }

    setPaymentStrategy(strategy) {
        this.paymentStrategy = strategy;
    }

    addItem(item, price) {
        this.items.push({ item, price });
    }

    checkout() {
        const total = this.items.reduce((sum, item) => sum + item.price, 0);
        return this.paymentStrategy.pay(total);
    }
}

// 使用
const cart = new ShoppingCart();
cart.addItem('Book', 29.99);
cart.addItem('Pen', 1.99);

// 使用信用卡支付
cart.setPaymentStrategy(new CreditCardPayment('1234567890123456', '123', '12/25'));
cart.checkout();  // Paid $31.98 with credit card ending in 3456

// 使用 PayPal 支付
cart.setPaymentStrategy(new PayPalPayment('user@example.com', 'password'));
cart.checkout();  // Paid $31.98 with PayPal account user@example.com
```

### 表单验证

```javascript
// 实际应用：表单验证策略

// 验证策略
class Validator {
    validate(value) {
        throw new Error('Must implement');
    }
}

class RequiredValidator extends Validator {
    validate(value) {
        return value && value.trim().length > 0
            ? { valid: true }
            : { valid: false, message: 'This field is required' };
    }
}

class EmailValidator extends Validator {
    validate(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value)
            ? { valid: true }
            : { valid: false, message: 'Invalid email format' };
    }
}

class MinLengthValidator extends Validator {
    constructor(minLength) {
        super();
        this.minLength = minLength;
    }

    validate(value) {
        return value.length >= this.minLength
            ? { valid: true }
            : { valid: false, message: `Minimum ${this.minLength} characters required` };
    }
}

// 表单字段
class FormField {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.validators = [];
        this.errors = [];
    }

    addValidator(validator) {
        this.validators.push(validator);
        return this;
    }

    validate() {
        this.errors = [];
        for (const validator of this.validators) {
            const result = validator.validate(this.value);
            if (!result.valid) {
                this.errors.push(result.message);
            }
        }
        return this.errors.length === 0;
    }
}

// 使用
const emailField = new FormField('email', 'user@example.com')
    .addValidator(new RequiredValidator())
    .addValidator(new EmailValidator());

const passwordField = new FormField('password', 'pass123')
    .addValidator(new RequiredValidator())
    .addValidator(new MinLengthValidator(8));

console.log(emailField.validate());  // true
console.log(passwordField.validate());  // false
console.log(passwordField.errors);  // ['Minimum 8 characters required']
```

## 命令模式

### 基本实现

```javascript
// 命令模式：将请求封装为对象

// 命令接口
class Command {
    execute() {
        throw new Error('Must implement');
    }

    undo() {
        throw new Error('Must implement');
    }
}

// 接收者
class Light {
    on() {
        console.log('Light is on');
    }

    off() {
        console.log('Light is off');
    }
}

class Stereo {
    on() {
        console.log('Stereo is on');
    }

    off() {
        console.log('Stereo is off');
    }

    setCD() {
        console.log('CD is loaded');
    }

    setVolume(volume) {
        console.log(`Volume set to ${volume}`);
    }
}

// 具体命令
class LightOnCommand extends Command {
    constructor(light) {
        super();
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
        super();
        this.light = light;
    }

    execute() {
        this.light.off();
    }

    undo() {
        this.light.on();
    }
}

class StereoOnWithCDCommand extends Command {
    constructor(stereo) {
        super();
        this.stereo = stereo;
    }

    execute() {
        this.stereo.on();
        this.stereo.setCD();
        this.stereo.setVolume(10);
    }

    undo() {
        this.stereo.off();
    }
}

// 调用者
class RemoteControl {
    constructor() {
        this.commands = [];
    }

    setCommand(command) {
        this.commands.push(command);
    }

    buttonPressed() {
        const command = this.commands[this.commands.length - 1];
        command.execute();
    }

    undoButtonPressed() {
        const command = this.commands.pop();
        if (command) {
            command.undo();
        }
    }
}

// 使用
const remote = new RemoteControl();

const livingRoomLight = new Light();
const stereo = new Stereo();

remote.setCommand(new LightOnCommand(livingRoomLight));
remote.buttonPressed();  // Light is on

remote.setCommand(new StereoOnWithCDCommand(stereo));
remote.buttonPressed();  // Stereo is on, CD is loaded, Volume set to 10

remote.undoButtonPressed();  // Stereo is off
```

### 宏命令

```javascript
// 宏命令：组合多个命令

class MacroCommand extends Command {
    constructor() {
        super();
        this.commands = [];
    }

    add(command) {
        this.commands.push(command);
    }

    remove(command) {
        const index = this.commands.indexOf(command);
        if (index > -1) {
            this.commands.splice(index, 1);
        }
    }

    execute() {
        this.commands.forEach(command => command.execute());
    }

    undo() {
        for (let i = this.commands.length - 1; i >= 0; i--) {
            this.commands[i].undo();
        }
    }
}

// 使用
const macro = new MacroCommand();

const light = new Light();
macro.add(new LightOnCommand(light));
macro.add(new LightOffCommand(light));

macro.execute();
// Light is on
// Light is off

macro.undo();
// Light is on
```

## 责任链模式

### 基本实现

```javascript
// 责任链模式：将请求沿处理链传递

// 处理者
class Handler {
    constructor() {
        this.nextHandler = null;
    }

    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }

    handle(request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return null;
    }
}

// 具体处理者
class Manager extends Handler {
    handle(request) {
        if (request.type === 'leave') {
            if (request.days <= 3) {
                console.log(`Manager approved ${request.days} days leave`);
                return true;
            }
        } else {
            return super.handle(request);
        }
    }
}

class Director extends Handler {
    handle(request) {
        if (request.type === 'leave') {
            if (request.days <= 7) {
                console.log(`Director approved ${request.days} days leave`);
                return true;
            }
        } else {
            return super.handle(request);
        }
    }
}

class CEO extends Handler {
    handle(request) {
        if (request.type === 'leave') {
            console.log(`CEO approved ${request.days} days leave`);
            return true;
        }
        return super.handle(request);
    }
}

// 使用
const manager = new Manager();
const director = new Director();
const ceo = new CEO();

manager.setNext(director).setNext(ceo);

// 1 天假期，经理批准
manager.handle({ type: 'leave', days: 1 });
// Manager approved 1 days leave

// 5 天假期，总监批准
manager.handle({ type: 'leave', days: 5 });
// Director approved 5 days leave

// 10 天假期，CEO 批准
manager.handle({ type: 'leave', days: 10 });
// CEO approved 10 days leave
```

### 中间件模式

```javascript
// 实际应用：Express 中间件

class RequestContext {
    constructor(req) {
        this.req = req;
        this.index = 0;
    }

    next() {
        const middleware = this.req.middleware[this.index++];
        if (middleware) {
            middleware(this, this.next.bind(this));
        }
    }
}

// 中间件函数
function logger(ctx, next) {
    console.log(`[LOG] ${ctx.req.method} ${ctx.req.url}`);
    next();
}

function auth(ctx, next) {
    if (ctx.req.headers.authorization) {
        console.log('[AUTH] User authenticated');
        ctx.req.user = { id: 1, name: 'Alice' };
        next();
    } else {
        console.log('[AUTH] Unauthorized');
    }
}

function errorHandler(ctx, next) {
    try {
        next();
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
    }
}

// 应用
class Application {
    constructor() {
        this.middleware = [];
    }

    use(fn) {
        this.middleware.push(fn);
    }

    handle(req) {
        const ctx = new RequestContext({ ...req, middleware: this.middleware });
        ctx.next();
    }
}

// 使用
const app = new Application();
app.use(logger);
app.use(auth);
app.use(errorHandler);

app.handle({
    method: 'GET',
    url: '/users',
    headers: { authorization: 'Bearer token' }
});
// [LOG] GET /users
// [AUTH] User authenticated
```

## 迭代器模式

### 基本实现

```javascript
// 迭代器模式：提供顺序访问聚合对象元素的方法

// 迭代器接口
class Iterator {
    hasNext() {
        throw new Error('Must implement');
    }

    next() {
        throw new Error('Must implement');
    }
}

// 具体迭代器
class ArrayIterator extends Iterator {
    constructor(collection) {
        this.collection = collection;
        this.position = 0;
    }

    hasNext() {
        return this.position < this.collection.items.length;
    }

    next() {
        if (!this.hasNext()) {
            throw new Error('No more elements');
        }
        const item = this.collection.items[this.position];
        this.position++;
        return item;
    }
}

// 聚合对象
class Collection {
    constructor(items) {
        this.items = items;
    }

    createIterator() {
        return new ArrayIterator(this);
    }
}

// 使用
const collection = new Collection(['Item 1', 'Item 2', 'Item 3']);
const iterator = collection.createIterator();

while (iterator.hasNext()) {
    console.log(iterator.next());
}
// Item 1
// Item 2
// Item 3
```

### ES6 迭代器

```javascript
// ES6 迭代器协议

class MyCollection {
    constructor(items) {
        this.items = items;
    }

    // 实现 [Symbol.iterator] 方法
    [Symbol.iterator]() {
        let index = 0;
        const items = this.items;

        return {
            next() {
                if (index < items.length) {
                    return { value: items[index++], done: false };
                } else {
                    return { done: true };
                }
            }
        };
    }
}

// 使用
const collection = new MyCollection(['A', 'B', 'C']);

// 使用 for...of
for (const item of collection) {
    console.log(item);
}
// A
// B
// C

// 使用展开运算符
console.log([...collection]);  // ['A', 'B', 'C']

// 使用解构
const [first, second] = collection;
console.log(first, second);  // A B
```

## 模板方法模式

### 基本实现

```javascript
// 模板方法模式：定义算法骨架，子类实现具体步骤

// 抽象类
class DataProcessor {
    // 模板方法
    process(data) {
        this.validate(data);
        const processed = this.transform(data);
        this.save(processed);
        this.notify(processed);
    }

    validate(data) {
        throw new Error('Must implement');
    }

    transform(data) {
        throw new Error('Must implement');
    }

    save(data) {
        console.log('Data saved:', data);
    }

    notify(data) {
        console.log('Notification sent:', data);
    }
}

// 具体类
class UserProcessor extends DataProcessor {
    validate(data) {
        if (!data.name || !data.email) {
            throw new Error('Invalid user data');
        }
        console.log('User data validated');
    }

    transform(data) {
        return {
            ...data,
            name: data.name.trim(),
            email: data.email.toLowerCase(),
            createdAt: new Date()
        };
    }
}

class OrderProcessor extends DataProcessor {
    validate(data) {
        if (!data.items || data.items.length === 0) {
            throw new Error('Invalid order data');
        }
        console.log('Order data validated');
    }

    transform(data) {
        const total = data.items.reduce((sum, item) => sum + item.price, 0);
        return {
            ...data,
            total,
            status: 'pending'
        };
    }
}

// 使用
const userProcessor = new UserProcessor();
userProcessor.process({
    name: ' Alice ',
    email: 'ALICE@EXAMPLE.COM'
});
// User data validated
// Data saved: { name: 'Alice', email: 'alice@example.com', createdAt: Date }
// Notification sent: { name: 'Alice', email: 'alice@example.com', createdAt: Date }
```

## 状态模式

### 基本实现

```javascript
// 状态模式：对象在不同状态下表现不同行为

// 状态接口
class State {
    handle(context) {
        throw new Error('Must implement');
    }
}

// 具体状态
class NewState extends State {
    handle(context) {
        console.log('Order is new');
        context.setState(new ProcessingState());
    }
}

class ProcessingState extends State {
    handle(context) {
        console.log('Order is being processed');
        context.setState(new ShippedState());
    }
}

class ShippedState extends State {
    handle(context) {
        console.log('Order is shipped');
        context.setState(new DeliveredState());
    }
}

class DeliveredState extends State {
    handle(context) {
        console.log('Order is delivered');
        context.setState(null);  // 终态
    }
}

// 上下文
class OrderContext {
    constructor() {
        this.state = new NewState();
    }

    setState(state) {
        this.state = state;
    }

    process() {
        while (this.state) {
            this.state.handle(this);
        }
    }
}

// 使用
const order = new OrderContext();
order.process();
// Order is new
// Order is being processed
// Order is shipped
// Order is delivered
```

## 最佳实践

::: tip 行为型模式建议

1. **观察者模式** - 事件系统、响应式编程
2. **策略模式** - 算法切换、表单验证
3. **命令模式** - 撤销操作、宏命令
4. **责任链模式** - 审批流程、中间件
5. **迭代器模式** - 遍历集合、自定义集合
6. **模板方法模式** - 算法框架、流程控制
7. **状态模式** - 状态机、工作流

:::

```javascript
// ✅ 推荐做法

// 1. 观察者实现解耦
eventBus.subscribe('event', handler);

// 2. 策略封装算法
const validator = new EmailValidator();

// 3. 命令封装操作
command.execute();

// 4. 链式处理
handler1.setNext(handler2);

// 5. 统一遍历
for (const item of collection) { }

// 6. 模板定义流程
processor.process(data);

// 7. 状态管理
stateMachine.handle();

// ❌ 不推荐做法

// 1. 紧耦合的事件系统
class Component {
    onEvent() {
        // 直接调用其他组件
    }
}

// 2. 大量 if-else
if (type === 'email') { }
else if (type === 'phone') { }

// 3. 直接调用方法
// 不利于撤销和重做

// 4. 嵌套 if 处理
if (level1) {
    if (level2) {
        if (level3) { }
    }
}
```

::: v-pre

[结构型模式](./structural.md) → [实践案例](../14-practice/README.md)

:::
