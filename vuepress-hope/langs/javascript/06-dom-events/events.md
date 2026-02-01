---
title: 事件处理
icon: ri:flashlight-line
order: 3
---

# 事件处理

事件是 JavaScript 与用户交互的核心，理解事件机制对开发交互式网页至关重要。

## 事件基础

### 什么是事件

```javascript
// 事件：文档或浏览器窗口中发生的特定交互瞬间

// 常见事件类型：
// 鼠标事件：click、dblclick、mousedown、mouseup、mousemove、mouseover、mouseout、mouseenter、mouseleave
// 键盘事件：keydown、keyup、keypress
// 表单事件：submit、input、change、focus、blur
// 文档事件：DOMContentLoaded、load、unload、beforeunload
// 窗口事件：resize、scroll
// 触摸事件：touchstart、touchmove、touchend
// 拖拽事件：dragstart、drag、dragend、drop

// 示例：点击事件
const button = document.querySelector('button');

button.addEventListener('click', () => {
    console.log('Button clicked!');
});
```

### 事件监听器

```javascript
// addEventListener：添加事件监听器
const button = document.querySelector('button');

// 语法：element.addEventListener(event, handler, options)
button.addEventListener('click', (event) => {
    console.log('Clicked!', event);
});

// 命名函数
function handleClick(event) {
    console.log('Clicked!', event);
}

button.addEventListener('click', handleClick);

// 选项参数
button.addEventListener('click', handleClick, {
    capture: false,    // 捕获阶段（默认 false）
    once: true,       // 只触发一次
    passive: true     // 被动监听器（不会阻止默认行为）
});

// 移除事件监听器
button.removeEventListener('click', handleClick);

// ⚠️ 匿名函数无法移除
button.addEventListener('click', () => {
    console.log('Anonymous');
});
// button.removeEventListener('click', () => {});  // 无效（不同的函数引用）
```

### 事件对象

```javascript
// Event 对象：包含事件相关的信息
button.addEventListener('click', (event) => {
    console.log(event.type);        // 'click'
    console.log(event.target);      // 触发事件的元素
    console.log(event.currentTarget); // 绑定事件的元素
    console.log(event.bubbles);     // 是否冒泡
    console.log(event.cancelable);  // 是否可取消
});

// 阻止事件冒泡
button.addEventListener('click', (event) => {
    event.stopPropagation();
});

// 阻止默认行为
const link = document.querySelector('a');
link.addEventListener('click', (event) => {
    event.preventDefault();  // 阻止跳转
});

// 同时阻止冒泡和默认行为
link.addEventListener('click', (event) => {
    event.stopImmediatePropagation();  // 阻止其他监听器
    event.preventDefault();
    event.stopPropagation();
});
```

## 鼠标事件

### 基本鼠标事件

```javascript
const box = document.querySelector('.box');

// click：单击
box.addEventListener('click', (e) => {
    console.log('Click');
    console.log('Client:', e.clientX, e.clientY);      // 相对视口
    console.log('Page:', e.pageX, e.pageY);            // 相对页面
    console.log('Offset:', e.offsetX, e.offsetY);      // 相对元素
});

// dblclick：双击
box.addEventListener('dblclick', (e) => {
    console.log('Double Click');
});

// mousedown：鼠标按下
box.addEventListener('mousedown', (e) => {
    console.log('Mouse Down', e.button);  // 0: 左, 1: 中, 2: 右
});

// mouseup：鼠标抬起
box.addEventListener('mouseup', (e) => {
    console.log('Mouse Up');
});

// mousemove：鼠标移动
box.addEventListener('mousemove', (e) => {
    console.log('Mouse Move', e.offsetX, e.offsetY);
});
```

### 悬停事件

```javascript
const box = document.querySelector('.box');

// mouseover / mouseout：会冒泡
box.addEventListener('mouseover', () => {
    console.log('Mouse Over');
});

box.addEventListener('mouseout', () => {
    console.log('Mouse Out');
});

// mouseenter / mouseleave：不会冒泡
box.addEventListener('mouseenter', () => {
    console.log('Mouse Enter');
});

box.addEventListener('mouseleave', () => {
    console.log('Mouse Leave');
});

// 区别示例
<div class="parent">
    <div class="child">Child</div>
</div>

const parent = document.querySelector('.parent');

// mouseover：进入子元素也会触发
parent.addEventListener('mouseover', () => {
    console.log('Parent Over');
});

// mouseenter：只在外层元素触发
parent.addEventListener('mouseenter', () => {
    console.log('Parent Enter');
});
```

## 键盘事件

### 基本键盘事件

