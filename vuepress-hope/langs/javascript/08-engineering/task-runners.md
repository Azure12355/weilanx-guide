---
title: 任务运行器
icon: ri:run-line
order: 4
---

# 任务运行器

任务运行器用于自动化常见的开发任务，如代码检查、测试、构建等。

## npm scripts

### 基本使用

```json
// package.json
{
  "scripts": {
    // 开发服务器
    "dev": "vite",
    "serve": "vite preview",

    // 构建
    "build": "vite build",
    "build:prod": "vite build --mode production",

    // 代码检查
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",

    // 测试
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",

    // 类型检查
    "type-check": "tsc --noEmit",

    // 清理
    "clean": "rm -rf dist",

    // 组合任务
    "check": "npm run lint && npm run type-check",
    "prebuild": "npm run clean && npm run check",
    "postbuild": "npm run test"
  }
}

// 运行脚本
// npm run dev
// npm run build

// 生命周期脚本
// npm install 前后运行
// "preinstall": "...",
// "postinstall": "...",
// "prebuild": "...",
// "postbuild": "..."
```

### 环境变量

```json
// package.json
{
  "scripts": {
    // 传递环境变量
    "dev": "NODE_ENV=development vite",
    "build": "NODE_ENV=production vite build",

    // 使用 cross-env 跨平台
    "dev": "cross-env NODE_ENV=development vite",
    "build": "cross-env NODE_ENV=production vite build",

    // 自定义环境变量
    "dev:api": "VITE_API_URL=http://localhost:8080 vite"
  }
}

// 代码中使用
// const isDev = process.env.NODE_ENV === 'development';
// const apiUrl = import.meta.env.VITE_API_URL;
```

## NPM Scripts 高级用法

### 顺序执行

```json
{
  "scripts": {
    // 串行执行（&&）：前一个成功后才执行下一个
    "prebuild": "npm run clean && npm run check",
    "all": "npm run lint && npm run test && npm run build",

    // 并行执行（&）：同时运行多个任务
    "dev:all": "npm run dev & npm run test:watch",

    // 使用 npm-run-all
    "start": "npm-run-all --parallel dev test:watch"
  }
}
```

### 通配符和参数

```json
{
  "scripts": {
    // 传递参数
    "lint": "eslint",
    "lint:fix": "npm run lint -- --fix",
    "test": "vitest",
    "test:file": "npm run test --",

    // 使用通配符
    "lint:all": "eslint \"src/**/*.js\" \"src/**/*.jsx\""
  }
}

// 命令行使用
// npm run lint:fix
// npm run test:file utils.test.js
```

## Gulp

### 基本使用

```javascript
// gulpfile.js
const gulp = require('gulp');
const sass = require('gulp-sass');
const terser = require('gulp-terser');
const rename = require('gulp-rename');

// 编译 Sass
gulp.task('sass', () => {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'));
});

// 压缩 JavaScript
gulp.task('js', () => {
    return gulp.src('src/js/**/*.js')
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'));
});

// 监听文件变化
gulp.task('watch', () => {
    gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
    gulp.watch('src/js/**/*.js', gulp.series('js'));
});

// 默认任务
gulp.task('default', gulp.parallel('sass', 'js', 'watch'));

// 运行
// gulp
// gulp sass
```

### Gulp 4 语法

```javascript
const gulp = require('gulp');

// 串行任务
gulp.task('series', gulp.series(
    'clean',
    'sass',
    'js'
));

// 并行任务
gulp.task('parallel', gulp.parallel(
    'sass',
    'js'
));

// 组合任务
gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('sass', 'js'),
    'reload'
));

// 异步任务
gulp.task('async', async () => {
    await someAsyncOperation();
});
```

## Grunt

### 基本配置

