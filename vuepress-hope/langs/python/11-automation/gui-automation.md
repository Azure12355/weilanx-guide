---
title: GUI 自动化
icon: ri:mouse-line
order: 3
---

# GUI 自动化

GUI 自动化通过模拟用户操作来自动化桌面应用程序和浏览器操作。

## PyAutoGUI

### 基础操作

```python
import pyautogui
import time

# 获取屏幕尺寸
screen_width, screen_height = pyautogui.size()
print(f"屏幕尺寸: {screen_width} x {screen_height}")

# 获取鼠标位置
current_x, current_y = pyautogui.position()
print(f"鼠标位置: ({current_x}, {current_y})")

# 移动鼠标
pyautogui.moveTo(100, 100, duration=0.5)  # 绝对位置
pyautogui.moveRel(50, 0, duration=0.3)     # 相对移动

# 点击
pyautogui.click(x=100, y=100)              # 单击
pyautogui.doubleClick(x=200, y=200)        # 双击
pyautogui.rightClick(x=300, y=300)         # 右键

# 拖动
pyautogui.dragTo(400, 400, duration=1)     # 绝对拖动
pyautogui.dragRel(100, 0, duration=0.5)    # 相对拖动
```

### 键盘操作

```python
import pyautogui

# 输入文本
pyautogui.write('Hello, World!', interval=0.05)

# 按键
pyautogui.press('enter')
pyautogui.press('tab')
pyautogui.press('space')

# 组合键
pyautogui.hotkey('ctrl', 'c')   # 复制
pyautogui.hotkey('ctrl', 'v')   # 粘贴
pyautogui.hotkey('ctrl', 'a')   # 全选
pyautogui.hotkey('ctrl', 's')   # 保存

# 特殊按键
pyautogui.press('f1')           # 功能键
pyautogui.press('esc')          # ESC
pyautogui.press('delete')       # Delete
```

### 屏幕操作

```python
import pyautogui

# 截图
screenshot = pyautogui.screenshot()
screenshot.save('screenshot.png')

# 区域截图
region_screenshot = pyautogui.screenshot(region=(0, 0, 300, 400))

# 查找图像
location = pyautogui.locateOnScreen('button.png')
if location:
    center = pyautogui.center(location)
    pyautogui.click(center)

# 查找所有匹配
locations = pyautogui.locateAllOnScreen('icon.png')
for location in locations:
    center = pyautogui.center(location)
    pyautogui.click(center)
```

### 安全措施

```python
import pyautogui

# 启用故障保护
pyautogui.FAILSAFE = True

# 设置操作暂停
pyautogui.PAUSE = 0.5

# 紧急停止：移动鼠标到屏幕左上角

# 防止检测（添加随机性）
import random

def human_like_click(x, y):
    # 添加随机偏移
    offset_x = random.randint(-5, 5)
    offset_y = random.randint(-5, 5)

    # 随机移动时间
    duration = random.uniform(0.2, 0.5)

    pyautogui.click(x + offset_x, y + offset_y, duration=duration)
```

## Selenium

### 基础使用

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# 创建浏览器
driver = webdriver.Chrome()

# 访问页面
driver.get('https://www.example.com')

# 查找元素
element = driver.find_element(By.ID, 'my-id')
elements = driver.find_elements(By.CLASS_NAME, 'my-class')

# 查找方式
driver.find_element(By.ID, 'id')
driver.find_element(By.NAME, 'name')
driver.find_element(By.XPATH, '//input[@id="id"]')
driver.find_element(By.CSS_SELECTOR, '#id')
driver.find_element(By.LINK_TEXT, '链接文本')
driver.find_element(By.PARTIAL_LINK_TEXT, '部分链接')

# 元素操作
element.click()
element.send_keys('文本内容')
element.clear()
element.submit()

# 获取元素信息
text = element.text
value = element.get_attribute('value')
is_displayed = element.is_displayed()
is_enabled = element.is_enabled()

# 关闭浏览器
driver.quit()
```

### 等待策略

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

# 显式等待
wait = WebDriverWait(driver, 10)

# 等待元素出现
element = wait.until(
    EC.presence_of_element_located((By.ID, 'my-id'))
)

# 等待元素可见
element = wait.until(
    EC.visibility_of_element_located((By.ID, 'my-id'))
)

# 等待元素可点击
element = wait.until(
    EC.element_to_be_clickable((By.ID, 'my-id'))
)

# 等待文本出现
wait.until(
    EC.text_to_be_present_in_element((By.ID, 'my-id'), '预期文本')
)

# 自定义等待条件
def custom_condition(driver):
    element = driver.find_element(By.ID, 'status')
    return element.get_attribute('data-ready') == 'true'

wait.until(custom_condition)
```

### 表单处理

