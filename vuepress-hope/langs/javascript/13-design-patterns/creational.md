---
title: 创建型模式
icon: ri:shape-2-line
order: 1
---

# 创建型模式

创建型模式关注对象的创建过程，将对象的创建和使用分离，降低系统的耦合度。

## 单例模式

### 基本实现

```javascript
// 单例模式：确保一个类只有一个实例

// 方式 1：闭包实现
const Singleton = (function() {
    let instance;

    function createInstance() {
        return {
            data: [],
            add(item) {
                this.data.push(item);
            },
            getData() {
                return this.data;
            }
        };
    }

    return {
        getInstance() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// 使用
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

console.log(instance1 === instance2);  // true

// 方式 2：ES6 Class 实现
class SingletonClass {
    static #instance = null;

    constructor() {
        if (SingletonClass.#instance) {
            return SingletonClass.#instance;
        }
        this.data = [];
        SingletonClass.#instance = this;
    }

    static getInstance() {
        if (!SingletonClass.#instance) {
            SingletonClass.#instance = new SingletonClass();
        }
        return SingletonClass.#instance;
    }

    add(item) {
        this.data.push(item);
    }

    getData() {
        return this.data;
    }
}

// 使用
const s1 = SingletonClass.getInstance();
const s2 = SingletonClass.getInstance();
console.log(s1 === s2);  // true
```

### 应用场景

```javascript
// 应用场景 1：全局配置
const Config = (function() {
    let instance;

    function createInstance() {
        return {
            apiBaseUrl: 'https://api.example.com',
            timeout: 5000,
            debug: false,
            update(config) {
                Object.assign(this, config);
            }
        };
    }

    return {
        getInstance() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// 应用场景 2：状态管理
class Store {
    static #instance = null;
    #state = {};

    constructor() {
        if (Store.#instance) {
            return Store.#instance;
        }
        Store.#instance = this;
    }

    static getInstance() {
        if (!Store.#instance) {
            Store.#instance = new Store();
        }
        return Store.#instance;
    }

    setState(key, value) {
        this.#state[key] = value;
        this.notify();
    }

    getState(key) {
        return this.#state[key];
    }

    notify() {
        // 通知观察者
    }
}
```

## 工厂模式

### 简单工厂

```javascript
// 简单工厂：根据参数创建不同对象

// 产品类
class Button {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    render() {
        console.log(`Rendering ${this.constructor.name}`);
    }
}

class PrimaryButton extends Button {
    constructor(width, height) {
        super(width, height);
        this.color = 'blue';
    }
}

class SecondaryButton extends Button {
    constructor(width, height) {
        super(width, height);
        this.color = 'gray';
    }
}

// 简单工厂
class ButtonFactory {
    static createButton(type, width = 100, height = 40) {
        switch (type) {
            case 'primary':
                return new PrimaryButton(width, height);
            case 'secondary':
                return new SecondaryButton(width, height);
            default:
                return new Button(width, height);
        }
    }
}

// 使用
const primaryBtn = ButtonFactory.createButton('primary');
const secondaryBtn = ButtonFactory.createButton('secondary');

primaryBtn.render();      // Rendering PrimaryButton
secondaryBtn.render();    // Rendering SecondaryButton
```

### 工厂方法

```javascript
// 工厂方法：定义创建对象的接口，由子类决定实例化哪个类

// 抽象工厂
class LoggerFactory {
    createLogger() {
        throw new Error('Must implement createLogger');
    }
}

// 具体工厂
class ConsoleLoggerFactory extends LoggerFactory {
    createLogger() {
        return new ConsoleLogger();
    }
}

class FileLoggerFactory extends LoggerFactory {
    createLogger(options) {
        return new FileLogger(options);
    }
}

// 产品
class ConsoleLogger {
    log(message) {
        console.log(`[Console] ${message}`);
    }
}

class FileLogger {
    constructor(options) {
        this.filename = options.filename;
    }

    log(message) {
        // 写入文件
        console.log(`[File:${this.filename}] ${message}`);
    }
}

// 使用
const consoleFactory = new ConsoleLoggerFactory();
const consoleLogger = consoleFactory.createLogger();
consoleLogger.log('Hello');  // [Console] Hello

const fileFactory = new FileLoggerFactory({ filename: 'app.log' });
const fileLogger = fileFactory.createLogger({ filename: 'app.log' });
fileLogger.log('Error');  // [File:app.log] Error
```

### 抽象工厂

```javascript
// 抽象工厂：创建相关对象家族

// 抽象工厂
class UIComponentFactory {
    createButton() {
        throw new Error('Must implement');
    }

    createInput() {
        throw new Error('Must implement');
    }
}

// Material Design 工厂
class MaterialFactory extends UIComponentFactory {
    createButton() {
        return {
            type: 'MaterialButton',
            style: {
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }
        };
    }

    createInput() {
        return {
            type: 'MaterialInput',
            style: {
                borderBottom: '1px solid #ccc',
                outline: 'none'
            }
        };
    }
}

// Ant Design 工厂
class AntFactory extends UIComponentFactory {
    createButton() {
        return {
            type: 'AntButton',
            style: {
                borderRadius: '2px',
                border: '1px solid #d9d9d9'
            }
        };
    }

    createInput() {
        return {
            type: 'AntInput',
            style: {
                border: '1px solid #d9d9d9',
                borderRadius: '2px'
            }
        };
    }
}

// 使用
function createUI(factory) {
    const button = factory.createButton();
    const input = factory.createInput();
    return { button, input };
}

const materialUI = createUI(new MaterialFactory());
const antUI = createUI(new AntFactory());
```

## 建造者模式

### 基本实现

