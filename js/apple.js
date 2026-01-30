/* =====================================================
   Apple Reader JS Pro v2.0
   Theme + Animation + Utility
   ===================================================== */


/* ================= SVG ICON ================= */

function setThemeIcon(isDark) {

    const btn = document.getElementById('themeBtn');

    if (!btn) return;


    if (isDark) {

        // Moon
        btn.innerHTML = `
        <svg class="svg-icon" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3
                     7 7 0 0 0 21 12.79z"></path>
        </svg>`;

    } else {

        // Sun
        btn.innerHTML = `
        <svg class="svg-icon sun-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5"></circle>

            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>

            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>

            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>

            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
    }
}



/* ================= THEME CORE ================= */

function applyTheme(toDark) {

    const root = document.documentElement;


    if (toDark) {

        root.classList.add('dark');

        localStorage.setItem('theme', 'dark');

    } else {

        root.classList.remove('dark');

        localStorage.setItem('theme', 'light');
    }


    setThemeIcon(toDark);
}



/* ================= TELEGRAM STYLE TRANSITION ================= */

function toggleTheme(event) {

    const root = document.documentElement;

    const isDark = root.classList.contains('dark');


    // 没支持 ViewTransition 直接切
    if (!document.startViewTransition) {

        applyTheme(!isDark);

        return;
    }


    // 点击坐标（仿 Telegram）
    const x = event.clientX || window.innerWidth - 36;
    const y = event.clientY || 36;


    const maxX = Math.max(x, innerWidth - x);
    const maxY = Math.max(y, innerHeight - y);

    const radius = Math.hypot(maxX, maxY);


    const transition = document.startViewTransition(() => {

        applyTheme(!isDark);

    });


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



/* ================= SCROLL ================= */

window.addEventListener('scroll', () => {

    const winScroll =
        document.documentElement.scrollTop || document.body.scrollTop;


    const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;


    const percent = (winScroll / height) * 100;


    const bar = document.getElementById("progress-bar");

    if (bar) {

        bar.style.width = percent + "%";
    }


    const btn = document.getElementById("scrollTopBtn");

    if (!btn) return;


    if (winScroll > 300) {

        btn.classList.add("show");

    } else {

        btn.classList.remove("show");
    }

});



/* ================= FONT SIZE ================= */

function toggleFontSize() {

    const body = document.getElementById('articleBody');

    if (!body) return;


    body.classList.toggle('large-text');
}



/* ================= SHARE ================= */

async function sharePage() {

    if (navigator.share) {

        try {

            await navigator.share({

                title: document.title,

                url: location.href

            });

        } catch (e) {

            console.log("Share cancelled");

        }

    } else {

        navigator.clipboard.writeText(location.href);

        alert("链接已复制");
    }

}



/* ================= INIT ================= */

function initTheme() {

    const saved = localStorage.getItem('theme');


    // 用户有设置
    if (saved) {

        applyTheme(saved === 'dark');

        return;
    }


    // 跟随系统
    const prefersDark =
        window.matchMedia('(prefers-color-scheme: dark)').matches;


    applyTheme(prefersDark);
}



/* ================= START ================= */

document.addEventListener('DOMContentLoaded', () => {

    initTheme();

});

/* ================== 沉浸模式 ================== */

(function() {
    const bottomNav = document.querySelector('.bottom-nav');
    const themeBtn = document.querySelector('.theme-toggle');
    let lastScroll = window.scrollY;
    let isHidden = false;
    let timer;

    function hideUI() {
        if (isHidden) return;
        if (bottomNav) bottomNav.style.transform = 'translateY(120px)'; // 隐藏到底部外
        if (themeBtn) themeBtn.style.transform = 'translateY(-80px)'; // 往上隐藏
        isHidden = true;
    }

    function showUI() {
        if (!isHidden) return;
        if (bottomNav) bottomNav.style.transform = 'translateY(0)';
        if (themeBtn) themeBtn.style.transform = 'translateY(0)';
        isHidden = false;
    }

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > lastScroll && currentScroll > 100) {
            hideUI();
        } else {
            showUI();
        }

        lastScroll = currentScroll;

        // 滚动停止 1s 显示
        clearTimeout(timer);
        timer = setTimeout(() => showUI(), 1000);
    });
})();