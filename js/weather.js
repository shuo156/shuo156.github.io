// weather.js
function initWeather() {
    // 创建天气显示元素
    if (!document.getElementById('weather-display')) {
        const weatherDiv = document.createElement('div');
        weatherDiv.id = 'weather-display';
        weatherDiv.className = 'weather-info';
        weatherDiv.innerHTML = '正在获取天气信息...';
        
        // 将天气显示元素插入到时间显示元素后面
        const timeDiv = document.getElementById('current-time');
        if (timeDiv) {
            timeDiv.parentNode.insertBefore(weatherDiv, timeDiv.nextSibling);
        }
    }

    // 获取天气数据
    function getWeather(lat, lon) {
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`)
            .then(response => response.json())
            .then(data => {
                const weather = data.current_weather;
                const temperature = weather.temperature;
                document.getElementById('weather-display').innerHTML = 
                    `当前位置温度: ${temperature}°C`;
            })
            .catch(error => {
                document.getElementById('weather-display').innerHTML = 
                    '无法获取天气信息';
            });
    }

    // 获取位置信息
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                getWeather(position.coords.latitude, position.coords.longitude);
            },
            function(error) {
                // 位置获取失败时使用IP定位
                fetch('https://ipapi.co/json/')
                    .then(response => response.json())
                    .then(data => {
                        getWeather(data.latitude, data.longitude);
                    })
                    .catch(error => {
                        document.getElementById('weather-display').innerHTML = 
                            '无法获取位置信息';
                    });
            }
        );
    } else {
        document.getElementById('weather-display').innerHTML = 
            '您的浏览器不支持地理定位';
    }
}

// 页面加载完成后初始化天气功能
document.addEventListener('DOMContentLoaded', initWeather);