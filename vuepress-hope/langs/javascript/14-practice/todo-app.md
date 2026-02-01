---
title: 待办事项应用
icon: ri:todo-line
order: 1
---

# 待办事项应用

通过构建一个完整的待办事项应用，综合运用 JavaScript 知识。

## 项目概述

### 功能需求

```javascript
// 待办事项应用功能列表

// 核心功能
// 1. 添加待办
//    - 输入框输入待办内容
//    - 点击按钮或回车添加
//    - 自动清空输入框

// 2. 显示待办列表
//    - 显示所有待办事项
//    - 区分已完成和未完成
//    - 显示待办数量

// 3. 标记完成
//    - 点击复选框标记完成
//    - 已完成待办样式变化
//    - 统计未完成数量

// 4. 删除待办
//    - 删除按钮或图标
//    - 确认删除（可选）
//    - 删除动画效果

// 5. 编辑待办
//    - 双击进入编辑模式
//    - 保存修改
//    - 取消编辑

// 高级功能
// 6. 筛选待办
//    - 全部/已完成/未完成
//    - 动态筛选列表

// 7. 数据持久化
//    - LocalStorage 存储
//    - 页面刷新保留数据

// 8. 键盘快捷键
//    - 回车添加待办
//    - ESC 取消编辑
```

### 项目结构

```javascript
// 项目结构

todo-app/
├── index.html          # 主 HTML 文件
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── app.js          # 主应用逻辑
│   ├── todo.js         # Todo 类
│   └── storage.js      # 存储管理
└── README.md           # 项目说明

// 技术栈
// - 原生 JavaScript（ES6+）
// - DOM 操作
// - LocalStorage
// - CSS3
```

## 项目实现

### HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>待办事项应用</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>📝 我的待办事项</h1>
            <p class="stats">剩余 <span id="count">0</span> 项</p>
        </header>

        <div class="input-section">
            <input
                type="text"
                id="todo-input"
                placeholder="添加新的待办事项..."
                autocomplete="off"
            >
            <button id="add-btn">添加</button>
        </div>

        <div class="filter-section">
            <button class="filter-btn active" data-filter="all">全部</button>
            <button class="filter-btn" data-filter="active">进行中</button>
            <button class="filter-btn" data-filter="completed">已完成</button>
        </div>

        <ul id="todo-list" class="todo-list">
            <!-- 待办事项将在这里动态生成 -->
        </ul>

        <div class="clear-section" id="clear-section" style="display: none;">
            <button id="clear-btn">清除已完成</button>
        </div>
    </div>

    <script src="js/storage.js"></script>
    <script src="js/todo.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

### CSS 样式

```css
/* css/style.css */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

header {
    text-align: center;
    margin-bottom: 30px;
}

header h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 10px;
}

.stats {
    color: #666;
    font-size: 1.1rem;
}

#count {
    font-weight: bold;
    color: #667eea;
}

/* 输入区域 */
.input-section {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
}

#todo-input {
    flex: 1;
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

#todo-input:focus {
    outline: none;
    border-color: #667eea;
}

#add-btn {
    padding: 15px 30px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
}

#add-btn:hover {
    background: #5568d3;
}

/* 筛选区域 */
.filter-section {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: center;
}

.filter-btn {
    padding: 8px 16px;
    background: #f5f5f5;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
}

.filter-btn:hover {
    background: #e0e0e0;
}

.filter-btn.active {
    background: #667eea;
    color: white;
}

/* 待办列表 */
.todo-list {
    list-style: none;
}

.todo-item {
    display: flex;
    align-items: center;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 10px;
    transition: all 0.3s;
}

.todo-item:hover {
    background: #f0f0f0;
}

.todo-item.completed {
    opacity: 0.6;
}

.todo-item.completed .todo-text {
    text-decoration: line-through;
    color: #999;
}

.todo-checkbox {
    width: 24px;
    height: 24px;
    margin-right: 15px;
    cursor: pointer;
}

.todo-text {
    flex: 1;
    font-size: 1.1rem;
    cursor: pointer;
}

.todo-actions {
    display: flex;
    gap: 10px;
}

.btn-action {
    padding: 5px 10px;
    background: #e0e0e0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-action:hover {
    background: #d0d0d0;
}

.btn-delete {
    color: #e74c3c;
}

.btn-edit {
    color: #3498db;
}

/* 清除区域 */
.clear-section {
    margin-top: 30px;
    text-align: center;
}

#clear-btn {
    padding: 10px 20px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
}

#clear-btn:hover {
    background: #c0392b;
}

/* 编辑模式 */
.edit-input {
    flex: 1;
    padding: 10px;
    border: 2px solid #667eea;
    border-radius: 4px;
    font-size: 1.1rem;
}

/* 动画 */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.todo-item {
    animation: slideIn 0.3s ease;
}

@keyframes fadeOut {
    to {
        opacity: 0;
        transform: translateX(20px);
    }
}

.todo-item.removing {
    animation: fadeOut 0.3s ease forwards;
}
```

