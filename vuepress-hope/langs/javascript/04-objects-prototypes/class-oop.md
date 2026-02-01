---
title: 类与面向对象
icon: ri:class-line
order: 4
---

# 类与面向对象

ES6 引入了 class 关键字，提供了更清晰的面向对象编程语法。

## 类的基本语法

### 定义类

```javascript
// 类声明
class Person {
    // 构造方法
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    // 实例方法
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }

    // 另一个实例方法
    introduce() {
        console.log(`I'm ${this.name}, ${this.age} years old`);
    }
}

// 创建实例
const person = new Person('Alice', 25);
person.greet();      // 'Hello, I'm Alice'
person.introduce(); // 'I'm Alice, 25 years old'
```

### 类表达式

```javascript
// 匿名类
const Person = class {
    constructor(name) {
        this.name = name;
    }

    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

// 命名类
const Person2 = class Person2 {
    constructor(name) {
        this.name = name;
    }
};

console.log(Person.name);    // 'Person'
console.log(Person2.name);   // 'Person2'
```

## 类的成员

### 实例属性

```javascript
class Person {
    constructor(name) {
        // 实例属性在构造函数中定义
        this.name = name;
        this.age = 25;
    }

    getAge() {
        return this.age;
    }
}

const person = new Person('Alice');
console.log(person.name);    // 'Alice'
console.log(person.getAge()); // 25

// 每个实例有独立的属性
const person2 = new Person('Bob');
person2.age = 30;
console.log(person.age);   // 25
console.log(person2.age);  // 30
```

### 原型方法

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }

    // 原型方法（所有实例共享）
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
}

const person1 = new Person('Alice');
const person2 = new Person('Bob');

// 方法共享
console.log(person1.greet === person2.greet);  // true
console.log(Person.prototype.greet);            // [Function: greet]
```

### 静态方法

```javascript
class Person {
    constructor(name) {
        this.name = name;
    }

    // 实例方法
    greet() {
        console.log(`Hello, ${this.name}`);
    }

    // 静态方法（使用 static 关键字）
    static createGuest() {
        return new Person('Guest');
    }

    static compare(person1, person2) {
        return person1.name.localeCompare(person2.name);
    }
}

// 调用静态方法
const guest = Person.createGuest();
console.log(guest.name);  // 'Guest'

const alice = new Person('Alice');
const bob = new Person('Bob');
console.log(Person.compare(alice, bob));  // -1（'Alice' < 'Bob'）

// 实例无法调用静态方法
// person.createGuest();  // TypeError
```

### 静态属性

```javascript
class Person {
    // 静态属性（ES2022）
    static count = 0;

    constructor(name) {
        this.name = name;
        Person.count++;  // 访问静态属性
    }

    static getCount() {
        return Person.count;
    }
}

const person1 = new Person('Alice');
const person2 = new Person('Bob');
console.log(Person.getCount());  // 2

// 实例无法访问静态属性
// console.log(person1.count);  // undefined
```

## Getter 和 Setter

### 基本语法

```javascript
class Person {
    constructor(name) {
        this._name = name;  // 使用 _ 约定表示私有属性
    }

    // Getter
    get name() {
        return this._name.toUpperCase();
    }

    // Setter
    set name(value) {
        if (value.length < 3) {
            console.log('名字太短');
            return;
        }
        this._name = value;
    }
}

const person = new Person('alice');
console.log(person.name);  // 'ALICE'

person.name = 'Bob';
console.log(person.name);  // 'BOB'

person.name = 'X';  // '名字太短'
console.log(person.name);  // 'BOB'（未修改）
```

### 计算属性

```javascript
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    // 计算属性：只读
    get area() {
        return this.width * this.height;
    }

    get perimeter() {
        return 2 * (this.width + this.height);
    }
}

const rect = new Rectangle(5, 3);
console.log(rect.area);       // 15
console.log(rect.perimeter);  // 16

// area 不能赋值
// rect.area = 100;  // 严格模式下报错
```

## 继承

### extends 关键字

```javascript
// 父类
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a sound`);
    }
}

// 子类
class Dog extends Animal {
    constructor(name, breed) {
        super(name);  // 调用父构造函数
        this.breed = breed;
    }

    // 重写父方法
    speak() {
        console.log(`${this.name} barks`);
    }

    // 新增方法
    fetch() {
        console.log(`${this.name} fetches the ball`);
    }
}

