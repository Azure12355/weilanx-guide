---
title: 脚本编程
icon: ri:terminal-box-line
order: 1
---

# 脚本编程

Python 脚本编程是自动化的基础，通过编写可执行的 Python 脚本完成各种系统任务。

## 命令行参数

### argparse 基础

```python
import argparse

# 创建解析器
parser = argparse.ArgumentParser(
    description='文件处理脚本',
    formatter_class=argparse.RawDescriptionHelpFormatter
)

# 添加位置参数
parser.add_argument(
    'input_file',
    help='输入文件路径'
)

# 添加可选参数
parser.add_argument(
    '-o', '--output',
    help='输出文件路径',
    default='output.txt'
)

parser.add_argument(
    '-v', '--verbose',
    help='详细输出',
    action='store_true'
)

# 解析参数
args = parser.parse_args()

print(f"输入文件: {args.input_file}")
print(f"输出文件: {args.output}")
print(f"详细模式: {args.verbose}")
```

### 高级参数

```python
import argparse

parser = argparse.ArgumentParser()

# 类型限制
parser.add_argument(
    '--count',
    type=int,
    help='重复次数',
    default=1
)

# 选择参数
parser.add_argument(
    '--mode',
    choices=['fast', 'normal', 'slow'],
    default='normal',
    help='运行模式'
)

# 多个值
parser.add_argument(
    '--files',
    nargs='+',
    help='多个文件'
)

# 计数参数
parser.add_argument(
    '-v', '--verbose',
    action='count',
    default=0,
    help='详细程度 (-v, -vv, -vvv)'
)

# 互斥参数
group = parser.add_mutually_exclusive_group()
group.add_argument('--enable', action='store_true')
group.add_argument('--disable', action='store_true')

args = parser.parse_args()
```

## 文件操作

### pathlib 使用

```python
from pathlib import Path

# 创建路径
data_dir = Path('data')
input_file = Path('data/input.txt')
output_file = Path('data/output.txt')

# 检查存在
if input_file.exists():
    print("文件存在")

# 创建目录
data_dir.mkdir(exist_ok=True)

# 遍历目录
for file in Path('data').glob('*.txt'):
    print(file.name)

# 递归遍历
for file in Path('data').rglob('*.csv'):
    print(file)

# 文件信息
file = Path('example.txt')
print(f"大小: {file.stat().st_size} bytes")
print(f"修改时间: {file.stat().st_mtime}")

# 路径操作
parent = file.parent
name = file.stem
extension = file.suffix
```

### 批量文件处理

```python
from pathlib import Path
import shutil

def batch_rename(directory, pattern, replacement):
    """批量重命名文件"""
    path = Path(directory)

    for file in path.glob('*'):
        if file.is_file():
            # 替换文件名中的模式
            new_name = file.name.replace(pattern, replacement)
            new_path = file.with_name(new_name)

            # 重命名
            file.rename(new_path)
            print(f"重命名: {file.name} -> {new_name}")

# 使用
batch_rename('./data', 'old', 'new')
```

### 文件批量操作

```python
from pathlib import Path
import shutil

def batch_convert(src_dir, dst_dir, src_ext, dst_ext):
    """批量转换文件格式"""
    src_path = Path(src_dir)
    dst_path = Path(dst_dir)
    dst_path.mkdir(exist_ok=True)

    for file in src_path.glob(f'*.{src_ext}'):
        # 读取和转换（示例）
        with open(file, 'r') as f:
            content = f.read()

        # 写入新文件
        new_file = dst_path / f'{file.stem}.{dst_ext}'
        with open(new_file, 'w') as f:
            f.write(content)

        print(f"转换: {file.name} -> {new_file.name}")

def batch_organize(source_dir):
    """按扩展名组织文件"""
    source = Path(source_dir)

    for file in source.iterdir():
        if file.is_file():
            # 创建扩展名目录
            ext_dir = source / file.suffix[1:]  # 去掉点
            ext_dir.mkdir(exist_ok=True)

            # 移动文件
            dest = ext_dir / file.name
            shutil.move(str(file), str(dest))
            print(f"移动: {file.name} -> {ext_dir.name}/")
```

## 系统操作

### 运行系统命令

