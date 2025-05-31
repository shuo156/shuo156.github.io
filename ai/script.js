document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chatHistory');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const deepThinkBtn = document.getElementById('deepThinkBtn');
    const deepSearchBtn = document.getElementById('deepSearchBtn');
    const newChatBtn = document.querySelector('.new-chat');
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    const chatArea = document.querySelector('.chat-area');

    // 发送消息
    function sendMessage() {
        const inputText = userInput.value.trim();
        if (!inputText) return;

        // 显示用户消息
        appendMessage('user', inputText);
        userInput.value = '';

        // 模拟AI回复
        setTimeout(() => {
            const response = aiResponses[inputText] || '服务器繁忙，请稍后再试';
            appendMessage('ai', response);
        }, 1000);
    }

    // 添加消息到聊天历史
    function appendMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // 深度思考动画
    function deepThink() {
        appendMessage('ai', '正在深度思考');
        const thinkingMessage = chatHistory.lastChild;
        thinkingMessage.classList.add('thinking');
        setTimeout(() => {
            thinkingMessage.remove();
            appendMessage('ai', '思考完成！这是一个深度思考的结果。');
        }, 2000);
    }

    // 深度搜索动画
    function deepSearch() {
        appendMessage('ai', '正在深度搜索');
        const searchingMessage = chatHistory.lastChild;
        searchingMessage.classList.add('thinking');
        setTimeout(() => {
            searchingMessage.remove();
            appendMessage('ai', '搜索完成！已浏览45个网页。');
        }, 2000);
    }

    // 新建聊天
    function newChat() {
        chatHistory.innerHTML = '';
        closeSidebar();
    }

    // 打开/关闭侧边栏
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        chatArea.classList.toggle('sidebar-active');
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        chatArea.classList.remove('sidebar-active');
    }

    // Hamburger 菜单点击
    hamburger.addEventListener('click', toggleSidebar);

    // 滑动关闭侧边栏（触控手势）
    let touchStartX = 0;
    let touchEndX = 0;

    sidebar.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    sidebar.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) { // 向左滑超过50px
            closeSidebar();
        }
    });

    // 键盘弹出处理
    function handleKeyboard() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            const inputArea = document.querySelector('.input-area');
            const isFocused = document.activeElement === userInput;

            if (isFocused && !inputArea.classList.contains('keyboard-active')) {
                inputArea.classList.add('keyboard-active');
                // 确保输入框可见
                setTimeout(() => {
                    userInput.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 300);
            } else if (!isFocused && inputArea.classList.contains('keyboard-active')) {
                inputArea.classList.remove('keyboard-active');
            }
        }
    }

    // 监听窗口大小变化和输入框焦点
    window.addEventListener('resize', handleKeyboard);
    userInput.addEventListener('focus', handleKeyboard);
    userInput.addEventListener('blur', handleKeyboard);

    // 其他事件监听
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    deepThinkBtn.addEventListener('click', deepThink);
    deepSearchBtn.addEventListener('click', deepSearch);
    newChatBtn.addEventListener('click', newChat);
});