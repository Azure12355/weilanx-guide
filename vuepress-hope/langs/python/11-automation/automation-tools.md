---
title: 自动化工具
icon: ri:tools-line
order: 4
---

# 自动化工具

Python 自动化生态系统提供了丰富的工具和框架，用于各种自动化场景。

## Fabric

### 远程命令执行

```python
from fabric import Connection

# 连接远程服务器
conn = Connection(
    host='example.com',
    user='username',
    connect_kwargs={'key_filename': '/path/to/key'}
)

# 执行命令
result = conn.run('ls -l', hide=True)
print(result.stdout)

# 带环境的命令
result = conn.run('source venv/bin/activate && python script.py')

# 上传文件
conn.put('local.txt', '/remote/path/remote.txt')

# 下载文件
conn.get('/remote/path/remote.txt', 'local.txt')
```

### 任务定义

```python
from fabric import task
from invoke import Context

# 本地任务
@task
def local_build(c):
    """本地构建"""
    c.run('python setup.py build')

# 远程任务
@task
def deploy(c):
    """部署到服务器"""
    conn = Connection('user@example.com')
    with conn.cd('/var/www/myapp'):
        conn.run('git pull')
        conn.run('systemctl restart myapp')

# 多服务器部署
@task
def deploy_all(c):
    """部署到所有服务器"""
    servers = [
        'server1.example.com',
        'server2.example.com',
        'server3.example.com'
    ]

    for server in servers:
        conn = Connection(f'user@{server}')
        with conn.cd('/var/www/myapp'):
            conn.run('git pull')
            conn.run('systemctl restart myapp')
```

### 批量操作

```python
from fabric import SerialGroup as Group

# 创建服务器组
servers = Group(
    'user1@server1.com',
    'user2@server2.com',
    'user3@server3.com',
    connect_kwargs={'key_filename': 'my_key.pem'}
)

# 并行执行
results = servers.run('uptime')
for connection, result in results.items():
    print(f"{connection.host}: {result.stdout.strip()}")

# 传输文件
servers.put('deploy.tar.gz', '/tmp/')
servers.run('cd /tmp && tar -xzf deploy.tar.gz')
```

## Invoke

### 任务管理

```python
from invoke import task

# 简单任务
@task
def hello(c):
    """打印问候"""
    print("Hello, World!")

# 带参数任务
@task
def build(c, release=False):
    """构建项目"""
    cmd = 'python setup.py build'
    if release:
        cmd += ' --release'
    c.run(cmd)

# 带默认值
@task
def test(c, coverage=True, verbose=False):
    """运行测试"""
    cmd = 'pytest'
    if coverage:
        cmd += ' --cov'
    if verbose:
        cmd += ' -v'
    c.run(cmd)
```

### 任务依赖

```python
from invoke import task

# 任务前置
@task
def clean(c):
    """清理"""
    c.run('rm -rf build/ dist/')

@task(pre=[clean])
def build(c):
    """构建（先清理）"""
    c.run('python setup.py build')

# 任务后置
@task
def notify(c):
    """通知"""
    c.run('echo "Build complete"')

@task(post=[notify])
def deploy(c):
    """部署（后通知）"""
    c.run('kubectl apply -f deployment.yaml')
```

### 命名空间

```python
from invoke import Collection, task

# 数据库任务
@task
def migrate(c):
    c.run('python manage.py migrate')

@task
def reset(c):
    c.run('python manage.py reset_db')

db = Collection('db')
db.add_task(migrate)
db.add_task(reset)

# 服务器任务
@task
def start(c):
    c.run('systemctl start myapp')

@task
def stop(c):
    c.run('systemctl stop myapp')

server = Collection('server')
server.add_task(start)
server.add_task(stop)

# 主命名空间
ns = Collection()
ns.add_collection(db)
ns.add_collection(server)
```

## APScheduler

### 定时任务

```python
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
import datetime

# 创建调度器
scheduler = BlockingScheduler()

# 简单定时任务
@scheduler.scheduled_job('interval', seconds=30)
def tick():
    print(f'Tick! {datetime.datetime.now()}')

# Cron 表达式
@scheduler.scheduled_job('cron', hour='*/6')
def scheduled_job():
    print('每6小时执行一次')

# 复杂 Cron
@scheduler.scheduled_job('cron', day_of_week='mon-fri', hour=9, minute=30)
def weekday_job():
    print('工作日上午9:30执行')

# 启动调度器
try:
    scheduler.start()
except (KeyboardInterrupt, SystemExit):
    pass
```

### 异步调度

