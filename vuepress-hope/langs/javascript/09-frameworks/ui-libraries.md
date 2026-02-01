---
title: UI 组件库
icon: ri:layout-grid-line
order: 6
---

# UI 组件库

UI 组件库提供了预制的界面组件，加速开发并保证设计一致性。

## Material UI (MUI)

### 基本使用

```bash
# 安装
npm install @mui/material @emotion/react @emotion/styled
```

```jsx
// 基本组件
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function App() {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    Material UI
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    React 组件库实现 Google Material Design
                </Typography>
                <Button variant="contained" color="primary">
                    Click Me
                </Button>
            </CardContent>
        </Card>
    );
}
```

### 主题定制

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

// 创建主题
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
    },
});

// 应用主题
function App() {
    return (
        <ThemeProvider theme={theme}>
            <YourComponent />
        </ThemeProvider>
    );
}
```

### 常用组件

```jsx
import {
    Button,
    TextField,
    Select,
    MenuItem,
    Checkbox,
    Radio,
    Switch,
    Slider,
    Dialog,
    Snackbar,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

function Form() {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [checked, setChecked] = useState(false);

    return (
        <Paper sx={{ p: 2 }}>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
            />

            <Select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                fullWidth
                displayEmpty
            >
                <MenuItem value="">Select Age</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>

            <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
            />

            <Button variant="contained" fullWidth>
                Submit
            </Button>
        </Paper>
    );
}
```

## Ant Design

### 基本使用

```bash
# 安装
npm install antd
```

```jsx
import { Button, Card, Typography, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function App() {
    return (
        <Card title="Ant Design">
            <Space direction="vertical">
                <Typography.Title level={4}>
                    企业级 UI 设计语言
                </Typography.Title>
                <Typography.Text>
                    React UI 组件库
                </Typography.Text>
                <Button type="primary" icon={<UserOutlined />}>
                    Click Me
                </Button>
            </Space>
        </Card>
    );
}
```

### 布局组件

```jsx
import { Layout, Menu, Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

function AppLayout() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal">
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        Home
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}>
                        User
                    </Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 24, minHeight: 380, background: '#fff' }}>
                    Content
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©2023
            </Footer>
        </Layout>
    );
}
```

### 表单组件

```jsx
import { Form, Input, Button, Select, Checkbox, DatePicker } from 'antd';

const { Option } = Select;

function MyForm() {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Form values:', values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input username!' }]}
            >
                <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Please input email!' },
                    { type: 'email', message: 'Invalid email!' }
                ]}
            >
                <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true }]}
            >
                <Select placeholder="Select gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="remember"
                valuePropName="checked"
            >
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
}
```

## Element Plus

### 基本使用

```bash
# 安装
npm install element-plus
```

```javascript
// main.js
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';

const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');
```

```vue
<template>
  <el-card>
    <template #header>
      <div>Element Plus</div>
    </template>
    <el-button type="primary">Primary Button</el-button>
    <el-button type="success">Success Button</el-button>
    <el-button type="warning">Warning Button</el-button>
  </el-card>
</template>
```

### 常用组件

```vue
<template>
  <div>
    <!-- 表单 -->
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="Username" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input v-model="form.password" type="password" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">
          Submit
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="tableData">
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="address" label="Address" />
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const form = reactive({
  username: '',
  password: ''
});

const rules = {
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' }
  ]
};

const tableData = ref([
  { date: '2023-01-01', name: 'Tom', address: 'No. 1' },
  { date: '2023-01-02', name: 'Jerry', address: 'No. 2' }
]);
</script>
```

## Chakra UI

### 基本使用

```bash
# 安装
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

```jsx
// 设置 Provider
import { ChakraProvider } from '@chakra-ui/react';

function App() {
    return (
        <ChakraProvider>
            <YourComponent />
        </ChakraProvider>
    );
}
```