```python
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.by import By

# 文本输入
text_input = driver.find_element(By.NAME, 'username')
text_input.clear()
text_input.send_keys('myusername')

# 下拉选择
select_element = driver.find_element(By.NAME, 'country')
select = Select(select_element)

# 选择方式
select.select_by_visible_text('China')
select.select_by_value('cn')
select.select_by_index(1)

# 多选
select.deselect_by_visible_text('China')
select.deselect_all()

# 单选按钮和复选框
radio = driver.find_element(By.ID, 'male')
radio.click()

checkbox = driver.find_element(By.ID, 'agree')
checkbox.click()

# 检查状态
is_selected = checkbox.is_selected()
```

### 窗口和框架

```python
# 切换窗口
driver.switch_to.window(driver.window_handles[1])

# 切换框架
driver.switch_to.frame('frame_name')           # 通过名称
driver.switch_to.frame(0)                       # 通过索引
driver.switch_to.frame(driver.find_element(By.ID, 'frame_id'))

# 返回主内容
driver.switch_to.default_content()

# 窗口操作
driver.maximize_window()
driver.set_window_size(1024, 768)
driver.set_window_position(100, 100)

# 获取窗口信息
current_window = driver.current_window_handle
all_windows = driver.window_handles
```

### Cookie 和 JavaScript

```python
# Cookie 操作
cookies = driver.get_cookies()
driver.add_cookie({'name': 'key', 'value': 'value'})
cookie = driver.get_cookie('key')
driver.delete_cookie('key')
driver.delete_all_cookies()

# 执行 JavaScript
result = driver.execute_script('return document.title;')
driver.execute_script('window.scrollTo(0, document.body.scrollHeight);')

# 高级 JavaScript
js_code = '''
    var elements = document.querySelectorAll('.item');
    return Array.from(elements).map(el => el.textContent);
'''
items = driver.execute_script(js_code)
```

## Playwright

### 基础使用

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    # 启动浏览器
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()

    # 访问页面
    page.goto('https://example.com')

    # 查找元素
    element = page.query_selector('#my-id')
    elements = page.query_selector_all('.my-class')

    # 操作元素
    element.click()
    element.fill('文本内容')
    element.select_option('value')

    # 等待
    page.wait_for_selector('.loaded')
    page.wait_for_url('**/success')

    # 关闭
    browser.close()
```

### 高级功能

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(
        viewport={'width': 1920, 'height': 1080},
        user_agent='Custom User Agent'
    )
    page = context.new_page()

    # 拦截请求
    def route_handler(route):
        if route.request.resource_type == 'image':
            route.abort()
        else:
            route.continue_()

    page.route('**/*', route_handler)

    # 监听响应
    page.on('response', lambda response: print(f"状态: {response.status}"))

    # 执行脚本
    page.evaluate('() => document.title')

    # 截图和 PDF
    page.screenshot(path='screenshot.png')
    page.pdf(path='page.pdf')

    browser.close()
```

## 自动化最佳实践

::: tip GUI 自动化建议

1. **元素定位**：优先使用稳定的定位方式
2. **等待策略**：使用显式等待而非固定延迟
3. **异常处理**：优雅处理元素未找到的情况
4. **日志记录**：记录操作步骤便于调试
5. **模块化**：封装可复用的操作函数

::: tip 元素定位优先级

```python
# 最稳定
element = driver.find_element(By.ID, 'unique-id')

# 次选
element = driver.find_element(By.NAME, 'unique-name')

# 可用但易变
element = driver.find_element(By.CLASS_NAME, 'class')
element = driver.find_element(By.CSS_SELECTOR, '#id')
element = driver.find_element(By.XPATH, '//div[@class="class"]')

# 最不稳定
element = driver.find_element(By.LINK_TEXT, '点击这里')
```

::: tip 页面对象模式

```python
class LoginPage:
    def __init__(self, driver):
        self.driver = driver
        self.username_input = (By.ID, 'username')
        self.password_input = (By.ID, 'password')
        self.login_button = (By.ID, 'login-btn')

    def enter_username(self, username):
        element = self.driver.find_element(*self.username_input)
        element.clear()
        element.send_keys(username)

    def enter_password(self, password):
        element = self.driver.find_element(*self.password_input)
        element.send_keys(password)

    def click_login(self):
        element = self.driver.find_element(*self.login_button)
        element.click()

    def login(self, username, password):
        self.enter_username(username)
        self.enter_password(password)
        self.click_login()
```

::: tip 反自动化检测

```python
# 隐藏 webdriver 特征
driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
    'source': '''
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined
        })
    '''
})

# 设置 User-Agent
options.add_argument('--user-agent=Mozilla/5.0...')

# 使用代理
options.add_argument('--proxy-server=http://proxy:8080')
```

::: tip 性能优化

```python
# 禁用图片加载
chrome_options = webdriver.ChromeOptions()
prefs = {'profile.managed_default_content_settings.images': 2}
chrome_options.add_experimental_option('prefs', prefs)

# 无头模式
chrome_options.add_argument('--headless')

# 禁用 GPU
chrome_options.add_argument('--disable-gpu')
```
