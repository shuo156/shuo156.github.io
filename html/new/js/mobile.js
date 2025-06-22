// mobile..js

class MobileOptimizer {
    constructor() {
        this.isAndroid = /Android/i.test(navigator.userAgent);
        this.currentUser = 'shuo156'; // 当前用户
        this.lastUpdateTime = '2025-06-22 09:18:30'; // 最后更新时间
        
        this.init();
    }

    init() {
        this.setupViewport();
        this.setupTouchHandlers();
        this.setupKeyboardHandling();
        this.setupGestures();
        this.setupPerformanceOptimizations();
        this.setupAndroidSpecifics();
        this.setupOfflineSupport();
    }

    setupViewport() {
        // 优化viewport设置
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        }

        // 处理安全区域
        document.body.style.paddingTop = 'env(safe-area-inset-top)';
        document.body.style.paddingBottom = 'env(safe-area-inset-bottom)';
    }

    setupTouchHandlers() {
        // 触摸事件优化
        document.addEventListener('touchstart', (e) => {
            // 防止300ms点击延迟
            e.target.style.touchAction = 'manipulation';
        }, { passive: true });

        // 双指缩放处理
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // 改善触摸反馈
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-tap-highlight-color: transparent;
            }
            
            .touch-feedback {
                position: relative;
                overflow: hidden;
            }
            
            .touch-feedback::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 5px;
                height: 5px;
                background: rgba(255, 255, 255, 0.5);
                opacity: 0;
                border-radius: 100%;
                transform: scale(1, 1) translate(-50%, -50%);
                transform-origin: 50% 50%;
            }
            
            .touch-feedback:active::after {
                opacity: 1;
                transform: scale(20, 20) translate(-50%, -50%);
                transition: transform 0.5s, opacity 1s;
            }
        `;
        document.head.appendChild(style);
    }

    setupKeyboardHandling() {
        // 软键盘处理
        const inputs = document.querySelectorAll('input, textarea');
        const originalHeight = window.innerHeight;

        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            if (currentHeight < originalHeight) {
                // 软键盘打开
                document.body.style.height = `${currentHeight}px`;
                document.body.scrollTop = document.body.scrollHeight;
            } else {
                // 软键盘关闭
                document.body.style.height = '100%';
            }
        });

        // 自动滚动到输入框
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
    }

    setupGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        let isScrolling = false;

        // 手势导航
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isScrolling = false;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!touchStartX || !touchStartY) return;

            const deltaX = e.touches[0].clientX - touchStartX;
            const deltaY = e.touches[0].clientY - touchStartY;

            // 判断是否为横向滑动
            if (!isScrolling && Math.abs(deltaX) > Math.abs(deltaY)) {
                if (Math.abs(deltaX) > 50) {
                    // 触发返回操作
                    if (deltaX > 0) {
                        window.history.back();
                    }
                    touchStartX = 0;
                    touchStartY = 0;
                }
            } else {
                isScrolling = true;
            }
        }, { passive: true });
    }

    setupPerformanceOptimizations() {
        // 使用 requestIdleCallback 进行非关键任务调度
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.preloadAssets();
                this.cleanupMemory();
            });
        }

        // 使用 IntersectionObserver 优化滚动性能
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.dataset.src) {
                        entry.target.src = entry.target.dataset.src;
                        entry.target.removeAttribute('data-src');
                    }
                }
            });
        }, {
            threshold: 0.1
        });

        // 观察懒加载元素
        document.querySelectorAll('[data-src]').forEach(el => observer.observe(el));
    }

    setupAndroidSpecifics() {
        if (this.isAndroid) {
            // 处理 Android 返回键
            document.addEventListener('backbutton', (e) => {
                e.preventDefault();
                if (document.querySelector('.modal.active')) {
                    // 关闭模态框
                    this.closeActiveModal();
                } else if (window.history.length > 1) {
                    window.history.back();
                } else {
                    // 询问是否退出应用
                    this.showExitPrompt();
                }
            }, false);

            // 优化滚动性能
            const style = document.createElement('style');
            style.textContent = `
                .scroll-container {
                    -webkit-overflow-scrolling: touch;
                    overflow-y: scroll;
                    overscroll-behavior: contain;
                    scroll-behavior: smooth;
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupOfflineSupport() {
        // 注册 Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        }

        // 添加离线存储支持
        const dbName = 'webCatOfflineDB';
        const dbVersion = 1;
        let db;

        const request = indexedDB.open(dbName, dbVersion);
        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.error);
        };

        request.onsuccess = (event) => {
            db = event.target.result;
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('files')) {
                db.createObjectStore('files', { keyPath: 'path' });
            }
        };
    }

    // 实用工具方法
    closeActiveModal() {
        const modal = document.querySelector('.modal.active');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showExitPrompt() {
        const prompt = document.createElement('div');
        prompt.className = 'exit-prompt modal active';
        prompt.innerHTML = `
            <div class="modal-content">
                <h3>确认退出？</h3>
                <div class="button-group">
                    <button onclick="navigator.app.exitApp()">退出</button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(prompt);
    }

    preloadAssets() {
        // 预加载关键资源
        const assets = [
            '/icons/icon-192.png',
            '/fonts/main.ttf'
        ];

        assets.forEach(asset => {
            const preload = document.createElement('link');
            preload.rel = 'preload';
            preload.as = asset.endsWith('.ttf') ? 'font' : 'image';
            preload.href = asset;
            document.head.appendChild(preload);
        });
    }

    cleanupMemory() {
        // 清理不需要的资源
        setInterval(() => {
            // 清理未使用的DOM元素
            document.querySelectorAll('.temporary').forEach(el => {
                if (!el.isVisible()) {
                    el.remove();
                }
            });

            // 清理过期的缓存数据
            if ('caches' in window) {
                caches.keys().then(cacheNames => {
                    cacheNames.forEach(cacheName => {
                        if (cacheName.startsWith('old-')) {
                            caches.delete(cacheName);
                        }
                    });
                });
            }
        }, 300000); // 每5分钟执行一次
    }

    // 电池优化
    setupBatteryOptimizations() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                battery.addEventListener('levelchange', () => {
                    if (battery.level <= 0.15) {
                        // 低电量模式
                        this.enablePowerSavingMode();
                    }
                });
            });
        }
    }

    enablePowerSavingMode() {
        // 降低动画频率
        document.body.classList.add('power-saving');
        
        // 减少后台任务
        this.reduceBackgroundTasks();
        
        // 降低刷新率
        this.reduceRefreshRate();
    }

    reduceBackgroundTasks() {
        // 暂停非必要的定时器
        clearInterval(this.cleanupInterval);
        
        // 减少数据同步频率
        this.syncInterval = 60000; // 延长同步间隔
    }

    reduceRefreshRate() {
        // 使用 CSS 降低动画帧率
        const style = document.createElement('style');
        style.textContent = `
            .power-saving * {
                animation-duration: 0.5s !important;
                transition-duration: 0.5s !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// 初始化移动端优化
const mobileOptimizer = new MobileOptimizer();

// 添加到全局作用域
window.mobileOptimizer = mobileOptimizer;