        // 1. Telegram 风格扩散主题切换
        function toggleTheme(event) {
            const isDark = document.documentElement.classList.contains('dark');
            if (!document.startViewTransition) {
                applyTheme(!isDark);
                return;
            }
            const x = event.clientX || window.innerWidth - 40;
            const y = event.clientY || 40;
            const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

            const transition = document.startViewTransition(() => {
                applyTheme(!isDark);
            });

            transition.ready.then(() => {
                const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
                document.documentElement.animate(
                    { clipPath: isDark ? [...clipPath].reverse() : clipPath },
                    { duration: 500, easing: 'ease-in-out', pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)' }
                );
            });
        }

        function applyTheme(toDark) {
            const icon = document.getElementById('themeIcon');
            if (toDark) {
                document.documentElement.classList.add('dark');
                icon.className = 'fa-solid fa-moon';
            } else {
                document.documentElement.classList.remove('dark');
                icon.className = 'fa-solid fa-sun';
            }
        }

        // 2. 滚动监听：进度条 & 返回顶部按钮
        window.onscroll = function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById("progress-bar").style.width = scrolled + "%";

            const scrollBtn = document.getElementById("scrollTopBtn");
            if (winScroll > 300) { scrollBtn.classList.add("show"); } 
            else { scrollBtn.classList.remove("show"); }
        };

        // 3. 字号切换
        function toggleFontSize() {
            const body = document.getElementById('articleBody');
            body.classList.toggle('large-text');
        }

        // 4. 分享功能
        async function sharePage() {
            if (navigator.share) {
                try {
                    await navigator.share({ title: document.title, url: window.location.href });
                } catch (err) { console.log("Share failed"); }
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert("链接已复制到剪贴板");
            }
        }

        // 5. 初始化系统配色
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme(true);