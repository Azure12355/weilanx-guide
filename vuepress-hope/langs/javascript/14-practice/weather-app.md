---
title: 天气应用
icon: ri:sun-cloudy-line
order: 2
---

# 天气应用

通过构建一个功能完整的天气应用，学习 API 集成和异步数据处理。

## 项目概述

### 功能需求

```javascript
// 天气应用功能列表

// 核心功能
// 1. 获取天气
//    - 根据城市名称搜索
//    - 自动定位当前位置
//    - 显示实时天气数据

// 2. 天气展示
//    - 温度、湿度、风速
//    - 天气图标和描述
//    - 体感温度

// 3. 未来预报
//    - 7 天天气预报
//    - 24 小时预报
//    - 图表可视化

// 4. 历史记录
//    - 保存搜索历史
//    - 快速切换城市
//    - 本地存储

// 高级功能
// 5. 单位切换
//    - 摄氏度/华氏度
//    - 公里/英里

// 6. 背景变化
//    - 根据天气变化
//    - 白天/夜晚模式
//    - 渐变动画

// 7. 错误处理
//    - 网络错误提示
//    - 城市未找到
//    - API 限流处理
```

### 项目结构

```javascript
// 项目结构

weather-app/
├── index.html          # 主 HTML 文件
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── app.js          # 主应用逻辑
│   ├── weather.js      # Weather API 封装
│   ├── storage.js      # 存储管理
│   └── ui.js           # UI 渲染
└── README.md           # 项目说明

// 技术栈
// - 原生 JavaScript（ES6+）
// - OpenWeatherMap API
// - Fetch API
// - LocalStorage
// - CSS3 动画
```

## 项目实现

### HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>天气应用</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <!-- 搜索区域 -->
        <div class="search-section">
            <div class="search-box">
                <input
                    type="text"
                    id="city-input"
                    placeholder="输入城市名称..."
                    autocomplete="off"
                >
                <button id="search-btn">
                    <span class="icon">🔍</span>
                </button>
                <button id="location-btn" title="使用当前位置">
                    <span class="icon">📍</span>
                </button>
            </div>
            <div class="unit-toggle">
                <button class="unit-btn active" data-unit="metric">°C</button>
                <button class="unit-btn" data-unit="imperial">°F</button>
            </div>
        </div>

        <!-- 历史记录 -->
        <div class="history-section" id="history-section" style="display: none;">
            <div class="history-title">最近搜索</div>
            <div class="history-list" id="history-list">
                <!-- 历史记录动态生成 -->
            </div>
        </div>

        <!-- 加载状态 -->
        <div class="loading" id="loading" style="display: none;">
            <div class="spinner"></div>
            <p>获取天气数据...</p>
        </div>

        <!-- 错误提示 -->
        <div class="error" id="error" style="display: none;">
            <span class="error-icon">⚠️</span>
            <p id="error-message"></p>
        </div>

        <!-- 当前天气 -->
        <div class="weather-card" id="weather-card" style="display: none;">
            <div class="weather-header">
                <div>
                    <h2 class="city-name" id="city-name">--</h2>
                    <p class="weather-date" id="weather-date">--</p>
                </div>
                <div class="weather-icon">
                    <img id="weather-icon" src="" alt="天气图标">
                </div>
            </div>

            <div class="weather-temp">
                <span class="temp-value" id="temp-value">--</span>
                <span class="temp-unit">°C</span>
            </div>

            <p class="weather-desc" id="weather-desc">--</p>

            <div class="weather-details">
                <div class="detail-item">
                    <span class="detail-icon">💧</span>
                    <div>
                        <p class="detail-label">湿度</p>
                        <p class="detail-value" id="humidity">--%</p>
                    </div>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">💨</span>
                    <div>
                        <p class="detail-label">风速</p>
                        <p class="detail-value" id="wind-speed">-- km/h</p>
                    </div>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">🌡️</span>
                    <div>
                        <p class="detail-label">体感</p>
                        <p class="detail-value" id="feels-like">--°</p>
                    </div>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">👁️</span>
                    <div>
                        <p class="detail-label">能见度</p>
                        <p class="detail-value" id="visibility">-- km</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 天气预报 -->
        <div class="forecast-section" id="forecast-section" style="display: none;">
            <h3 class="forecast-title">7 天预报</h3>
            <div class="forecast-list" id="forecast-list">
                <!-- 预报动态生成 -->
            </div>
        </div>
    </div>

    <script src="js/storage.js"></script>
    <script src="js/weather.js"></script>
    <script src="js/ui.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
