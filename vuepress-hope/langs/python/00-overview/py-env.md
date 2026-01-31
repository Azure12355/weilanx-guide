---
title: 环境安装配置
icon: ri:download-cloud-2-line.svg
order: 2
---

# 环境安装配置

## Python 安装

### Windows 安装

1. **下载安装包**
   - 访问 [Python 官网](https://www.python.org/downloads/)
   - 下载 Python 3.12.x 安装包

2. **安装配置**
   ```powershell
   # 勾选 "Add Python to PATH"
   # 或手动添加到系统环境变量
   ```

3. **验证安装**
   ```powershell
   python --version
   pip --version
   ```

### macOS 安装

```bash
# 使用 Homebrew 安装
brew install python@3.12

# 验证安装
python3 --version
pip3 --version
```

### Linux 安装

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3.12 python3-pip

# CentOS/RHEL
sudo yum install python3.12 python3-pip

# 验证安装
python3 --version
pip3 --version
```

## 虚拟环境

### venv（推荐）

```bash
# 创建虚拟环境
python -m venv .venv

# 激活虚拟环境
# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

# 退出虚拟环境
deactivate
```

### virtualenv

```bash
# 安装 virtualenv
pip install virtualenv

# 创建虚拟环境
virtualenv .venv

# 激活
source .venv/bin/activate
```

### conda

```bash
# 创建环境
conda create -n myenv python=3.12

# 激活环境
conda activate myenv

# 退出环境
conda deactivate
```

## 包管理

### pip 基本用法

```bash
# 安装包
pip install requests

# 指定版本
pip install requests==2.31.0

# 卸载包
pip uninstall requests

# 列出已安装的包
pip list

# 导出依赖
pip freeze > requirements.txt

# 安装依赖
pip install -r requirements.txt
```

### requirements.txt

```txt
# requirements.txt
requests==2.31.0
flask>=3.0.0
numpy~=1.24.0
pandas>=2.0.0,<3.0.0
```

### pip 高级用法

```bash
# 升级 pip
python -m pip install --upgrade pip

# 查看包信息
pip show requests

# 搜索包
pip search requests

# 清理缓存
pip cache purge

# 国内镜像源
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple requests
```

## IDE 配置

### VS Code

1. **安装扩展**
   - Python（Microsoft）
   - Pylance
   - Python Test Explorer

2. **配置 settings.json**
   ```json
   {
       "python.defaultInterpreterPath": "/path/to/python",
       "python.formatting.provider": "black",
       "python.linting.enabled": true,
       "python.linting.pylintEnabled": true
   }
   ```

3. **快捷键**
   - `Ctrl+` 打开终端
   - `F5` 运行脚本
   - `Ctrl+Shift+P` 命令面板

### PyCharm

1. **配置解释器**
   - Settings → Project → Python Interpreter
   - 选择虚拟环境

2. **代码风格**
   - Settings → Editor → Code Style → Python
   - 配置 Line Length、Imports 等

3. **快捷键**
   - `Ctrl+Enter` 运行当前文件
   - `Shift+F10` 运行配置
   - `Alt+Enter` 显示操作菜单

### Jupyter Notebook

```bash
# 安装 Jupyter
pip install jupyter

# 启动 Jupyter
jupyter notebook

# 或使用 JupyterLab
pip install jupyterlab
jupyter lab
```

## 代码格式化工具

### Black

```bash
# 安装
pip install black

# 格式化代码
black .

# 配置 pyproject.toml
[tool.black]
line-length = 88
target-version = ['py312']
```

### isort

```bash
# 安装
pip install isort

# 整理导入
isort .

# 配置
[tool.isort]
profile = "black"
line_length = 88
```

### Ruff

```bash
# 安装
pip install ruff

# 快速格式化和检查
ruff check .
ruff format .
```

## 类型检查

### mypy

```bash
# 安装
pip install mypy

# 类型检查
mypy .

# 配置
[tool.mypy]
python_version = "3.12"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
```

## 项目模板

```bash
# 使用 cookiecutter 创建项目
pip install cookiecutter

# Python 项目模板
cookiecutter https://github.com/audreyfeldroy/cookiecutter-pypackage
```

## 环境变量

### .env 文件

```bash
# .env
DATABASE_URL=postgresql://localhost/mydb
API_KEY=secret_key_here
DEBUG=True
```

### python-dotenv

```python
# 安装
# pip install python-dotenv

from dotenv import load_dotenv
import os

load_dotenv()

database_url = os.getenv("DATABASE_URL")
api_key = os.getenv("API_KEY")
```

## 多版本管理

### pyenv（macOS/Linux）

```bash
# 安装 pyenv
curl https://pyenv.run | bash

# 安装 Python 版本
pyenv install 3.12.0
pyenv install 3.11.0

# 切换版本
pyenv global 3.12.0
pyenv local 3.11.0  # 当前目录
```

## 最佳实践

::: tip 建议

1. **使用虚拟环境**：隔离项目依赖
2. **requirements.txt**：记录所有依赖
3. **代码格式化**：使用 Black 统一风格
4. **类型提示**：提高代码可读性
5. **版本控制**：.gitignore 排除虚拟环境
:::

::: warning 注意

1. 不要使用 sudo pip 安装包
2. 不要混用 pip 和 conda
3. 定期更新依赖包
4. 使用国内镜像加速安装
:::