### Todo 类

```javascript
// js/todo.js

class Todo {
    constructor(id, text, completed = false) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.createdAt = new Date();
    }

    toggle() {
        this.completed = !this.completed;
    }

    setText(text) {
        this.text = text;
    }

    isCompleted() {
        return this.completed;
    }
}

export default Todo;
```

### 存储管理

```javascript
// js/storage.js

class Storage {
    constructor() {
        this.STORAGE_KEY = 'todos';
    }

    getTodos() {
        const todos = localStorage.getItem(this.STORAGE_KEY);
        return todos ? JSON.parse(todos) : [];
    }

    saveTodos(todos) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    }

    addTodo(todo) {
        const todos = this.getTodos();
        todos.push(todo);
        this.saveTodos(todos);
    }

    deleteTodo(id) {
        const todos = this.getTodos().filter(todo => todo.id !== id);
        this.saveTodos(todos);
    }

    updateTodo(updatedTodo) {
        const todos = this.getTodos();
        const index = todos.findIndex(todo => todo.id === updatedTodo.id);
        if (index !== -1) {
            todos[index] = updatedTodo;
            this.saveTodos(todos);
        }
    }

    clearCompleted() {
        const todos = this.getTodos().filter(todo => !todo.completed);
        this.saveTodos(todos);
    }
}

export default Storage;
```

### 应用逻辑

