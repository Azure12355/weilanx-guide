---
title: 状态管理
icon: ri:database-2-line
order: 3
---

# 状态管理

状态管理是现代前端应用的核心，用于管理跨组件的共享状态。

## 为什么需要状态管理

### 组件间共享状态

```javascript
// 问题：组件间共享状态困难
// Prop drilling：Props 逐层传递

// App.js
function App() {
    const user = { name: 'Alice', age: 25 };

    return (
        <div>
            <Header user={user} />
            <Main user={user} />
            <Footer user={user} />
        </div>
    );
}

// Header.js
function Header({ user }) {
    return <h1>Welcome, {user.name}</h1>;
}

// Main.js
function Main({ user }) {
    return (
        <div>
            <Content user={user} />
            <Sidebar user={user} />
        </div>
    );
}

// 越深层的组件需要 Props 传递越麻烦
```

### 状态管理解决方案

```javascript
// 状态管理提供集中式存储
// 所有组件都可以访问和更新状态

// Store
┌─────────────────────────┐
│         State          │
│  user: { name, age }   │
│  items: [...]          │
└─────────────────────────┘
         ↓         ↑
    Components  Updates
```

## Redux

### 基本概念

```javascript
// Redux：可预测的状态容器
// 三大原则：
// 1. 单一数据源
// 2. State 是只读的
// 3. 使用纯函数执行修改

// Action：描述发生了什么
const incrementAction = {
    type: 'INCREMENT'
};

const incrementByAction = (amount) => ({
    type: 'INCREMENT_BY',
    payload: amount
});

// Reducer：纯函数处理 State 更新
const initialState = { count: 0 };

function counterReducer(state = initialState, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + 1 };
        case 'INCREMENT_BY':
            return { count: state.count + action.payload };
        case 'DECREMENT':
            return { count: state.count - 1 };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

// Store：持有应用状态
import { createStore } from 'redux';

const store = createStore(counterReducer);

// 读取 State
console.log(store.getState());  // { count: 0 }

// 更新 State（dispatch action）
store.dispatch({ type: 'INCREMENT' });
console.log(store.getState());  // { count: 1 }

// 订阅 State 变化
store.subscribe(() => {
    console.log('State changed:', store.getState());
});
```

### Redux Toolkit

```javascript
// Redux Toolkit：Redux 官方推荐工具集
import { createSlice, configureStore } from '@reduxjs/toolkit';

// Slice：自动生成 actions 和 reducers
const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 0
    },
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload;
        }
    }
});

// 导出 actions
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 配置 Store
const store = configureStore({
    reducer: {
        counter: counterSlice.reducer
    }
});

// 使用
// dispatch actions
store.dispatch(increment());
store.dispatch(incrementByAmount(5));

// 读取 state
console.log(store.getState().counter.value);  // 6
```

### React Redux

```javascript
// React Redux：React 组件中使用 Redux
import { Provider, useSelector, useDispatch } from 'react-redux';
import { createStore } from 'redux';
import counterReducer from './counterSlice';

const store = createStore(counterReducer);

// 提供 Store
function App() {
    return (
        <Provider store={store}>
            <Counter />
        </Provider>
    );
}

// 读取 State
function Counter() {
    const count = useSelector(state => state.counter.value);
    const dispatch = useDispatch();

    return (
        <div>
            <h2>Count: {count}</h2>
            <button onClick={() => dispatch({ type: 'counter/increment' })}>
                +
            </button>
            <button onClick={() => dispatch({ type: 'counter/decrement' })}>
                -
            </button>
        </div>
    );
}
```

## Zustand

### 基本用法

```javascript
// Zustand：轻量级状态管理库
import { create } from 'zustand';

// 创建 Store
const useStore = create((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 })
}));

// 使用
function Counter() {
    const { count, increment, decrement, reset } = useStore();

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

### Store 切片

```javascript
// 切片：模块化 Store
import { create } from 'zustand';

const useUserStore = create((set) => ({
    user: null,
    login: (user) => set({ user }),
    logout: () => set({ user: null })
}));

const useTodoStore = create((set) => ({
    todos: [],
    addTodo: (todo) => set((state) => ({
        todos: [...state.todos, todo]
    })),
    removeTodo: (id) => set((state) => ({
        todos: state.todos.filter(t => t.id !== id)
    }))
}));

// 使用
function Profile() {
    const user = useUserStore((state) => state.user);
    const login = useUserStore((state) => state.login);

    return (
        <div>
            {user ? (
                <p>Welcome, {user.name}</p>
            ) : (
                <button onClick={() => login({ name: 'Alice' })}>
                    Login
                </button>
            )}
        </div>
    );
}
```

## Pinia

### 基本用法

```javascript
// Pinia：Vue 官方状态管理库
// stores/counter.js
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
    state: () => ({
        count: 0
    }),
    getters: {
        doubleCount: (state) => state.count * 2
    },
    actions: {
        increment() {
            this.count++;
        },
        decrement() {
            this.count--;
        },
        incrementBy(amount) {
            this.count += amount;
        }
    }
});

// 使用
// Counter.vue
<script setup>
import { useCounterStore } from '@/stores/counter';

const counterStore = useCounterStore();
</script>