```javascript
// Gruntfile.js
module.exports = function(grunt) {
    // 加载插件
    require('load-grunt-tasks')(grunt);

    // 配置任务
    grunt.initConfig({
        // JSHint：代码检查
        jshint: {
            all: ['src/**/*.js']
        },

        // Uglify：压缩 JS
        uglify: {
            options: {
                mangle: true,
                compress: true
            },
            target: {
                src: 'src/**/*.js',
                dest: 'dist/'
            }
        },

        // Sass：编译 Sass
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/scss',
                    src: ['**/*.scss'],
                    dest: 'dist/css',
                    ext: '.css'
                }]
            }
        },

        // Watch：监听文件变化
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['jshint', 'uglify']
            },
            styles: {
                files: ['src/scss/**/*.scss'],
                tasks: ['sass']
            }
        }
    });

    // 注册任务
    grunt.registerTask('default', ['jshint', 'uglify', 'sass']);
    grunt.registerTask('dev', ['watch']);
};

// 运行
// grunt
// grunt dev
```

## Shell 脚本

### 基本使用

```bash
#!/bin/bash
# scripts/build.sh

# 设置变量
NODE_ENV=${NODE_ENV:-production}
OUTPUT_DIR=${OUTPUT_DIR:-dist}

# 清理输出目录
echo "Cleaning $OUTPUT_DIR..."
rm -rf $OUTPUT_DIR
mkdir -p $OUTPUT_DIR

# 安装依赖
echo "Installing dependencies..."
npm install

# 构建
echo "Building..."
npm run build

# 运行测试
echo "Running tests..."
npm test

# 输出
echo "Build complete!"
echo "Output: $OUTPUT_DIR"
```

```json
// package.json
{
  "scripts": {
    "build": "./scripts/build.sh"
  }
}
```

### 跨平台脚本

```javascript
// 使用 Node.js 脚本实现跨平台
// scripts/build.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = 'dist';

// 清理
console.log('Cleaning...');
if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// 安装依赖
console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

// 构建
console.log('Building...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Build complete!');
```

## 任务运行器对比

### 功能对比

```javascript
// npm scripts
// - 无需额外依赖
// - 简单直接
// - 适合简单任务

// Gulp
// - 代码优于配置
// - 流式处理
// - 插件丰富
// - 适合文件处理

// Grunt
// - 配置优于代码
// - 任务并行
// - 插件丰富
// - 适合自动化流程
```

### 选择建议

```javascript
// 选择建议

// 1. 简单任务：npm scripts
// - 不需要额外依赖
// - package.json 中定义
// - 适合小型项目

// 2. 文件处理：Gulp
// - 流式处理
// - 实时编译
// - 适合样式、脚本编译

// 3. 复杂流程：npm-run-all
// - 并行/串行控制
// - 跨平台兼容
// - 适合组合任务

// 4. 自定义需求：Node.js 脚本
// - 完全控制
// - 跨平台兼容
// - 适合复杂逻辑
```

## 任务运行器最佳实践

```javascript
// ✅ 推荐做法

// 1. 优先使用 npm scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}

// 2. 使用清晰的命名
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "test": "vitest"
  }
}

// 3. 组合相关任务
{
  "scripts": {
    "check": "npm run lint && npm run type-check",
    "build:full": "npm run clean && npm run check && npm run build"
  }
}

// 4. 使用跨平台方案
{
  "scripts": {
    "clean": "rimraf dist",
    "build": "cross-env NODE_ENV=production vite build"
  }
}

// 5. 添加描述性注释
{
  "scripts": {
    "// 开发服务器": "",
    "dev": "vite",
    "// 生产构建": "",
    "build": "vite build"
  }
}

// ❌ 不推荐做法

// 1. 过度使用 Gulp/Grunt
// 简单任务不需要复杂的构建系统

// 2. 忽略跨平台兼容性
// "clean": "rm -rf dist"  // Windows 不支持

// 3. 使用不清晰的命名
// "a": "vite",
// "b": "vite build"

// 4. 硬编码路径
// "build": "vite build --outDir=/absolute/path"
```

::: tip 任务运行器检查清单

- [ ] 使用 npm scripts 管理任务
- [ ] 使用清晰的命名约定
- [ ] 组合相关任务
- [ ] 确保跨平台兼容
- [ ] 使用生命周期钩子
- [ ] 避免过度复杂的任务系统

:::

::: tip 下一步

学习开发工作流 → [开发工作流](./development-workflow.md)
:::
