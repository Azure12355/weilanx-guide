---
title: 文件操作
icon: ri:file-text-line
order: 2
---

# 文件操作

文件操作是处理持久化数据的基础，Python 提供了丰富的文件 I/O 功能。

## 基本文件操作

### 打开和读取文件

```python
# 打开文件
file = open("example.txt", "r")  # "r" = 读取模式
content = file.read()
print(content)
file.close()

# 使用 with 语句（推荐）
with open("example.txt", "r") as file:
    content = file.read()
# 文件自动关闭

# 读取模式
mode = {
    "r":  "读取（默认）",
    "w":  "写入（覆盖）",
    "a":  "追加",
    "r+": "读写（文件必须存在）",
    "w+": "读写（创建或覆盖）",
    "a+": "读写追加",
    "x":  "独占创建（文件存在则失败）"
}

# 二进制模式
"rb", "wb", "ab", "rb+", "wb+", "ab+"
```

### 读取方法

```python
# read()：读取全部
with open("example.txt", "r") as file:
    content = file.read()  # 整个文件作为字符串

# read(size)：读取指定字节数
with open("example.txt", "r") as file:
    chunk = file.read(1024)  # 读取 1024 字节

# readline()：读取一行
with open("example.txt", "r") as file:
    line = file.readline()
    while line:
        print(line.strip())
        line = file.readline()

# readlines()：读取所有行
with open("example.txt", "r") as file:
    lines = file.readlines()  # 返回列表
    for line in lines:
        print(line.strip())

# 遍历文件（推荐）
with open("example.txt", "r") as file:
    for line in file:
        print(line.strip())
```

### 写入文件

```python
# write()：写入字符串
with open("output.txt", "w") as file:
    file.write("Hello, World!\n")
    file.write("Second line\n")

# writelines()：写入字符串列表
lines = ["Line 1\n", "Line 2\n", "Line 3\n"]
with open("output.txt", "w") as file:
    file.writelines(lines)

# 追加模式
with open("output.txt", "a") as file:
    file.write("This will be appended\n")
```

## 文件路径

### pathlib（推荐）

```python
from pathlib import Path

# 路径创建
path = Path("documents/report.txt")
absolute = Path("/home/user/docs")
home = Path.home()  # 用户主目录
current = Path.cwd()  # 当前工作目录

# 路径操作
path = Path("docs") / "report.txt"  # 拼接路径
path = path.parent  # 父目录
path = path.name  # 文件名
path = path.stem  # 文件名（无扩展名）
path = path.suffix  # 扩展名

# 路径检查
path.exists()  # 是否存在
path.is_file()  # 是否是文件
path.is_dir()  # 是否是目录

# 创建目录
Path("new_dir").mkdir(exist_ok=True)
Path("a/b/c").mkdir(parents=True, exist_ok=True)

# 遍历目录
for item in Path(".").iterdir():
    print(f"{'DIR ' if item.is_dir() else 'FILE'} {item.name}")

# glob 模式匹配
for py_file in Path(".").glob("*.py"):
    print(py_file)

for file in Path(".").rglob("*.md"):  # 递归
    print(file)
```

### os.path（传统方式）

```python
import os

# 路径拼接
path = os.path.join("docs", "report.txt")

# 路径信息
os.path.exists(path)
os.path.isfile(path)
os.path.isdir(path)
os.path.basename(path)  # 文件名
os.path.dirname(path)   # 目录名
os.path.splitext(path)  # (root, ext)

# 获取绝对路径
os.path.abspath("file.txt")

# 当前工作目录
os.getcwd()
os.chdir("/path/to/dir")

# 目录操作
os.mkdir("new_dir")
os.makedirs("a/b/c", exist_ok=True)

# 列出目录
os.listdir(".")
```

## 文件属性

```python
import os
from pathlib import Path
from datetime import datetime

path = Path("example.txt")

# 文件大小
size = path.stat().st_size

# 时间戳
created = datetime.fromtimestamp(path.stat().st_ctime)
modified = datetime.fromtimestamp(path.stat().st_mtime)
accessed = datetime.fromtimestamp(path.stat().st_atime)

# 权限
mode = path.stat().st_mode

# 使用 os 模块
size = os.path.getsize("example.txt")
mtime = os.path.getmtime("example.txt")

# 文件详细信息
import os
def get_file_info(filepath):
    stat = os.stat(filepath)
    return {
        "size": stat.st_size,
        "created": datetime.fromtimestamp(stat.st_ctime),
        "modified": datetime.fromtimestamp(stat.st_mtime),
        "is_file": os.path.isfile(filepath),
        "is_dir": os.path.isdir(filepath),
    }
```

## 文件搜索

```python
from pathlib import Path

# 查找文件
def find_file(name, start_path="."):
    """递归查找文件"""
    for path in Path(start_path).rglob(name):
        if path.is_file():
            return path
    return None

# 查找匹配模式的文件
def find_files(pattern, start_path="."):
    """查找匹配模式的文件"""
    return list(Path(start_path).rglob(pattern))

# 使用
result = find_file("config.json")
py_files = find_files("*.py")
```

## JSON 文件

```python
import json

# 读取 JSON
with open("data.json", "r") as file:
    data = json.load(file)

# 写入 JSON
data = {"name": "Alice", "age": 25}
with open("output.json", "w") as file:
    json.dump(data, file, indent=2)

# 美化输出
with open("output.json", "w") as file:
    json.dump(data, file, indent=4, sort_keys=True, ensure_ascii=False)

# 从字符串
json_string = '{"name": "Bob"}'
data = json.loads(json_string)

# 转为字符串
data = {"name": "Charlie"}
json_string = json.dumps(data)
```

