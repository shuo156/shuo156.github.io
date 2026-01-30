/* =====================================================
   Apple Style Article UI - JavaScript
   ===================================================== */

/* ============= GLOBAL REFS ============= */

const htmlElement = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;


/* ============= SVG ICON FUNCTIONS ============= */

function setThemeIcon(isDark) {
    const btns = document.querySelectorAll('#themeToggleNav');
    
    btns.forEach(btn => {
        if (isDark) {
            // Moon Icon
            btn.innerHTML = `
            <svg class="svg-icon" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
            </svg>`;
        } else {
            // Sun Icon
            btn.innerHTML = `
            <svg class="svg-icon sun-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" fill="currentColor"/>
                <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`;
        }
    });
    
    // 也支持旧的 themeBtn ID
    const oldThemeBtn = document.getElementById('themeBtn');
    if (oldThemeBtn) {
        if (isDark) {
            oldThemeBtn.innerHTML = `
            <svg class="svg-icon" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
            </svg>`;
        } else {
            oldThemeBtn.innerHTML = `
            <svg class="svg-icon sun-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" fill="currentColor"/>
                <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`;
        }
    }
}


/* ============= THEME CORE FUNCTIONS ============= */

function applyTheme(toDark) {
    if (toDark) {
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
    
    setThemeIcon(toDark);
}


/* ============= TELEGRAM STYLE CIRCULAR TRANSITION ============= */

function toggleThemeWithTransition(event) {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    
    // 如果不支持 ViewTransition，直接切换
    if (!document.startViewTransition) {
        applyTheme(!isDark);
        return;
    }
    
    // 获取点击坐标（仿 Telegram 风格）
    const x = event ? event.clientX : window.innerWidth - 36;
    const y = event ? event.clientY : 36;
    
    // 计算最大半径（从点击位置到角的最大距离）
    const maxX = Math.max(x, innerWidth - x);
    const maxY = Math.max(y, innerHeight - y);
    const radius = Math.hypot(maxX, maxY);
    
    // 启动 ViewTransition
    const transition = document.startViewTransition(() => {
        applyTheme(!isDark);
    });
    
    // 应用圆形扩散动画
    transition.ready.then(() => {
        const clip = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`
        ];
        
        document.documentElement.animate(
            {
                clipPath: isDark ? clip.reverse() : clip
            },
            {
                duration: 520,
                easing: 'cubic-bezier(.4,0,.2,1)',
                pseudoElement: isDark
                    ? '::view-transition-old(root)'
                    : '::view-transition-new(root)'
            }
        );
    });
}


/* ============= THEME TOGGLE WITH EVENT BINDING ============= */

function initThemeToggle() {
    const themeToggleBtns = document.querySelectorAll('#themeToggleNav');
    
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            toggleThemeWithTransition(event);
        });
    });
    
    // 也支持旧的 themeBtn ID
    const oldThemeBtn = document.getElementById('themeBtn');
    if (oldThemeBtn) {
        oldThemeBtn.addEventListener('click', (event) => {
            toggleThemeWithTransition(event);
        });
    }
}


/* ============= INITIALIZE THEME ============= */

function initTheme() {
    const saved = localStorage.getItem('theme');
    
    // 用户有保存的设置
    if (saved) {
        applyTheme(saved === 'dark');
        return;
    }
    
    // 跟随系统偏好
    applyTheme(prefersDark);
}

// 监听系统主题变更
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches);
    }
});


/* ============= BACK BUTTON ============= */

const backBtn = document.getElementById('backBtn');

if (backBtn) {
    backBtn.addEventListener('click', () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    });
}


/* ============= SHARE BUTTON ============= */

const shareBtn = document.getElementById('shareBtn');

if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        const title = document.querySelector('h1')?.textContent || '文章';
        const url = window.location.href;
        
        // 使用 Web Share API（如果可用）
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: '看看这篇文章！',
                    url: url
                });
            } catch (err) {
                console.log('分享被取消或出错');
            }
        } else {
            // 备选方案：复制链接到剪贴板
            try {
                await navigator.clipboard.writeText(url);
                showNotification('链接已复制到剪贴板');
            } catch (err) {
                alert('分享链接: ' + url);
            }
        }
    });
}


/* ============= FONT SIZE TOGGLE ============= */

function toggleFontSize() {
    const body = document.getElementById('articleBody');
    const contentDiv = document.querySelector('.article-content');
    
    if (contentDiv) {
        contentDiv.classList.toggle('large-text');
    }
}

// 为字体大小按钮添加事件监听器
const fontSizeBtn = document.getElementById('fontSizeBtn');
if (fontSizeBtn) {
    fontSizeBtn.addEventListener('click', toggleFontSize);
}


/* ============= NOTIFICATION SYSTEM ============= */

function showNotification(message, duration = 2000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10000;
        animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// 添加动画样式
if (!document.querySelector('style[data-animations]')) {
    const style = document.createElement('style');
    style.setAttribute('data-animations', 'true');
    style.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        @keyframes slideDown {
            from {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to {
                opacity: 0;
                transform: translateX(-50%) translateY(20px);
            }
        }
    `;
    document.head.appendChild(style);
}


/* ============= PROGRESS BAR ============= */

const progressBar = document.getElementById('progress-bar');

function updateProgress() {
    if (!progressBar) return;
    
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    progressBar.style.width = scrolled + '%';
}

window.addEventListener('scroll', updateProgress, { passive: true });


/* ============= SCROLL TO TOP BUTTON ============= */

const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


/* ============= NAVIGATION TITLE UPDATE ============= */

const navTitle = document.getElementById('navTitle');

if (navTitle) {
    const h1 = document.querySelector('h1');
    if (h1) {
        navTitle.textContent = h1.textContent;
    }
}


/* ============= IMMERSIVE MODE (沉浸模式) ============= */

(function() {
    const topNav = document.querySelector('.top-nav');
    const bottomNav = document.querySelector('.bottom-nav');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    let lastScroll = window.scrollY;
    let isHidden = false;
    let hideTimer;
    
    function hideUI() {
        if (isHidden) return;
        
        if (topNav) topNav.style.transform = 'translateY(-70px)';      // 隐藏到顶部外
        if (bottomNav) bottomNav.style.transform = 'translateY(120px)'; // 隐藏到底部外
        if (scrollTopBtn) scrollTopBtn.style.opacity = '0';             // 逐渐隐藏
        
        isHidden = true;
    }
    
    function showUI() {
        if (!isHidden) return;
        
        if (topNav) topNav.style.transform = 'translateY(0)';
        if (bottomNav) bottomNav.style.transform = 'translateY(0)';
        if (scrollTopBtn && scrollTopBtn.classList.contains('show')) {
            scrollTopBtn.style.opacity = '1';
        }
        
        isHidden = false;
    }
    
    // 添加transition样式
    if (topNav) topNav.style.transition = 'transform 0.3s ease';
    if (bottomNav) bottomNav.style.transition = 'transform 0.3s ease';
    if (scrollTopBtn) scrollTopBtn.style.transition = 'opacity 0.3s ease';
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // 向下滚动超过100px时隐藏UI
        if (currentScroll > lastScroll && currentScroll > 100) {
            hideUI();
        } else {
            showUI();
        }
        
        lastScroll = currentScroll;
        
        // 滚动停止1秒后显示UI
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => showUI(), 1000);
    });
})();


/* ============= INITIALIZATION ============= */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initThemeToggle();
});
