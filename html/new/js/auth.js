// auth.js

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.currentTime = '2025-06-22 09:23:24';
        this.currentLogin = 'shuo156';
        this.init();
    }

    init() {
        this.setupUI();
        this.checkAutoLogin();
        this.setupEventListeners();
        this.startTimeUpdate();
    }

    setupUI() {
        // 创建登录/注册对话框
        const authDialog = document.createElement('div');
        authDialog.className = 'auth-dialog';
        authDialog.innerHTML = `
            <div class="auth-content">
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">登录</button>
                    <button class="auth-tab" data-tab="register">注册</button>
                </div>
                
                <div class="auth-form" id="loginForm">
                    <input type="text" placeholder="用户名" id="loginUsername">
                    <input type="password" placeholder="密码" id="loginPassword">
                    <label class="remember-me">
                        <input type="checkbox" id="rememberMe">
                        <span>记住我</span>
                    </label>
                    <button class="auth-button" id="loginButton">登录</button>
                </div>
                
                <div class="auth-form" id="registerForm" style="display: none;">
                    <input type="text" placeholder="用户名" id="registerUsername">
                    <input type="password" placeholder="密码" id="registerPassword">
                    <input type="password" placeholder="确认密码" id="confirmPassword">
                    <button class="auth-button" id="registerButton">注册</button>
                </div>
            </div>
        `;
        document.body.appendChild(authDialog);

        // 创建用户信息显示
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <span class="current-time"></span>
            <span class="username"></span>
            <button class="logout-button">退出</button>
        `;
        document.querySelector('.header').appendChild(userInfo);
    }

    setupEventListeners() {
        // 标签切换
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const formId = tab.dataset.tab === 'login' ? 'loginForm' : 'registerForm';
                document.querySelectorAll('.auth-form').forEach(form => {
                    form.style.display = form.id === formId ? 'block' : 'none';
                });
            });
        });

        // 登录表单
        document.getElementById('loginButton').addEventListener('click', () => {
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            this.login(username, password, rememberMe);
        });

        // 注册表单
        document.getElementById('registerButton').addEventListener('click', () => {
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            this.register(username, password, confirmPassword);
        });

        // 退出登录
        document.querySelector('.logout-button').addEventListener('click', () => {
            this.logout();
        });

        // 添加回车键登录支持
        document.getElementById('loginPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('loginButton').click();
            }
        });
    }

    startTimeUpdate() {
        // 更新当前时间显示
        const updateTime = () => {
            const now = new Date();
            const timeStr = now.toISOString().replace('T', ' ').substr(0, 19);
            document.querySelector('.current-time').textContent = timeStr;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    async login(username, password, rememberMe) {
        // 从本地存储获取用户数据
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[username] && users[username].password === this.hashPassword(password)) {
            this.currentUser = {
                username,
                loginTime: new Date().toISOString(),
                rememberMe
            };
            
            if (rememberMe) {
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
            
            this.updateUIAfterLogin();
            this.hideAuthDialog();
        } else {
            this.showError('用户名或密码错误');
        }
    }

    async register(username, password, confirmPassword) {
        if (!username || username.length < 3) {
            this.showError('用户名至少需要3个字符');
            return;
        }

        if (!password || password.length < 6) {
            this.showError('密码至少需要6个字符');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('两次输入的密码不一致');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[username]) {
            this.showError('用户名已存在');
            return;
        }

        users[username] = {
            password: this.hashPassword(password),
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('users', JSON.stringify(users));
        this.login(username, password, false);
        this.showSuccess('注册成功！');
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        this.updateUIAfterLogout();
    }

    checkAutoLogin() {
        const savedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIAfterLogin();
        } else {
            this.showAuthDialog();
        }
    }

    updateUIAfterLogin() {
        document.querySelector('.user-info .username').textContent = this.currentUser.username;
        document.querySelector('.user-info').classList.add('logged-in');
        this.hideAuthDialog();
    }

    updateUIAfterLogout() {
        document.querySelector('.user-info').classList.remove('logged-in');
        this.showAuthDialog();
    }

    showAuthDialog() {
        document.querySelector('.auth-dialog').classList.add('visible');
    }

    hideAuthDialog() {
        document.querySelector('.auth-dialog').classList.remove('visible');
    }

    showError(message) {
        const error = document.createElement('div');
        error.className = 'auth-error';
        error.textContent = message;
        document.querySelector('.auth-content').appendChild(error);
        setTimeout(() => error.remove(), 3000);
    }

    showSuccess(message) {
        const success = document.createElement('div');
        success.className = 'auth-success';
        success.textContent = message;
        document.querySelector('.auth-content').appendChild(success);
        setTimeout(() => success.remove(), 3000);
    }

    hashPassword(password) {
        // 使用简单的哈希函数，实际应用中应该使用更安全的方法
        return btoa(password);
    }
}

// 添加样式
const style = document.createElement('style');
style.textContent = `
    .auth-dialog {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .auth-dialog.visible {
        display: flex;
    }

    .auth-content {
        background: var(--editor-bg);
        padding: 20px;
        border-radius: 8px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .auth-tabs {
        display: flex;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--border-color);
    }

    .auth-tab {
        flex: 1;
        padding: 10px;
        border: none;
        background: none;
        color: var(--text-color);
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.3s;
    }

    .auth-tab.active {
        border-bottom-color: var(--primary-color);
        color: var(--primary-color);
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .auth-form input[type="text"],
    .auth-form input[type="password"] {
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-color);
        color: var(--text-color);
        font-size: 16px;
    }

    .remember-me {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-color);
        cursor: pointer;
    }

    .auth-button {
        padding: 12px;
        border: none;
        border-radius: 4px;
        background: var(--primary-color);
        color: white;
        cursor: pointer;
        font-size: 16px;
        transition: background 0.3s;
    }

    .auth-button:hover {
        background: var(--secondary-color);
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .current-time {
        color: var(--text-color);
        font-size: 14px;
    }

    .username {
        color: var(--primary-color);
        font-weight: bold;
    }

    .logout-button {
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        background: var(--primary-color);
        color: white;
        cursor: pointer;
        transition: background 0.3s;
    }

    .logout-button:hover {
        background: var(--secondary-color);
    }

    .auth-error {
        color: #f44336;
        text-align: center;
        margin-top: 10px;
        padding: 8px;
        border-radius: 4px;
        background: rgba(244, 67, 54, 0.1);
    }

    .auth-success {
        color: #4caf50;
        text-align: center;
        margin-top: 10px;
        padding: 8px;
        border-radius: 4px;
        background: rgba(76, 175, 80, 0.1);
    }

    @media (max-width: 768px) {
        .auth-content {
            width: 95%;
            padding: 15px;
        }

        .auth-form input,
        .auth-button {
            padding: 14px;
            font-size: 16px;
        }

        .user-info {
            font-size: 14px;
        }

        .current-time {
            font-size: 12px;
        }
    }

    /* 触摸反馈 */
    @media (hover: none) {
        .auth-button:active,
        .logout-button:active {
            opacity: 0.7;
        }
    }
`;
document.head.appendChild(style);

// 初始化认证管理器
const authManager = new AuthManager();

// 导出实例
window.authManager = authManager;