```

### CSS 样式

```css
/* css/style.css */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    min-height: 100vh;
    padding: 20px;
    transition: background 0.5s ease;
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
}

body.night {
    background: linear-gradient(135deg, #2d3436 0%, #000000 100%);
}

body.rain {
    background: linear-gradient(135deg, #636e72 0%, #2d3436 100%);
}

body.cloudy {
    background: linear-gradient(135deg, #b2bec3 0%, #636e72 100%);
}

.container {
    max-width: 600px;
    margin: 0 auto;
}

/* 搜索区域 */
.search-section {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
}

.search-box {
    flex: 1;
    display: flex;
    gap: 10px;
}

#city-input {
    flex: 1;
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.9);
}

#city-input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.search-btn,
.location-btn {
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: transform 0.2s;
}

.search-btn:hover,
.location-btn:hover {
    transform: scale(1.05);
}

.search-btn .icon,
.location-btn .icon {
    font-size: 1.2rem;
}

.unit-toggle {
    display: flex;
    gap: 5px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 4px;
}

.unit-btn {
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: white;
    cursor: pointer;
    transition: all 0.3s;
}

.unit-btn.active {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
}

/* 历史记录 */
.history-section {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 15px;
    margin-bottom: 20px;
}

.history-title {
    color: white;
    font-weight: 600;
    margin-bottom: 10px;
}

.history-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.history-item {
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    color: white;
    cursor: pointer;
    transition: background 0.3s;
    font-size: 0.9rem;
}

.history-item:hover {
    background: rgba(255, 255, 255, 0.5);
}

/* 加载状态 */
.loading {
    text-align: center;
    padding: 40px;
    color: white;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* 错误提示 */
.error {
    background: rgba(231, 76, 60, 0.9);
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    color: white;
}

.error-icon {
    font-size: 2rem;
    display: block;
    margin-bottom: 10px;
}

/* 天气卡片 */
.weather-card {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 30px;
    margin-bottom: 20px;
    color: white;
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.weather-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.city-name {
    font-size: 2rem;
    margin-bottom: 5px;
}

.weather-date {
    opacity: 0.8;
    font-size: 0.9rem;
}

.weather-icon img {
    width: 80px;
    height: 80px;
}

.weather-temp {
    text-align: center;
    margin: 30px 0;
}

.temp-value {
    font-size: 5rem;
    font-weight: 300;
}

.temp-unit {
    font-size: 2rem;
    opacity: 0.8;
}

.weather-desc {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 30px;
    opacity: 0.9;
}

.weather-details {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
}

.detail-item {
    text-align: center;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
}

.detail-icon {
    font-size: 1.5rem;
    display: block;
    margin-bottom: 8px;
}

.detail-label {
    font-size: 0.8rem;
    opacity: 0.8;
    margin-bottom: 5px;
}

.detail-value {
    font-weight: 600;
}

/* 预报区域 */
.forecast-section {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 20px;
    color: white;
}

.forecast-title {
    margin-bottom: 15px;
}

.forecast-list {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
}

.forecast-item {
    text-align: center;
    padding: 15px 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
}

.forecast-day {
    font-size: 0.85rem;
    opacity: 0.8;
    margin-bottom: 8px;
}

.forecast-icon img {
    width: 40px;
    height: 40px;
}

.forecast-temps {
    margin-top: 8px;
    font-size: 0.9rem;
}

.forecast-max {
    font-weight: 600;
}

.forecast-min {
    opacity: 0.7;
}

/* 响应式 */
@media (max-width: 600px) {
    .weather-details {
        grid-template-columns: repeat(2, 1fr);
    }

    .forecast-list {
        grid-template-columns: repeat(4, 1fr);
    }

    .temp-value {
        font-size: 4rem;
    }
}
```

### Weather API 封装

```javascript
// js/weather.js

class WeatherAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    // 获取当前天气
    async getCurrentWeather(city, units = 'metric') {
        const url = `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${this.apiKey}`;
        return this.fetchData(url);
    }

    // 根据坐标获取天气
    async getWeatherByCoords(lat, lon, units = 'metric') {
        const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${this.apiKey}`;
        return this.fetchData(url);
    }

    // 获取预报
    async getForecast(city, units = 'metric') {
        const url = `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${this.apiKey}`;
        return this.fetchData(url);
    }

    // 根据坐标获取预报
    async getForecastByCoords(lat, lon, units = 'metric') {
        const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${this.apiKey}`;
        return this.fetchData(url);
    }

    // 通用数据获取
    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // 处理天气数据
    processCurrentWeather(data) {
        return {
            city: data.name,
            country: data.sys.country,
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
            visibility: Math.round(data.visibility / 1000), // m to km
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            weatherCode: data.weather[0].id
        };
    }

    // 处理预报数据
    processForecast(data) {
        const dailyData = {};

        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toDateString();

            if (!dailyData[dateKey]) {
                dailyData[dateKey] = {
                    date: date,
                    temps: [],
                    icons: [],
                    descriptions: []
                };
            }

            dailyData[dateKey].temps.push(item.main.temp);
            dailyData[dateKey].icons.push(item.weather[0].icon);
            dailyData[dateKey].descriptions.push(item.weather[0].description);
        });

        return Object.values(dailyData).slice(0, 7).map(day => ({
            date: day.date,
            tempMin: Math.round(Math.min(...day.temps)),
            tempMax: Math.round(Math.max(...day.temps)),
            icon: day.icons[Math.floor(day.icons.length / 2)],
            description: day.descriptions[Math.floor(day.descriptions.length / 2)]
        }));
    }
}