```javascript
// keydown：按键按下
document.addEventListener('keydown', (e) => {
    console.log('Key Down');
    console.log('Key:', e.key);        // 按键名称
    console.log('Code:', e.code);      // 按键位置
    console.log('Which:', e.which);    // 按键代码
    console.log('Ctrl:', e.ctrlKey);
    console.log('Shift:', e.shiftKey);
    console.log('Alt:', e.altKey);
    console.log('Meta:', e.metaKey);
});

// keyup：按键抬起
document.addEventListener('keyup', (e) => {
    console.log('Key Up', e.key);
});

// keypress：按键按下（已废弃，使用 keydown）
// document.addEventListener('keypress', (e) => {});
```

### 特殊按键

```javascript
// 常用按键判断
document.addEventListener('keydown', (e) => {
    // Enter 键
    if (e.key === 'Enter') {
        console.log('Enter pressed');
    }

    // Escape 键
    if (e.key === 'Escape') {
        console.log('Escape pressed');
    }

    // 空格键
    if (e.key === ' ') {
        console.log('Space pressed');
    }

    // 组合键：Ctrl + S
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();  // 阻止保存对话框
        console.log('Ctrl + S');
    }

    // 组合键：Ctrl + C
    if (e.ctrlKey && e.key === 'c') {
        console.log('Ctrl + C');
    }

    // 方向键
    if (e.key === 'ArrowUp') {
        console.log('Arrow Up');
    }
});
```

## 表单事件

### input 和 change

```javascript
const input = document.querySelector('input');

// input：输入时实时触发
input.addEventListener('input', (e) => {
    console.log('Input:', e.target.value);
});

// change：值改变并失去焦点时触发
input.addEventListener('change', (e) => {
    console.log('Changed:', e.target.value);
});

// select：选择文本时触发
input.addEventListener('select', (e) => {
    console.log('Selected:', e.target.value.substring(
        e.target.selectionStart,
        e.target.selectionEnd
    ));
});
```

### focus 和 blur

```javascript
const input = document.querySelector('input');

// focus：获得焦点
input.addEventListener('focus', () => {
    console.log('Focused');
    input.style.backgroundColor = 'yellow';
});

// blur：失去焦点
input.addEventListener('blur', () => {
    console.log('Blurred');
    input.style.backgroundColor = 'white';
});

// focusin / focusout：会冒泡（推荐）
input.addEventListener('focusin', () => {
    console.log('Focus In');
});

input.addEventListener('focusout', () => {
    console.log('Focus Out');
});
```

### submit 事件

```javascript
const form = document.querySelector('form');

// submit：表单提交
form.addEventListener('submit', (e) => {
    e.preventDefault();  // 阻止默认提交行为

    // 获取表单数据
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log('Form Data:', data);

    // 或手动获取
    const inputs = form.querySelectorAll('input, select, textarea');
    const values = {};
    inputs.forEach(input => {
        values[input.name] = input.value;
    });
    console.log('Values:', values);

    // 发送数据
    // fetch('/api/submit', { method: 'POST', body: formData });
});

// 表单验证
form.addEventListener('submit', (e) => {
    const username = form.querySelector('[name="username"]');
    if (username.value.length < 3) {
        e.preventDefault();
        alert('用户名至少 3 个字符');
    }
});
```

## 文档和窗口事件

### 文档加载事件

```javascript
// DOMContentLoaded：DOM 加载完成（不等待图片等资源）
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready');
    // 此时可以安全操作 DOM
});

// load：所有资源加载完成（包括图片、样式等）
window.addEventListener('load', () => {
    console.log('Page fully loaded');
});

// beforeunload：页面卸载前（关闭、刷新等）
window.addEventListener('beforeunload', (e) => {
    e.preventDefault();  // 必须调用
    e.returnValue = '';  // Chrome 需要设置
    // 显示确认对话框
});

// unload：页面卸载时
window.addEventListener('unload', () => {
    console.log('Page unloading');
    // 不要在这里做复杂操作（可能不执行）
});
```

### 窗口事件

```javascript
// resize：窗口大小改变
window.addEventListener('resize', () => {
    console.log('Resized:', window.innerWidth, window.innerHeight);
});

// 使用防抖优化
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        console.log('Resize completed');
    }, 250);
});

// scroll：滚动事件
window.addEventListener('scroll', () => {
    console.log('Scrolled:', window.scrollY, window.scrollX);
});

// 使用节流优化
let scrollTimer;
window.addEventListener('scroll', () => {
    if (!scrollTimer) {
        scrollTimer = setTimeout(() => {
            console.log('Scroll position:', window.scrollY);
            scrollTimer = null;
        }, 100);
    }
});
```

## 事件委托

### 基本概念

```javascript
// 事件委托：利用事件冒泡，在父元素上监听子元素事件

// ❌ 不使用事件委托（每个子元素都绑定监听器）
const items = document.querySelectorAll('.item');
items.forEach(item => {
    item.addEventListener('click', () => {
        console.log('Item clicked');
    });
});

// ✅ 使用事件委托（只在父元素绑定监听器）
const list = document.querySelector('.list');

list.addEventListener('click', (e) => {
    // 检查点击的是否是目标元素
    if (e.target.matches('.item')) {
        console.log('Item clicked:', e.target.textContent);
    }
});
```

