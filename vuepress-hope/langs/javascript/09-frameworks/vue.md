---
title: Vue.js
icon: logos:vue
order: 2
---

# Vue.js

Vue.js 是一个渐进式 JavaScript 框架，易学易用，性能出色。

## Vue 基础

### 创建应用

```javascript
// Vue 3：创建应用
import { createApp } from 'vue';

const app = createApp({
    data() {
        return {
            message: 'Hello, Vue!'
        };
    },
    methods: {
        greet() {
            console.log(this.message);
        }
    }
});

app.mount('#app');

// 或使用 Composition API
import { createApp, ref } from 'vue';

const app = createApp({
    setup() {
        const message = ref('Hello, Vue!');

        const greet = () => {
            console.log(message.value);
        };

        return {
            message,
            greet
        };
    }
});

app.mount('#app');
```

### 模板语法

```html
<!-- 插值 -->
<div>{{ message }}</div>

<!-- 指令 -->
<div v-bind:id="dynamicId"></div>
<!-- 简写 -->
<div :id="dynamicId"></div>

<!-- 事件监听 -->
<button v-on:click="doSomething">Click</button>
<!-- 简写 -->
<button @click="doSomething">Click</button>

<!-- 双向绑定 -->
<input v-model="message" />

<!-- 条件渲染 -->
<div v-if="isShow">Show me</div>
<div v-else-if="isOther">Other</div>
<div v-else>Default</div>

<!-- 列表渲染 -->
<li v-for="item in items" :key="item.id">
    {{ item.text }}
</li>
```

## 响应式系统

### ref

```javascript
// ref：创建响应式引用
import { ref } from 'vue';

export default {
    setup() {
        // 基本类型
        const count = ref(0);
        const message = ref('Hello');

        // 访问值需要 .value
        console.log(count.value);  // 0
        count.value++;

        return {
            count,
            message
        };
    }
};

// 在模板中使用不需要 .value
// <div>{{ count }}</div>
```

### reactive

```javascript
// reactive：创建响应式对象
import { reactive } from 'vue';

export default {
    setup() {
        // 响应式对象
        const state = reactive({
            count: 0,
            user: {
                name: 'Alice',
                age: 25
            }
        });

        // 直接访问属性
        state.count++;
        state.user.name = 'Bob';

        return {
            state
        };
    }
};

// 在模板中
// <div>{{ state.count }}</div>
// <div>{{ state.user.name }}</div>
```

### computed

```javascript
// computed：计算属性
import { ref, computed } from 'vue';

export default {
    setup() {
        const count = ref(0);

        // 计算属性（只读）
        const doubleCount = computed(() => count.value * 2);

        // 计算属性（可读写）
        const fullName = computed({
            get() {
                return `${firstName.value} ${lastName.value}`;
            },
            set(value) {
                [firstName.value, lastName.value] = value.split(' ');
            }
        });

        return {
            count,
            doubleCount,
            fullName
        };
    }
};
```

### watch

```javascript
// watch：侦听变化
import { ref, watch } from 'vue';

export default {
    setup() {
        const count = ref(0);
        const message = ref('Hello');

        // 侦听单个 source
        watch(count, (newValue, oldValue) => {
            console.log(`count changed from ${oldValue} to ${newValue}`);
        });

        // 侦听多个 sources
        watch([count, message], ([newCount, newMessage]) => {
            console.log('count or message changed');
        });

        // 立即执行侦听器
        watch(
            count,
            (value) => {
                console.log('count:', value);
            },
            { immediate: true }
        );

        // 侦听深层对象
        const state = reactive({
            user: {
                name: 'Alice'
            }
        });

        watch(
            () => state.user,
            (newUser) => {
                console.log('User changed:', newUser.name);
            },
            { deep: true }
        );

        return {
            count,
            message,
            state
        };
    }
};
```

## 组件

### 组件定义

```javascript
// 组件定义（SFC - 单文件组件）
<!-- UserProfile.vue -->
<template>
    <div class="user-profile">
        <img :src="user.avatar" :alt="user.name" />
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Props
const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});

// Emits
const emit = defineEmits(['update', 'delete']);

// 方法
const handleDelete = () => {
    emit('delete', props.user.id);
};
</script>

<style scoped>
.user-profile {
    padding: 16px;
    border: 1px solid #eee;
}
</style>
```

### 组件通信

```javascript
// 父传子：Props
// Parent.vue
<template>
    <Child :message="parentMessage" />
</template>

<script setup>
import Child from './Child.vue';
const parentMessage = ref('Hello from parent');
</script>

// Child.vue
<script setup>
const props = defineProps({
    message: String
});
</script>

// 子传父：Emit
// Child.vue
<script setup>
const emit = defineEmits(['update']);

const handleClick = () => {
    emit('update', 'new value');
};
</script>

<template>
    <button @click="handleClick">Update</button>
</template>

// Parent.vue
<template>
    <Child @update="handleUpdate" />
</template>

<script setup>
const handleUpdate = (value) => {
    console.log('Received:', value);
};
</script>
```

### Provide/Inject

