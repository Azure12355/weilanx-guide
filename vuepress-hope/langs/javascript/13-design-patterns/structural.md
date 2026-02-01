---
title: 结构型模式
icon: ri:layout-masonry-line
order: 2
---

# 结构型模式

结构型模式关注类和对象的组合，通过继承或组合来构建更大的结构。

## 适配器模式

### 基本实现

```javascript
// 适配器模式：将不兼容的接口转换为期望的接口

// 已有接口（不兼容）
class LegacyAPI {
    requestOld(url, method, data) {
        console.log(`Legacy API: ${method} ${url}`, data);
        return { status: 200, data: 'result' };
    }
}

// 新接口
class NewAPI {
    get(url) {
        throw new Error('Must implement');
    }

    post(url, data) {
        throw new Error('Must implement');
    }
}

// 适配器
class APIAdapter extends NewAPI {
    constructor(legacyAPI) {
        super();
        this.legacyAPI = legacyAPI;
    }

    get(url) {
        return this.legacyAPI.requestOld(url, 'GET', null);
    }

    post(url, data) {
        return this.legacyAPI.requestOld(url, 'POST', data);
    }
}

// 使用
const legacyAPI = new LegacyAPI();
const api = new APIAdapter(legacyAPI);

api.get('/users');  // Legacy API: GET /users
api.post('/users', { name: 'Alice' });  // Legacy API: POST /users
```

### 实际应用

```javascript
// 实际应用：地理编码 API 适配

// Google Maps API
class GoogleGeocoder {
    async geocode(address) {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}`);
        const data = await response.json();
        return {
            lat: data.results[0].geometry.location.lat,
            lng: data.results[0].geometry.location.lng
        };
    }
}

// 标准接口
class Geocoder {
    async geocode(address) {
        throw new Error('Must implement');
    }
}

// 适配器
class GoogleGeocoderAdapter extends Geocoder {
    constructor(googleAPI) {
        super();
        this.googleAPI = googleAPI;
    }

    async geocode(address) {
        const result = await this.googleAPI.geocode(address);
        return {
            latitude: result.lat,
            longitude: result.lng
        };
    }
}

// 使用
const googleAPI = new GoogleGeocoder();
const geocoder = new GoogleGeocoderAdapter(googleAPI);

const location = await geocoder.geocode('Beijing, China');
console.log(location);  // { latitude: 39.9042, longitude: 116.4074 }
```

## 装饰器模式

### 基本实现

```javascript
// 装饰器模式：动态地给对象添加额外功能

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

class WhippedCreamDecorator extends CoffeeDecorator {
    cost() {
        return this.coffee.cost() + 5;
    }

    description() {
        return this.coffee.description() + ', Whipped Cream';
    }
}

// 使用
let coffee = new Coffee();
console.log(coffee.description(), ': $' + coffee.cost());
// Coffee : $10

coffee = new MilkDecorator(coffee);
console.log(coffee.description(), ': $' + coffee.cost());
// Coffee, Milk : $12

coffee = new SugarDecorator(coffee);
console.log(coffee.description(), ': $' + coffee.cost());
// Coffee, Milk, Sugar : $13

coffee = new WhippedCreamDecorator(coffee);
console.log(coffee.description(), ': $' + coffee.cost());
// Coffee, Milk, Sugar, Whipped Cream : $18
```

### 函数式装饰器

```javascript
// 函数式装饰器实现

// 基础函数
function greet(name) {
    return `Hello, ${name}!`;
}

// 装饰器函数
function withExclamation(fn) {
    return function(...args) {
        return fn(...args) + '!';
    };
}

function withQuestion(fn) {
    return function(...args) {
        return fn(...args) + '?';
    };
}

function withUpperCase(fn) {
    return function(...args) {
        return fn(...args).toUpperCase();
    };
}

// 使用
let decoratedGreet = greet;
decoratedGreet = withExclamation(decoratedGreet);
decoratedGreet = withUpperCase(decoratedGreet);

console.log(decoratedGreet('Alice'));  // HELLO, ALICE!!

// 更实用的例子：函数性能监控
function withPerformanceLogging(fn) {
    return function(...args) {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();
        console.log(`${fn.name} executed in ${end - start}ms`);
        return result;
    };
}

const expensiveOperation = withPerformanceLogging(function(n) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += i;
    }
    return sum;
});

expensiveOperation(1000000);  // expensiveOperation executed in 3.45ms
```

### ES7 装饰器

```javascript
// ES7 类装饰器语法（需要 Babel）

// 类装饰器
function singleton(Class) {
    let instance;
    return new Proxy(Class, {
        construct(target, args) {
            if (!instance) {
                instance = new target(...args);
            }
            return instance;
        }
    });
}

