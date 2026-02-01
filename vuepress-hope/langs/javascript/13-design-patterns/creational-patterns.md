---
title: 创建型模式
icon: ri:shape-line
order: 1
---

# 创建型模式

创建型模式关注对象的创建过程，解耦对象的创建和使用。

## 单例模式

### 基本实现

```javascript
// 单例模式：确保类只有一个实例

// ES6 Class 实现
class Singleton {
    static instance = null;

    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        Singleton.instance = this;
        this.data = 'Singleton Data';
    }

    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }

    getData() {
        return this.data;
    }
}

// 使用
const s1 = new Singleton();
const s2 = new Singleton();
console.log(s1 === s2);  // true

// 或使用静态方法
const s3 = Singleton.getInstance();
const s4 = Singleton.getInstance();
console.log(s3 === s4);  // true

// 模块模式（Node.js）
// singleton.js
class Singleton {
    constructor() {
        this.data = 'Singleton Data';
    }

    getData() {
        return this.data;
    }
}

module.exports = new Singleton();

// 使用
const singleton1 = require('./singleton');
const singleton2 = require('./singleton');
console.log(singleton1 === singleton2);  // true
```

### 应用场景

```javascript
// 应用场景：数据库连接

class Database {
    static instance = null;

    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        this.connection = this.createConnection();
        Database.instance = this;
    }

    createConnection() {
        console.log('Creating database connection...');
        return { connected: true };
    }

    static getConnection() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance.connection;
    }
}

// 使用
const conn1 = Database.getConnection();
const conn2 = Database.getConnection();
console.log(conn1 === conn2);  // true

// 配置管理
class Config {
    static instance = null;
    config = {};

    constructor() {
        if (Config.instance) {
            return Config.instance;
        }
        this.loadConfig();
        Config.instance = this;
    }

    loadConfig() {
        this.config = {
            apiUrl: 'https://api.example.com',
            timeout: 5000
        };
    }

    get(key) {
        return this.config[key];
    }

    static getConfig() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
}
```

## 工厂模式

### 简单工厂

```javascript
// 简单工厂：根据输入创建不同对象

class Car {
    constructor(type) {
        this.type = type;
    }

    drive() {
        console.log(`${this.type} car is driving`);
    }
}

// 简单工厂函数
function createCar(type) {
    return new Car(type);
}

// 使用
const sedan = createCar('Sedan');
const suv = createCar('SUV');

sedan.drive();  // Sedan car is driving
suv.drive();   // SUV car is driving

// 或使用对象
const carFactory = {
    createSedan: () => new Car('Sedan'),
    createSUV: () => new Car('SUV'),
    createTruck: () => new Car('Truck')
};

const car1 = carFactory.createSedan();
const car2 = carFactory.createSUV();
```

### 工厂方法

```javascript
// 工厂方法：定义创建对象的接口

class Car {
    drive() {
        console.log('Car is driving');
    }
}

class Sedan extends Car {
    drive() {
        console.log('Sedan is driving');
    }
}

class SUV extends Car {
    drive() {
        console.log('SUV is driving');
    }
}

// 工厂类
class CarFactory {
    createCar(type) {
        switch (type) {
            case 'sedan':
                return new Sedan();
            case 'suv':
                return new SUV();
            default:
                throw new Error('Unknown car type');
        }
    }
}

// 使用
const factory = new CarFactory();
const car1 = factory.createCar('sedan');
const car2 = factory.createCar('suv');

car1.drive();  // Sedan is driving
car2.drive();  // SUV is driving
```

### 抽象工厂

```javascript
// 抽象工厂：创建相关对象家族

// 抽象工厂接口
class UIComponentFactory {
    createButton() {
        throw new Error('Must implement createButton');
    }

    createInput() {
        throw new Error('Must implement createInput');
    }
}

// Windows 工厂
class WindowsFactory extends UIComponentFactory {
    createButton() {
        return new WindowsButton();
    }

    createInput() {
        return new WindowsInput();
    }
}

// Mac 工厂
class MacFactory extends UIComponentFactory {
    createButton() {
        return new MacButton();
    }

    createInput() {
        return new MacInput();
    }
}

// Button 类
class WindowsButton {
    render() {
        console.log('Rendering Windows button');
    }
}

class MacButton {
    render() {
        console.log('Rendering Mac button');
    }
}

// Input 类
class WindowsInput {
    render() {
        console.log('Rendering Windows input');
    }
}

class MacInput {
    render() {
        console.log('Rendering Mac input');
    }
}

// 使用
function createUI(factory) {
    const button = factory.createButton();
    const input = factory.createInput();

    button.render();
    input.render();
}

// Windows UI
createUI(new WindowsFactory());

// Mac UI
createUI(new MacFactory());
```

## 建造者模式

### 基本实现

