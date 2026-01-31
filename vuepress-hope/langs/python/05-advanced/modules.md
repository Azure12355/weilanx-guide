---
title: 模块与包
icon: ri:folder-3-line
order: 4
---

# 模块与包

模块和包是 Python 代码组织和复用的基础，理解它们对于构建可维护的应用程序至关重要。

## 模块基础

### 导入模块

```python
# 导入整个模块
import math
print(math.pi)
print(math.sqrt(16))

# 导入并重命名
import numpy as np
np.array([1, 2, 3])

# 导入特定内容
from math import pi, sqrt
print(pi)
print(sqrt(16))

# 导入所有（不推荐）
from math import *

# 导入并重命名特定内容
from math import sqrt as square_root
square_root(25)
```

### 模块搜索路径

```python
import sys

# 查看搜索路径
print(sys.path)
# ['', '/usr/lib/python39.zip', '/usr/lib/python3.9', ...]

# 添加自定义路径
sys.path.append("/path/to/modules")

# PYTHONPATH 环境变量
# export PYTHONPATH=/path/to/modules:$PYTHONPATH
```

### 模块信息

```python
import math

# 模块文档
print(math.__doc__)

# 模块文件位置
print(math.__file__)

# 模块名称
print(math.__name__)

# 模块内置属性
print(dir(math))  # 列出所有属性
```

## 包结构

### 基本包结构

```
my_package/
├── __init__.py          # 包初始化文件
├── module1.py
├── module2.py
└── subpackage/
    ├── __init__.py
    └── module3.py
```

### __init__.py

```python
# my_package/__init__.py

# 包初始化代码
print("Initializing my_package")

# 导入接口（简化导入）
from .module1 import function1
from .module2 import Class2

# 包级别变量
VERSION = "1.0.0"
AUTHOR = "Your Name"

# __all__ 定义 from package import * 的行为
__all__ = ["function1", "Class2", "VERSION"]
```

### 导入包

```python
# 导入包
import my_package
print(my_package.VERSION)

# 导入子模块
import my_package.module1
my_package.module1.function1()

# from 导入
from my_package import module1
module1.function1()

# 从子模块导入
from my_package.module1 import function1
function1()

# 导入子包
from my_package.subpackage import module3
```

## 绝对导入 vs 相对导入

### 绝对导入（推荐）

```python
# 从项目根目录开始导入
from my_package.module1 import function1
from my_package.subpackage.module3 import Class3

# 优点：清晰、明确、不依赖当前位置
```

### 相对导入

```python
# 在包内部使用
# . 表示当前包
# .. 表示父包
# ... 表示上上级包

# 在 my_package/subpackage/module3.py 中
from ..module1 import function1      # 父包的 module1
from .. import module1               # 父包
from .module4 import function4       # 同级 module4

# 注意：相对导入只能在包内使用
# 直接运行包含相对导入的脚本会失败
```

## 模块特殊属性

```python
# __name__ 属性
def main():
    print("Running as main")

if __name__ == "__main__":
    main()
# 只在直接运行时执行
# python my_module.py  # 执行
# import my_module     # 不执行

# __file__ 属性
import os
current_dir = os.path.dirname(os.path.abspath(__file__))

# __package__ 属性
print(__package__)  # 所属包名
```

## 动态导入

### importlib

```python
import importlib

# 动态导入模块
module_name = "math"
math_module = importlib.import_module(module_name)
print(math_module.pi)

# 根据配置动态导入
config = {"module": "numpy", "as_name": "np"}
module = importlib.import_module(config["module"])
np = module

# 重新加载模块（开发时有用）
import my_module
# 修改 my_module 后
importlib.reload(my_module)
```

### 插件系统

```python
import importlib
import os
from pathlib import Path

def load_plugins(plugin_dir):
    """动态加载插件"""
    plugins = []
    for file in Path(plugin_dir).glob("*.py"):
        if file.name.startswith("_"):
            continue

        module_name = file.stem
        spec = importlib.util.spec_from_file_location(
            f"plugins.{module_name}",
            file
        )
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)

        if hasattr(module, "register"):
            plugins.append(module)
    return plugins

# 使用
plugins = load_plugins("plugins/")
for plugin in plugins:
    plugin.register()
```

## 命名空间包

```python
# Python 3.3+ 支持命名空间包
# 无需 __init__.py

# 结构：
# namespace_pkg/
#   ├── part1/
#   │   └── module.py
#   └── part2/
#       └── module.py

# 可以从不同位置导入
from namespace_pkg.part1 import module as m1
from namespace_pkg.part2 import module as m2
```

## 模块最佳实践

### 循环导入

```python
# ❌ 循环导入（错误）
# a.py
import b
def func_a():
    return b.func_b()

# b.py
import a
def func_b():
    return a.func_a()

# ✅ 解决方案 1：重构
# a.py
import b
def func_a():
    return b.func_b()

# b.py
# 不导入 a，而是在需要时导入
def func_b():
    from a import func_a
    return func_a()

# ✅ 解决方案 2：使用函数内导入
def func_a():
    import b  # 延迟导入
    return b.func_b()
```

### 延迟导入

