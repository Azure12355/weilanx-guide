---
title: 项目结构
icon: ri:folder-line
order: 1
---

# 项目结构

良好的项目结构是可维护 Python 项目的基础。

## 标准项目结构

### src 布局

```
my_project/
├── src/
│   └── my_package/
│       ├── __init__.py
│       ├── core.py
│       └── utils/
│           ├── __init__.py
│           └── helpers.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_core.py
│   └── test_utils.py
├── docs/
│   ├── conf.py
│   └── index.rst
├── scripts/
│   ├── setup.py
│   └── migrate.py
├── .github/
│   └── workflows/
│       └── ci.yml
├── pyproject.toml
├── README.md
├── LICENSE
├── .gitignore
└── CHANGELOG.md
```

### 单模块布局

```
simple_project/
├── simple_package/
│   ├── __init__.py
│   └── module.py
├── tests/
│   └── test_module.py
├── setup.py
├── README.md
└── LICENSE
```

## pyproject.toml 配置

### 基础配置

```toml
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "my-package"
version = "1.0.0"
description = "我的 Python 包"
readme = "README.md"
requires-python = ">=3.8"
license = {text = "MIT"}
authors = [
    {name = "Your Name", email = "your.email@example.com"}
]
keywords = ["example", "package"]
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
]

dependencies = [
    "requests>=2.28.0",
    "click>=8.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "black>=22.0.0",
    "isort>=5.10.0",
    "mypy>=0.950",
    "ruff>=0.1.0",
]
docs = [
    "sphinx>=5.0.0",
    "sphinx-rtd-theme>=1.0.0",
]

[project.urls]
Homepage = "https://github.com/user/my-package"
Documentation = "https://my-package.readthedocs.io"
Repository = "https://github.com/user/my-package"
"Bug Tracker" = "https://github.com/user/my-package/issues"

[project.scripts]
my-cli = "my_package.cli:main"
```

### 工具配置

```toml
[tool.setuptools.packages.find]
where = ["src"]

[tool.black]
line-length = 88
target-version = ["py38", "py39", "py310", "py311"]
include = '\.pyi?$'

[tool.isort]
profile = "black"
line_length = 88
multi_line_output = 3

[tool.mypy]
python_version = "3.8"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]

[tool.ruff]
line-length = 88
select = ["E", "F", "W", "I", "N"]
ignore = ["E501"]

[tool.coverage.run]
source = ["src"]
omit = ["*/tests/*"]

[tool.coverage.report]
exclude_lines = [
    "pragma: no cover",
    "def __repr__",
    "raise AssertionError",
    "raise NotImplementedError",
]
```

## 配置文件

### .gitignore

```
# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# C extensions
*.so

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
pip-wheel-metadata/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# PyInstaller
*.manifest
*.spec

# Unit test / coverage reports
htmlcov/
.tox/
.nox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.py,cover
.hypothesis/
.pytest_cache/

# Environments
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# IDEs
.idea/
.vscode/
*.swp
*.swo
*~

# mypy
.mypy_cache/
.dmypy.json
dmypy.json

# ruff
.ruff_cache/
```

### README.md 结构

```markdown
# My Package

简短的项目描述。

## 功能特性

- 特性 1
- 特性 2
- 特性 3

## 安装

```bash
pip install my-package
```

## 快速开始

```python
from my_package import core

core.do_something()
```

## 文档

完整文档：https://my-package.readthedocs.io

## 贡献

欢迎贡献！请查看项目仓库的贡献指南。

## 许可证

MIT License
```

## 命名规范

### 模块命名

```python
# 好的模块名
import requests
import numpy
import pandas

# 避免使用
import my_module  # 太通用
import MyModule  # 不符合规范

# 推荐方式
import image_processor
import http_utils
import config_manager
```

### 类命名

```python
# 好的类名
class DataProcessor:
    pass

class HTTPClient:
    pass

class UserAccount:
    pass

# 避免使用
class dataProcessor:  # 驼峰命名
class data_processor:  # 类名应用大写
```

### 函数命名

```python
# 好的函数名
def calculate_average(numbers):
    pass

def fetch_user_data(user_id):
    pass

def validate_email(email):
    pass

# 避免使用
def calc(nums):  # 缩写不清晰
def get(x):      # 太通用
```

## 文档结构

### docs 目录

```
docs/
├── conf.py                 # Sphinx 配置
├── index.rst               # 首页
├── installation.rst        # 安装指南
├── quickstart.rst          # 快速开始
├── api/                    # API 文档
│   ├── module.rst
│   └── utils.rst
├── tutorials/              # 教程
│   └── basic_usage.rst
└── examples/               # 示例
    └── advanced.rst
```

### conf.py 配置

```python
project = 'My Package'
copyright = '2024, Your Name'
author = 'Your Name'

extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',
    'sphinx.ext.viewcode',
    'sphinx.ext.intersphinx',
]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']
```

## 最佳实践

::: tip 项目结构建议

1. **使用 src 布局**：避免导入问题
2. **分离测试**：tests 目录与 src 分离
3. **配置集中**：使用 pyproject.toml
4. **文档完善**：README + API 文档
5. **版本控制**：添加合适的 .gitignore

::: tip 目录组织

```python
# 按功能组织
my_package/
├── __init__.py
├── api/          # API 接口
├── core/         # 核心逻辑
├── utils/        # 工具函数
└── config/       # 配置

# 按层组织
my_package/
├── __init__.py
├── models/       # 数据模型
├── services/     # 业务逻辑
├── repositories/ # 数据访问
└── controllers/  # 控制器
```

::: tip 导入顺序

```python
# 1. 标准库
import os
import sys

# 2. 第三方库
import requests
import numpy as np

# 3. 本地模块
from my_package import core
from my_package.utils import helpers

# 使用 isort 自动排序
```

::: tip __init__.py 使用

```python
# 暴露公共 API
from my_package.core import DataProcessor
from my_package.utils import validate_input

__all__ = [
    "DataProcessor",
    "validate_input",
]

__version__ = "1.0.0"
```
