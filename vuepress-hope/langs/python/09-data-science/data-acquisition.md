---
title: 数据获取
icon: ri:download-cloud-2-line
order: 4
---

# 数据获取

数据获取是数据科学的第一步，Python 提供了多种方式获取各种来源的数据。

## 文件数据

### CSV 文件

```python
import pandas as pd

# 读取 CSV
df = pd.read_csv("data.csv")

# 指定分隔符
df = pd.read_csv("data.tsv", sep="\t")

# 指定编码
df = pd.read_csv("data.csv", encoding="utf-8")

# 跳过行和指定列
df = pd.read_csv("data.csv", skiprows=1, usecols=["col1", "col2"])

# 写入 CSV
df.to_csv("output.csv", index=False)
```

### Excel 文件

```python
# 读取 Excel
df = pd.read_excel("data.xlsx", sheet_name="Sheet1")

# 读取多个表
excel_file = pd.ExcelFile("data.xlsx")
df1 = pd.read_excel(excel_file, "Sheet1")
df2 = pd.read_excel(excel_file, "Sheet2")

# 写入 Excel
with pd.ExcelWriter("output.xlsx") as writer:
    df1.to_excel(writer, sheet_name="Sheet1", index=False)
    df2.to_excel(writer, sheet_name="Sheet2", index=False)
```

### JSON 文件

```python
import json

# 读取 JSON
with open("data.json", "r") as f:
    data = json.load(f)

# 使用 Pandas
df = pd.read_json("data.json")

# 写入 JSON
with open("output.json", "w") as f:
    json.dump(data, f, indent=2)

# 使用 Pandas
df.to_json("output.json", orient="records", indent=2)
```

## Web API

### requests 库

```python
import requests

# GET 请求
response = requests.get("https://api.example.com/data")
data = response.json()

# 带参数的请求
params = {"page": 1, "limit": 10}
response = requests.get("https://api.example.com/data", params=params)

# 带认证的请求
headers = {"Authorization": "Bearer your-token"}
response = requests.get("https://api.example.com/data", headers=headers)

# POST 请求
payload = {"name": "Alice", "age": 25}
response = requests.post("https://api.example.com/users", json=payload)

# 处理响应
if response.status_code == 200:
    data = response.json()
else:
    print(f"Error: {response.status_code}")
```

### RESTful API

```python
import requests

# 基础 URL
base_url = "https://api.github.com"

# 获取用户信息
response = requests.get(f"{base_url}/users/octocat")
user_data = response.json()

# 获取仓库列表
response = requests.get(f"{base_url}/users/octocat/repos")
repos = response.json()

# 分页
page = 1
while True:
    response = requests.get(
        f"{base_url}/users/octocat/repos",
        params={"page": page, "per_page": 100}
    )
    repos = response.json()
    if not repos:
        break
    process_repos(repos)
    page += 1
```

### 异步请求

```python
import aiohttp
import asyncio

async def fetch_data(session, url):
    async with session.get(url) as response:
        return await response.json()

async def main():
    urls = [
        "https://api.example.com/data1",
        "https://api.example.com/data2",
        "https://api.example.com/data3",
    ]

    async with aiohttp.ClientSession() as session:
        tasks = [fetch_data(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

# 运行
# results = asyncio.run(main())
```

## 网页抓取

### requests + BeautifulSoup

```python
import requests
from bs4 import BeautifulSoup

# 获取网页
url = "https://example.com"
response = requests.get(url)
html = response.text

# 解析 HTML
soup = BeautifulSoup(html, "html.parser")

# 查找元素
title = soup.find("title").text

# 查找多个元素
links = soup.find_all("a", class_="link")

# 提取属性和文本
for link in links:
    href = link.get("href")
    text = link.text.strip()
    print(f"{text}: {href}")

# CSS 选择器
elements = soup.select("div.container > p.description")
```

### Scrapy 框架

```python
import scrapy

class MySpider(scrapy.Spider):
    name = "myspider"
    start_urls = ["https://example.com"]

    def parse(self, response):
        # 提取数据
        titles = response.css("h1.title::text").getall()
        for title in titles:
            yield {"title": title.strip()}

        # 跟随链接
        for href in response.css("a::attr(href)"):
            yield response.follow(href, self.parse)
```

### Selenium 动态网页

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# 创建浏览器
driver = webdriver.Chrome()

# 访问网页
driver.get("https://example.com")

# 等待元素加载
wait = WebDriverWait(driver, 10)
element = wait.until(
    EC.presence_of_element_located((By.ID, "my-element"))
)

# 交互
element.click()
search_box = driver.find_element(By.NAME, "q")
search_box.send_keys("Python")
search_box.submit()