## CSV 文件

```python
import csv

# 读取 CSV
with open("data.csv", "r") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# 读取为字典
with open("data.csv", "r") as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(row["column_name"])

# 写入 CSV
data = [
    ["Name", "Age", "City"],
    ["Alice", 25, "NYC"],
    ["Bob", 30, "LA"]
]

with open("output.csv", "w", newline="") as file:
    writer = csv.writer(file)
    writer.writerows(data)

# 写入字典
with open("output.csv", "w", newline="") as file:
    fieldnames = ["name", "age", "city"]
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerow({"name": "Alice", "age": 25, "city": "NYC"})
```

## 文件编码

```python
# 检测文件编码
import chardet

with open("unknown.txt", "rb") as file:
    raw_data = file.read()
    result = chardet.detect(raw_data)
    encoding = result["encoding"]
    confidence = result["confidence"]

# 指定编码读取
with open("file.txt", "r", encoding="utf-8") as file:
    content = file.read()

# 处理编码错误
with open("file.txt", "r", encoding="utf-8", errors="ignore") as file:
    content = file.read()  # 忽略错误

with open("file.txt", "r", encoding="utf-8", errors="replace") as file:
    content = file.read()  # 替换错误字符
```

## 临时文件

```python
import tempfile
import os

# 临时文件
with tempfile.NamedTemporaryFile(mode="w", delete=False) as temp:
    temp_name = temp.name
    temp.write("Temporary data")
    print(f"Temp file: {temp_name}")

# 手动删除
os.unlink(temp_name)

# 临时目录
with tempfile.TemporaryDirectory() as temp_dir:
    print(f"Temp dir: {temp_dir}")
    # 在此使用临时目录
    # 自动清理

# 获取系统临时目录
tempfile.gettempdir()  # 如 /tmp
```

## 文件锁定

```python
import fcntl  # Unix/Linux
# Windows 使用 msvcrt 或 pywin32

def file_lock(filepath):
    """文件锁（Unix）"""
    with open(filepath, "w") as f:
        fcntl.flock(f, fcntl.LOCK_EX)  # 排他锁
        try:
            # 临界区代码
            f.write("Exclusive access")
        finally:
            fcntl.flock(f, fcntl.LOCK_UN)  # 释放锁

# 跨平台方案：使用 portalocker
import portalocker

with open("file.txt", "w") as f:
    portalocker.lock(f, portalocker.LOCK_EX)
    # 写入操作
    portalocker.unlock(f)
```

## 高级操作

### 内存文件

```python
from io import StringIO, BytesIO

# StringIO：文本内存文件
output = StringIO()
output.write("Hello")
output.write(" World")
content = output.getvalue()
output.close()

# BytesIO：二进制内存文件
output = BytesIO()
output.write(b"Binary data")
content = output.getvalue()

# 读取
input_stream = StringIO("Line 1\nLine 2\n")
for line in input_stream:
    print(line.strip())
```

### 文件压缩

```python
import gzip
import bz2
import zipfile

# Gzip 压缩
with gzip.open("file.txt.gz", "wt") as f:
    f.write("Compressed content")

# Gzip 解压
with gzip.open("file.txt.gz", "rt") as f:
    content = f.read()

# Zip 文件
with zipfile.ZipFile("archive.zip", "w") as zipf:
    zipf.write("file1.txt")
    zipf.write("file2.txt")

# 读取 Zip
with zipfile.ZipFile("archive.zip", "r") as zipf:
    # 列出文件
    print(zipf.namelist())
    # 提取文件
    zipf.extractall("extracted/")
    # 读取特定文件
    with zipf.open("file1.txt") as f:
        content = f.read()
```

### 文件比较

```python
import filecmp

# 比较文件
same = filecmp.cmp("file1.txt", "file2.txt")

# 比较目录
comparison = filecmp.dircmp("dir1", "dir2")
comparison.same_files  # 相同文件
comparison.diff_files  # 不同文件
comparison.left_only   # 只在左边
comparison.right_only  # 只在右边
```

## 最佳实践

::: tip 文件操作建议

1. **使用 with 语句**：自动关闭文件
2. **指定编码**：避免平台差异
3. **使用 pathlib**：更现代的路径处理
4. **处理异常**：文件操作可能失败
5. **检查路径**：操作前验证路径存在

::: tip 性能优化

```python
# 大文件分块读取
def read_in_chunks(file_path, chunk_size=4096):
    with open(file_path, "rb") as f:
        while chunk := f.read(chunk_size):
            yield chunk

# 使用生成器处理大文件
def process_large_file(file_path):
    with open(file_path, "r") as f:
        for line in f:
            yield process_line(line)
```

::: warning 常见陷阱

```python
# ❌ 忘记关闭文件
file = open("data.txt", "r")
content = file.read()
# 如果这里出错，文件不会关闭

# ✅ 使用 with
with open("data.txt", "r") as file:
    content = file.read()

# ❌ Windows 路径问题
path = "C:\new\test.txt"  # \n 是换行符

# ✅ 使用原始字符串或 pathlib
path = r"C:\new\test.txt"
path = Path("C:/new/test.txt")
```
