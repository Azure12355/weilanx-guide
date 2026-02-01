---
title: Webpack 打包
icon: ri-box-3-line
order: 2
---

# Webpack 打包

Webpack 是现代前端最流行的模块打包工具之一。

## 核心概念

### Entry（入口）

```javascript
// webpack.config.js
module.exports = {
    // 单入口
    entry: './src/index.js',

    // 多入口
    entry: {
        app: './src/app.js',
        admin: './src/admin.js'
    },

    // 动态入口
    entry: () => './src/index.js'
};
```

### Output（输出）

```javascript
const path = require('path');

module.exports = {
    output: {
        // 输出目录
        path: path.resolve(__dirname, 'dist'),

        // 输出文件名
        filename: 'bundle.js',

        // 多入口输出
        filename: '[name].bundle.js',

        // 带哈希的文件名
        filename: '[name].[contenthash].js',

        // CDN 路径
        publicPath: 'https://cdn.example.com/'
    }
};
```

### Loader

```javascript
module.exports = {
    module: {
        rules: [
            {
                // 匹配文件
                test: /\.css$/,

                // 使用 loader
                use: ['style-loader', 'css-loader'],

                // 只匹配指定目录
                include: path.resolve(__dirname, 'src'),

                // 排除指定目录
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
```

### Plugin

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    plugins: [
        // HTML 模板
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            minify: true
        }),

        // CSS 提取
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),

        // 清理 dist
        new CleanWebpackPlugin()
    ]
};
```

## 常用 Loader

### CSS Loader

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',      // 创建 style 标签
                    'css-loader',        // 解析 @import/url()
                    'postcss-loader'     // PostCSS 处理
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                outputStyle: 'compressed'
                            }
                        }
                    }
                ]
            }
        ]
    }
};
```

### Babel Loader

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
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
                            '@babel/plugin-transform-runtime'
                        ]
                    }
                }
            }
        ]
    }
};
```

### File Loader

```javascript
module.exports = {
    module: {
        rules: [
            // 图片
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // 10kb
                    }
                },
                generator: {
                    filename: 'images/[name].[hash:6][ext]'
                }
            },
            // 字体
            {
                test: /\.(woff2?|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[hash:6][ext]'
                }
            }
        ]
    }
};
```

## 模式

### Development Mode

```javascript
module.exports = {
    mode: 'development',

    // 开发工具
    devtool: 'eval-cheap-module-source-map',

    // 开发服务器
    devServer: {
        static: './dist',
        port: 8080,
        hot: true,
        open: true,
        compress: true,
        client: {
            overlay: {
                errors: true,
                warnings: false
            }
        },
        proxy: {
            '/api': 'http://localhost:3000'
        }
    },

    // 优化
    optimization: {
        moduleIds: 'named',
        chunkIds: 'named'
    }
};
```

### Production Mode

```javascript
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',

    // 开发工具
    devtool: 'source-map',

    // 优化
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true
                    }
                }
            })
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    name: 'vendors',
                    priority: -10
                }
            }
        }
    }
};
```

## 高级配置

### 代码分割

```javascript
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            automaticNameDelimiter: '~',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};
```

### 动态导入

```javascript
// 路由级别代码分割
const Home = () => import('./views/Home.vue');
const About = () => import('./views/About.vue');

// 条件加载
if (process.env.NODE_ENV === 'development') {
    import('./devtools').then(devtools => {
        devtools.initialize();
    });
}

// 预获取
import(/* webpackPrefetch: true */ './path/to/LoginModal.js');
// 预加载
import(/* webpackPreload: true */ './path/to/HeavyLibrary.js');
```

### 环境变量

```javascript
// DefinePlugin
const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.API_URL': JSON.stringify('https://api.example.com')
        })
    ]
};

// 使用
console.log(process.env.NODE_ENV);  // 'production'
console.log(process.env.API_URL);   // 'https://api.example.com'
```

### 多入口配置

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: './src/main.js',
        admin: './src/admin.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            template: './src/admin.html',
            filename: 'admin.html',
            chunks: ['admin']
        })
    ]
};
```

## 性能优化

### 构建速度

```javascript
module.exports = {
    // 缓存 loader
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }
            }
        ]
    },

    // 缓存模块
    cache: {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '.webpack_cache')
    },

    // 并行处理
    parallelism: 4
};
```

### 打包优化

```javascript
module.exports = {
    optimization: {
        // Tree Shaking
        usedExports: true,
        sideEffects: true,

        // 代码压缩
        minimize: true,

        // 运行时代码
        runtimeChunk: 'single',

        // 模块标识符
        moduleIds: 'deterministic'
    }
};
```

## 最佳实践

::: tip Webpack 配置建议

1. **分离配置** - 开发和生产环境分开
2. **缓存** - 使用 cache-loader 和文件系统缓存
3. **代码分割** - 合理配置 splitChunks
4. **Tree Shaking** - 删除未使用代码
5. **资源哈希** - 使用 contenthash 实现长效缓存

:::

```javascript
// webpack.config.js
const path = require('path');
const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const dev = require('./webpack.dev.js');
const prod = require('./webpack.prod.js');

module.exports = (env, argv) => {
    return merge(common, argv.mode === 'development' ? dev : prod);
};
```

## 总结

| 概念 | 说明 |
|------|------|
| **Entry** | 入口文件配置 |
| **Output** | 输出文件配置 |
| **Loader** | 文件转换器 |
| **Plugin** | 插件系统 |
| **Mode** | 模式配置 |

::: v-pre

[npm 包管理](./npm.md) → [Vite 构建](./vite.md)

:::