const dog = new Dog('Max', 'Golden Retriever');
dog.speak();  // 'Max barks'
dog.fetch();  // 'Max fetches the ball'

// instanceof 检查
console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true
```

### super 关键字

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log('Animal sound');
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);  // 调用父构造函数
        this.breed = breed;
    }

    // 调用父方法
    speak() {
        super.speak();  // 'Animal sound'
        console.log('Woof!');
    }

    // 访问父类静态方法
    static info() {
        super.info();  // 调用父静态方法
        console.log('Dog info');
    }
}

Dog.info = function() {
    console.log('Animal class');
};

Dog.info();  // 'Animal class'
             // 'Dog info'
```

## 类的特殊方法

### Symbol 方法

```javascript
class MyClass {
    constructor(value) {
        this.value = value;
    }

    // Symbol.iterator：使对象可迭代
    *[Symbol.iterator]() {
        yield this.value;
        yield this.value * 2;
        yield this.value * 3;
    }

    // Symbol.toStringTag：自定义 Object.prototype.toString()
    get [Symbol.toStringTag]() {
        return 'MyClass';
    }
}

const obj = new MyClass(5);

// 使用迭代器
for (const value of obj) {
    console.log(value);  // 5, 10, 15
}

// 自定义 toString
console.log(Object.prototype.toString.call(obj));  // '[object MyClass]'
console.log(obj.toString());                      // '[object MyClass]'
```

## 私有属性

### 约定私有属性（_ 前缀）

```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this._age = age;  // _ 约定表示私有
    }

    get age() {
        return this._age;
    }

    set age(value) {
        if (value < 0) {
            console.log('年龄不能为负数');
            return;
        }
        this._age = value;
    }
}

const person = new Person('Alice', 25);
console.log(person.age);  // 25
person.age = -5;  // '年龄不能为负数'
console.log(person._age);  // 25（仍然可以访问）
```

### 私有字段（# 前缀，ES2022）

```javascript
class Person {
    // 私有字段（必须在类体中声明）
    #age;
    #salary;

    constructor(name, age, salary) {
        this.name = name;
        this.#age = age;
        this.#salary = salary;
    }

    getAge() {
        return this.#age;
    }

    setAge(value) {
        if (value < 0) {
            console.log('年龄不能为负数');
            return;
        }
        this.#age = value;
    }

    getSalary() {
        return this.#salary;
    }
}

const person = new Person('Alice', 25, 50000);
console.log(person.getAge());  // 25
// console.log(person.#age);  // SyntaxError（外部无法访问）
// console.log(person.#salary);  // SyntaxError
```

## 类的最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用 class 定义对象
class Person {
    constructor(name) {
        this.name = name;
    }

    greet() {
        console.log(`Hello, ${this.name}`);
    }
}

// 2. 使用继承重用代码
class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
}

// 3. 使用私有字段保护数据
class BankAccount {
    #balance;

    constructor(initialBalance) {
        this.#balance = initialBalance;
    }

    deposit(amount) {
        this.#balance += amount;
    }

    getBalance() {
        return this.#balance;
    }
}

// 4. 使用 getter/setter 控制访问
class Temperature {
    #celsius;

    constructor(celsius) {
        this.#celsius = celsius;
    }

    get celsius() {
        return this.#celsius;
    }

    set celsius(value) {
        this.#celsius = value;
    }

    get fahrenheit() {
        return this.#celsius * 9 / 5 + 32;
    }

    set fahrenheit(value) {
        this.#celsius = (value - 32) * 5 / 9;
    }
}

// ❌ 不推荐做法

// 1. 过度使用继承（考虑组合）
// 2. 过深的继承层次
// 3. 忘记使用 super
// 4. 在类外部添加方法
// Person.prototype.newMethod = function() {};
```

::: tip 面向对象原则

- **单一职责原则**：类只做一件事
- **开闭原则**：对扩展开放，对修改关闭
- **里氏替换原则**：子类可以替换父类
- **接口隔离原则**：不应依赖不需要的接口
- **依赖倒置原则**：依赖抽象而非具体

:::

::: tip 类检查清单

- [ ] 使用 class 关键字定义类
- [ ] 使用 extends 实现继承
- [ ] 子类构造函数必须调用 super
- [ ] 使用私有字段 (#) 保护数据
- [ ] 使用 getter/setter 控制访问
- [ ] 遵循面向对象设计原则

:::
