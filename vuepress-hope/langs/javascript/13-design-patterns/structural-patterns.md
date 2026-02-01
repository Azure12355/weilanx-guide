---
title: 结构型模式
icon: ri:layout-masonry-line
order: 2
---

# 结构型模式

结构型模式关注类和对象的组合，形成更大的结构。

## 适配器模式

### 基本实现

```javascript
// 适配器模式：将不兼容的接口转换为兼容

// 不兼容的接口
class LegacyAPI {
    request_old() {
        return 'Legacy response';
    }
}

// 新接口
class NewAPI {
    request() {
        return 'New response';
    }
}

// 适配器
class APIAdapter {
    constructor(legacyAPI) {
        this.legacyAPI = legacyAPI;
    }

    request() {
        // 调用旧接口，返回新格式
        const response = this.legacyAPI.request_old();
        return {
            data: response,
            status: 200
        };
    }
}

// 使用
const legacyAPI = new LegacyAPI();
const adapter = new APIAdapter(legacyAPI);

const result = adapter.request();
console.log(result);  // { data: 'Legacy response', status: 200 }
```

### 应用场景

```javascript
// 应用场景：API 数据适配

// 第三方 API 返回格式
{
    "user_id": 123,
    "user_name": "Alice",
    "user_email": "alice@example.com"
}

// 应用内部格式
{
    "id": 123,
    "name": "Alice",
    "email": "alice@example.com"
}

// 适配器
class UserAdapter {
    static adapt(legacyData) {
        return {
            id: legacyData.user_id,
            name: legacyData.user_name,
            email: legacyData.user_email
        };
    }
}

// 使用
const legacyUser = {
    user_id: 123,
    user_name: 'Alice',
    user_email: 'alice@example.com'
};

const user = UserAdapter.adapt(legacyUser);
console.log(user);
// { id: 123, name: 'Alice', email: 'alice@example.com' }
```

## 装饰器模式

### 基本实现

```javascript
// 装饰器模式：动态添加功能

// 基础组件
class Coffee {
    cost() {
        return 10;
    }

    description() {
        return 'Coffee';
    }
}

// 装饰器基类
class CoffeeDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }

    cost() {
        return this.coffee.cost();
    }

    description() {
        return this.coffee.description();
    }
}

// 具体装饰器
class MilkDecorator extends CoffeeDecorator {
    cost() {
        return this.coffee.cost() + 2;
    }

    description() {
        return this.coffee.description() + ', Milk';
    }
}

class SugarDecorator extends CoffeeDecorator {
    cost() {
        return this.coffee.cost() + 1;
    }

    description() {
        return this.coffee.description() + ', Sugar';
    }
}

// 使用
let coffee = new Coffee();
console.log(coffee.cost());        // 10
console.log(coffee.description()); // Coffee

coffee = new MilkDecorator(coffee);
console.log(coffee.cost());        // 12
console.log(coffee.description()); // Coffee, Milk

coffee = new SugarDecorator(coffee);
console.log(coffee.cost());        // 13
console.log(coffee.description()); // Coffee, Milk, Sugar
```

### JavaScript 装饰器

```javascript
// JavaScript 装饰器语法（需要 Babel）

// 类装饰器
function log(Class) {
    return class extends Class {
        constructor(...args) {
            console.log(`Creating instance of ${Class.name}`);
            super(...args);
        }
    };
}

@log
class MyClass {
    constructor(name) {
        this.name = name;
    }
}

// 方法装饰器
function log(target, name, descriptor) {
    const original = descriptor.value;

    descriptor.value = function(...args) {
        console.log(`Calling ${name} with`, args);
        const result = original.apply(this, args);
        console.log(`${name} returned`, result);
        return result;
    };
}

class UserService {
    @log
    getUser(id) {
        return { id, name: 'Alice' };
    }
}

// 使用
const service = new UserService();
service.getUser(1);
// Calling getUser with [1]
// getUser returned { id: 1, name: 'Alice' }
```

## 代理模式

### 基本实现

```javascript
// 代理模式：控制对象访问

// 真实对象
class RealImage {
    constructor(filename) {
        this.filename = filename;
        this.loadFromDisk();
    }

    display() {
        console.log(`Displaying ${this.filename}`);
    }

    loadFromDisk() {
        console.log(`Loading ${this.filename} from disk`);
    }
}

// 代理对象
class ProxyImage {
    constructor(filename) {
        this.filename = filename;
        this.image = null;
    }

    display() {
        if (!this.image) {
            this.image = new RealImage(this.filename);
        }
        this.image.display();
    }
}

// 使用
const image = new ProxyImage('photo.jpg');
console.log('First call:');
image.display();
// Loading photo.jpg from disk
// Displaying photo.jpg

console.log('Second call:');
image.display();
// Displaying photo.jpg（未重新加载）
```

### ES6 Proxy

```javascript
// ES6 Proxy：拦截对象操作

const target = {
    message: 'Hello'
};

const handler = {
    get(target, property, receiver) {
        console.log(`Getting ${property}`);
        return Reflect.get(target, property, receiver);
    },

    set(target, property, value, receiver) {
        console.log(`Setting ${property} to ${value}`);
        return Reflect.set(target, property, value, receiver);
    }
};

const proxy = new Proxy(target, handler);

proxy.message;  // Getting message
proxy.message = 'Hi';  // Setting message to Hi

// 验证代理
const validator = {
    set(target, property, value) {
        if (property === 'age' && (typeof value !== 'number' || value < 0)) {
            throw new Error('Invalid age');
        }
        target[property] = value;
        return true;
    }
};

const person = new Proxy({}, validator);
person.age = 25;      // OK
person.age = -1;      // Error: Invalid age
```

## 桥接模式

### 基本实现

