---
title: 依赖管理
icon: ri:links-line
order: 2
---

# 依赖管理

依赖管理是 Python 项目工程化的重要组成部分。

## pip 基础

### requirements.txt

```txt
# 基础格式
requests>=2.28.0
flask==2.3.0
django~=4.2.0
numpy>=1.24.0,<2.0.0

# 包含 extras
pytest[testing]>=7.0.0
requests[security]==2.28.0

# 从 URL 安装
package @ https://github.com/user/repo/archive/main.zip

# 本地包
-e ./local_package

# 版本约束
# == 精确版本
# >= 最低版本
# <= 最高版本
# ~= 兼容版本 (1.2.3 ~= 1.2, >=1.2.0, ==1.2.*
# != 排除版本
```

### requirements 分层

```txt
# requirements/base.txt
django==4.2.0
requests>=2.28.0
psycopg2-binary>=2.9.0

# requirements/development.txt
-r base.txt
pytest>=7.0.0
black>=22.0.0
mypy>=0.950

# requirements/production.txt
-r base.txt
gunicorn>=20.1.0
sentry-sdk>=1.20.0
```

## 虚拟环境

### venv 使用

```bash
# 创建虚拟环境
python -m venv .venv

# 激活虚拟环境
# Linux/Mac
source .venv/bin/activate

# Windows
.venv\Scripts\activate

# 退出虚拟环境
deactivate

# 删除虚拟环境
rm -rf .venv
```

### virtualenv

```bash
# 安装
pip install virtualenv

# 创建虚拟环境
virtualenv .venv
virtualenv -p python3.11 .venv

# 使用方式与 venv 相同
```

## pipenv

### 基础使用

```bash
# 安装 pipenv
pip install pipenv

# 创建虚拟环境并安装依赖
pipenv install requests

# 指定 Python 版本
pipenv --python 3.11

# 安装开发依赖
pipenv install pytest --dev

# 从 requirements.txt 安装
pipenv install -r requirements.txt

# 激活虚拟环境
pipenv shell

# 运行命令
pipenv run python script.py
pipenv run pytest
```

### Pipfile 配置

```toml
[[source]]
url = "https://pypi.org/simple"
verify_ssl = true
name = "pypi"

[packages]
requests = ">=2.28.0"
flask = "~=2.3.0"

[dev-packages]
pytest = ">=7.0.0"
black = ">=22.0.0"
mypy = ">=0.950"

[requires]
python_version = "3.11"

[pipenv]
allow_prereleases = false
```

## poetry

### 安装和初始化

```bash
# 安装 poetry
pip install poetry
curl -sSL https://install.python-poetry.org | python3 -

# 创建新项目
poetry new my-project
cd my-project

# 在现有项目中初始化
poetry init
```

### 基础使用

```bash
# 添加依赖
poetry add requests
poetry add pytest --group dev

# 安装依赖
poetry install

# 安装特定组
poetry install --with dev

# 更新依赖
poetry update
poetry update requests

# 激活虚拟环境
# Linux/Mac
source $(poetry env info --path)/bin/activate

# Windows
$(poetry env info --path)\Scripts\activate

# 运行命令
poetry run python script.py
poetry run pytest

# 构建
poetry build

# 发布
poetry publish
```

### pyproject.toml 配置

```toml
[tool.poetry]
name = "my-project"
version = "1.0.0"
description = "My project description"
authors = ["Your Name <your.email@example.com>"]
readme = "README.md"
packages = [{include = "my_project"}]

[tool.poetry.dependencies]
python = "^3.8"
requests = "^2.28.0"
flask = "^2.3.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.0.0"
black = "^22.0.0"
mypy = "^0.950"

[tool.poetry.scripts]
my-cli = "my_project.cli:main"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

## conda

### 基础使用

```bash
# 创建环境
conda create -n myenv python=3.11

# 激活环境
conda activate myenv

# 退出环境
conda deactivate

# 安装包
conda install numpy pandas
conda install requests  # 从 conda-forge
pip install some-package  # 不在 conda 中的包

# 导出环境
conda env export > environment.yml

# 从文件创建环境
conda env create -f environment.yml
```

### environment.yml

```yaml
name: myenv
channels:
  - conda-forge
  - defaults
dependencies:
  - python=3.11
  - numpy>=1.24.0
  - pandas>=2.0.0
  - pip
  - pip:
    - requests>=2.28.0
    - flask>=2.3.0
```

## uv (现代工具)

### 基础使用

```bash
# 安装 uv
pip install uv

# 创建项目
uv init my-project
cd my-project

# 添加依赖
uv add requests
uv add --dev pytest

# 安装依赖
uv sync

# 运行命令
uv run python script.py
uv run pytest

# 构建
uv build

# 发布
uv publish
```

### pyproject.toml 配置

```toml
[project]
name = "my-project"
version = "1.0.0"
description = "My project"
requires-python = ">=3.8"
dependencies = [
    "requests>=2.28.0",
    "flask>=2.3.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "black>=22.0.0",
]

[tool.uv]
dev-dependencies = [
    "pytest>=7.0.0",
    "black>=22.0.0",
]
```

## 依赖锁定

### 版本锁定策略

```txt
# requirements.txt (生产环境)
# 精确锁定版本
django==4.2.0
requests==2.28.0
urllib3==1.26.0

# requirements.in (开发环境)
# 灵活版本约束
django>=4.2.0,<5.0.0
requests>=2.28.0
```

### pip-tools 使用

```bash
# 安装
pip install pip-tools

# requirements.in
django>=4.2.0
requests>=2.28.0

# 生成 requirements.txt
pip-compile requirements.in

# 升级依赖
pip-compile --upgrade requirements.in
```

## 最佳实践

::: tip 依赖管理建议

1. **分层管理**：分离生产和开发依赖
2. **版本锁定**：生产环境精确锁定
3. **虚拟环境**：每个项目独立环境
4. **文档记录**：记录依赖安装原因
5. **定期更新**：定期检查和更新依赖

::: tip 工具选择

| 场景 | 推荐工具 |
|------|----------|
| 简单脚本 | venv + pip |
| Web 应用 | poetry |
| 数据科学 | conda |
| 企业项目 | pipenv |
| 现代项目 | uv |

::: tip 安全考虑

```bash
# 审计依赖安全性
pip install pip-audit
pip-audit

# 检查过期包
pip list --outdated

# 使用 requirements 编译
pip-compile requirements.in --upgrade
```

::: tip 性能优化

```bash
# 使用缓存
pip install --cache-dir /path/to/cache package

# 并行安装
pip install --use-pep517 package

# 使用 uv 加速
# uv 比 pip 快 10-100 倍
uv sync
```