@singleton
class Database {
    constructor() {
        console.log('Creating database connection');
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

    return descriptor;
}

class Calculator {
    @log
    add(a, b) {
        return a + b;
    }
}

// 参数装饰器
function validate(target, name, index) {
    const validator = target[`__validate_${name}_${index}`];
    if (!validator) {
        target[`__validate_${name}_${index}`] = [];
    }
    target[`__validate_${name}_${index}`].push((value) => {
        if (typeof value !== 'number') {
            throw new Error('Parameter must be a number');
        }
    });
}

class User {
    setName(@validate name) {
        this.name = name;
    }
}
```

## 代理模式

### 基本实现

```javascript
// 代理模式：为对象提供代理以控制对该对象的访问

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
        this.realImage = null;
    }

    display() {
        if (!this.realImage) {
            this.realImage = new RealImage(this.filename);
        }
        this.realImage.display();
    }
}

// 使用
const image = new ProxyImage('photo.jpg');
// 此时还未加载图片

image.display();  // Loading photo.jpg from disk, Displaying photo.jpg
image.display();  // Displaying photo.jpg（无需重新加载）
```

### ES6 Proxy

```javascript
// 使用 ES6 Proxy API

// 目标对象
const user = {
    name: 'Alice',
    age: 25
};

// 代理处理器
const handler = {
    get(target, property) {
        console.log(`Getting ${property}`);
        return target[property];
    },

    set(target, property, value) {
        console.log(`Setting ${property} to ${value}`);
        if (property === 'age' && typeof value !== 'number') {
            throw new Error('Age must be a number');
        }
        target[property] = value;
        return true;
    }
};

// 创建代理
const proxy = new Proxy(user, handler);

proxy.name;  // Getting name
proxy.age = 26;  // Setting age to 26
// proxy.age = 'twenty-six';  // Error: Age must be a number
```

### 实际应用

```javascript
// 实际应用 1：数据验证

const validator = {
    set(target, property, value) {
        const rules = {
            name: (v) => typeof v === 'string' && v.length > 0,
            age: (v) => typeof v === 'number' && v >= 0 && v <= 150,
            email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        };

        if (rules[property] && !rules[property](value)) {
            throw new Error(`Invalid ${property}`);
        }

        target[property] = value;
        return true;
    }
};

const user = new Proxy({}, validator);
user.name = 'Alice';
user.age = 25;
user.email = 'alice@example.com';
// user.age = -5;  // Error: Invalid age

// 实际应用 2：懒加载
function createLazyProxy(factory) {
    let instance = null;

    return new Proxy({}, {
        get(target, property) {
            if (!instance) {
                instance = factory();
            }
            return instance[property];
        },

        set(target, property, value) {
            if (!instance) {
                instance = factory();
            }
            instance[property] = value;
            return true;
        }
    });
}

const heavyObject = createLazyProxy(() => {
    console.log('Creating heavy object');
    return {
        data: new Array(1000000).fill(0),
        process() {
            return 'Processed';
        }
    };
});

// 此时还未创建对象
console.log(heavyObject.process());  // Creating heavy object, Processed
```

## 外观模式

### 基本实现

```javascript
// 外观模式：为复杂子系统提供简化接口

// 复杂子系统
class Computer {
    constructor() {
        this.cpu = new CPU();
        this.memory = new Memory();
        this.hardDrive = new HardDrive();
        this.os = new OS();
    }
}

class CPU {
    freeze() { console.log('CPU frozen'); }
    jump(position) { console.log(`CPU jump to ${position}`); }
    execute() { console.log('CPU executing'); }
}

class Memory {
    load(position, data) { console.log(`Memory loading ${data} at ${position}`); }
}

class HardDrive {
    read(position, size) {
        console.log(`HardDrive reading ${size} bytes at ${position}`);
        return 'data';
    }
}

class OS {
    boot() { console.log('OS booting'); }
}

// 外观
class ComputerFacade {
    constructor(computer) {
        this.computer = computer;
    }

    start() {
        console.log('Starting computer...');
        this.computer.os.boot();
        this.computer.cpu.freeze();
        const bootData = this.computer.hardDrive.read(0, 1024);
        this.computer.memory.load(0, bootData);
        this.computer.cpu.jump(0);
        this.computer.cpu.execute();
        console.log('Computer started!');
    }

    shutdown() {
        console.log('Shutting down computer...');
        this.computer.cpu.freeze();
        console.log('Computer shut down!');
    }
}

// 使用
const computer = new Computer();
const facade = new ComputerFacade(computer);

facade.start();
facade.shutdown();
```

### 实际应用

```javascript
// 实际应用：API 请求门面

class APIClient {
    constructor() {
        this.httpClient = new HTTPClient();
        this.cache = new Cache();
        this.auth = new AuthManager();
        this.logger = new Logger();
    }