<template>
    <div>
        <h2>Count: {{ counterStore.count }}</h2>
        <p>Double: {{ counterStore.doubleCount }}</p>
        <button @click="counterStore.increment">+</button>
        <button @click="counterStore.decrement">-</button>
    </div>
</template>
```

### Store 组合

```javascript
// 组合 Store
// stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        token: null
    }),
    actions: {
        setUser(user) {
            this.user = user;
        },
        setToken(token) {
            this.token = token;
        },
        logout() {
            this.user = null;
            this.token = null;
        }
    }
});

// stores/auth.js
import { defineStore } from 'pinia';
import { useUserStore } from './user';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false
    }),
    actions: {
        async login(credentials) {
            const userStore = useUserStore();
            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });
            const data = await response.json();

            userStore.setUser(data.user);
            userStore.setToken(data.token);
            this.isAuthenticated = true;
        },
        logout() {
            const userStore = useUserStore();
            userStore.logout();
            this.isAuthenticated = false;
        }
    }
});
```

## Recoil

### 基本概念

```javascript
// Recoil：Facebook 开发的状态管理库
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';

// Atom：可观察和可修改的状态单元
const countState = atom({
    key: 'count',
    default: 0
});

const userState = atom({
    key: 'user',
    default: {
        name: 'Guest',
        age: 0
    }
});

// Selector：派生状态
const doubleCountState = selector({
    key: 'doubleCount',
    get: ({ get }) => get(countState) * 2
});

// 使用
function Counter() {
    const count = useRecoilValue(countState);
    const setCount = useRecoilState(countState);
    const doubleCount = useRecoilValue(doubleCountState);

    return (
        <div>
            <h2>Count: {count}</h2>
            <p>Double: {doubleCount}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
        </div>
    );
}
```

### 异步处理

```javascript
// 异步状态管理
import { atom, useRecoilState, useRecoilValueLoadable } from 'recoil';

// 异步数据 Atom
const userDataQuery = atom({
    key: 'userData',
    default: selector({
        get: async ({ get }) => {
            const userId = get(userIdState);
            const response = await fetch(`/api/users/${userId}`);
            return response.json();
        }
    })
});

// 使用
function UserProfile() {
    const userId = useRecoilValue(userIdState);
    const [userState, setUserState] = useRecoilState(userDataQuery);

    // 加载状态
    const loadable = useRecoilValueLoadable(userDataQuery);

    switch (loadable.state) {
        case 'hasValue':
            return <div>Welcome, {loadable.contents.name}</div>;
        case 'loading':
            return <div>Loading...</div>;
        case 'hasError':
            return <div>Error: {loadable.contents.message}</div>;
    }
}
```

## 状态管理对比

### 功能对比

```javascript
// Redux
// - 最成熟、生态最丰富
// - 中间件丰富（thunk、saga、observable）
// - 学习曲线较陡
// - 适合大型应用

// Redux Toolkit
// - 简化 Redux 使用
// - 内置最佳实践
// - 较少的模板代码
// - 推荐用于新项目

// Zustand
// - 轻量简洁
// - 无需 Provider
// - TypeScript 友好
// - 适合中小型应用

// Pinia
// - Vue 官方推荐
// - 简洁的 API
// - TypeScript 支持
// - 完善的 DevTools
// - 适合 Vue 项目

// Recoil
// - Facebook 开发
// - 细粒度更新
// - 与 React 紧密集成
// - 实验性质
```

### 选择建议

```javascript
// 选择建议

// 1. 大型 React 应用：Redux Toolkit
// - 生态系统成熟
// - 丰富的中间件
// - 团队经验丰富

// 2. 中小型 React 应用：Zustand
// - 简单易用
// - 性能优秀
// - 学习成本低

// 3. Vue 应用：Pinia
// - 官方推荐
// - 完善的支持
// - 与 Vue 紧密集成

// 4. 实验性项目：Recoil
// - 创新的概念
// - 细粒度控制
// - 未来趋势
```

## 状态管理最佳实践

```javascript
// ✅ 推荐做法

// 1. 根据项目规模选择状态管理
// 小项目：Context API / useState
// 中项目：Zustand / Pinia
// 大项目：Redux Toolkit

// 2. 模块化 Store
// 按功能模块划分状态

// 3. 保持状态扁平化
// 避免深层嵌套

// 4. 使用 Selector 派生状态
const doubleCount = selector({
    key: 'doubleCount',
    get: ({ get }) => get(countState) * 2
});

// 5. 异步操作使用中间件
// Redux Thunk / Redux Saga

// 6. 利用 DevTools 调试
// Redux DevTools / Pinia DevTools

// ❌ 不推荐做法

// 1. 状态管理过度设计
// 简单应用不需要复杂的状态管理

// 2. 混用多个状态管理库
// Redux 和 MobX 一起用

// 3. 直接修改 State
// state.count = 1;  // 错误

// 4. 在组件中直接修改 Store
// 应该通过 actions/mutations

// 5. 忽略 TypeScript 支持
// 应该使用类型化的状态管理
```

::: tip 状态管理检查清单

- [ ] 根据项目规模选择方案
- [ ] 模块化 Store
- [ ] 保持状态扁平化
- [ ] 使用 Selector 派生状态
- [ ] 利用 DevTools 调试
- [ ] 规范化异步操作

:::

::: tip 下一步

学习路由 → [路由](./routing.md)
:::
