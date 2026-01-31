---
title: 单元测试
icon: ri:test-tube-line
order: 1
---

# 单元测试

单元测试是验证代码最小可测试单元（函数、方法、类）的正确性的重要实践。

## unittest 框架

### 基本测试

```python
import unittest

def add(a, b):
    return a + b

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

class TestMathOperations(unittest.TestCase):
    def test_add(self):
        """测试加法"""
        self.assertEqual(add(2, 3), 5)
        self.assertEqual(add(-1, 1), 0)
        self.assertEqual(add(0, 0), 0)

    def test_divide(self):
        """测试除法"""
        self.assertEqual(divide(10, 2), 5)
        self.assertEqual(divide(5, 2), 2.5)

    def test_divide_by_zero(self):
        """测试除零异常"""
        with self.assertRaises(ValueError):
            divide(10, 0)

if __name__ == "__main__":
    unittest.main()
```

### 断言方法

```python
class TestAssertions(unittest.TestCase):
    def test_equality(self):
        # 相等性断言
        self.assertEqual(1 + 1, 2)
        self.assertNotEqual(1 + 1, 3)

    def test_boolean(self):
        # 布尔断言
        self.assertTrue(1 < 2)
        self.assertFalse(1 > 2)

    def test_comparison(self):
        # 比较断言
        self.assertGreater(5, 3)
        self.assertLess(3, 5)
        self.assertGreaterEqual(5, 5)
        self.assertLessEqual(3, 3)

    def test_membership(self):
        # 成员断言
        self.assertIn(3, [1, 2, 3])
        self.assertNotIn(4, [1, 2, 3])

    def test_identity(self):
        # 身份断言
        a = [1, 2, 3]
        b = a
        self.assertIs(a, b)
        self.assertIsNot(a, [1, 2, 3])

    def test_none(self):
        # None 断言
        self.assertIsNone(None)
        self.assertIsNotNone(0)

    def test_exceptions(self):
        # 异常断言
        def raise_error():
            raise ValueError("Error")

        self.assertRaises(ValueError, raise_error)
        with self.assertRaises(ValueError) as cm:
            raise_error()
        self.assertEqual(str(cm.exception), "Error")

    def test_almost_equal(self):
        # 近似相等（浮点数）
        self.assertAlmostEqual(1.1 + 2.2, 3.3, places=7)
        self.assertAlmostEquals(0.1 + 0.2, 0.3, delta=0.0001)

    def test_collection(self):
        # 集合断言
        self.assertCountEqual([1, 2, 3], [3, 2, 1])
        self.assertListEqual([1, 2], [1, 2])
        self.assertTupleEqual((1, 2), (1, 2))
        self.assertSetEqual({1, 2}, {2, 1})

    def test_dict(self):
        # 字典断言
        self.assertDictEqual({"a": 1}, {"a": 1})
        self.assertIn("a", {"a": 1})
```

### setUp 和 tearDown

```python
class TestWithSetup(unittest.TestCase):
    def setUp(self):
        """每个测试方法前调用"""
        print("Setting up test")
        self.data = [1, 2, 3, 4, 5]

    def tearDown(self):
        """每个测试方法后调用"""
        print("Tearing down test")
        self.data = []

    @classmethod
    def setUpClass(cls):
        """整个类测试前调用一次"""
        print("Setting up class")
        cls.shared_resource = "shared"

    @classmethod
    def tearDownClass(cls):
        """整个类测试后调用一次"""
        print("Tearing down class")
        cls.shared_resource = None

    def test_sum(self):
        result = sum(self.data)
        self.assertEqual(result, 15)

    def test_length(self):
        self.assertEqual(len(self.data), 5)
```

### 跳过测试

```python
class TestSkipped(unittest.TestCase):
    @unittest.skip("Skipping this test")
    def test_skipped(self):
        self.fail("Should not run")

    @unittest.skipIf(sys.version_info < (3, 8), "Requires Python 3.8+")
    def test_skip_if(self):
        self.assertTrue(True)

    @unittest.skipUnless(sys.platform == "linux", "Linux only")
    def test_skip_unless(self):
        self.assertTrue(True)

    def test_maybe_skip(self):
        if not external_resource_available():
            self.skipTest("External resource not available")
        self.assertTrue(True)
```

## pytest 框架

### 安装和基础使用

