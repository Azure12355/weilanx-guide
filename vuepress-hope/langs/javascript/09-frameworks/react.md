---
title: React
icon: logos:react
order: 1
---

# React

React 是一个用于构建用户界面的 JavaScript 库，由 Facebook 开发。

## React 基础

### JSX 语法

```jsx
// JSX：JavaScript 的扩展语法
// 允许在 JavaScript 中编写类似 HTML 的代码

// 基本语法
const element = <h1>Hello, World!</h1>;

// 表达式插值
const name = 'Alice';
const element = <h1>Hello, {name}!</h1>;

// 属性
const element = <img src="avatar.png" alt="Avatar" />;

// 使用大括号包裹 JavaScript 表达式
const element = (
    <div>
        <h1>Hello, {name}!</h1>
        <p>Today is {new Date().toDateString()}</p>
    </div>
);

// 条件渲染
const isLoggedIn = true;
const element = (
    <div>
        {isLoggedIn ? <Welcome /> : <Login />}
    </div>
);

// 列表渲染
const items = ['Apple', 'Banana', 'Orange'];
const element = (
    <ul>
        {items.map((item, index) => (
            <li key={index}>{item}</li>
        ))}
    </ul>
);
```

### 组件定义

```jsx
// 函数组件（推荐）
function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
}

// 箭头函数组件
const Welcome = (props) => {
    return <h1>Hello, {props.name}</h1>;
};

// 简化写法（直接返回）
const Welcome = ({ name }) => <h1>Hello, {name}</h1>;

// 使用组件
<Welcome name="Alice" />

// 组件命名必须大写开头
// good: Welcome, UserProfile
// bad: welcome, userProfile
```

### Props

```jsx
// Props：组件的输入
function UserCard({ name, age, avatar }) {
    return (
        <div className="user-card">
            <img src={avatar} alt={name} />
            <h3>{name}</h3>
            <p>Age: {age}</p>
        </div>
    );
}

// 使用组件
<UserCard
    name="Alice"
    age={25}
    avatar="avatar.png"
/>

// Props 默认值
function Greeting({ name = 'Guest' }) {
    return <h1>Hello, {name}!</h1>;
}

// Props 验证（TypeScript）
interface UserCardProps {
    name: string;
    age: number;
    avatar?: string;  // 可选
}

function UserCard({ name, age, avatar }: UserCardProps) {
    return (
        <div className="user-card">
            <h3>{name}</h3>
            <p>Age: {age}</p>
            {avatar && <img src={avatar} alt={name} />}
        </div>
    );
}
```

## State

### useState

```jsx
// useState：组件状态管理
import { useState } from 'react';

function Counter() {
    // 解构赋值：[当前值, 更新函数]
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        setCount(count - 1);
    };

    const reset = () => {
        setCount(0);
    };

    return (
        <div>
            <h2>Count: {count}</h2>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}
```

### State 更新

```jsx
// State 更新规则

// 1. State 更新是异步的
function Counter() {
    const [count, setCount] = useState(0);

    const handleIncrement = () => {
        // ❌ 错误：连续多次更新只会生效一次
        setCount(count + 1);
        setCount(count + 1);
        // 结果：count = 1（不是 2）

        // ✅ 正确：使用函数式更新
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
        // 结果：count = 2
    };

    return <button onClick={handleIncrement}>Increment</button>;
}

// 2. State 更新会触发重新渲染
// 3. 不要直接修改 State
function TodoList() {
    const [todos, setTodos] = useState([
        { id: 1, text: 'Learn React' }
    ]);

    const addTodo = (text) => {
        // ❌ 错误：直接修改
        // todos.push({ id: Date.now(), text });

        // ✅ 正确：创建新数组
        setTodos([...todos, { id: Date.now(), text }]);
    };

    return (
        <div>
            {todos.map(todo => (
                <div key={todo.id}>{todo.text}</div>
            ))}
        </div>
    );
}
```

## useEffect

### 基本用法

```jsx
// useEffect：处理副作用（数据获取、订阅、DOM 操作等）
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 组件挂载后执行
    useEffect(() => {
        // 获取用户数据
        fetch(`/api/users/${userId}`)
            .then(response => response.json())
            .then(data => {
                setUser(data);
                setLoading(false);
            });

        // 返回清理函数（组件卸载时执行）
        return () => {
            console.log('Cleanup');
        };
    }, [userId]);  // 依赖项：userId 变化时重新执行

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
}
```

### 依赖数组

```jsx
// 依赖数组：控制 useEffect 执行时机

function Chat({ roomId }) {
    const [messages, setMessages] = useState([]);

    // 每次 render 都执行（依赖为空数组除外）
    useEffect(() => {
        console.log('Render');
    });

    // 只执行一次（挂载时）
    useEffect(() => {
        console.log('Mount');
    }, []);

    // roomId 变化时执行
    useEffect(() => {
        // 连接到聊天室
        const connection = connectToChatRoom(roomId);

        // 清理函数
        return () => {
            connection.disconnect();
        };
    }, [roomId]);

    return <div>{/* ... */}</div>;
}
```