export default WeatherAPI;
```

### 存储管理

```javascript
// js/storage.js

class Storage {
    constructor() {
        this.HISTORY_KEY = 'weather_history';
        this.SETTINGS_KEY = 'weather_settings';
    }

    // 获取历史记录
    getHistory() {
        const history = localStorage.getItem(this.HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    }

    // 添加历史记录
    addToHistory(city) {
        let history = this.getHistory();
        history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
        history.unshift(city);
        history = history.slice(0, 10);
        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    }

    // 清除历史记录
    clearHistory() {
        localStorage.removeItem(this.HISTORY_KEY);
    }

    // 获取设置
    getSettings() {
        const settings = localStorage.getItem(this.SETTINGS_KEY);
        return settings ? JSON.parse(settings) : { unit: 'metric' };
    }

    // 保存设置
    saveSettings(settings) {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    }
}

export default Storage;
```

### UI 渲染

```javascript
// js/ui.js

class WeatherUI {
    constructor() {
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.errorMessage = document.getElementById('error-message');
        this.weatherCard = document.getElementById('weather-card');
        this.forecastSection = document.getElementById('forecast-section');
        this.historySection = document.getElementById('history-section');
        this.historyList = document.getElementById('history-list');
    }

    showLoading() {
        this.loading.style.display = 'block';
        this.error.style.display = 'none';
        this.weatherCard.style.display = 'none';
        this.forecastSection.style.display = 'none';
    }

    hideLoading() {
        this.loading.style.display = 'none';
    }

    showError(message) {
        this.hideLoading();
        this.errorMessage.textContent = message;
        this.error.style.display = 'block';
        this.weatherCard.style.display = 'none';
        this.forecastSection.style.display = 'none';
    }

    hideError() {
        this.error.style.display = 'none';
    }

