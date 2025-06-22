// settings.js

class SettingsManager {
    constructor() {
        this.defaultSettings = {
            theme: 'light',
            fontSize: 14,
            fontFamily: 'CustomFont',
            autoSave: true,
            autoSaveInterval: 5,
            indentSize: 4,
            lineNumbers: true,
            wordWrap: true,
            highlightCurrentLine: true,
            autoComplete: true,
            tabSize: 4,
            showInvisibles: false,
            keyBindings: 'default',
            customTheme: {
                background: '#ffffff',
                foreground: '#333333',
                cursor: '#000000',
                selection: '#b3d4fc'
            }
        };

        this.settings = {};
        this.settingsPanel = document.getElementById('settingsPanel');
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.applySettings();
        this.createSettingsUI();
    }

    loadSettings() {
        try {
            const savedSettings = JSON.parse(localStorage.getItem('editorSettings'));
            this.settings = { ...this.defaultSettings, ...savedSettings };
        } catch (error) {
            console.error('加载设置失败:', error);
            this.settings = { ...this.defaultSettings };
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('editorSettings', JSON.stringify(this.settings));
            this.applySettings();
            this.showNotification('设置已保存');
        } catch (error) {
            console.error('保存设置失败:', error);
            this.showError('无法保存设置');
        }
    }

    setupEventListeners() {
        // 主题切换按钮
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // 设置面板的打开/关闭
        document.addEventListener('click', (e) => {
            if (e.target.closest('.settings-button')) {
                this.toggleSettingsPanel();
            } else if (!e.target.closest('.settings-panel') && 
                      this.settingsPanel.classList.contains('visible')) {
                this.toggleSettingsPanel();
            }
        });

        // 移动端手势支持
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        document.addEventListener('touchmove', (e) => {
            const touchX = e.touches[0].clientX;
            const diff = touchStartX - touchX;

            if (Math.abs(diff) > 50) {
                if (diff > 0 && !this.settingsPanel.classList.contains('visible')) {
                    this.toggleSettingsPanel();
                } else if (diff < 0 && this.settingsPanel.classList.contains('visible')) {
                    this.toggleSettingsPanel();
                }
            }
        });
    }

    createSettingsUI() {
        const content = document.createElement('div');
        content.className = 'settings-content';
        content.innerHTML = `
            <div class="settings-group">
                <h3>外观设置</h3>
                <div class="setting-item">
                    <label for="theme">主题</label>
                    <select id="theme">
                        <option value="light">浅色</option>
                        <option value="dark">深色</option>
                        <option value="custom">自定义</option>
                    </select>
                </div>
                <div class="setting-item custom-theme-settings" style="display: none;">
                    <label>自定义主题颜色</label>
                    <div class="color-pickers">
                        <div class="color-picker">
                            <label>背景色</label>
                            <input type="color" id="backgroundColor" value="${this.settings.customTheme.background}">
                        </div>
                        <div class="color-picker">
                            <label>前景色</label>
                            <input type="color" id="foregroundColor" value="${this.settings.customTheme.foreground}">
                        </div>
                    </div>
                </div>
                <div class="setting-item">
                    <label for="fontSize">字体大小</label>
                    <div class="range-with-value">
                        <input type="range" id="fontSize" min="12" max="24" value="${this.settings.fontSize}">
                        <span class="range-value">${this.settings.fontSize}px</span>
                    </div>
                </div>
                <div class="setting-item">
                    <label for="fontFamily">字体</label>
                    <select id="fontFamily">
                        <option value="CustomFont">Main Font</option>
                        <option value="monospace">等宽字体</option>
                        <option value="sans-serif">无衬线字体</option>
                    </select>
                </div>
            </div>

            <div class="settings-group">
                <h3>编辑器设置</h3>
                <div class="setting-item">
                    <label for="indentSize">缩进大小</label>
                    <select id="indentSize">
                        <option value="2">2 空格</option>
                        <option value="4">4 空格</option>
                        <option value="8">8 空格</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label class="switch">
                        <input type="checkbox" id="lineNumbers" ${this.settings.lineNumbers ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span>显示行号</span>
                </div>
                <div class="setting-item">
                    <label class="switch">
                        <input type="checkbox" id="wordWrap" ${this.settings.wordWrap ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span>自动换行</span>
                </div>
                <div class="setting-item">
                    <label class="switch">
                        <input type="checkbox" id="highlightCurrentLine" ${this.settings.highlightCurrentLine ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span>高亮当前行</span>
                </div>
            </div>

            <div class="settings-group">
                <h3>自动保存</h3>
                <div class="setting-item">
                    <label class="switch">
                        <input type="checkbox" id="autoSave" ${this.settings.autoSave ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span>启用自动保存</span>
                </div>
                <div class="setting-item">
                    <label for="autoSaveInterval">保存间隔（分钟）</label>
                    <input type="number" id="autoSaveInterval" min="1" max="30" value="${this.settings.autoSaveInterval}">
                </div>
            </div>

            <div class="settings-group">
                <h3>快捷键设置</h3>
                <div class="setting-item">
                    <label for="keyBindings">快捷键方案</label>
                    <select id="keyBindings">
                        <option value="default">默认</option>
                        <option value="vim">Vim</option>
                        <option value="emacs">Emacs</option>
                    </select>
                </div>
            </div>

            <div class="settings-group">
                <h3>其他设置</h3>
                <div class="setting-item">
                    <label class="switch">
                        <input type="checkbox" id="showInvisibles" ${this.settings.showInvisibles ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span>显示不可见字符</span>
                </div>
                <div class="setting-item">
                    <button class="button" onclick="settingsManager.resetSettings()">恢复默认设置</button>
                </div>
            </div>
        `;

        this.settingsPanel.querySelector('.settings-content').replaceWith(content);
        this.setupSettingsListeners();
    }

