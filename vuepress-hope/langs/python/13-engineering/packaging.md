---
title: 打包发布
icon: ri:upload-cloud-line
order: 3
---

# 打包发布

将 Python 项目打包并发布到 PyPI，让其他人可以安装使用。

## 基础配置

### pyproject.toml 完整配置

```toml
[build-system]
requires = ["setuptools>=61.0", "wheel", "build"]
build-backend = "setuptools.build_meta"

[project]
name = "my-package"
version = "1.0.0"
description = "简短描述"
readme = "README.md"
requires-python = ">=3.8"
license = {text = "MIT"}
authors = [
    {name = "Your Name", email = "your.email@example.com"}
]
maintainers = [
    {name = "Maintainer Name", email = "maintainer@example.com"}
]
keywords = ["keyword1", "keyword2"]
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Operating System :: OS Independent",
    "Topic :: Software Development :: Libraries :: Python Modules",
]

dependencies = [
    "requests>=2.28.0",
    "click>=8.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "pytest-cov>=4.0.0",
    "black>=22.0.0",
    "isort>=5.10.0",
    "mypy>=0.950",
]
docs = [
    "sphinx>=5.0.0",
    "sphinx-rtd-theme>=1.0.0",
]
all = [
    "my-package[dev,docs]",
]

[project.urls]
Homepage = "https://github.com/user/my-package"
Documentation = "https://my-package.readthedocs.io"
Repository = "https://github.com/user/my-package"
"Bug Tracker" = "https://github.com/user/my-package/issues"
Changelog = "https://github.com/user/my-package/blob/main/CHANGELOG.md"

[project.scripts]
my-cli = "my_package.cli:main"

[project.entry-points."my_package.plugin"]
processor = "my_package.plugins:DataProcessor"

[tool.setuptools]
package-dir = {"" = "src"}

[tool.setuptools.packages.find]
where = ["src"]

[tool.setuptools.dynamic]
readme = {file = ["README.md"]}
```

## 版本管理

### 语义化版本

```
格式: MAJOR.MINOR.PATCH

MAJOR: 不兼容的 API 变更
MINOR: 向后兼容的功能新增
PATCH: 向后兼容的问题修复

示例:
1.0.0  初始发布
1.1.0  新增功能
1.1.1  修复 bug
2.0.0  破坏性变更
```

### __version__ 使用

```python
# my_package/__init__.py
__version__ = "1.0.0"

# 或从版本文件读取
from importlib.metadata import version, PackageNotFoundError

try:
    __version__ = version("my-package")
except PackageNotFoundError:
    __version__ = "unknown"
```

### 动态版本

```toml
[project]
dynamic = ["version"]

[tool.setuptools.dynamic]
version = {attr = "my_package.__version__"}
```

## 构建包

### 安装构建工具

```bash
pip install build twine
```

### 构建命令

```bash
# 构建包
python -m build

# 输出目录
dist/
├── my_package-1.0.0-py3-none-any.whl  # wheel
└── my_package-1.0.0.tar.gz            # 源码包
```

### 检查包

```bash
# 检查 wheel 文件
python -m zipfile --list dist/my_package-1.0.0-py3-none-any.whl

# 检查元数据
twine check dist/*

# 测试安装
pip install dist/my_package-1.0.0-py3-none-any.whl
```

## 发布到 PyPI

### 注册账号

1. 访问 https://pypi.org/account/register/
2. 启用双因素认证 (2FA)
3. 创建 API token

### 配置认证

```bash
# 创建 .pypirc
cat > ~/.pypirc << EOF
[distutils]
index-servers =
    pypi
    testpypi

[pypi]
username = __token__
password = pypi-... # API token

[testpypi]
username = __token__
password = pypi-... # TestPyPI token
EOF

# 设置权限
chmod 600 ~/.pypirc
```

### 发布到 TestPyPI

```bash
# 发布到测试仓库
twine upload --repository testpypi dist/*

# 测试安装
pip install --index-url https://test.pypi.org/simple/ my-package
```

### 发布到 PyPI

```bash
# 发布到正式仓库
twine upload dist/*

# 验证发布
pip install my-package
```

## MANIFEST.in

### 包含额外文件

```
# MANIFEST.in

# 包含文件
include README.md
include LICENSE
include CHANGELOG.md

# 包含特定类型
include *.txt
recursive-include docs *.rst *.md

# 排除文件
exclude .gitignore
recursive-exclude *.pyc
recursive-exclude __pycache__

# 排除目录
prune tests
prune examples
prune .github
```

## 数据文件

### package_data 配置

```toml
[tool.setuptools.package-data]
"*" = ["*.txt", "*.rst", "*.json"]
"my_package" = ["data/*.csv", "templates/*.html"]
```

### 或在 MANIFEST.in

```
# 包含数据文件
recursive-include my_package/data *.csv
recursive-include my_package/templates *.html
```

### 访问数据文件

```python
from importlib.resources import files

# 获取数据文件路径
data_file = files("my_package.data") / "example.csv"

# 读取内容
content = data_file.read_text()

# 二进制文件
binary_content = data_file.read_bytes()

# 兼容旧版本
import pkgutil
data = pkgutil.get_data("my_package", "data/example.csv")
```

## 代码签名

### GPG 签名

```bash
# 安装 GPG
# Windows: https://gnupg.org/download/
# Mac: brew install gnupg
# Linux: sudo apt install gnupg

# 生成密钥
gpg --full-generate-key

# 列出密钥
gpg --list-secret-keys

# 上传公钥到密钥服务器
gpg --keyserver keyserver.ubuntu.com --send-keys KEY_ID

# 签名包
gpg --detach-sign -a dist/my_package-1.0.0.tar.gz

# 上传签名
twine upload dist/my_package-1.0.0.tar.gz dist/my_package-1.0.0.tar.gz.asc
```

## 最佳实践

::: tip 打包建议

1. **使用 src 布局**：避免测试导入问题
2. **完整元数据**：提供详细的项目信息
3. **语义化版本**：遵循 SemVer 规范
4. **CHANGELOG**：记录版本变更
5. **先测试**：在 TestPyPI 测试

::: tip 发布检查清单

```bash
# 运行测试
pytest

# 代码检查
black . --check
isort . --check-only
mypy src/

# 构建检查
python -m build
twine check dist/*

# 测试安装
pip install dist/*.whl
python -c "import my_package; print(my_package.__version__)"
```

::: tip 版本号位置

```python
# 单一真相源 (Single Source of Truth)
# my_package/__init__.py
__version__ = "1.0.0"

# pyproject.toml
[tool.setuptools.dynamic]
version = {attr = "my_package.__version__"}

# 或使用环境变量
[project]
version = "1.0.0"
```

::: tip 持续集成

```yaml
# .github/workflows/publish.yml
name: Publish to PyPI

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install build tools
        run: pip install build twine

      - name: Build package
        run: python -m build

      - name: Publish to PyPI
        env:
          TWINE_USERNAME: __token__
          TWINE_PASSWORD: ${{ secrets.PYPI_API_TOKEN }}
        run: twine upload dist/*
```
