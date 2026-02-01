---
title: 路由
icon: ri:route-line
order: 4
---

# 路由

路由是单页应用（SPA）的核心功能，用于管理页面导航和视图切换。

## 路由基础

### 什么是路由

```javascript
// 路由：URL 路径与组件的映射关系

// 传统多页应用
// /home → home.html
// /about → about.html
// /contact → contact.html

// 单页应用（SPA）
// 所有页面都在同一个 HTML 中
// 通过 JavaScript 动态切换内容
// /home → 渲染 <Home /> 组件
// /about → 渲染 <About /> 组件
// /contact → 渲染 <Contact /> 组件

// 路由工作原理
┌─────────────────────────────────┐
│         Browser                 │
│  URL: /users/123                │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│         Router                  │
│  解析路径: /users/:id           │
│  匹配路由: UserDetail          │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│         Component               │
│  渲染: <UserDetail id={123} /> │
└─────────────────────────────────┘
```

### 前端路由 vs 后端路由

```javascript
// 后端路由（服务器端）
// 服务器根据 URL 返回不同的 HTML

// Express.js 路由示例
app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/about.html');
});

// 前端路由（客户端）
// 浏览器根据 URL 渲染不同的组件
// 不需要重新加载页面

// 前端路由优势
// 1. 快速：无需服务器请求
// 2. 流畅：页面无刷新切换
// 3. 体验：类似原生应用

// 前端路由实现方式
// 1. Hash 模式：/#/home
// 2. History 模式：/home（需要服务器配置）
```

## React Router

### 基础配置

```jsx
// 安装
npm install react-router-dom

// 基础配置
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 精确匹配 */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* 404 页面 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
```

### HashRouter

```jsx
// HashRouter：使用 URL 的 hash 部分
// URL 格式：http://localhost:3000/#/about

import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </HashRouter>
    );
}

// HashRouter vs BrowserRouter
// HashRouter：
// - 不需要服务器配置
// - URL 中有 # 号
// - 兼容性好

// BrowserRouter：
// - 需要服务器配置（刷新时返回 index.html）
// - URL 美观
// - 是推荐选择
```

### 动态路由

```jsx
// 动态路由：路径参数
import { Routes, Route, useParams } from 'react-router-dom';

// 定义路由
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* :id 是动态参数 */}
                <Route path="/users/:id" element={<UserDetail />} />
                <Route path="/posts/:categoryId/:postId" element={<PostDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

// 使用 useParams 获取参数
function UserDetail() {
    const { id } = useParams();
    // URL: /users/123
    // id = '123'

    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`/api/users/${id}`)
            .then(res => res.json())
            .then(data => setUser(data));
    }, [id]);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>{user.name}</h1>
            <p>Email: {user.email}</p>
        </div>
    );
}
```

### 嵌套路由

```jsx
// 嵌套路由：父路由包含子路由
import { Routes, Route, Outlet, Link } from 'react-router-dom';

// 父组件
function Dashboard() {
    return (
        <div>
            <nav>
                <Link to="">Overview</Link>
                <Link to="settings">Settings</Link>
                <Link to="profile">Profile</Link>
            </nav>

            {/* 子路由渲染位置 */}
            <Outlet />
        </div>
    );
}

// 配置嵌套路由
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                {/* 嵌套路由 */}
                <Route path="/dashboard" element={<Dashboard />}>
                    {/* 相对路径：/dashboard */}
                    <Route index element={<Overview />} />

                    {/* 相对路径：/dashboard/settings */}
                    <Route path="settings" element={<Settings />} />

                    {/* 相对路径：/dashboard/profile */}
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
```

### 导航

```jsx
// 声明式导航：Link 组件
import { Link, NavLink } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            {/* Link：基本链接 */}
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>

            {/* NavLink：激活状态样式 */}
            <NavLink
                to="/contact"
                className={({ isActive }) =>
                    isActive ? 'active' : ''
                }
            >
                Contact
            </NavLink>
        </nav>
    );
}

// 编程式导航：useNavigate Hook
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const navigate = useNavigate();

    const handleLogin = async (credentials) => {
        const success = await login(credentials);

        if (success) {
            // 导航到首页
            navigate('/');
        } else {
            // 导航到登录页（替换历史记录）
            navigate('/login', { replace: true });
        }
    };

    const handleBack = () => {
        // 返回上一页
        navigate(-1);
    };

    const handleForward = () => {
        // 前进一页
        navigate(1);
    };

    return (
        <form onSubmit={handleLogin}>
            {/* 表单内容 */}
        </form>
    );
}
```