### 事件委托的优势

```javascript
const list = document.querySelector('.list');

// 优势 1：减少内存占用
// 只需一个监听器，而不是为每个子元素绑定

// 优势 2：动态元素自动绑定
list.addEventListener('click', (e) => {
    if (e.target.matches('.item')) {
        console.log('Clicked:', e.target.textContent);
    }
});

// 添加新元素（自动具有事件监听）
const newItem = document.createElement('li');
newItem.className = 'item';
newItem.textContent = 'New Item';
list.appendChild(newItem);

// 优势 3：代码更简洁
const container = document.querySelector('.container');

container.addEventListener('click', (e) => {
    // 根据不同元素执行不同操作
    if (e.target.matches('.delete-btn')) {
        e.target.closest('.item').remove();
    } else if (e.target.matches('.edit-btn')) {
        console.log('Edit:', e.target.closest('.item'));
    } else if (e.target.matches('.item')) {
        console.log('Select:', e.target.textContent);
    }
});
```

### closest 方法

```javascript
// closest：查找最近的匹配祖先元素（包括自身）
const container = document.querySelector('.container');

container.addEventListener('click', (e) => {
    // 查找最近的 .item 元素
    const item = e.target.closest('.item');

    if (item) {
        console.log('Clicked item:', item.textContent);
    }
});

// 嵌套结构示例
<div class="container">
    <div class="item">
        <span>Text</span>
        <button>Delete</button>
    </div>
</div>

// 点击 button 或 span 都能找到 .item
container.addEventListener('click', (e) => {
    const item = e.target.closest('.item');
    console.log('Item:', item);
});
```

## 自定义事件

### 创建和触发

```javascript
// CustomEvent：自定义事件
const element = document.querySelector('.element');

// 创建自定义事件
const event = new CustomEvent('myEvent', {
    detail: {
        message: 'Hello',
        data: { id: 1, name: 'Alice' }
    },
    bubbles: true,    // 是否冒泡
    cancelable: true  // 是否可取消
});

// 监听自定义事件
element.addEventListener('myEvent', (e) => {
    console.log('Custom event:', e.detail.message);
    console.log('Data:', e.detail.data);
});

// 触发自定义事件
element.dispatchEvent(event);
```

### 事件总线

```javascript
// 事件总线：全局事件管理
class EventBus {
    constructor() {
        this.events = {};
    }

    // 订阅事件
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    // 取消订阅
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }

    // 触发事件
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

// 使用示例
const bus = new EventBus();

// 订阅事件
bus.on('user:login', (user) => {
    console.log('User logged in:', user.name);
});

bus.on('user:logout', () => {
    console.log('User logged out');
});

// 触发事件
bus.emit('user:login', { id: 1, name: 'Alice' });
bus.emit('user:logout');
```

## 事件处理最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用事件委托减少监听器数量
const list = document.querySelector('.list');
list.addEventListener('click', (e) => {
    const item = e.target.closest('.item');
    if (item) {
        console.log('Clicked:', item.textContent);
    }
});

// 2. 使用命名函数便于移除
function handleClick(e) {
    console.log('Clicked');
}

button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick);

// 3. 使用 passive 优化滚动性能
window.addEventListener('scroll', handleScroll, { passive: true });

// 4. 使用 once 只触发一次
button.addEventListener('click', () => {
    console.log('Only once');
}, { once: true });

// 5. 阻止默认行为前先检查
link.addEventListener('click', (e) => {
    if (shouldPrevent) {
        e.preventDefault();
    }
});

// ❌ 不推荐做法

// 1. 为每个元素绑定监听器
items.forEach(item => {
    item.addEventListener('click', handler);  // 内存浪费
});

// 2. 使用匿名函数无法移除
button.addEventListener('click', () => {
    console.log('Cannot remove');
});

// 3. 忘记移除监听器
button.addEventListener('click', handler);
// 销毁元素前应该移除监听器
button.removeEventListener('click', handler);

// 4. 阻止所有默认行为
document.addEventListener('click', (e) => {
    e.preventDefault();  // 阻止所有点击行为
});
```

::: tip 事件检查清单

- [ ] 理解事件捕获、目标、冒泡三个阶段
- [ ] 使用事件委托减少监听器
- [ ] 使用命名函数便于移除监听器
- [ ] 阻止默认行为前先检查
- [ ] 使用 passive 优化滚动性能
- [ ] 动态元素使用事件委托

:::

::: tip 下一步

学习事件冒泡与捕获 → [事件冒泡与捕获](./event-bubbling-capture.md)
:::