```javascript
// 建造者模式：分步骤创建复杂对象

class House {
    constructor() {
        this.walls = 0;
        this.doors = 0;
        this.windows = 0;
        this.hasGarage = false;
        this.hasPool = false;
    }
}

// House 建造者
class HouseBuilder {
    constructor() {
        this.house = new House();
    }

    buildWalls(count) {
        this.house.walls = count;
        return this;
    }

    buildDoors(count) {
        this.house.doors = count;
        return this;
    }

    buildWindows(count) {
        this.house.windows = count;
        return this;
    }

    buildGarage() {
        this.house.hasGarage = true;
        return this;
    }

    buildPool() {
        this.house.hasPool = true;
        return this;
    }

    build() {
        return this.house;
    }
}

// 使用
const house = new HouseBuilder()
    .buildWalls(4)
    .buildDoors(2)
    .buildWindows(6)
    .buildGarage()
    .build();

console.log(house);
// {
//   walls: 4,
//   doors: 2,
//   windows: 6,
//   hasGarage: true,
//   hasPool: false
// }
```

### 流畅接口

```javascript
// 流畅接口：链式调用

class QueryBuilder {
    constructor(table) {
        this.table = table;
        this.selects = [];
        this.wheres = [];
        this.orders = [];
        this.limit = null;
    }

    select(...fields) {
        this.selects.push(...fields);
        return this;
    }

    where(condition) {
        this.wheres.push(condition);
        return this;
    }

    orderBy(field, direction = 'ASC') {
        this.orders.push({ field, direction });
        return this;
    }

    take(count) {
        this.limit = count;
        return this;
    }

    build() {
        let query = `SELECT ${this.selects.join(', ') || '*'}`;
        query += ` FROM ${this.table}`;

        if (this.wheres.length > 0) {
            query += ` WHERE ${this.wheres.join(' AND ')}`;
        }

        if (this.orders.length > 0) {
            query += ` ORDER BY ${this.orders.map(o => `${o.field} ${o.direction}`).join(', ')}`;
        }

        if (this.limit) {
            query += ` LIMIT ${this.limit}`;
        }

        return query;
    }
}

// 使用
const query = new QueryBuilder('users')
    .select('id', 'name', 'email')
    .where('age > 18')
    .where('status = "active"')
    .orderBy('name', 'ASC')
    .take(10)
    .build();

console.log(query);
// SELECT id, name, email FROM users WHERE age > 18 AND status = "active" ORDER BY name ASC LIMIT 10
```

## 原型模式

### 基本实现

```javascript
// 原型模式：通过克隆创建对象

class Prototype {
    constructor(field) {
        this.field = field;
    }

    clone() {
        return new Prototype(this.field);
    }
}

// 使用
const prototype = new Prototype('Original');
const clone = prototype.clone();

console.log(prototype.field);  // Original
console.log(clone.field);        // Original
console.log(prototype === clone);  // false

// 浅克隆
class ShallowClone {
    constructor(data) {
        this.data = data;
    }

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

const original = new ShallowClone({ name: 'Alice' });
const cloned = original.clone();

console.log(original === cloned);  // false
console.log(original.data === cloned.data);  // true（共享引用）

// 深克隆
class DeepClone {
    constructor(data) {
        this.data = data;
    }

    clone() {
        return new DeepClone(JSON.parse(JSON.stringify(this.data)));
    }
}

const original2 = new DeepClone({ name: 'Alice' });
const cloned2 = original2.clone();

console.log(original2 === cloned2);  // false
console.log(original2.data === cloned2.data);  // false（独立副本）
```

### Object.create

```javascript
// Object.create：原型继承

const person = {
    name: 'Unknown',
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

// 创建新对象，person 作为原型
const alice = Object.create(person);
alice.name = 'Alice';

alice.greet();  // Hello, I'm Alice

// 原型链
console.log(Object.getPrototypeOf(alice) === person);  // true

// 检查属性
console.log('name' in alice);        // true
console.log(alice.hasOwnProperty('name'));  // true
console.log('greet' in alice);       // true
console.log(alice.hasOwnProperty('greet'));  // false（继承属性）
```

## 创建型模式最佳实践

```javascript
// ✅ 推荐做法

// 1. 单例：用于共享资源
class Database {
    static instance = null;
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

// 2. 工厂：封装创建逻辑
function createCar(type) {
    switch (type) {
        case 'sedan': return new Sedan();
        case 'suv': return new SUV();
        default: throw new Error('Unknown type');
    }
}

// 3. 建造者：分步骤创建
const house = new HouseBuilder()
    .buildWalls(4)
    .buildDoors(2)
    .build();

// 4. 原型：克隆对象
const clone = original.clone();

// ❌ 不推荐做法

// 1. 滥用单例
// 所有类都用单例

// 2. 工厂类过于复杂
// 支持太多类型，难以维护

// 3. 建造者步骤过多
// 导致使用困难

// 4. 忽略深克隆
// 导致共享引用问题
```

::: tip 创建型模式检查清单

- [ ] 理解单例模式
// 2. 掌握工厂模式
// 3. 使用建造者模式
// 4. 了解原型模式
// 5. 选择合适模式
// 6. 避免过度设计

:::

::: tip 下一步

学习结构型模式 → [结构型模式](./structural-patterns.md)
:::