```python
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import asyncio

scheduler = AsyncIOScheduler()

async def async_job():
    print("执行异步任务")
    await asyncio.sleep(1)

scheduler.add_job(async_job, 'interval', seconds=10)

scheduler.start()

try:
    asyncio.get_event_loop().run_forever()
except KeyboardInterrupt:
    pass
```

### 任务持久化

```python
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore

# 配置任务存储
jobstores = {
    'default': SQLAlchemyJobStore(url='sqlite:///jobs.sqlite')
}

scheduler = BackgroundScheduler(jobstores=jobstores)

# 添加持久化任务
scheduler.add_job(
    my_function,
    'interval',
    seconds=3600,
    id='my_job_id',
    replace_existing=True
)

scheduler.start()
```

## Airflow

### DAG 定义

```python
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email': ['admin@example.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

dag = DAG(
    'my_etl_dag',
    default_args=default_args,
    description='ETL 流程',
    schedule_interval='0 0 * * *',  # 每天执行
    catchup=False
)

# 任务定义
extract = BashOperator(
    task_id='extract',
    bash_command='python extract_data.py',
    dag=dag
)

def transform_data(**context):
    """转换数据"""
    # 处理逻辑
    print("转换数据")

transform = PythonOperator(
    task_id='transform',
    python_callable=transform_data,
    dag=dag
)

load = BashOperator(
    task_id='load',
    bash_command='python load_data.py',
    dag=dag
)

# 任务依赖
extract >> transform >> load
```

### 传感器和转移

```python
from airflow.sensors.filesystem import FileSensor
from airflow.operators.email import EmailOperator

# 等待文件
wait_for_file = FileSensor(
    task_id='wait_for_file',
    filepath='/data/input.csv',
    poke_interval=60,  # 每60秒检查
    dag=dag
)

# 条件转移
from airflow.operators.python import BranchPythonOperator

def check_condition(**context):
    if some_condition:
        return 'process_a'
    else:
        return 'process_b'

branch = BranchPythonOperator(
    task_id='branch',
    python_callable=check_condition,
    dag=dag
)

process_a = BashOperator(task_id='process_a', bash_command='...', dag=dag)
process_b = BashOperator(task_id='process_b', bash_command='...', dag=dag)

branch >> [process_a, process_b]
```

## Prefect

### 流程定义

```python
from prefect import task, Flow
from prefect.executors import DaskExecutor

@task
def extract():
    """提取数据"""
    print("提取数据")
    return [1, 2, 3, 4, 5]

@task
def transform(data):
    """转换数据"""
    print(f"转换 {len(data)} 条数据")
    return [x * 2 for x in data]

@task
def load(data):
    """加载数据"""
    print(f"加载 {len(data)} 条数据")

# 定义流程
with Flow('my_etl_flow') as flow:
    data = extract()
    transformed = transform(data)
    load(transformed)

# 运行流程
flow.run()
```

### 调度和部署

```python
from prefect.schedules import IntervalSchedule
from datetime import timedelta

# 创建调度
schedule = IntervalSchedule(interval=timedelta(hours=1))

with Flow('scheduled_flow', schedule=schedule) as flow:
    extract_task()
    transform_task()
    load_task()

# 部署
flow.register(project_name='My Project')

# 本地运行
flow.run()
```

## 工具选择

::: tip 工具对比

| 工具 | 用途 | 适用场景 |
|------|------|----------|
| Fabric | 远程执行 | 服务器管理、部署 |
| Invoke | 本地任务 | 项目构建、测试 |
| APScheduler | 定时调度 | 周期性任务 |
| Airflow | 工作流 | 复杂 ETL 流程 |
| Prefect | 数据流 | 现代数据工程 |

::: tip 最佳实践

```python
# 错误处理
from fabric import Connection
from invoke import UnexpectedExit

try:
    conn = Connection('host')
    conn.run('command')
except UnexpectedExit as e:
    print(f"命令失败: {e.result.stderr}")

# 幂等性
@task
def deploy(c):
    """幂等部署"""
    c.run('kubectl apply -f deployment.yaml')  # 幂等

# 日志记录
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@task
def my_task(c):
    logger.info("开始执行任务")
    try:
        c.run('command')
        logger.info("任务完成")
    except Exception as e:
        logger.error(f"任务失败: {e}")
        raise
```

::: tip 监控和告警

```python
# 任务监控
from prefect.tasks.monitoring import get_task_run_state

@task
def monitor_task(task_run_id):
    state = get_task_run_state(task_run_id)
    if state.is_failed():
        send_alert(f"任务 {task_run_id} 失败")

# 健康检查
@task
def health_check(url):
    import requests
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"健康检查失败: {url}")
```