```javascript
// js/app.js

import Todo from './todo.js';
import Storage from './storage.js';

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.storage = new Storage();

        // DOM 元素
        this.input = document.getElementById('todo-input');
        this.addBtn = document.getElementById('add-btn');
        this.list = document.getElementById('todo-list');
        this.countSpan = document.getElementById('count');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearSection = document.getElementById('clear-section');
        this.clearBtn = document.getElementById('clear-btn');

        this.init();
    }

    init() {
        this.loadTodos();
        this.bindEvents();
    }

    loadTodos() {
        const savedTodos = this.storage.getTodos();
        savedTodos.forEach(data => {
            const todo = new Todo(data.id, data.text, data.completed);
            this.todos.push(todo);
        });
        this.render();
    }

    bindEvents() {
        // 添加待办
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // 筛选按钮
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentFilter = btn.dataset.filter;
                this.updateFilterButtons();
                this.render();
            });
        });

        // 待办列表事件
        this.list.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;

            const id = parseInt(todoItem.dataset.id);

            if (e.target.classList.contains('todo-checkbox') ||
                e.target.classList.contains('todo-text')) {
                this.toggleTodo(id);
            }

            if (e.target.classList.contains('btn-delete')) {
                this.deleteTodo(id, todoItem);
            }

            if (e.target.classList.contains('btn-edit')) {
                this.editTodo(id, todoItem);
            }
        });

        // 清除已完成
        this.clearBtn.addEventListener('click', () => {
            this.clearCompleted();
        });
    }

    addTodo() {
        const text = this.input.value.trim();
        if (!text) {
            alert('请输入待办事项');
            return;
        }

        const todo = new Todo(Date.now(), text);
        this.todos.push(todo);
        this.storage.addTodo(todo);

        this.input.value = '';
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.toggle();
            this.storage.updateTodo(todo);
            this.render();
        }
    }

    deleteTodo(id, element) {
        // 添加删除动画
        element.classList.add('removing');

        element.addEventListener('animationend', () => {
            this.todos = this.todos.filter(t => t.id !== id);
            this.storage.deleteTodo(id);
            this.render();
        });
    }

    editTodo(id, element) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        // 创建编辑输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.value = todo.text;
        input.className = 'edit-input';

        // 替换文本
        const textSpan = element.querySelector('.todo-text');
        textSpan.style.display = 'none';
        element.insertBefore(input, textSpan);
        input.focus();

        // 保存编辑
        const saveEdit = () => {
            const newText = input.value.trim();
            if (newText) {
                todo.setText(newText);
                this.storage.updateTodo(todo);
                this.render();
            } else {
                this.render(); // 恢复原状
            }
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    }

    clearCompleted() {
        if (!confirm('确定清除所有已完成的待办事项吗？')) {
            return;
        }

        this.todos = this.todos.filter(t => !t.completed);
        this.storage.clearCompleted();
        this.render();
    }

    updateFilterButtons() {
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
        });
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        this.list.innerHTML = '';

        filteredTodos.forEach(todo => {
            const li = this.createTodoElement(todo);
            this.list.appendChild(li);
        });

        // 更新计数
        const activeCount = this.todos.filter(t => !t.completed).length;
        this.countSpan.textContent = activeCount;

        // 显示/隐藏清除按钮
        const hasCompleted = this.todos.some(t => t.completed);
        this.clearSection.style.display = hasCompleted ? 'block' : 'none';
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="btn-action btn-edit" title="编辑">✏️</button>
                <button class="btn-action btn-delete" title="删除">🗑️</button>
            </div>
        `;

        return li;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
```

## 项目总结

### 技术要点

```javascript
// 技术要点总结

// 1. ES6+ 语法
// - Class 类定义
// - Arrow functions 箭头函数
// - Template literals 模板字符串
// - Destructuring 解构赋值
// - Modules 模块系统

// 2. DOM 操作
// - querySelector/querySelectorAll
// - addEventListener 事件监听
// - createElement/createTextNode
// - appendChild/insertBefore
// - classList 操作类名

// 3. 数据管理
// - Array 方法（map, filter, find, forEach）
// - LocalStorage 存储
// - JSON 序列化

// 4. 事件处理
// - click 点击事件
// - keypress 键盘事件
// - 事件委托
// - 自定义事件

// 5. 样式交互
// - CSS 类切换
// - 动画效果
// - 响应式布局
```

### 扩展功能

```javascript
// 可扩展功能

// 1. 拖拽排序
// - 使用 HTML5 Drag and Drop API
// - 或使用第三方库

// 2. 优先级
// - 添加优先级字段
// - 按优先级排序

// 3. 截止日期
// - 添加日期字段
// - 过期提醒

// 4. 分类标签
// - 添加标签系统
// - 按标签筛选

// 5. 搜索功能
// - 关键词搜索
// - 高亮匹配项

// 6. 数据同步
// - 后端 API
// - 实时同步
```

::: tip 待办事项应用检查清单

- [ ] 完成 HTML 结构
- [ ] 完成 CSS 样式
- [ ] 实现 Todo 类
- [ ] 实现存储管理
// 5. 实现应用逻辑
// 6. 测试应用功能
// 7. 扩展应用功能

:::

::: tip 下一步

学习天气应用 → [天气应用](./weather-app.md)
:::