```python
# 在需要时才导入重型模块
def process_data(data):
    import pandas as pd  # 只在使用时导入
    df = pd.DataFrame(data)
    return df

# 或使用 __getattr__（Python 3.7+）
class LazyImports:
    def __getattr__(self, name):
        if name == "pandas":
            import pandas as pd
            return pd
        raise AttributeError(f"module {__name__} has no attribute {name}")

sys.modules[__name__] = LazyImports()
```

### 模块初始化

```python
# __init__.py 中避免繁重操作

# ❌ 不好：阻塞导入
import time
time.sleep(10)  # 导入时等待

# ✅ 好：延迟初始化
_initialized = False

def _initialize():
    global _initialized
    if not _initialized:
        # 初始化代码
        time.sleep(10)
        _initialized = True

def get_resource():
    _initialize()
    return resource
```

## 发布包

### setup.py / pyproject.toml

```toml
# pyproject.toml (推荐)
[build-system]
requires = ["setuptools>=45", "wheel", "setuptools_scm>=6.2"]
build-backend = "setuptools.build_meta"

[project]
name = "my_package"
version = "1.0.0"
description = "My awesome package"
authors = [{name = "Your Name", email = "you@example.com"}]
license = {text = "MIT"}
requires-python = ">=3.8"
dependencies = [
    "requests>=2.28.0",
    "numpy>=1.23.0",
]

[project.optional-dependencies]
dev = ["pytest>=7.0", "black", "mypy"]
docs = ["sphinx", "sphinx-rtd-theme"]

[project.urls]
Homepage = "https://github.com/user/my_package"
```

### 安装本地包

```bash
# 开发模式（可编辑安装）
pip install -e .

# 从本地目录安装
pip install /path/to/package

# 从本地压缩包安装
pip install package.tar.gz
```

## 包管理工具

### pip

```bash
# 安装包
pip install package_name
pip install -r requirements.txt

# 指定版本
pip install package==1.0.0
pip install "package>=1.0,<2.0"

# 卸载
pip uninstall package_name

# 列出已安装
pip list
pip freeze > requirements.txt

# 显示信息
pip show package_name

# 搜索
pip search package_name
```

### virtualenv/venv

```bash
# 创建虚拟环境
python -m venv myenv

# 激活虚拟环境
# Linux/Mac
source myenv/bin/activate
# Windows
myenv\Scripts\activate

# 退出虚拟环境
deactivate
```

### requirements.txt

```txt
# requirements.txt
# 基础依赖
requests>=2.28.0
numpy>=1.23.0
pandas>=1.5.0

# 开发依赖
# 在 requirements-dev.txt 中
pytest>=7.0.0
black>=22.0.0
mypy>=0.990

# 安装
pip install -r requirements.txt
```

## 包结构示例

### 完整项目结构

```
my_project/
├── pyproject.toml           # 项目配置
├── README.md               # 项目说明
├── LICENSE                 # 许可证
├── requirements.txt        # 依赖列表
├── requirements-dev.txt    # 开发依赖
├── setup.cfg               # 设置配置
├── .gitignore             # Git 忽略
├── my_package/            # 主包
│   ├── __init__.py       # 包初始化
│   ├── core/             # 核心模块
│   │   ├── __init__.py
│   │   ├── base.py
│   │   └── utils.py
│   ├── api/              # API 模块
│   │   ├── __init__.py
│   │   └── client.py
│   └── cli/              # 命令行模块
│       ├── __init__.py
│       └── main.py
├── tests/                # 测试
│   ├── __init__.py
│   ├── test_core.py
│   └── test_api.py
├── docs/                 # 文档
│   ├── conf.py
│   └── index.md
└── scripts/              # 脚本
    └── run.py
```

### __init__.py 模式

```python
# my_package/__init__.py

# 版本信息
__version__ = "1.0.0"

# 导入顶层 API
from .core.base import BaseClass
from .core.utils import helper_function
from .api.client import APIClient

# 定义公共接口
__all__ = [
    "__version__",
    "BaseClass",
    "helper_function",
    "APIClient",
]
```

## 包最佳实践

::: tip 包设计原则

1. **单一职责**：每个模块专注一个功能
2. **清晰分层**：core、api、ui 等明确分离
3. **避免循环导入**：重构代码消除循环依赖
4. **使用相对导入**：包内使用相对导入
5. **明确公共接口**：使用 __all__ 定义 API

::: tip 命名规范

```python
# 模块名：小写 + 下划线
my_module.py
my_package/

# 类名：大驼峰
class MyClass:
    pass

# 函数/变量：小写 + 下划线
def my_function():
    pass

# 常量：大写 + 下划线
MAX_SIZE = 100
```

::: tip 依赖管理

1. **分离依赖**：生产依赖和开发依赖分开
2. **版本锁定**：使用 requirements.txt 锁定版本
3. **最小依赖**：只安装必要的包
4. **定期更新**：及时更新依赖版本

::: tip 项目模板

```python
# 推荐使用 cookiecutter 生成项目结构
# pip install cookiecutter
# cookiecutter https://github.com/audreyfeldroy/cookiecutter-pypackage
```
