---
title: 代码质量
icon: ri:star-line
order: 4
---

# 代码质量

高质量的代码是可读、可维护、可测试的。使用工具和实践可以提升代码质量。

## 代码格式化

### Black

```bash
# 安装
pip install black

# 格式化文件
black script.py

# 格式化整个目录
black .

# 检查但不修改（dry run）
black --check script.py

# 显示差异
black --diff script.py

# 配置（pyproject.toml）
[tool.black]
line-length = 88
target-version = ['py38', 'py39']
include = '\.pyi?$'
extend-exclude = '''
/(
  # 排除目录
  \.eggs
  | \.git
  | \.venv
  | build
  | dist
)/
'''
```

### autopep8

```bash
# 安装
pip install autopep8

# 格式化文件
autopep8 script.py

# 就地修改
autopep8 --in-place script.py

# 递归处理
autopep8 --recursive --in-place .
```

### Yapf

```bash
# 安装
pip install yapf

# 格式化文件
yapf script.py

# 就地修改
yapf -i script.py

# 配置（.style.yapf）
[style]
based_on_style = pep8
indent_width = 4
spaces_before_comment = 4
```

## 代码检查

### Pylint

```bash
# 安装
pip install pylint

# 检查文件
pylint script.py

# 检查目录
pylint my_package/

# 评分（10 分制）
pylint --output-format=text script.py

# 配置（.pylintrc）
[MESSAGES CONTROL]
disable=C0111,C0103

[FORMAT]
max-line-length=88

[DESIGN]
max-args=5
```

### Flake8

```bash
# 安装
pip install flake8

# 检查文件
flake8 script.py

# 忽略特定错误
flake8 --ignore=E501,W503 script.py

# 设置最大行长度
flake8 --max-line-length=88 script.py

# 配置（.flake8）
[flake8]
max-line-length = 88
extend-ignore = E203, W503
exclude = .git,__pycache__,docs
```

### Ruff（快速）

```bash
# 安装
pip install ruff

# 检查文件
ruff check script.py

# 自动修复
ruff check --fix script.py

# 配置（pyproject.toml）
[tool.ruff]
line-length = 88
select = ["E", "F", "W"]
ignore = ["E203", "W503"]
```

## 类型检查

### mypy

```bash
# 安装
pip install mypy

# 类型检查
mypy script.py

# 检查目录
mypy my_package/

# 严格模式
mypy --strict script.py

# 配置（mypy.ini 或 pyproject.toml）
[tool.mypy]
python_version = "3.9"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
```

### 类型注解

```python
from typing import List, Dict, Optional, Union, Callable

# 基本类型注解
def add(a: int, b: int) -> int:
    return a + b

# 集合类型
def process_items(items: List[str]) -> Dict[str, int]:
    return {item: len(item) for item in items}

# Optional 类型
def find_user(user_id: int) -> Optional[Dict]:
    if user_id == 1:
        return {"name": "Alice"}
    return None

# Union 类型
def parse_value(value: Union[str, int]) -> int:
    if isinstance(value, str):
        return int(value)
    return value

# Callable 类型
def apply(func: Callable[[int, int], int], a: int, b: int) -> int:
    return func(a, b)

# 类型别名
UserId = int
UserData = Dict[str, Union[str, int]]

def get_user(user_id: UserId) -> UserData:
    return {"id": user_id, "name": "Bob"}

# 泛型
from typing import TypeVar, List

T = TypeVar("T")

def first(items: List[T]) -> T:
    return items[0]

# Protocol（结构化类型）
from typing import Protocol

class Sized(Protocol):
    def __len__(self) -> int: ...

def get_size(sized: Sized) -> int:
    return len(sized)
```

## 类型存根

### .pyi 文件

```python
# my_module.pyi（类型存根文件）

from typing import List, Optional

class User:
    id: int
    name: str
    email: str

    def __init__(self, id: int, name: str, email: str) -> None: ...

    def get_display_name(self) -> str: ...

def get_user(user_id: int) -> Optional[User]: ...

def list_users() -> List[User]: ...
```

### TypedDict

```python
from typing import TypedDict

class UserDict(TypedDict):
    id: int
    name: str
    email: str

def process_user(user: UserDict) -> str:
    return f"{user['name']} <{user['email']}>"

# 使用
user: UserDict = {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com"
}
```

## 文档字符串

### Google 风格

```python
def calculate_discount(price: float, discount_percent: float) -> float:
    """Calculate discounted price.

    Args:
        price: Original price.
        discount_percent: Discount percentage (0-100).

    Returns:
        Discounted price.

    Raises:
        ValueError: If discount_percent is not between 0 and 100.

    Examples:
        >>> calculate_discount(100, 20)
        80.0
    """
    if not 0 <= discount_percent <= 100:
        raise ValueError("Discount must be between 0 and 100")
    return price * (1 - discount_percent / 100)
```

### NumPy 风格

```python
def calculate_discount(price, discount_percent):
    """Calculate discounted price.

    Parameters
    ----------
    price : float
        Original price.
    discount_percent : float
        Discount percentage (0-100).

    Returns
    -------
    float
        Discounted price.

    Raises
    ------
    ValueError
        If discount_percent is not between 0 and 100.

    Examples
    --------
    >>> calculate_discount(100, 20)
    80.0
    """
    if not 0 <= discount_percent <= 100:
        raise ValueError("Discount must be between 0 and 100")
    return price * (1 - discount_percent / 100)
```

### reStructuredText 风格