## Hooks

### 自定义 Hooks

```jsx
// 自定义 Hook：复用状态逻辑
function useCounter(initialValue = 0) {
    const [count, setCount] = useState(initialValue);

    const increment = () => setCount(prev => prev + 1);
    const decrement = () => setCount(prev => prev - 1);
    const reset = () => setCount(initialValue);

    return { count, increment, decrement, reset };
}

// 使用
function Counter() {
    const { count, increment, decrement, reset } = useCounter(10);

    return (
        <div>
            <h2>Count: {count}</h2>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}
```

### useContext

```jsx
// useContext：跨组件共享状态
import { createContext, useContext, useState } from 'react';

// 创建 Context
const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 使用 Context
function ThemeButton() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            style={{ background: theme === 'light' ? '#fff' : '#333' }}
        >
            Current theme: {theme}
        </button>
    );
}
```

### useReducer

```jsx
// useReducer：复杂状态管理
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { count: state.count + 1 };
        case 'decrement':
            return { count: state.count - 1 };
        case 'reset':
            return initialState;
        default:
            throw new Error(`Unknown action: ${action.type}`);
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <div>
            <h2>Count: {state.count}</h2>
            <button onClick={() => dispatch({ type: 'increment' })}>
                +
            </button>
            <button onClick={() => dispatch({ type: 'decrement' })}>
                -
            </button>
            <button onClick={() => dispatch({ type: 'reset' })}>
                Reset
            </button>
        </div>
    );
}
```

## 事件处理

### 事件绑定

```jsx
// React 事件处理
function Button() {
    const handleClick = (event) => {
        event.preventDefault();  // 阻止默认行为
        console.log('Button clicked!');
        console.log('Event type:', event.type);
        console.log('Target:', event.target);
    };

    return <button onClick={handleClick}>Click me</button>;
}

// 传参
function TodoList({ todos, onRemove }) {
    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.id}>
                    {todo.text}
                    <button onClick={() => onRemove(todo.id)}>
                        Remove
                    </button>
                </li>
            ))}
        </ul>
    );
}
```

### 表单处理

```jsx
// 受控组件
function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Login:', { username, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
}
```

## 列表渲染

### 基本列表

```jsx
// 列表渲染
function List() {
    const items = ['Apple', 'Banana', 'Orange'];

    return (
        <ul>
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    );
}

// 使用唯一 ID 作为 key
function TodoList({ todos }) {
    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.id}>
                    {todo.text}
                </li>
            ))}
        </ul>
    );
}
```

### 条件渲染

```jsx
// 条件渲染
function Welcome({ isLoggedIn }) {
    // 三元运算符
    return (
        <div>
            {isLoggedIn ? <WelcomeUser /> : <Login />}
        </div>
    );
}

// 逻辑与运算符
function Button({ text, show }) {
    return (
        <div>
            {show && <button>{text}</button>}
        </div>
    );
}

// 立即执行函数
function Warning({ message }) {
    return (
        <div>
            {message && (
                <div className="warning">
                    Warning: {message}
                </div>
            )}
        </div>
    );
}
```

## React 最佳实践

```jsx
// ✅ 推荐做法

// 1. 使用函数组件
function Component() {
    return <div>Hello</div>;
}

// 2. 使用 Hooks
const [state, setState] = useState();

// 3. 提取组件为独立文件
// Component.jsx
export function Component() {}

// 4. 使用 PropTypes 或 TypeScript 验证 Props
interface Props {
    name: string;
    age: number;
}

// 5. 使用 key 优化列表
items.map(item => <Item key={item.id} item={item} />)

// 6. 使用 useCallback/memo 优化性能
const memoizedCallback = useCallback(() => {}, [deps]);

// ❌ 不推荐做法

// 1. 使用 class 组件（除非必要）
class Component extends React.Component {}

// 2. 直接修改 State
state.count = 1;

// 3. 忘记依赖项
useEffect(() => {
    // 缺少依赖项
}, []);  // 应该包含所有使用的变量

// 4. 使用索引作为 key（如果列表会变化）
items.map((item, index) => <Item key={index} />)

// 5. 嵌套过深
<Container>
    <Wrapper>
        <Card>
            <Content>
                <Item />
            </Content>
        </Card>
    </Wrapper>
</Container>
```

::: tip React 检查清单

- [ ] 使用函数组件和 Hooks
- [ ] 理解 Props 和 State
- [ ] 使用 useEffect 处理副作用
- [ ] 正确处理事件
- [ ] 使用 key 优化列表
- [ ] 使用自定义 Hooks 复用逻辑

:::

::: tip 下一步

学习 Vue.js → [Vue.js](./vue.md)
:::