    setupSettingsListeners() {
        // 主题设置
        const themeSelect = document.getElementById('theme');
        themeSelect.value = this.settings.theme;
        themeSelect.addEventListener('change', () => {
            this.settings.theme = themeSelect.value;
            this.toggleCustomThemeSettings();
            this.saveSettings();
        });

        // 字体大小设置
        const fontSizeInput = document.getElementById('fontSize');
        const fontSizeValue = fontSizeInput.nextElementSibling;
        fontSizeInput.addEventListener('input', () => {
            this.settings.fontSize = parseInt(fontSizeInput.value);
            fontSizeValue.textContent = `${fontSizeInput.value}px`;
            this.saveSettings();
        });

        // 字体设置
        const fontFamilySelect = document.getElementById('fontFamily');
        fontFamilySelect.value = this.settings.fontFamily;
        fontFamilySelect.addEventListener('change', () => {
            this.settings.fontFamily = fontFamilySelect.value;
            this.saveSettings();
        });

        // 其他设置的事件监听器
        ['lineNumbers', 'wordWrap', 'highlightCurrentLine', 'autoSave', 'showInvisibles'].forEach(setting => {
            const input = document.getElementById(setting);
            input.checked = this.settings[setting];
            input.addEventListener('change', () => {
                this.settings[setting] = input.checked;
                this.saveSettings();
            });
        });

        // 自动保存间隔
        const autoSaveIntervalInput = document.getElementById('autoSaveInterval');
        autoSaveIntervalInput.value = this.settings.autoSaveInterval;
        autoSaveIntervalInput.addEventListener('change', () => {
            this.settings.autoSaveInterval = parseInt(autoSaveIntervalInput.value);
            this.saveSettings();
        });

        // 自定义主题颜色
        const colorInputs = document.querySelectorAll('.color-picker input');
        colorInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.settings.customTheme[input.id] = input.value;
                this.saveSettings();
            });
        });
    }

    toggleCustomThemeSettings() {
        const customThemeSettings = document.querySelector('.custom-theme-settings');
        customThemeSettings.style.display = 
            this.settings.theme === 'custom' ? 'block' : 'none';
    }

    toggleTheme() {
        this.settings.theme = this.settings.theme === 'light' ? 'dark' : 'light';
        this.saveSettings();
    }

    toggleSettingsPanel() {
        this.settingsPanel.classList.toggle('visible');
    }

    applySettings() {
        // 应用主题
        document.documentElement.setAttribute('data-theme', this.settings.theme);

        // 应用字体设置
        if (window.editor) {
            window.editor.style.fontSize = `${this.settings.fontSize}px`;
            window.editor.style.fontFamily = this.settings.fontFamily;
        }

        // 应用自定义主题
        if (this.settings.theme === 'custom') {
            const style = document.getElementById('custom-theme') || document.createElement('style');
            style.id = 'custom-theme';
            style.textContent = `
                :root {
                    --editor-bg: ${this.settings.customTheme.background};
                    --text-color: ${this.settings.customTheme.foreground};
                    --cursor-color: ${this.settings.customTheme.cursor};
                    --selection-color: ${this.settings.customTheme.selection};
                }
            `;
            document.head.appendChild(style);
        } else {
            document.getElementById('custom-theme')?.remove();
        }

        // 应用行号显示
        const lineNumbers = document.querySelector('.editor-line-numbers');
        if (lineNumbers) {
            lineNumbers.style.display = this.settings.lineNumbers ? 'block' : 'none';
        }

        // 应用自动换行
        if (window.editor) {
            window.editor.style.whiteSpace = this.settings.wordWrap ? 'pre-wrap' : 'pre';
        }

        // 更新自动保存
        if (window.editor) {
            if (this.settings.autoSave) {
                window.editor.startAutoSave();
            } else {
                window.editor.stopAutoSave();
            }
        }
    }

    resetSettings() {
        if (confirm('确定要恢复默认设置吗？')) {
            this.settings = { ...this.defaultSettings };
            this.saveSettings();
            this.createSettingsUI();
            this.showNotification('已恢复默认设置');
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }, 100);
    }

    showError(message) {
        this.showNotification(message);
    }
}

// 添加通知样式
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background: var(--primary-color);
        color: white;
        border-radius: 4px;
        transform: translateY(100%);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }

    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }

    .notification.error {
        background: #f44336;
    }

    @media screen and (max-width: 768px) {
        .notification {
            bottom: 10px;
            right: 10px;
            left: 10px;
            text-align: center;
        }
    }
`;
document.head.appendChild(style);

// 初始化设置管理器
const settingsManager = new SettingsManager();

// 导出实例
window.settingsManager = settingsManager;