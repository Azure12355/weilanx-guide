---
title: 网络爬虫
icon: ri:global-line
order: 2
---

# 网络爬虫

网络爬虫是自动获取网页内容的程序，Python 提供了强大的爬虫工具链。

## 基础爬虫

### requests 使用

```python
import requests

# 基本 GET 请求
response = requests.get('https://example.com')
print(response.status_code)
print(response.text)

# 带参数请求
params = {'key': 'value', 'page': 1}
response = requests.get('https://api.example.com/data', params=params)

# 带请求头
headers = {
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'application/json'
}
response = requests.get('https://example.com', headers=headers)

# POST 请求
data = {'username': 'user', 'password': 'pass'}
response = requests.post('https://example.com/login', data=data)

# JSON 数据
json_data = {'key': 'value'}
response = requests.post('https://api.example.com', json=json_data)
```

### 会话管理

```python
# 使用会话保持状态
session = requests.Session()

# 登录
login_data = {'username': 'user', 'password': 'pass'}
session.post('https://example.com/login', data=login_data)

# 使用会话访问需要登录的页面
response = session.get('https://example.com/protected')
print(response.text)

# 设置会话请求头
session.headers.update({'User-Agent': 'My Bot 1.0'})
```

### 异常处理

```python
from requests.exceptions import RequestException
import time

def safe_get(url, max_retries=3):
    """安全的 GET 请求"""
    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return response
        except RequestException as e:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)  # 指数退避

    return None
```

## HTML 解析

### BeautifulSoup 基础

```python
from bs4 import BeautifulSoup
import requests

# 获取网页
url = 'https://example.com'
response = requests.get(url)
html = response.text

# 创建解析器
soup = BeautifulSoup(html, 'html.parser')

# 查找元素
title = soup.find('title').text
print(title)

# 查找多个元素
links = soup.find_all('a', class_='link')

# 提取链接
for link in links:
    href = link.get('href')
    text = link.text.strip()
    print(f"{text}: {href}")
```

### CSS 选择器

```python
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, 'html.parser')

# CSS 选择器
elements = soup.select('div.container > p.description')
titles = soup.select('h1.title')
items = soup.select('.item[data-id]')

# 带属性选择
elements = soup.select('a[href^="http"]')  # 以 http 开头
elements = soup.select('img[src$=".png"]')  # 以 .png 结尾

# 组合选择
elements = soup.select('div.content p.highlight')
```

### 数据提取

```python
from bs4 import BeautifulSoup
import requests

def scrape_articles(url):
    """提取文章信息"""
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    articles = []

    for item in soup.select('.article-item'):
        title = item.select_one('.title').text.strip()
        author = item.select_one('.author').text.strip()
        date = item.select_one('.date')['datetime']
        link = item.select_one('a')['href']

        articles.append({
            'title': title,
            'author': author,
            'date': date,
            'link': link
        })

    return articles
```

## 动态网页

### Selenium 基础

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# 创建浏览器
driver = webdriver.Chrome()

# 访问网页
driver.get('https://example.com')

# 查找元素
element = driver.find_element(By.ID, 'my-element')
elements = driver.find_elements(By.CLASS_NAME, 'item')

# 等待元素
wait = WebDriverWait(driver, 10)
element = wait.until(
    EC.presence_of_element_located((By.ID, 'dynamic-element'))
)

# 交互
element.click()
search_box = driver.find_element(By.NAME, 'q')
search_box.send_keys('Python')
search_box.submit()

# 获取数据
data = driver.page_source
print(data)

# 关闭浏览器
driver.quit()
```

### Playwright 使用

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # 启动浏览器
    browser = p.chromium.launch()
    page = browser.new_page()

    # 访问页面
    page.goto('https://example.com')

    # 等待元素
    page.wait_for_selector('.data-loaded')

    # 提取数据
    titles = page.query_selector_all('.title')
    for title in titles:
        print(title.text_content())

    # 关闭浏览器
    browser.close()
```

### 无头浏览器

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# 配置无头模式
chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--no-sandbox')

# 创建无头浏览器
driver = webdriver.Chrome(options=chrome_options)
driver.get('https://example.com')
print(driver.page_source)
driver.quit()
```

## Scrapy 框架

### 创建项目

```bash
# 创建项目
scrapy startproject myproject

# 创建爬虫
cd myproject
scrapy genspider myspider example.com
```

### Spider 编写

```python
import scrapy

class MySpider(scrapy.Spider):
    name = 'myspider'
    start_urls = ['https://example.com']

    def parse(self, response):
        # 提取数据
        for item in response.css('.item'):
            yield {
                'title': item.css('.title::text').get(),
                'price': item.css('.price::text').get(),
                'link': item.css('a::attr(href)').get()
            }

        # 跟随链接
        next_page = response.css('.next::attr(href)').get()
        if next_page:
            yield response.follow(next_page, self.parse)
```

### Item Pipeline

```python
class MyPipeline:
    def __init__(self):
        self.items = []

    def process_item(self, item, spider):
        # 处理数据
        item['price'] = float(item['price'].replace('$', ''))
        self.items.append(item)
        return item

    def close_spider(self, spider):
        # 爬虫结束时的操作
        save_to_database(self.items)
```

### 中间件

```python
class UserAgentMiddleware:
    def __init__(self, user_agents):
        self.user_agents = user_agents

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            user_agents=crawler.settings.get('USER_AGENTS')
        )

    def process_request(self, request, spider):
        # 随机 User-Agent
        import random
        request.headers['User-Agent'] = random.choice(self.user_agents)
```

## 爬虫最佳实践

::: tip 爬虫规范

1. **遵守 robots.txt**：尊重网站爬虫协议
2. **限制速率**：避免对服务器造成压力
3. **设置 User-Agent**：表明身份
4. **错误重试**：处理网络异常
5. **数据验证**：验证提取的数据

::: tip 速率限制

```python
import time
import random

def polite_request(url):
    # 随机延迟
    time.sleep(random.uniform(1, 3))

    response = requests.get(url)
    return response
```

::: tip 代理使用

```python
proxies = {
    'http': 'http://proxy.example.com:8080',
    'https': 'https://proxy.example.com:8080'
}

response = requests.get('https://example.com', proxies=proxies)
```

::: tip 反爬虫应对

```python
# 随机 User-Agent
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    'Mozilla/5.0 (X11; Linux x86_64)'
]

headers = {
    'User-Agent': random.choice(USER_AGENTS)
}

# 使用 Cookie
session = requests.Session()
session.cookies.set('key', 'value')

# 验证码处理（使用第三方服务）
# 可以使用 2captcha、Anti-Captcha 等服务
```

::: tip 数据存储

```python
import csv
import json
from datetime import datetime

# 保存为 CSV
def save_csv(data, filename):
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)

# 保存为 JSON
def save_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# 带时间戳的文件名
timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
filename = f'data_{timestamp}.json'
```

::: tip 法律合规

```python
# robots.txt 检查
from urllib.robotparser import RobotFileParser

def can_fetch(url, user_agent='*'):
    rp = RobotFileParser()
    rp.set_url(url + '/robots.txt')
    rp.read()
    return rp.can_fetch(user_agent, url)

# 使用
if can_fetch('https://example.com'):
    response = requests.get('https://example.com')
else:
    print(" robots.txt 禁止访问")
```
