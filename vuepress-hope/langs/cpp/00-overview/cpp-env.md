---
title: 开发环境搭建
icon: devicon-plain:cplusplus
order: 2
---

# 开发环境搭建

## 编译器选择

### GCC (GNU Compiler Collection)

最常用的 C++ 编译器，开源免费，跨平台支持。

#### 安装 GCC

::: tabs

@tab Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install build-essential gdb

# 验证安装
g++ --version
gdb --version
```

@tab macOS

```bash
# 使用 Homebrew
brew install gcc

# 验证安装
g++ --version
```

@tab Windows

下载 [MinGW-w64](https://www.mingw-w64.org/) 或使用 MSYS2

:::

### Clang

LLVM 项目的一部分，编译速度快，错误信息更友好。

::: tabs

@tab Linux (Ubuntu/Debian)

```bash
sudo apt install clang clang-tools

# 验证安装
clang++ --version
```

@tab macOS

Clang 通常已预装在 Xcode 命令行工具中：

```bash
# 安装 Xcode 命令行工具
xcode-select --install

# 验证安装
clang++ --version
```

@tab Windows

下载 [LLVM](https://releases.llvm.org/)

:::

### MSVC (Microsoft Visual C++)

Windows 平台的原生编译器，与 Windows API 集成最佳。

1. 下载 [Visual Studio Community](https://visualstudio.microsoft.com/)
2. 安装时选择"使用 C++ 的桌面开发"工作负载

## IDE 选择

### Visual Studio Code

轻量级、插件丰富、跨平台。

#### 推荐插件

- **C/C++** - Microsoft 官方插件
- **C/C++ Extension Pack** - 扩展包
- **Code Runner** - 快速运行代码
- **Chinese (Simplified)** - 中文界面

#### 配置示例

**.vscode/tasks.json**

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "shell",
      "label": "C++: g++ build active file",
      "command": "/usr/bin/g++",
      "args": [
        "-fdiagnostics-color=always",
        "-g",
        "${file}",
        "-o",
        "${fileDirname}/${fileBasenameNoExtension}"
      ],
      "options": {
        "cwd": "${fileDirname}"
      },
      "problemMatcher": ["$gcc"],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ]
}
```

**.vscode/launch.json**

```json
{
  "version": "2.0.0",
  "configurations": [
    {
      "name": "C++: g++ debug",
      "type": "cppdbg",
      "request": "launch",
      "program": "${fileDirname}/${fileBasenameNoExtension}",
      "args": [],
      "stopAtEntry": false,
      "cwd": "${fileDirname}",
      "environment": [],
      "externalConsole": false,
      "MIMode": "lldb",
      "preLaunchTask": "C++: g++ build active file"
    }
  ]
}
```

### CLion

JetBrains 出品的 C++ IDE，功能强大。

- **智能代码补全**
- **内置调试器**
- **CMake 支持**
- **版本控制集成**

### Visual Studio

Windows 平台最强大的 C++ IDE。

- **IntelliSense 代码补全**
- **强大的调试器**
- **性能分析工具**
- **GUI 设计器**

## CMake

跨平台构建系统，推荐使用。

### 安装 CMake

```bash
# Linux
sudo apt install cmake

# macOS
brew install cmake

# Windows
# 下载安装器 https://cmake.org/download/
```

### CMakeLists.txt 示例

```cmake
cmake_minimum_required(VERSION 3.10)
project(MyProject)

# 设置 C++ 标准
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# 添加可执行文件
add_executable(main main.cpp)

# 如果有多个文件
add_executable(app
    src/main.cpp
    src/utils.cpp
    src/utils.h
)
```

### 构建项目

```bash
# 创建构建目录
mkdir build && cd build

# 生成构建文件
cmake ..

# 编译
cmake --build .

# 运行
./main
```

## 包管理器

### vcpkg (推荐)

微软开发的跨平台 C++ 包管理器。

```bash
# 克隆仓库
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg

# 运行安装脚本
./bootstrap-vcpkg.sh  # Linux/macOS
.\bootstrap-vcpkg.bat # Windows

# 集成到系统
./vcpkg integrate install

# 安装包
./vcpkg install jsoncpp
./vcpkg install fmt
```

### Conan

另一个流行的 C++ 包管理器。

```bash
# 安装
pip install conan

# 创建配置文件
conan install . --output-folder=build --build=missing

# 使用
conan install fmt/10.1.1@
```

## 调试工具

### GDB

GNU 调试器，Linux 下最常用。

```bash
# 编译时添加调试信息
g++ -g program.cpp -o program

# 启动调试
gdb ./program

# 常用命令
(gdb) break main     # 设置断点
(gdb) run           # 运行程序
(gdb) next          # 单步执行
(gdb) print variable # 打印变量
(gdb) continue      # 继续执行
(gdb) quit          # 退出
```

### LLDB

macOS 默认调试器。

```bash
# 编译
clang++ -g program.cpp -o program

# 启动调试
lldb ./program

# 常用命令
(lldb) breakpoint set --name main
(lldb) run
(lldb) next
(lldb) print variable
(lldb) continue
(lldb) quit
```

## 代码格式化

### Clang-Format

自动格式化 C++ 代码。

```bash
# 安装
sudo apt install clang-format  # Linux
brew install clang-format       # macOS

# 格式化文件
clang-format -i main.cpp

# 创建配置文件
clang-format -style=llvm -dump-config > .clang-format
```

**.clang-format 配置示例**

```yaml
BasedOnStyle: Google
IndentWidth: 4
UseTab: Never
ColumnLimit: 100
```

## 编译选项速查

```bash
# 基本编译
g++ main.cpp -o main

# 指定 C++ 标准
g++ -std=c++20 main.cpp -o main

# 添加警告信息
g++ -Wall -Wextra main.cpp -o main

# 添加调试信息
g++ -g main.cpp -o main

# 优化等级
g++ -O1 main.cpp -o main   # 基础优化
g++ -O2 main.cpp -o main   # 推荐优化
g++ -O3 main.cpp -o main   # 最高优化
g++ -Os main.cpp -o main   # 优化体积

# 定义宏
g++ -DDEBUG main.cpp -o main

# 链接库
g++ main.cpp -lpthread -o main

# 包含头文件目录
g++ -I./include main.cpp -o main

# 链接库文件目录
g++ -L./lib main.cpp -o main
```

---

::: tip 开发建议
推荐使用 VS Code + CMake + vcpkg 的组合，既轻量又强大。
:::