    async get(url, options = {}) {
        // 统一处理缓存、认证、日志等
        const cacheKey = this.cache.generateKey(url);

        // 检查缓存
        const cached = this.cache.get(cacheKey);
        if (cached) {
            this.logger.info(`Cache hit for ${url}`);
            return cached;
        }

        // 添加认证头
        const headers = this.auth.addHeaders(options.headers || {});

        // 发送请求
        const response = await this.httpClient.get(url, { ...options, headers });

        // 缓存响应
        this.cache.set(cacheKey, response);

        this.logger.info(`GET ${url} - ${response.status}`);
        return response;
    }

    async post(url, data, options = {}) {
        const headers = this.auth.addHeaders(options.headers || {});
        const response = await this.httpClient.post(url, data, { ...options, headers });
        this.logger.info(`POST ${url} - ${response.status}`);
        return response;
    }
}

// 使用：客户端代码简化
const api = new APIClient();

const users = await api.get('/users');
const result = await api.post('/users', { name: 'Alice' });
```

## 桥接模式

### 基本实现

```javascript
// 桥接模式：将抽象部分与实现部分分离

// 实现接口
class DrawingAPI {
    drawCircle(x, y, radius) {
        throw new Error('Must implement');
    }
}

// 具体实现
class CanvasAPI extends DrawingAPI {
    drawCircle(x, y, radius) {
        console.log(`Drawing circle on Canvas at (${x}, ${y}) with radius ${radius}`);
    }
}

class SVGAPI extends DrawingAPI {
    drawCircle(x, y, radius) {
        console.log(`Drawing circle in SVG: <circle cx="${x}" cy="${y}" r="${radius}" />`);
    }
}

// 抽象
class Shape {
    constructor(drawingAPI) {
        this.drawingAPI = drawingAPI;
    }

    draw() {
        throw new Error('Must implement');
    }
}

// 扩展抽象
class Circle extends Shape {
    constructor(x, y, radius, drawingAPI) {
        super(drawingAPI);
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw() {
        this.drawingAPI.drawCircle(this.x, this.y, this.radius);
    }

    resize(percent) {
        this.radius *= percent;
    }
}

// 使用
const canvasCircle = new Circle(10, 10, 5, new CanvasAPI());
canvasCircle.draw();  // Drawing circle on Canvas at (10, 10) with radius 5

const svgCircle = new Circle(10, 10, 5, new SVGAPI());
svgCircle.draw();  // Drawing circle in SVG: <circle cx="10" cy="10" r="5" />
```

## 组合模式

### 基本实现

```javascript
// 组合模式：将对象组合成树形结构以表示"部分-整体"层次结构

// 组件接口
class FileSystemNode {
    constructor(name) {
        this.name = name;
    }

    print(indent = 0) {
        throw new Error('Must implement');
    }
}

// 叶子节点
class File extends FileSystemNode {
    constructor(name, size) {
        super(name);
        this.size = size;
    }

    print(indent = 0) {
        console.log('  '.repeat(indent) + `📄 ${this.name} (${this.size}KB)`);
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

    remove(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    print(indent = 0) {
        console.log('  '.repeat(indent) + `📁 ${this.name}/`);
        this.children.forEach(child => child.print(indent + 1));
    }
}

// 使用
const root = new Directory('root');
const home = new Directory('home');
const user = new Directory('user');

const file1 = new File('document.txt', 12);
const file2 = new File('image.jpg', 256);
const file3 = new File('script.js', 8);

root.add(home);
home.add(user);
user.add(file1);
user.add(file2);
user.add(file3);

root.print();
// 📁 root/
//   📁 home/
//     📁 user/
//       📄 document.txt (12KB)
//       📄 image.jpg (256KB)
//       📄 script.js (8KB)
```

## 最佳实践

::: tip 结构型模式建议

1. **适配器模式** - 接口不兼容、集成第三方库
2. **装饰器模式** - 动态添加功能、避免子类爆炸
3. **代理模式** - 延迟加载、访问控制、缓存
4. **外观模式** - 简化复杂子系统、API 设计
5. **桥接模式** - 多维度变化、平台独立性
6. **组合模式** - 树形结构、部分-整体层次

:::

```javascript
// ✅ 推荐做法

// 1. 适配器统一接口
const adapter = new APIAdapter(legacyAPI);

// 2. 装饰器增强功能
@log
@memoize
class Service { }

// 3. 代理控制访问
const proxy = new Proxy(target, handler);

// 4. 外观简化复杂度
facade.start();

// 5. 桥接分离抽象
const shape = new Circle(x, y, radius, new CanvasAPI());

// 6. 组合统一处理
node.print();

// ❌ 不推荐做法

// 1. 直接修改不兼容接口
class NewAPI {
    requestOld() { }  // 不要这样做
}

// 2. 继承过多功能
class CoffeeWithMilkAndSugarAndWhippedCream extends Coffee { }

// 3. 复杂的客户端代码
// 直接操作复杂子系统
```

::: v-pre

[创建型模式](./creational.md) → [行为型模式](./behavioral.md)

:::