# 获取数据
data = driver.page_source

# 关闭浏览器
driver.quit()
```

## 数据库数据

### SQL 数据库

```python
import sqlite3
import pandas as pd

# 连接数据库
conn = sqlite3.connect("database.db")

# 读取数据
df = pd.read_sql_query("SELECT * FROM users", conn)

# 使用 SQLAlchemy
from sqlalchemy import create_engine

engine = create_engine("postgresql://user:password@localhost/dbname")
df = pd.read_sql_query("SELECT * FROM users", engine)

# 写入数据
df.to_sql("new_table", conn, if_exists="replace", index=False)
```

### MongoDB

```python
from pymongo import MongoClient

# 连接 MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["mydb"]
collection = db["users"]

# 读取数据
users = collection.find({"age": {"$gt": 25}})
df = pd.DataFrame(list(users))

# 写入数据
data = {"name": "Alice", "age": 25, "email": "alice@example.com"}
collection.insert_one(data)
```

## 大数据平台

### HDFS (Hadoop)

```python
from pyarrow import fs

# 连接 HDFS
hdfs = fs.HadoopFileSystem(host="localhost", port=8020)

# 读取文件
with hdfs.open("/path/to/file.csv", "rb") as f:
    df = pd.read_csv(f)

# 写入文件
with hdfs.open("/path/to/output.csv", "wb") as f:
    df.to_csv(f, index=False)
```

### Spark (PySpark)

```python
from pyspark.sql import SparkSession

# 创建 Spark 会话
spark = SparkSession.builder \
    .appName("MyApp") \
    .getOrCreate()

# 读取数据
df = spark.read.csv("hdfs://path/to/data.csv", header=True, inferSchema=True)

# 基本操作
df.show()
df.printSchema()
df.count()

# SQL 查询
df.createOrReplaceTempView("table")
result = spark.sql("SELECT * FROM table WHERE age > 25")
result.show()

# 写入数据
df.write.csv("hdfs://path/to/output.csv", mode="overwrite")

# 停止会话
spark.stop()
```

## 数据清洗

### 处理缺失值

```python
import pandas as pd

# 检查缺失值
print(df.isnull().sum())

# 删除缺失值
df_clean = df.dropna()

# 填充缺失值
df["column"] = df["column"].fillna(0)
df["column"] = df["column"].fillna(method="ffill")

# 插值
df["column"] = df["column"].interpolate()
```

### 处理异常值

```python
# 使用 IQR 方法检测异常值
Q1 = df["column"].quantile(0.25)
Q3 = df["column"].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

# 标记异常值
df["is_outlier"] = (df["column"] < lower_bound) | (df["column"] > upper_bound)

# 删除异常值
df_clean = df[df["is_outlier"] == False]
```

### 数据转换

```python
# 类型转换
df["date"] = pd.to_datetime(df["date"])
df["amount"] = pd.to_numeric(df["amount"])

# 标准化
df["normalized"] = (df["column"] - df["column"].mean()) / df["column"].std()

# One-Hot 编码
df_encoded = pd.get_dummies(df, columns=["category"])
```

## 数据获取最佳实践

::: tip 数据获取原则

1. **尊重 API**：遵守速率限制和使用条款
2. **错误处理**：优雅处理网络错误
3. **缓存数据**：避免重复获取相同数据
4. **增量更新**：只获取新数据
5. **验证数据**：检查数据完整性

::: tip 性能优化

```python
# 并发请求
import concurrent.futures

def fetch_url(url):
    response = requests.get(url)
    return response.json()

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    results = executor.map(fetch_url, urls)
```

::: tip 数据存储

```python
# 使用 Parquet 格式（高效）
df.to_parquet("data.parquet", index=False)

# 压缩存储
df.to_csv("data.csv.gz", compression="gzip", index=False)

# 分块存储大文件
chunk_size = 100000
for i, chunk in enumerate(pd.read_csv("large.csv", chunksize=chunk_size)):
    chunk.to_parquet(f"data_chunk_{i}.parquet", index=False)
```

::: tip 调试技巧

```python
# 打印请求信息
import logging

logging.basicConfig(level=logging.DEBUG)
requests.get("https://api.example.com/data")

# 检查响应头
print(response.headers)
print(response.status_code)
print(response.text[:1000])  # 前 1000 字符
```

::: tip 安全考虑

1. **API 密钥**：使用环境变量存储
2. **验证证书**：HTTPS 和证书验证
3. **输入验证**：验证用户输入
4. **限流**：实现速率限制
5. **日志**：记录访问日志但不记录敏感信息