    renderWeather(weather, unit) {
        this.hideLoading();
        this.hideError();

        document.getElementById('city-name').textContent = `${weather.city}, ${weather.country}`;
        document.getElementById('weather-date').textContent = this.formatDate(new Date());
        document.getElementById('temp-value').textContent = weather.temp;
        document.getElementById('weather-desc').textContent =
            this.capitalizeFirst(weather.description);
        document.getElementById('humidity').textContent = `${weather.humidity}%`;
        document.getElementById('wind-speed').textContent = `${weather.windSpeed} km/h`;
        document.getElementById('feels-like').textContent = `${weather.feelsLike}°`;
        document.getElementById('visibility').textContent = `${weather.visibility} km`;

        const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
        document.getElementById('weather-icon').src = iconUrl;

        const tempUnit = unit === 'metric' ? '°C' : '°F';
        document.querySelector('.temp-unit').textContent = tempUnit;

        this.updateBackground(weather.weatherCode);

        this.weatherCard.style.display = 'block';
    }

    renderForecast(forecast) {
        const forecastList = document.getElementById('forecast-list');
        forecastList.innerHTML = '';

        forecast.forEach(day => {
            const item = document.createElement('div');
            item.className = 'forecast-item';
            item.innerHTML = `
                <p class="forecast-day">${this.formatDay(day.date)}</p>
                <img src="https://openweathermap.org/img/wn/${day.icon}.png"
                     alt="${day.description}">
                <p class="forecast-temps">
                    <span class="forecast-max">${day.tempMax}°</span>
                    <span class="forecast-min">${day.tempMin}°</span>
                </p>
            `;
            forecastList.appendChild(item);
        });

        this.forecastSection.style.display = 'block';
    }

    renderHistory(history, onCitySelect) {
        this.historyList.innerHTML = '';
        if (history.length === 0) {
            this.historySection.style.display = 'none';
            return;
        }

        history.forEach(city => {
            const item = document.createElement('span');
            item.className = 'history-item';
            item.textContent = city;
            item.addEventListener('click', () => onCitySelect(city));
            this.historyList.appendChild(item);
        });

        this.historySection.style.display = 'block';
    }

    updateBackground(weatherCode) {
        document.body.classList.remove('night', 'rain', 'cloudy');

        if (weatherCode >= 200 && weatherCode < 600) {
            document.body.classList.add('rain');
        } else if (weatherCode >= 801) {
            document.body.classList.add('cloudy');
        }
    }

    formatDate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('zh-CN', options);
    }

    formatDay(date) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return '今天';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return '明天';
        }
        return date.toLocaleDateString('zh-CN', { weekday: 'short' });
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

export default WeatherUI;
```

### 应用逻辑

```javascript
// js/app.js

import WeatherAPI from './weather.js';
import Storage from './storage.js';
import WeatherUI from './ui.js';

class WeatherApp {
    constructor(apiKey) {
        this.api = new WeatherAPI(apiKey);
        this.storage = new Storage();
        this.ui = new WeatherUI();

        this.currentCity = null;
        this.currentUnit = this.storage.getSettings().unit;

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadHistory();
        this.updateUnitButtons();
    }

