document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chatHistory');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const deepThinkBtn = document.getElementById('deepThinkBtn');
    const deepSearchBtn = document.getElementById('deepSearchBtn');
    const newChatBtn = document.querySelector('.new-chat');
    const saveChatBtn = document.querySelector('.save-chat');
    const loadChatBtn = document.querySelector('.load-chat');
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
    function appendMessage(sender, text, type = null, expandedContent = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}${type ? ` ${type}` : ''}`;
        
        // 添加头像
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        messageDiv.appendChild(avatarDiv);

        // 添加消息内容
        const contentDiv = document.createElement('div');
        contentDiv.textContent = text;
        messageDiv.appendChild(contentDiv);

        // 深度思考/搜索的展开按钮
        if (type === 'think' || type === 'search') {
            const expandBtn = document.createElement('span');
            expandBtn.className = 'expand-btn';
            expandBtn.textContent = '展开';
            expandBtn.onclick = () => {
                messageDiv.classList.toggle('expanded');
            };
            contentDiv.appendChild(expandBtn);

            const expandedDiv = document.createElement('div');
            expandedDiv.className = 'expanded-content';
            expandedDiv.textContent = expandedContent;
            messageDiv.appendChild(expandedDiv);
        }

        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // 保存聊天记录
        saveChat();
    }

    // 深度思考
    function deepThink() {
        appendMessage('ai', '已深度思考', 'think', '思考完成！这是一个深度思考的结果。');
    }

    // 联网搜索
    function deepSearch() {
        appendMessage('ai', '已联网搜索', 'search', '搜索完成！这是一个联网搜索的结果。');
    }

    // 新建聊天
    function newChat() {
        chatHistory.innerHTML = '';
        localStorage.removeItem('chatHistory');
        closeSidebar();
    }

    // 保存聊天
    function saveChat() {
        const messages = Array.from(chatHistory.children).map(msg => ({
            sender: msg.classList.contains('user') ? 'user' : 'ai',
            text: msg.querySelector(':not(.avatar):not(.expanded-content):not(.expand-btn)').textContent,
            type: msg.classList.contains('think') ? 'think' : msg.classList.contains('search') ? 'search' : null,
            expandedContent: msg.querySelector('.expanded-content')?.textContent
        }));
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }

    // 加载聊天
    function loadChat() {
        const saved = localStorage.getItem('chatHistory');
        if (saved) {
            chatHistory.innerHTML = '';
            const messages = JSON.parse(saved);
            messages.forEach(msg => {
                appendMessage(msg.sender, msg.text, msg.type, msg.expandedContent);
            });
        }
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

    // 滑动关闭侧边栏
    let touchStartX = 0;
    let touchEndX = 0;

    sidebar.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    sidebar.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
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
                setTimeout(() => {
                    userInput.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 300);
            } else if (!isFocused && inputArea.classList.contains('keyboard-active')) {
                inputArea.classList.remove('keyboard-active');
            }
        }
    }

    // 事件监听
    window.addEventListener('resize', handleKeyboard);
    userInput.addEventListener('focus', handleKeyboard);
    userInput.addEventListener('blur', handleKeyboard);
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
    saveChatBtn.addEventListener('click', saveChat);
    loadChatBtn.addEventListener('click', loadChat);

    // 初次加载聊天记录
    loadChat();
});