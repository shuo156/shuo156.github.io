    // 暗色模式切换功能
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    // 检查本地存储中是否有暗色模式偏好
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // 根据偏好设置初始模式
    if (isDarkMode) {
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '切换浅色模式';
    }
    
    // 切换暗色模式
    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        const isDark = body.classList.contains('dark-mode');
        darkModeToggle.textContent = isDark ? '切换浅色模式' : '切换深色模式';
        
        // 保存用户偏好
        localStorage.setItem('darkMode', isDark);
    });