```javascript
// 建造者模式：分步骤创建复杂对象

// 产品
class Pizza {
    constructor() {
        this.dough = '';
        this.sauce = '';
        this.toppings = [];
    }

    setDough(dough) {
        this.dough = dough;
    }

    setSauce(sauce) {
        this.sauce = sauce;
    }

    addTopping(topping) {
        this.toppings.push(topping);
    }

    describe() {
        console.log(`Pizza with ${this.dough} dough, ${this.sauce} sauce, and toppings: ${this.toppings.join(', ')}`);
    }
}

// 抽象建造者
class PizzaBuilder {
    constructor() {
        this.pizza = new Pizza();
    }

    setDough(dough) {
        this.pizza.setDough(dough);
        return this;
    }

    setSauce(sauce) {
        this.pizza.setSauce(sauce);
        return this;
    }

    addTopping(topping) {
        this.pizza.addTopping(topping);
        return this;
    }

    build() {
        return this.pizza;
    }
}

// 指导者
class PizzaDirector {
    constructor(builder) {
        this.builder = builder;
    }

    buildMargherita() {
        return this.builder
            .setDough('thin')
            .setSauce('tomato')
            .addTopping('mozzarella')
            .addTopping('basil')
            .build();
    }

    buildPepperoni() {
        return this.builder
            .setDough('thick')
            .setSauce('tomato')
            .addTopping('mozzarella')
            .addTopping('pepperoni')
            .build();
    }
}

// 使用
const builder = new PizzaBuilder();
const director = new PizzaDirector(builder);

const margherita = director.buildMargherita();
margherita.describe();

const pepperoni = director.buildPepperoni();
pepperoni.describe();

// 或链式调用
const customPizza = new PizzaBuilder()
    .setDough('thin')
    .setSauce('pesto')
    .addTopping('chicken')
    .addTopping('pineapple')
    .build();
```

### 实际应用

```javascript
// 实际应用：AJAX 请求配置

class RequestBuilder {
    constructor() {
        this.config = {
            method: 'GET',
            headers: {},
            body: null
        };
    }

    setMethod(method) {
        this.config.method = method;
        return this;
    }

    setURL(url) {
        this.config.url = url;
        return this;
    }

    setHeader(key, value) {
        this.config.headers[key] = value;
        return this;
    }

    setBody(body) {
        this.config.body = JSON.stringify(body);
        return this;
    }

    build() {
        return fetch(this.config.url, this.config);
    }
}

// 使用
const request = new RequestBuilder()
    .setMethod('POST')
    .setURL('https://api.example.com/users')
    .setHeader('Content-Type', 'application/json')
    .setHeader('Authorization', 'Bearer token')
    .setBody({ name: 'Alice', age: 25 })
    .build();
```

## 原型模式

### 基本实现

```javascript
// 原型模式：通过克隆现有对象创建新对象

// 使用 Object.create
const prototype = {
    name: 'Prototype',
    sayHello() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

const obj1 = Object.create(prototype);
obj1.name = 'Object 1';
obj1.sayHello();  // Hello, I'm Object 1

const obj2 = Object.create(prototype);
obj2.name = 'Object 2';
obj2.sayHello();  // Hello, I'm Object 2

// 使用原型链
class Shape {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        // 创建新实例并复制属性
        return new this.constructor(this.x, this.y);
    }

    getArea() {
        return 0;
    }
}

class Circle extends Shape {
    constructor(x, y, radius) {
        super(x, y);
        this.radius = radius;
    }

    clone() {
        return new Circle(this.x, this.y, this.radius);
    }

    getArea() {
        return Math.PI * this.radius * this.radius;
    }
}

// 使用
const circle1 = new Circle(0, 0, 5);
const circle2 = circle1.clone();

console.log(circle1 === circle2);  // false
console.log(circle1.getArea() === circle2.getArea());  // true
```

### 深度克隆

```javascript
// 深度克隆实现

function deepClone(obj) {
    // 基本类型
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // Date
    if (obj instanceof Date) {
        return new Date(obj);
    }

    // Array
    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item));
    }

    // Object
    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

// 使用
const original = {
    name: 'Alice',
    hobbies: ['reading', 'coding'],
    address: {
        city: 'Beijing',
        country: 'China'
    },
    createdAt: new Date()
};

const cloned = deepClone(original);

console.log(original === cloned);  // false
console.log(original.hobbies === cloned.hobbies);  // false
console.log(original.address === cloned.address);  // false
```

## 最佳实践

::: tip 创建型模式建议

1. **单例模式** - 全局配置、状态管理、日志记录器
2. **工厂模式** - 对象创建逻辑复杂、需要根据条件创建不同对象
3. **建造者模式** - 构建复杂对象、多步骤配置
4. **原型模式** - 对象创建成本高、需要大量相似对象

:::

```javascript
// ✅ 推荐做法

// 1. 单例用于全局状态
class Store {
    static #instance = null;
    static getInstance() { }
}

// 2. 工厂创建相关对象
const factory = new ComponentFactory();
const button = factory.create('button');

// 3. 建造者分步骤构建
const query = new QueryBuilder()
    .select('*')
    .from('users')
    .where('age > 18')
    .build();

// 4. 原型克隆对象
const clone = original.clone();

// ❌ 不推荐做法

// 1. 滥用单例
class Utils {
    static getInstance() { }  // 工具类不需要单例
}

// 2. 工厂过于复杂
if (type === 'A') { }
else if (type === 'B') { }
// ... 太多分支

// 3. 建造者简单对象
new UserBuilder()
    .setName('Alice')  // 简单对象直接构造
    .build();
```

::: v-pre

[结构型模式](./structural.md) → [行为型模式](./behavioral.md)

:::