    bindEvents() {
        // 搜索按钮
        document.getElementById('search-btn').addEventListener('click', () => {
            this.handleSearch();
        });

        // 回车搜索
        document.getElementById('city-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // 定位按钮
        document.getElementById('location-btn').addEventListener('click', () => {
            this.handleLocation();
        });

        // 单位切换
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentUnit = e.target.dataset.unit;
                this.storage.saveSettings({ unit: this.currentUnit });
                this.updateUnitButtons();
                if (this.currentCity) {
                    this.loadWeather(this.currentCity);
                }
            });
        });
    }

    async handleSearch() {
        const input = document.getElementById('city-input');
        const city = input.value.trim();
        if (!city) return;

        await this.loadWeather(city);
        input.value = '';
    }

    async handleLocation() {
        if (!navigator.geolocation) {
            this.ui.showError('您的浏览器不支持地理定位');
            return;
        }

        this.ui.showLoading();

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await this.loadWeatherByCoords(latitude, longitude);
            },
            (error) => {
                this.ui.showError('无法获取您的位置');
            }
        );
    }

    async loadWeather(city) {
        try {
            this.ui.showLoading();
            this.currentCity = city;

            // 获取当前天气
            const currentData = await this.api.getCurrentWeather(city, this.currentUnit);
            const weather = this.api.processCurrentWeather(currentData);
            this.ui.renderWeather(weather, this.currentUnit);

            // 获取预报
            const forecastData = await this.api.getForecast(city, this.currentUnit);
            const forecast = this.api.processForecast(forecastData);
            this.ui.renderForecast(forecast);

            // 保存历史
            this.storage.addToHistory(city);
            this.loadHistory();

        } catch (error) {
            if (error.message.includes('404')) {
                this.ui.showError('未找到该城市');
            } else {
                this.ui.showError('获取天气数据失败，请稍后重试');
            }
        }
    }

    async loadWeatherByCoords(lat, lon) {
        try {
            this.ui.showLoading();

            const currentData = await this.api.getWeatherByCoords(lat, lon, this.currentUnit);
            const weather = this.api.processCurrentWeather(currentData);
            this.ui.renderWeather(weather, this.currentUnit);

            const forecastData = await this.api.getForecastByCoords(lat, lon, this.currentUnit);
            const forecast = this.api.processForecast(forecastData);
            this.ui.renderForecast(forecast);

            this.currentCity = weather.city;
            this.storage.addToHistory(weather.city);
            this.loadHistory();

        } catch (error) {
            this.ui.showError('获取天气数据失败，请稍后重试');
        }
    }

    loadHistory() {
        const history = this.storage.getHistory();
        this.ui.renderHistory(history, (city) => this.loadWeather(city));
    }

    updateUnitButtons() {
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.unit === this.currentUnit);
        });
    }
}

// 初始化应用（替换 YOUR_API_KEY 为你的 OpenWeatherMap API 密钥）
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp('YOUR_API_KEY');
});
```

## 项目总结

### 技术要点

```javascript
// 技术要点总结

// 1. API 集成
// - Fetch API
// - 异步数据处理
// - 错误处理
// - API 密钥管理

// 2. 异步编程
// - async/await
// - Promise 链式调用
// - 错误捕获
// - 并发请求

// 3. DOM 操作
// - 动态内容渲染
// - 事件监听
// - 状态管理
// - UI 更新

// 4. 数据处理
// - JSON 解析
// - 数据转换
// - 数据聚合
// - 日期格式化

// 5. 用户体验
// - 加载状态
// - 错误提示
// - 历史记录
// - 响应式设计
```

### API 使用说明

```javascript
// OpenWeatherMap API 注册和使用

// 1. 注册账号
// - 访问 https://openweathermap.org/api
// - 注册免费账号
// - 获取 API 密钥

// 2. API 端点
// 当前天气: /weather
// 天气预报: /forecast
// 参数: q=城市名, units=metric/imperial, appid=密钥

// 3. 天气代码
// 2xx: 雷暴
// 3xx: 毛毛雨
// 5xx: 雨
// 6xx: 雪
// 7xx: 雾
// 800: 晴
// 80x: 云

// 4. 免费限制
// - 60 次/分钟
// - 1,000,000 次/月
```

### 扩展功能

```javascript
// 可扩展功能

// 1. 图表展示
// - 使用 Chart.js
// - 温度趋势图
// - 降水概率图

// 2. 地图集成
// - Leaflet.js
// - 天气图层
// - 多城市对比

// 3. 通知功能
// - 天气预警
// - 每日天气推送
// - 使用 Notification API

// 4. 离线支持
// - Service Worker
// - 缓存策略
// - 离线数据

// 5. 多语言
// - i18n 支持
// - 动态切换语言
// - 本地化日期格式
```

::: tip 天气应用检查清单

- [ ] 完成 HTML 结构
- [ ] 完成 CSS 样式
- [ ] 实现 Weather API 封装
- [ ] 实现存储管理
- [ ] 实现 UI 渲染
- [ ] 实现应用逻辑
- [ ] 注册 API 密钥
- [ ] 测试应用功能
- [ ] 扩展应用功能

:::

::: tip 下一步

学习聊天应用 → [聊天应用](./chat-app.md)
:::
