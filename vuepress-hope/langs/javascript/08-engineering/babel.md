---
title: Babel 转译
icon: ri-braces-line
order: 4
---

# Babel 转译

Babel 是 JavaScript 编译器，将新版本代码转换为向后兼容的代码。

## 基础配置

### .babelrc

```json
{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": []
}
```

### babel.config.js

```javascript
module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                browsers: ['last 2 versions', 'not dead', '> 0.2%']
            },
            useBuiltIns: 'usage',
            corejs: 3
        }]
    ],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-object-rest-spread'
    ]
};
```

## Presets

### @babel/preset-env

```javascript
module.exports = {
    presets: [
        ['@babel/preset-env', {
            // 目标环境
            targets: {
                browsers: ['last 2 versions', 'not dead'],
                node: 'current'
            },

            // 使用 polyfill
            useBuiltIns: 'entry',
            // usage: 按需引入
            // entry: 入口文件引入
            // false: 不引入

            // corejs 版本
            corejs: 3,

            // 不转换模块语法
            modules: false
        }]
    ]
};
```

### @babel/preset-react

```javascript
module.exports = {
    presets: [
        ['@babel/preset-react', {
            runtime: 'automatic',
            development: process.env.NODE_ENV === 'development'
        }]
    ]
};
```

### @babel/preset-typescript

```javascript
module.exports = {
    presets: [
        ['@babel/preset-typescript', {
            allExtensions: true,
            isTSX: true
        }]
    ]
};
```

## Plugins

### 转换插件

```javascript
module.exports = {
    plugins: [
        // 类属性
        '@babel/plugin-proposal-class-properties',

        // 私有方法
        '@babel/plugin-proposal-private-methods',

        // 私有字段
        ['@babel/plugin-proposal-private-property-in-object', { loose: false }],

        // 空值合并
        '@babel/plugin-proposal-nullish-coalescing-operator',

        // 可选链
        '@babel/plugin-proposal-optional-chaining',

        // 装饰器
        ['@babel/plugin-proposal-decorators', { version: '2023-05' }],

        // do 表达式
        '@babel/plugin-proposal-do-expressions',

        // 函数绑定
        '@babel/plugin-proposal-function-bind',

        // 导出命名空间
        '@babel/plugin-proposal-export-namespace-from'
    ]
};
```

### 运行时插件

```javascript
module.exports = {
    plugins: [
        ['@babel/plugin-transform-runtime', {
            // 使用 corejs 2 的辅助函数
            corejs: false,
            // corejs: 3,

            // 使用 helpers
            helpers: true,

            // 使用 regenerator
            regenerator: true,

            // 不使用 polyfill
            useESModules: false
        }]
    ]
};
```

## 高级配置

### 覆盖配置

```javascript
module.exports = function (api) {
    // cache 缓存
    api.cache(true);

    const presets = [
        ['@babel/preset-env', {
            targets: {
                browsers: ['last 2 versions']
            }
        }]
    ];

    const plugins = [
        '@babel/plugin-transform-runtime'
    ];

    return {
        presets,
        plugins
    };
};
```

### 环境配置

```javascript
module.exports = {
    env: {
        development: {
            presets: [
                ['@babel/preset-env', {
                    targets: {
                        node: 'current'
                    }
                }]
            ]
        },
        production: {
            presets: [
                ['@babel/preset-env', {
                    targets: {
                        browsers: ['last 2 versions']
                    },
                    useBuiltIns: 'usage',
                    corejs: 3
                }]
            ],
            plugins: [
                'babel-plugin-transform-react-remove-prop-types',
                '@babel/plugin-transform-react-constant-elements'
            ]
        },
        test: {
            presets: [
                ['@babel/preset-env', {
                    targets: {
                        node: 'current'
                    }
                }]
            ]
        }
    }
};
```

## 聚合配置

### Webpack + Babel

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                useBuiltIns: 'usage',
                                corejs: 3
                            }],
                            '@babel/preset-react'
                        ],
                        plugins: [
                            '@babel/plugin-transform-runtime'
                        ],
                        // 缓存
                        cacheDirectory: true
                    }
                }
            }
        ]
    }
};
```

### Vite + Babel

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
    esbuild: {
        // 不使用 jsx 自动转换
        jsx: 'preserve'
    },
    optimizeDeps: {
        esbuildOptions: {
            // 不使用 jsx 自动转换
            jsx: 'preserve'
        }
    },
    plugins: [
        {
            name: 'vite:babel',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    if (req.url.endsWith('.js') || req.url.endsWith('.jsx')) {
                        // 转换代码
                        const code = fs.readFileSync(req.url, 'utf-8');
                        const result = babel.transformSync(code, {
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        });
                        res.end(result.code);
                    } else {
                        next();
                    }
                });
            }
        }
    ]
);
```

## Polyfill

### core-js

```javascript
// babel.config.js
module.exports = {
    presets: [
        ['@babel/preset-env', {
            useBuiltIns: 'usage',
            corejs: 3
        }]
    ];

// src/index.js
import 'core-js/stable';
import 'core-js/es/promise';
```

### 按需引入

```javascript
// 只引入需要的 polyfill
import 'core-js/features/array/flat-map';
import 'core-js/features/string/trim';

// 或自动引入（推荐）
// babel 会自动分析代码并引入所需 polyfill
```

## 最佳实践

::: tip Babel 配置建议

1. **使用缓存** - 开启 babel-loader 缓存
2. **按需转译** - 只转译需要的文件
3. **runtime** - 使用 @babel/plugin-transform-runtime
4. **core-js** - 按需引入 polyfill
5. **targets** - 明确目标环境

:::

```javascript
// ✅ 推荐配置
module.exports = {
    presets: [
        ['@babel/preset-env', {
            modules: false,
            useBuiltIns: 'usage',
            corejs: 3
        }],
        '@babel/preset-react',
        '@babel/preset-typescript'
    ],
    plugins: [
        ['@babel/plugin-transform-runtime', {
            corejs: 3
        }]
    ]
};
```

## 总结

| 配置 | 说明 |
|------|------|
| **presets** | 预设配置集合 |
| **plugins** | 转换插件 |
| **polyfill** | 旧浏览器兼容 |
| **runtime** | 辅助函数复用 |

::: v-pre

[Vite 构建](./vite.md) → [工具链](./tooling.md)

:::