```python
import subprocess

# 运行命令
result = subprocess.run(
    ['ls', '-l'],
    capture_output=True,
    text=True
)
print(result.stdout)

# 带错误处理
try:
    result = subprocess.run(
        ['invalid_command'],
        check=True,
        capture_output=True,
        text=True
    )
except subprocess.CalledProcessError as e:
    print(f"命令失败: {e}")
    print(f"错误输出: {e.stderr}")

# 管道命令
p1 = subprocess.Popen(['ls', '-l'], stdout=subprocess.PIPE)
p2 = subprocess.Popen(['grep', '.py'], stdin=p1.stdout, stdout=subprocess.PIPE)
output = p2.communicate()[0].decode()
print(output)
```

### 定时任务

```python
import schedule
import time

def job():
    print("执行定时任务...")

# 每 10 分钟执行
schedule.every(10).minutes.do(job)

# 每天特定时间执行
schedule.every().day.at("09:30").do(job)

# 每周执行
schedule.every().monday.do(job)

# 运行调度器
while True:
    schedule.run_pending()
    time.sleep(1)
```

### 后台服务

```python
import daemon
import lockfile.pidfile
import time

def run_service():
    """后台服务"""
    while True:
        # 执行任务
        print("服务运行中...")
        time.sleep(60)

# 使用守护进程
with daemon.DaemonContext(
    pidfile=lockfile.pidfile.PIDLockFile('/tmp/my_service.pid')
):
    run_service()
```

## 日志记录

### 基础日志

```python
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# 记录日志
logger.debug('调试信息')
logger.info('普通信息')
logger.warning('警告信息')
logger.error('错误信息')
logger.critical('严重错误')
```

### 高级日志配置

```python
import logging
from logging.handlers import RotatingFileHandler
import os

# 创建日志目录
log_dir = 'logs'
os.makedirs(log_dir, exist_ok=True)

# 创建 logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# 文件处理器（轮转）
file_handler = RotatingFileHandler(
    os.path.join(log_dir, 'app.log'),
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5
)
file_handler.setLevel(logging.DEBUG)

# 控制台处理器
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# 格式化
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

# 添加处理器
logger.addHandler(file_handler)
logger.addHandler(console_handler)
```

## 配置管理

### JSON 配置

```python
import json
from pathlib import Path

# 读取配置
def load_config(config_path='config.json'):
    with open(config_path, 'r') as f:
        return json.load(f)

# 保存配置
def save_config(config, config_path='config.json'):
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)

# 使用
config = {
    'database': {
        'host': 'localhost',
        'port': 5432,
        'name': 'mydb'
    },
    'api': {
        'key': 'your-api-key',
        'timeout': 30
    }
}

save_config(config)
loaded_config = load_config()
```

### YAML 配置

```python
import yaml

# 读取 YAML
with open('config.yaml', 'r') as f:
    config = yaml.safe_load(f)

# 写入 YAML
with open('config.yaml', 'w') as f:
    yaml.dump(config, f, default_flow_style=False)
```

### 环境变量

```python
import os
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()

# 获取环境变量
api_key = os.getenv('API_KEY')
database_url = os.getenv('DATABASE_URL', 'default_value')

# 带验证
def get_env_var(name, default=None, required=False):
    value = os.getenv(name, default)

    if required and not value:
        raise ValueError(f"必需的环境变量 {name} 未设置")

    return value

api_key = get_env_var('API_KEY', required=True)
```

## 脚本最佳实践

::: tip 脚本编写建议

1. **使用 shebang**：指定 Python 解释器
2. **添加文档**：清晰的脚本说明
3. **错误处理**：优雅处理异常
4. **日志记录**：便于调试和追踪
5. **配置分离**：配置代码分离

::: tip shebang 示例

```bash
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
脚本说明

用途: 批量处理文件
作者: Your Name
日期: 2024-01-01
"""

import sys
from pathlib import Path

def main():
    """主函数"""
    print("脚本运行中...")

if __name__ == '__main__':
    main()
```

::: tip 错误处理模式

```python
import sys
import logging

logger = logging.getLogger(__name__)

def main():
    try:
        # 主要逻辑
        process_data()
    except KeyboardInterrupt:
        logger.info("用户中断")
        sys.exit(0)
    except Exception as e:
        logger.error(f"发生错误: {e}", exc_info=True)
        sys.exit(1)

if __name__ == '__main__':
    main()
```

::: tip 进度显示

```python
from tqdm import tqdm
import time

# 带进度的循环
for i in tqdm(range(100), desc="处理中"):
    time.sleep(0.01)

# 处理文件列表
files = list(Path('data').glob('*'))
for file in tqdm(files, desc="文件处理"):
    process_file(file)
```