```bash
# 安装 pytest
pip install pytest

# 运行测试
pytest                    # 运行所有测试
pytest test_file.py       # 运行指定文件
pytest test_module.py::test_function  # 运行指定测试
pytest -k "test_add"      # 运行匹配的测试
pytest -v                # 详细输出
pytest -s                # 显示 print 输出
pytest -x                # 遇到失败停止
pytest --tb=short        # 简短的 traceback
```

### 基本测试

```python
# test_math.py

def add(a, b):
    return a + b

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

def test_divide():
    assert divide(10, 2) == 5
    assert divide(5, 2) == 2.5

def test_divide_by_zero():
    with pytest.raises(ValueError):
        divide(10, 0)
```

### pytest 参数化

```python
import pytest

@pytest.mark.parametrize("a, b, expected", [
    (2, 3, 5),
    (0, 0, 0),
    (-1, 1, 0),
    (100, 200, 300),
])
def test_add(a, b, expected):
    assert add(a, b) == expected

# 多参数组合
@pytest.mark.parametrize("x", [1, 2, 3])
@pytest.mark.parametrize("y", [10, 20])
def test_combinations(x, y):
    assert x + y > 0
# 测试: (1,10), (1,20), (2,10), (2,20), (3,10), (3,20)
```

### pytest fixtures

```python
import pytest

# 简单 fixture
@pytest.fixture
def sample_data():
    return [1, 2, 3, 4, 5]

def test_sum(sample_data):
    assert sum(sample_data) == 15

# 带 setup/teardown 的 fixture
@pytest.fixture
def database():
    """Setup"""
    db = {"users": []}
    yield db
    """Teardown"""
    db.clear()

def test_database(database):
    database["users"].append("Alice")
    assert len(database["users"]) == 1

# fixture 作用域
@pytest.fixture(scope="module")
def module_resource():
    print("Module setup")
    resource = {"value": 42}
    yield resource
    print("Module teardown")

# fixture 参数化
@pytest.fixture(params=[1, 2, 3])
def number(request):
    return request.param

def test_number(number):
    assert number > 0
```

### pytest 断言

```python
def test_assertions():
    # 基本断言
    assert 1 + 1 == 2
    assert True
    assert False is False
    assert None is None

    # 消息
    assert 1 + 1 == 3, "One plus one should equal two"

    # 近似相等
    assert 0.1 + 0.2 == pytest.approx(0.3, rel=1e-9)

    # 集合
    assert {1, 2, 3} & {2, 3, 4} == {2, 3}

    # 异常
    with pytest.raises(ValueError) as exc_info:
        raise ValueError("Error message")
    assert str(exc_info.value) == "Error message"

    # 警告
    import warnings
    with pytest.warns(UserWarning):
        warnings.warn("Warning message")

    # 大约相等
    assert 1.00001 == pytest.approx(1)
    assert [1.0, 2.0, 3.0] == pytest.approx([1.0, 2.0, 3.0])
```

### pytest 插件和标记

```python
import pytest

# 自定义标记
@pytest.mark.slow
def test_slow_operation():
    import time
    time.sleep(2)

@pytest.mark.fast
def test_fast_operation():
    assert True

@pytest.mark.integration
def test_database():
    assert True

# 运行特定标记
# pytest -m slow
# pytest -m "not slow"

# skip 和 xfail
@pytest.mark.skip(reason="Not implemented yet")
def test_not_implemented():
    pass

@pytest.mark.skipif(sys.version_info < (3, 8), reason="Requires Python 3.8+")
def test_python38_feature():
    assert True

@pytest.mark.xfail(reason="Known issue")
def test_known_failure():
    assert False  # 预期失败，不算测试失败
```

### pytest hooks

```python
# conftest.py

import pytest

@pytest.fixture(autouse=True)
def setup_teardown():
    """自动应用的 fixture"""
    print("\nSetup")
    yield
    print("Teardown")

def pytest_configure(config):
    """配置阶段"""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow"
    )

def pytest_collection_modifyitems(config, items):
    """修改收集的测试"""
    for item in items:
        # 自动为所有测试添加标记
        item.add_marker(pytest.mark.unit)

def pytest_runtest_setup(item):
    """每个测试前"""
    print(f"Setting up {item.name}")

def pytest_runtest_teardown(item):
    """每个测试后"""
    print(f"Tearing down {item.name}")

def pytest_report_header(config):
    """自定义报告头"""
    return "Custom Test Suite"
```

## Mock 和 Patch

### unittest.mock