```javascript
// Provide/Inject：跨层级组件通信
// Provider.vue
<script setup>
import { provide, ref, readonly } from 'vue';

const theme = ref('light');

provide('theme', readonly(theme));

const updateTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
};

provide('updateTheme', updateTheme);
</script>

// Consumer.vue（任意深层组件）
<script setup>
const { inject } = require('vue');

const theme = inject('theme');
const updateTheme = inject('updateTheme');
</script>

<template>
    <div :class="theme">
        <button @click="updateTheme">Toggle Theme</button>
    </div>
</template>
```

## 生命周期

### 生命周期钩子

```javascript
// Composition API：生命周期钩子
import {
    onMounted,
    onUpdated,
    onUnmounted,
    onBeforeMount,
    onBeforeUpdate,
    onBeforeUnmount
} from 'vue';

export default {
    setup() {
        // 挂载前
        onBeforeMount(() => {
            console.log('Before mount');
        });

        // 挂载后
        onMounted(() => {
            console.log('Mounted');
            // DOM 操作、数据获取等
            fetch('/api/data')
                .then(response => response.json())
                .then(data => console.log(data));
        });

        // 更新前
        onBeforeUpdate(() => {
            console.log('Before update');
        });

        // 更新后
        onUpdated(() => {
            console.log('Updated');
        });

        // 卸载前
        onBeforeUnmount(() => {
            console.log('Before unmount');
            // 清理工作（取消订阅、定时器等）
        });

        // 卸载后
        onUnmounted(() => {
            console.log('Unmounted');
        });

        return {};
    }
};
```

## 组合式函数

### 自定义 Hooks

```javascript
// 自定义 Hook：复用逻辑
// useCounter.js
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
    const count = ref(initialValue);

    const doubleCount = computed(() => count.value * 2);

    const increment = () => {
        count.value++;
    };

    const decrement = () => {
        count.value--;
    };

    const reset = () => {
        count.value = initialValue;
    };

    return {
        count,
        doubleCount,
        increment,
        decrement,
        reset
    };
}

// 使用
// Counter.vue
<script setup>
import { useCounter } from './useCounter';

const { count, doubleCount, increment, decrement, reset } = useCounter(10);
</script>

<template>
    <div>
        <h2>Count: {{ count }}</h2>
        <p>Double: {{ doubleCount }}</p>
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
        <button @click="reset">Reset</button>
    </div>
</template>
```

### useFetch

```javascript
// useFetch：数据获取 Hook
import { ref, onMounted } from 'vue';

export function useFetch(url) {
    const data = ref(null);
    const error = ref(null);
    const loading = ref(true);

    const fetchData = async () => {
        loading.value = true;
        try {
            const response = await fetch(url);
            data.value = await response.json();
            error.value = null;
        } catch (err) {
            error.value = err;
        } finally {
            loading.value = false;
        }
    };

    onMounted(() => {
        fetchData();
    });

    return {
        data,
        error,
        loading,
        refetch: fetchData
    };
}

// 使用
// UserList.vue
<script setup>
import { useFetch } from './useFetch';

const { data, error, loading } = useFetch('/api/users');
</script>

<template>
    <div>
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Error: {{ error.message }}</div>
        <div v-else>
            <div v-for="user in data" :key="user.id">
                {{ user.name }}
            </div>
        </div>
    </div>
</template>
```

## 路由

### Vue Router

```javascript
// 路由配置
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        component: About
    },
    {
        path: '/user/:id',
        name: 'User',
        component: () => import('../views/User.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;

// 使用路由
// App.vue
<template>
    <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
    </nav>
    <router-view />
</template>
```

### 编程式导航

```javascript
// 编程式导航
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();

        const navigateToHome = () => {
            router.push('/');
        };

        const navigateToUser = (id) => {
            router.push(`/user/${id}`);
        };

        const replaceToAbout = () => {
            router.replace('/about');
        };

        const goBack = () => {
            router.go(-1);
        };

        return {
            navigateToHome,
            navigateToUser,
            replaceToAbout,
            goBack
        };
    }
};
```

## Vue 最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用 Composition API
<script setup>
const count = ref(0);
</script>

// 2. 使用 defineProps / defineEmits
const props = defineProps(['message']);
const emit = defineEmits(['update']);

// 3. 使用 computed 缓存计算
const doubleCount = computed(() => count.value * 2);

// 4. 使用 watch 监听变化
watch(count, (newValue) => {
    console.log('Count:', newValue);
});

// 5. 提取逻辑到 composables
const { data, loading } = useFetch('/api/data');

// 6. 使用 key 优化列表
<li v-for="item in items" :key="item.id">

// ❌ 不推荐做法

// 1. 使用 Options API（新项目）
export default {
    data() {
        return {};
    }
}

// 2. 直接修改 props
props.message = 'new message';

// 3. 忘记 watch 的依赖项
watch(() => state.user.name, (val) => {
    console.log(val);
});  // 缺少配置

// 4. 使用 index 作为 key
<li v-for="(item, index) in items" :key="index">
```

::: tip Vue.js 检查清单

- [ ] 使用 Composition API
- [ ] 理解 ref 和 reactive
- [ ] 使用 computed 缓存计算
- [ ] 使用 watch 监听变化
- [ ] 掌握组件通信方式
- [ ] 理解 Vue Router 基本用法

:::

::: tip 下一步

学习状态管理 → [状态管理](./state-management.md)
:::