```python
def calculate_discount(price, discount_percent):
    """Calculate discounted price.

    :param price: Original price
    :type price: float
    :param discount_percent: Discount percentage (0-100)
    :type discount_percent: float
    :return: Discounted price
    :rtype: float
    :raises ValueError: If discount_percent is not between 0 and 100
    :Example:

    >>> calculate_discount(100, 20)
    80.0
    """
    if not 0 <= discount_percent <= 100:
        raise ValueError("Discount must be between 0 and 100")
    return price * (1 - discount_percent / 100)
```

## 命名规范

### PEP 8 命名

```python
# 模块名：小写，下划线分隔
my_module.py

# 包名：小写，下划线分隔
my_package/

# 类名：大驼峰
class MyClass:
    pass

class HTTPResponse:
    pass

# 函数/方法名：小写，下划线分隔
def my_function():
    pass

def calculate_total():
    pass

# 变量名：小写，下划线分隔
user_name = "Alice"
total_amount = 100

# 常量：大写，下划线分隔
MAX_CONNECTIONS = 100
DEFAULT_TIMEOUT = 30

# 私有成员：单下划线前缀
class MyClass:
    def __init__(self):
        self._private_var = 42

    def _private_method(self):
        pass
```

### 命名最佳实践

```python
# ✅ 好的命名
def calculate_rectangle_area(width, height):
    """计算矩形面积"""
    return width * height

user_authentication_token = "abc123"

# ❌ 不好的命名
def calc(w, h):
    return w * h

uat = "abc123"

# ✅ 有意义的命名
def get_user_by_id(user_id):
    pass

# ❌ 模糊的命名
def get_data(id):
    pass
```

## 代码复杂度

### cyclomatic-complexity

```bash
# 安装
pip install mccabe

# 检查复杂度
python -m mccabe --min 5 script.py
```

```python
# 降低复杂度
# ❌ 高复杂度
def process_data(data):
    if data:
        if isinstance(data, list):
            if len(data) > 0:
                if data[0]:
                    # 嵌套太深
                    return True
    return False

# ✅ 低复杂度（提前返回）
def process_data(data):
    if not data:
        return False
    if not isinstance(data, list):
        return False
    if len(data) == 0:
        return False
    if not data[0]:
        return False
    return True
```

### radon（代码度量）

```bash
# 安装
pip install radon

# 检查复杂度
radon cc script.py -a

# 检查可维护性指数
radon mi script.py

# 生成 HTML 报告
radon cc script.py -a --html > report.html
```

## 代码审查

### 审查清单

- [ ] **命名**：变量、函数、类名清晰？
- [ ] **长度**：函数不超过 50 行？
- [ ] **复杂度**：圈复杂度小于 10？
- [ ] **重复**：没有重复代码？
- [ ] **注释**：注释解释"为什么"而非"是什么"？
- [ ] **测试**：有足够的单元测试？
- [ ] **错误处理**：异常处理得当？
- [ ] **性能**：无明显性能问题？
- [ ] **安全**：没有安全漏洞？
- [ ] **文档**：文档字符串完整？

### 审查工具

```python
# 使用 pre-commit 框架
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black

  - repo: https://github.com/pycqa/flake8
    rev: 6.0.0
    hooks:
      - id: flake8

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.3.0
    hooks:
      - id: mypy

  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort
```

## 代码质量工具

### pre-commit

```bash
# 安装
pip install pre-commit

# 配置
cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black

  - repo: https://github.com/pycqa/flake8
    rev: 6.0.0
    hooks:
      - id: flake8

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.3.0
    hooks:
      - id: mypy
        additional_dependencies: [types-all]
EOF

# 安装钩子
pre-commit install

# 手动运行
pre-commit run --all-files
```

### isort（导入排序）

```bash
# 安装
pip install isort

# 排序导入
isort script.py

# 检查
isort --check-only script.py

# 配置
[tool.isort]
profile = "black"
line_length = 88
multi_line_output = 3
include_trailing_comma = true
force_grid_wrap = 0
use_parentheses = true
ensure_newline_before_comments = true
```

### bandit（安全检查）

```bash
# 安装
pip install bandit

# 安全检查
bandit -r my_package/

# 排除测试
bandit -r my_package/ --exclude "*/tests/*"
```

## 持续质量检查

### GitHub Actions

```yaml
# .github/workflows/quality.yml
name: Code Quality

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'

    - name: Install tools
      run: |
        pip install black flake8 mypy isort bandit

    - name: Run black
      run: black --check .

    - name: Run flake8
      run: flake8 .

    - name: Run mypy
      run: mypy .

    - name: Run isort
      run: isort --check-only .

    - name: Run bandit
      run: bandit -r .
```

## 代码质量最佳实践

::: tip 代码质量原则

1. **KISS**：保持简单
2. **DRY**：不要重复自己
3. **YAGNI**：你不会需要它
4. **SOLID**：面向对象设计原则

::: tip 代码审查实践

1. **小改动**：保持 PR 小而聚焦
2. **自审查**：提交前自己先审查
3. **描述清晰**：说明为什么这样做
4. **响应反馈**：及时处理评论

::: tip 提高代码质量

1. **自动化**：使用工具自动检查
2. **测试**：编写全面的测试
3. **重构**：持续重构改进
4. **学习**：阅读优秀代码

::: tip 避免反模式

```python
# ❌ 魔法数字
def calculate_discount(price):
    return price * 0.85  # 15% 折扣

# ✅ 使用常量
DISCOUNT_RATE = 0.15

def calculate_discount(price):
    return price * (1 - DISCOUNT_RATE)

# ❌ 过长函数
def process_complex_data(data):
    # 100 行代码
    pass

# ✅ 拆分函数
def process_complex_data(data):
    validated = validate_data(data)
    transformed = transform_data(validated)
    return save_data(transformed)
```