```python
from unittest.mock import Mock, patch, MagicMock

def get_user_from_db(user_id):
    """模拟数据库查询"""
    # 实际代码会查询数据库
    return {"id": user_id, "name": "Alice"}

def test_with_mock():
    # 创建 mock 对象
    mock_db = Mock()
    mock_db.get_user.return_value = {"id": 1, "name": "Alice"}

    user = mock_db.get_user(1)
    assert user["name"] == "Alice"

    # 验证调用
    mock_db.get_user.assert_called_once_with(1)

def test_with_patch():
    # patch 装饰器
    with patch("__main__.get_user_from_db") as mock_get_user:
        mock_get_user.return_value = {"id": 1, "name": "Bob"}

        user = get_user_from_db(1)
        assert user["name"] == "Bob"

        mock_get_user.assert_called_once_with(1)

def test_patch_class():
    from unittest.mock import patch

    class Database:
        def get_user(self, user_id):
            return {"id": user_id, "name": "Alice"}

    # patch 类方法
    with patch.object(Database, "get_user", return_value={"id": 1, "name": "Bob"}):
        db = Database()
        user = db.get_user(1)
        assert user["name"] == "Bob"

def test_mock_side_effect():
    mock_func = Mock()
    mock_func.side_effect = [1, 2, 3, ValueError("Error")]

    assert mock_func() == 1
    assert mock_func() == 2
    assert mock_func() == 3

    with pytest.raises(ValueError):
        mock_func()

def test_magic_mock():
    # MagicMock 支持魔法方法
    mock_dict = MagicMock()
    mock_dict.__getitem__.return_value = "value"
    mock_dict.__len__.return_value = 5

    assert mock_dict["key"] == "value"
    assert len(mock_dict) == 5
```

### pytest-mock

```python
# pip install pytest-mock

def test_with_pytest_mock(mocker):
    """使用 pytest 的 mocker fixture"""
    # patch 函数
    mock_func = mocker.patch("module.function")
    mock_func.return_value = 42

    result = module.function()
    assert result == 42

    # patch 类属性
    mock_obj = mocker.patch.object(SomeClass, "attribute", 100)

    # spy：监视调用
    spy = mocker.spy(module, "function")

    # stub：替换实现
    stub = mocker.stub(name="stub")
```

## 测试覆盖

### coverage.py

```bash
# 安装
pip install coverage

# 运行测试并收集覆盖率
coverage run -m pytest
coverage report          # 报告
coverage report -m       # 带百分比
coverage html            # HTML 报告
coverage xml             # XML 报告
```

### pytest-cov

```bash
# 安装
pip install pytest-cov

# 运行测试并显示覆盖率
pytest --cov=my_module tests/
pytest --cov=my_module --cov-report=html
pytest --cov=my_module --cov-report=term-missing
```

### 分支覆盖

```python
# .coveragerc

[run]
source = my_module
branch = True
omit =
    */tests/*
    */__init__.py

[report]
exclude_lines =
    pragma: no cover
    def __repr__
    raise AssertionError
    raise NotImplementedError
    if __name__ == .__main__.:
```

## 测试最佳实践

::: tip 测试原则

1. ** arrange-act-assert**：组织测试代码
2. **独立性**：每个测试应该独立
3. **可重复**：测试结果应该一致
4. **快速**：测试应该快速运行
5. **清晰**：测试名称应该描述清楚

::: tip AAA 模式

```python
def test_user_authentication():
    # Arrange（准备）
    user = User(username="alice", password="password123")
    database = Database()

    # Act（执行）
    result = database.authenticate(user)

    # Assert（断言）
    assert result is True
```

::: tip 命名规范

```python
# ✅ 好的命名
def test_add_two_positive_numbers():
    assert add(2, 3) == 5

def test_divide_by_zero_raises_error():
    with pytest.raises(ValueError):
        divide(10, 0)

# ❌ 不好的命名
def test_1():
    assert add(2, 3) == 5

def test_error():
    with pytest.raises(ValueError):
        divide(10, 0)
```

::: tip 测试组织

```
tests/
├── unit/           # 单元测试
│   ├── test_models.py
│   └── test_utils.py
├── integration/    # 集成测试
│   ├── test_api.py
│   └── test_database.py
└── e2e/           # 端到端测试
    └── test_workflow.py
```

::: tip 持续集成

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.8, 3.9, 3.10, 3.11]

    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: ${{ matrix.python-version }}
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install pytest pytest-cov
    - name: Run tests
      run: |
        pytest --cov=my_module --cov-report=xml
    - name: Upload coverage
      uses: codecov/codecov-action@v2
```