```jsx
import {
    Box,
    Button,
    Text,
    Heading,
    Input,
    Stack,
    Flex
} from '@chakra-ui/react';

function MyComponent() {
    return (
        <Box p={5} maxW="md" borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>
                Chakra UI
            </Heading>
            <Text mb={4}>
                简单、模块化、可访问的 React 组件库
            </Text>
            <Stack spacing={3}>
                <Input placeholder="Basic input" />
                <Button colorScheme="blue">Click Me</Button>
                <Flex>
                    <Button mr={2} colorScheme="teal">
                        Cancel
                    </Button>
                    <Button colorScheme="blue">Confirm</Button>
                </Flex>
            </Stack>
        </Box>
    );
}
```

### 响应式样式

```jsx
import { Box, Text, Grid } from '@chakra-ui/react';

function ResponsiveBox() {
    return (
        <Box
            w={{ base: '100%', md: '50%', lg: '30%' }}
            p={{ base: 2, md: 4, lg: 6 }}
            bg={{ base: 'blue.100', md: 'blue.200' }}
        >
            <Text fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}>
                Responsive Text
            </Text>
        </Box>
    );
}
```

## Tailwind CSS

### 基本使用

```bash
# 安装
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```javascript
// tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx,vue}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
```

```css
/* main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```jsx
// 使用
function MyComponent() {
    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="md:flex">
                <div className="md:shrink-0">
                    <img className="h-48 w-full object-cover md:h-full md:w-48" src="/img.jpg" alt="Image" />
                </div>
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                        Case study
                    </div>
                    <h2 className="mt-1 text-xl font-semibold text-gray-900">
                        Using Tailwind CSS
                    </h2>
                    <p className="mt-2 text-gray-500">
                        快速构建自定义用户界面
                    </p>
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
}
```

### 组件抽象

```jsx
// 创建可复用组件
function Button({ variant = 'primary', children, ...props }) {
    const baseStyles = 'px-4 py-2 rounded font-semibold';
    const variants = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        danger: 'bg-red-500 text-white hover:bg-red-600'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]}`}
            {...props}
        >
            {children}
        </button>
    );
}

// 使用
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
```

## 组件库对比

| 特性 | Material UI | Ant Design | Element Plus | Chakra UI | Tailwind |
|------|-------------|------------|-------------|-----------|---------|
| **设计语言** | Material Design | 蚂蚁设计 | Element Design | 可访问性优先 | 原子化 CSS |
| **框架** | React | React | Vue 3 | React | 通用 |
| **包大小** | 较大 | 较大 | 较大 | 中等 | 小 |
| **定制性** | 中等 | 中等 | 中等 | 高 | 很高 |
| **学习曲线** | 中等 | 中等 | 中等 | 低 | 中等 |

## 选择建议

::: tip 组件库选择建议

1. **React + Material Design** → Material UI
2. **React + 企业后台** → Ant Design
3. **Vue 3 + Element** → Element Plus
4. **可访问性 + 原子设计** → Chakra UI
5. **完全定制 + 性能优先** → Tailwind CSS

:::

## 最佳实践

::: tip 组件库使用建议

1. **按需引入** - 减少打包体积
2. **主题定制** - 匹配品牌设计
3. **类型安全** - 使用 TypeScript
4. **性能优化** - 避免不必要的渲染
5. **可访问性** - 遵循 ARIA 规范

:::

```jsx
// ✅ 推荐做法

// 1. 按需引入
import { Button } from '@mui/material';
// 而不是 import * from '@mui/material'

// 2. 统一主题
const theme = createTheme({
    palette: { primary: { main: '#1976d2' } }
});

// 3. 类型安全
interface Props {
    variant: 'primary' | 'secondary';
    onClick: () => void;
}

// 4. 可复用组件
function PrimaryButton({ children, ...props }) {
    return <Button variant="contained" color="primary" {...props}>
        {children}
    </Button>;
}
```

::: v-pre

[Angular](./angular.md) → [状态管理](./state-management.md)

:::