### 路由守卫

```jsx
// 私有路由：需要认证才能访问
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function PrivateRoute({ isAuthenticated }) {
    const location = useLocation();

    if (!isAuthenticated) {
        // 保存原始路径，登录后返回
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 渲染子路由
    return <Outlet />;
}

// 使用
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* 私有路由 */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute isAuthenticated={isAuthenticated} />
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

// 登录后返回原始页面
function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleLogin = async (credentials) => {
        const success = await login(credentials);
        if (success) {
            navigate(from, { replace: true });
        }
    };

    return <form onSubmit={handleLogin}>{/* ... */}</form>;
}
```

### 查询参数

```jsx
// 查询参数：URL 的 ? 后面的部分
// URL: /search?q=react&page=1

import { useSearchParams, useLocation } from 'react-router-dom';

function SearchPage() {
    // useSearchParams
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q');
    const page = searchParams.get('page');

    // 更新查询参数
    const handleSearch = (newQuery) => {
        setSearchParams({ q: newQuery, page: 1 });
    };

    // useLocation
    const location = useLocation();
    // 需要手动解析查询参数
    const params = new URLSearchParams(location.search);

    return (
        <div>
            <input
                type="text"
                defaultValue={query || ''}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <p>当前页: {page || 1}</p>
        </div>
    );
}
```

## Vue Router

### 基础配置

```javascript
// 安装
npm install vue-router@4

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
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;

// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');

// App.vue
<template>
    <router-view />
</template>
```

### Hash 模式

```javascript
// Hash 模式：使用 URL 的 hash 部分
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// Hash 模式 vs History 模式
// Hash 模式：
// - URL: http://localhost:3000/#/about
// - 不需要服务器配置
// - 兼容性好

// History 模式：
// - URL: http://localhost:3000/about
// - 需要 SPA fallback 配置
// - URL 更美观
```

### 动态路由

```javascript
// 动态路由：路径参数
const routes = [
    {
        // :id 是动态参数
        path: '/users/:id',
        name: 'UserDetail',
        component: () => import('../views/UserDetail.vue')
    },
    {
        // 多个动态参数
        path: '/posts/:categoryId/:postId',
        name: 'PostDetail',
        component: () => import('../views/PostDetail.vue')
    }
];

// 组件中使用参数
<template>
    <div>
        <h1>User: {{ user?.name }}</h1>
        <p>ID: {{ route.params.id }}</p>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';

const route = useRoute();
const userId = route.params.id;
const user = ref(null);

onMounted(async () => {
    const response = await fetch(`/api/users/${userId}`);
    user.value = await response.json();
});
</script>
```

### 嵌套路由

```javascript
// 嵌套路由配置
const routes = [
    {
        path: '/dashboard',
        component: () => import('../views/Dashboard.vue'),
        children: [
            {
                // 默认子路由：/dashboard
                path: '',
                name: 'DashboardOverview',
                component: () => import('../views/dashboard/Overview.vue')
            },
            {
                // 子路由：/dashboard/settings
                path: 'settings',
                name: 'DashboardSettings',
                component: () => import('../views/dashboard/Settings.vue')
            },
            {
                // 子路由：/dashboard/profile
                path: 'profile',
                name: 'DashboardProfile',
                component: () => import('../views/dashboard/Profile.vue')
            }
        ]
    }
];

// Dashboard.vue（父组件）
<template>
    <div>
        <nav>
            <router-link to="">Overview</router-link>
            <router-link to="settings">Settings</router-link>
            <router-link to="profile">Profile</router-link>
        </nav>

        <!-- 子路由渲染位置 -->
        <router-view />
    </div>
</template>
```

### 编程式导航