```javascript
// 桥接模式：分离抽象和实现

// 实现接口
class DrawingAPI {
    drawCircle(x, y, radius) {
        throw new Error('Must implement drawCircle');
    }
}

// 具体实现
class CanvasAPI extends DrawingAPI {
    drawCircle(x, y, radius) {
        console.log(`Canvas: Drawing circle at (${x}, ${y}) with radius ${radius}`);
    }
}

class SVGAPI extends DrawingAPI {
    drawCircle(x, y, radius) {
        console.log(`SVG: Drawing circle at (${x}, ${y}) with radius ${radius}`);
    }
}

// 抽象类
class Shape {
    constructor(x, y, drawingAPI) {
        this.x = x;
        this.y = y;
        this.drawingAPI = drawingAPI;
    }

    draw() {
        throw new Error('Must implement draw');
    }
}

// 具体抽象
class Circle extends Shape {
    constructor(x, y, radius, drawingAPI) {
        super(x, y, drawingAPI);
        this.radius = radius;
    }

    draw() {
        this.drawingAPI.drawCircle(this.x, this.y, this.radius);
    }
}

// 使用
const canvasCircle = new Circle(10, 10, 5, new CanvasAPI());
canvasCircle.draw();
// Canvas: Drawing circle at (10, 10) with radius 5

const svgCircle = new Circle(20, 20, 10, new SVGAPI());
svgCircle.draw();
// SVG: Drawing circle at (20, 20) with radius 10
```

### 应用场景

```javascript
// 应用场景：跨平台 UI

// 平台抽象
class UIButton {
    constructor(platform) {
        this.platform = platform;
    }

    render() {
        this.platform.renderButton();
    }
}

// 平台实现
class WebPlatform {
    renderButton() {
        console.log('Rendering HTML button');
    }
}

class MobilePlatform {
    renderButton() {
        console.log('Rendering native button');
    }
}

// 使用
const webButton = new UIButton(new WebPlatform());
webButton.render();

const mobileButton = new UIButton(new MobilePlatform());
mobileButton.render();
```

## 组合模式

### 基本实现

```javascript
// 组合模式：树形结构处理

// 组件基类
class FileSystemNode {
    constructor(name) {
        this.name = name;
    }

    print() {
        throw new Error('Must implement print');
    }
}

// 叶子节点
class File extends FileSystemNode {
    constructor(name, size) {
        super(name);
        this.size = size;
    }

    print(indent = '') {
        console.log(`${indent}📄 ${this.name} (${this.size}KB)`);
    }
}

// 组合节点
class Directory extends FileSystemNode {
    constructor(name) {
        super(name);
        this.children = [];
    }

    add(child) {
        this.children.push(child);
    }

    print(indent = '') {
        console.log(`${indent}📁 ${this.name}/`);
        this.children.forEach(child => {
            child.print(indent + '  ');
        });
    }
}

// 使用
const root = new Directory('root');

const home = new Directory('home');
const user = new Directory('user');
const file1 = new File('document.txt', 10);
const file2 = new File('photo.jpg', 500);

root.add(home);
home.add(user);
user.add(file1);
user.add(file2);

root.print();
// 📁 root/
//   📁 home/
//     📁 user/
//       📄 document.txt (10KB)
//       📄 photo.jpg (500KB)
```

### 应用场景

```javascript
// 应用场景：组织架构树

class Employee {
    constructor(name, salary) {
        this.name = name;
        this.salary = salary;
    }

    getSalary() {
        return this.salary;
    }
}

class Manager extends Employee {
    constructor(name, salary) {
        super(name, salary);
        this.subordinates = [];
    }

    add(employee) {
        this.subordinates.push(employee);
    }

    getSalary() {
        let total = this.salary;
        for (const subordinate of this.subordinates) {
            total += subordinate.getSalary();
        }
        return total;
    }
}

// 使用
const ceo = new Manager('CEO', 10000);

const cto = new Manager('CTO', 8000);
const dev1 = new Employee('Dev 1', 5000);
const dev2 = new Employee('Dev 2', 5000);

const cfo = new Manager('CFO', 9000);
const acc1 = new Employee('Accountant 1', 4000);

ceo.add(cto);
ceo.add(cfo);

cto.add(dev1);
cto.add(dev2);
cfo.add(acc1);

console.log('Total salary:', ceo.getSalary());
// Total salary: 41000
```

## 结构型模式最佳实践

```javascript
// ✅ 推荐做法

// 1. 适配器：转换不兼容接口
class APIAdapter {
    constructor(legacyAPI) {
        this.legacyAPI = legacyAPI;
    }
    request() {
        return this.legacyAPI.request_old();
    }
}

// 2. 装饰器：动态添加功能
function log(target, name, descriptor) {
    // 装饰器逻辑
}

// 3. 代理：控制对象访问
const proxy = new Proxy(target, handler);

// 4. 桥接：分离抽象实现
class Shape {
    constructor(drawingAPI) {
        this.drawingAPI = drawingAPI;
    }
}

// 5. 组合：树形结构
class Directory {
    add(child) {
        this.children.push(child);
    }
}

// ❌ 不推荐做法

// 1. 过度使用适配器
// 导致多层适配

// 2. 装饰器链过长
// 难以追踪功能来源

// 3. 代理逻辑复杂
// 影响性能

// 4. 桥接不必要的抽象
// 增加复杂度

// 5. 组合过深
// 难以遍历
```

::: tip 结构型模式检查清单

- [ ] 理解适配器模式
// 2. 掌握装饰器模式
// 3. 使用代理模式
// 4. 了解桥梁模式
// 5. 使用组合模式
// 6. 选择合适模式

:::

::: tip 下一步

学习行为型模式 → [行为型模式](./behavioral-patterns.md)
:::
