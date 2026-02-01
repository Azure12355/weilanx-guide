---
title: Vite 构建
icon: ri-flashlight-fill
order: 3
---

# Vite 构建

Vite 是新一代前端构建工具，利用浏览器原生 ES 模块实现极速开发体验。

## 基础配置

### vite.config.js

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    // 插件
    plugins: [vue()],

    // 开发服务器
    server: {
        port: 3000,
        host: true,
        open: true,
        proxy: {
            '/api': 'http://localhost:8080'
        }
    },

    // 构建配置
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',

        // 打包配置
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['vue', 'vue-router'],
                    'utils': ['lodash', 'axios']
                }
            }
        }
    },

    // 解析配置
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    }
});
```

## 插件系统

### Vue 插件

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
    plugins: [
        vue(),
        vueJsx()
    ]
});
```

### React 插件

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react({
            jsxImportSource: '@emotion-jsx', // 或 @emotion/react
            babel: {
                plugins: ['@emotion/babel-plugin']
            }
        })
    ]
});
```

### 自定义插件

```javascript
// my-plugin.js
export function myPlugin() {
    return {
        name: 'my-plugin',

        // 配置钩子
        config(config) {
            console.log('当前配置:', config);
            return config;
        },

        // 转换钩子
        transform(code, id) {
            if (id.endsWith('.special')) {
                return code.replace(/foo/g, 'bar');
            }
        },

        // 热更新钩子
        handleHotUpdate({ file, modules }) {
            console.log('热更新:', file);
            return modules;
        }
    };
}

// 使用
import { defineConfig } from 'vite';
import { myPlugin } from './my-plugin.js';

export default defineConfig({
    plugins: [myPlugin()]
});
```

## 开发服务器

### 基础配置

```javascript
export default defineConfig({
    server: {
        // 端口
        port: 3000,

        // 监听所有地址
        host: '0.0.0.0',

        // 自动打开浏览器
        open: true,

        // HTTPS
        https: {
            key: fs.readFileSync('./cert/key.pem'),
            cert: fs.readFileSync('./cert/cert.pem')
        },

        // 代理
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        },

        // HMR 配置
        hmr: {
            overlay: true
        }
    }
});
```

### 预览服务器

```javascript
export default defineConfig({
    preview: {
        port: 4000,
        open: true,
        proxy: {
            '/api': 'http://localhost:8080'
        }
    }
});
```

## 构建优化

### 生产构建

```javascript
export default defineConfig({
    build: {
        // 输出目录
        outDir: 'dist',
        assetsDir: 'assets',

        // 源码映射
        sourcemap: false,

        // 压缩
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },

        // Chunk 大小警告
        chunkSizeWarningLimit: 500,

        // Rollup 配置
        rollupOptions: {
            output: {
                // 手动分块
                manualChunks: {
                    'vue-vendor': ['vue', 'vue-router', 'pinia'],
                    'ui-library': ['element-plus'],
                    'utils': ['lodash', 'dayjs', 'axios']
                },

                // 命名
                chunkFileNames: 'js/[name]-[hash].js',
                entryFileNames: 'js/[name]-[hash].js',
                assetFileNames: '[ext]/[name]-[hash].[ext]'
            },

            // 外部化
            external: ['react', 'react-dom']
        }
    }
});
```

### 库模式

```javascript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],

    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'MyLib',
            fileName: 'my-lib'
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
});
```

## 环境变量

### .env 文件

```bash
# .env.development
VITE_APP_TITLE=开发环境
VITE_API_URL=http://localhost:8080

# .env.production
VITE_APP_TITLE=生产环境
VITE_API_URL=https://api.example.com

# .env
VITE_APP_VERSION=1.0.0
```

### 使用环境变量

```javascript
// vite.config.js
export default defineConfig({
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        __APP_VERSION__: JSON.stringify(process.env.VITE_APP_VERSION)
    }
});

// 在代码中使用
console.log(import.meta.env.VITE_APP_TITLE);
console.log(import.meta.env.VITE_API_URL);

// 类型定义
/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
```

## TypeScript 支持

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "jsx": "preserve",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowJs": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "lib": ["ESNext", "DOM"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

## 性能优化

### 依赖预构建

```javascript
export default defineConfig({
    optimizeDeps: {
        // 强制预构建
        include: ['lodash-es'],

        // 排除预构建
        exclude: ['your-custom-lib'],

        // 自定义 esbuild 选项
        esbuildOptions: {
            target: 'es2020'
        }
    }
});
```

### CSS 代码分割

```javascript
export default defineConfig({
    build: {
        cssCodeSplit: true,
        cssMinify: 'lightningcss'
    }
});
```

## 最佳实践

::: tip Vite 使用建议

1. **使用原生 ES 模块** - 充分利用浏览器能力
2. **按需加载** - 使用动态导入实现代码分割
3. **配置别名** - 简化导入路径
4. **环境变量** - 统一管理配置
5. **TypeScript** - 增强类型安全

:::

```javascript
// ✅ 推荐配置
export default defineConfig({
    plugins: [vue()],

    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@components': resolve(__dirname, 'src/components')
        }
    },

    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['vue', 'vue-router']
                }
            }
        }
    },

    server: {
        proxy: {
            '/api': 'http://localhost:8080'
        }
    }
});
```

## 总结

| 特性 | 说明 |
|------|------|
| **极速 HMR** | 基于 ESM 的热更新 |
| **开箱即用** | 无需配置即可使用 |
| **插件生态** | 丰富的插件支持 |
| **Rollup 打包** | 生产环境优化 |
| **TypeScript** | 原生支持 |

::: v-pre

[Webpack 打包](./webpack.md) → [Babel 转译](./babel.md)

:::