```javascript
// router.push：导航到新路由
import { useRouter } from 'vue-router';

const router = useRouter();

// 字符串路径
router.push('/home');

// 对象（带参数）
router.push({ path: '/home' });

// 命名路由
router.push({ name: 'User', params: { id: 123 } });

// 带查询参数
router.push({ path: '/user', query: { tab: 'profile' } });
// 结果：/user?tab=profile

// router.replace：替换当前路由
router.replace('/home');

// router.go：前进/后退
router.go(1);   // 前进
router.go(-1);  // 后退
router.go(0);   // 刷新

// 组件中使用
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function handleLogin() {
    // 登录成功后跳转
    router.push('/dashboard');
}

function handleBack() {
    // 返回上一页
    router.go(-1);
}
</script>
```

### 路由守卫

```javascript
// 全局前置守卫
router.beforeEach((to, from, next) => {
    // to: 即将进入的目标路由
    // from: 即将离开的当前路由
    // next: 必须调用该方法来 resolve 这个钩子

    const isAuthenticated = checkAuth();

    if (to.meta.requiresAuth && !isAuthenticated) {
        // 需要认证但未登录
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    } else {
        // 继续导航
        next();
    }
});

// 全局后置钩子
router.afterEach((to, from) => {
    // 修改页面标题
    document.title = to.meta.title || 'My App';
});

// 路由元信息
const routes = [
    {
        path: '/dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true,
            title: 'Dashboard'
        }
    }
];

// 组件内守卫
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';

// 离开守卫
onBeforeRouteLeave((to, from, next) => {
    const answer = window.confirm('确定要离开吗？未保存的更改将丢失！');
    if (answer) {
        next();
    } else {
        next(false);
    }
});

// 更新守卫（当路由改变但组件被复用时调用）
onBeforeRouteUpdate((to, from, next) => {
    // 获取新的用户数据
    fetchData(to.params.id).then(() => {
        next();
    });
});
</script>
```

### 路由懒加载

```javascript
// 路由懒加载：按需加载组件
const routes = [
    {
        path: '/',
        name: 'Home',
        // 懒加载
        component: () => import('../views/Home.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: '/dashboard',
        component: () => import('../views/Dashboard.vue'),
        children: [
            {
                path: '',
                component: () => import('../views/dashboard/Overview.vue')
            },
            {
                path: 'settings',
                component: () => import('../views/dashboard/Settings.vue')
            }
        ]
    }
];

// 分组打包（相同 chunk）
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue');
const Overview = () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/Overview.vue');
const Settings = () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/Settings.vue');
```

## 路由最佳实践

```javascript
// ✅ 推荐做法

// 1. 使用命名路由
// React Router
<Route path="/users/:id" element={<UserDetail />} />

// Vue Router
{
    path: '/users/:id',
    name: 'UserDetail',
    component: UserDetail
}

// 2. 使用路由懒加载
const Home = () => import('./views/Home.vue');

// 3. 使用路由守卫保护页面
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

// 4. 提取路由配置到单独文件
// router/index.js

// 5. 使用路由元信息
{
    path: '/admin',
    meta: {
        requiresAuth: true,
        roles: ['admin'],
        title: 'Admin Panel'
    }
}

// ❌ 不推荐做法

// 1. 硬编码路由路径
<a href="/about">About</a>  // 应该用 Link 或 router-link

// 2. 在组件中直接访问 window.location
// 应该使用路由 API

// 3. 忘记处理 404 页面
// 应该配置通配符路由

// 4. 深层嵌套路由
// 保持路由层级简洁

// 5. 重复定义路由
// 避免路径冲突
```

::: tip 路由检查清单

- [ ] 配置基础路由
- [ ] 实现动态路由
- [ ] 配置嵌套路由
- [ ] 添加路由守卫
- [ ] 使用路由懒加载
- [ ] 处理 404 页面

:::

::: tip 框架与库回顾

恭喜！你已掌握框架与库的核心知识：

- [x] React
- [x] Vue.js
- [x] 状态管理
- [x] 路由

接下来学习 Node.js → [Node.js](../10-nodejs/nodejs-overview.md)
:::
