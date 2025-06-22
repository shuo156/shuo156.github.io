// editor.js

class Editor {
    constructor() {
        this.editor = document.getElementById('editor');
        this.lineNumbers = document.getElementById('lineNumbers');
        this.output = document.getElementById('output').querySelector('.output-content');
        this.tabs = document.getElementById('editorTabs');
        this.openFiles = new Map();
        this.currentFile = null;
        this.undoStack = [];
        this.redoStack = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateLineNumbers();
        this.setupAutoSave();
        this.loadSettings();
    }

    setupEventListeners() {
        // 编辑器内容改变时更新行号
        this.editor.addEventListener('input', () => {
            this.updateLineNumbers();
            this.saveToUndoStack();
            this.triggerAutoSave();
        });

        // 处理Tab键
        this.editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertText('    '); // 4个空格
            }
            // Ctrl + Z
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                this.undo();
            }
            // Ctrl + Y
            if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                this.redo();
            }
        });

        // 同步滚动
        this.editor.addEventListener('scroll', () => {
            this.lineNumbers.scrollTop = this.editor.scrollTop;
        });
    }

    updateLineNumbers() {
        const lines = this.editor.value.split('\n').length;
        let lineNumbersHtml = '';
        for (let i = 1; i <= lines; i++) {
            lineNumbersHtml += `<div>${i}</div>`;
        }
        this.lineNumbers.innerHTML = lineNumbersHtml;
    }

    insertText(text) {
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const before = this.editor.value.substring(0, start);
        const after = this.editor.value.substring(end);
        this.editor.value = before + text + after;
        this.editor.selectionStart = this.editor.selectionEnd = start + text.length;
        this.updateLineNumbers();
    }

    saveToUndoStack() {
        this.undoStack.push({
            content: this.editor.value,
            selectionStart: this.editor.selectionStart,
            selectionEnd: this.editor.selectionEnd
        });
        this.redoStack = []; // 清空重做栈
        if (this.undoStack.length > 100) {
            this.undoStack.shift(); // 限制栈大小
        }
    }

    undo() {
        if (this.undoStack.length > 0) {
            const current = {
                content: this.editor.value,
                selectionStart: this.editor.selectionStart,
                selectionEnd: this.editor.selectionEnd
            };
            this.redoStack.push(current);
            
            const previous = this.undoStack.pop();
            this.editor.value = previous.content;
            this.editor.selectionStart = previous.selectionStart;
            this.editor.selectionEnd = previous.selectionEnd;
            this.updateLineNumbers();
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            const current = {
                content: this.editor.value,
                selectionStart: this.editor.selectionStart,
                selectionEnd: this.editor.selectionEnd
            };
            this.undoStack.push(current);
            
            const next = this.redoStack.pop();
            this.editor.value = next.content;
            this.editor.selectionStart = next.selectionStart;
            this.editor.selectionEnd = next.selectionEnd;
            this.updateLineNumbers();
        }
    }

    createTab(filename) {
        const tab = document.createElement('div');
        tab.className = 'editor-tab';
        tab.innerHTML = `
            <span>${filename}</span>
            <svg class="close-tab" viewBox="0 0 24 24" width="12" height="12">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        `;
        
        tab.addEventListener('click', () => this.switchTab(filename));
        tab.querySelector('.close-tab').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeTab(filename);
        });
        
        this.tabs.appendChild(tab);
    }

    switchTab(filename) {
        if (this.currentFile) {
            this.openFiles.set(this.currentFile, this.editor.value);
        }
        
        this.currentFile = filename;
        this.editor.value = this.openFiles.get(filename) || '';
        
        // 更新标签页状态
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.classList.toggle('active', tab.textContent.trim() === filename);
        });
        
        this.updateLineNumbers();
    }

    closeTab(filename) {
        if (confirm(`是否关闭 ${filename}？未保存的更改将丢失。`)) {
            this.openFiles.delete(filename);
            const tab = Array.from(document.querySelectorAll('.editor-tab'))
                .find(tab => tab.textContent.trim() === filename);
            if (tab) {
                tab.remove();
            }
            
            if (this.currentFile === filename) {
                const nextFile = this.openFiles.keys().next().value;
                if (nextFile) {
                    this.switchTab(nextFile);
                } else {
                    this.editor.value = '';
                    this.currentFile = null;
                }
            }
        }
    }

    setupAutoSave() {
        this.autoSaveInterval = null;
        this.autoSaveEnabled = localStorage.getItem('autoSaveEnabled') === 'true';
        this.autoSaveIntervalTime = parseInt(localStorage.getItem('autoSaveInterval')) || 5;
        
        if (this.autoSaveEnabled) {
            this.startAutoSave();
        }
    }

    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.currentFile && this.editor.value.trim()) {
                this.saveCurrentFile(true); // true表示自动保存
            }
        }, this.autoSaveIntervalTime * 60 * 1000);
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
    }

    saveCurrentFile(isAutoSave = false) {
        if (!this.currentFile) return;
        
        try {
            localStorage.setItem(`file_${this.currentFile}`, this.editor.value);
            if (!isAutoSave) {
                this.showMessage(`文件 ${this.currentFile} 已保存`);
            }
        } catch (error) {
            this.showMessage(`保存失败: ${error.message}`, 'error');
        }
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        this.output.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 3000);
    }

    loadSettings() {
        const fontSize = localStorage.getItem('fontSize') || '14';
        const fontFamily = localStorage.getItem('fontFamily') || 'CustomFont';
        const theme = localStorage.getItem('theme') || 'light';
        
        this.editor.style.fontSize = `${fontSize}px`;
        this.editor.style.fontFamily = fontFamily;
        document.documentElement.setAttribute('data-theme', theme);
    }

    // 格式化代码
    formatCode() {
        try {
            const code = this.editor.value;
            let formatted;
            
            if (this.currentFile?.endsWith('.html')) {
                formatted = this.formatHTML(code);
            } else if (this.currentFile?.endsWith('.css')) {
                formatted = this.formatCSS(code);
            } else if (this.currentFile?.endsWith('.js')) {
                formatted = this.formatJS(code);
            } else {
                throw new Error('不支持的文件类型');
            }
            
            this.editor.value = formatted;
            this.updateLineNumbers();
            this.showMessage('代码格式化成功');
        } catch (error) {
            this.showMessage(`格式化失败: ${error.message}`, 'error');
        }
    }

    formatHTML(code) {
        let formatted = '';
        let indent = 0;
        const lines = code.split('\n');
        
        lines.forEach(line => {
            line = line.trim();
            if (line.match(/<\/.+>/)) {
                indent--;
            }
            formatted += '    '.repeat(Math.max(0, indent)) + line + '\n';
            if (line.match(/<[^/].+>/) && !line.match(/<.+\/>/) && !line.match(/<.+>.+<\/.+>/)) {
                indent++;
            }
        });
        
        return formatted.trim();
    }

    formatCSS(code) {
        return code
            .replace(/\s+/g, ' ')
            .replace(/\s*{\s*/g, ' {\n    ')
            .replace(/\s*}\s*/g, '\n}\n')
            .replace(/;\s*/g, ';\n    ')
            .replace(/,\s*/g, ',\n')
            .trim();
    }

    formatJS(code) {
        try {
            // 简单的JS格式化
            return code
                .replace(/{\s*/g, '{\n    ')
                .replace(/}\s*/g, '\n}\n')
                .replace(/;\s*/g, ';\n')
                .replace(/,\s*/g, ', ')
                .trim();
        } catch (error) {
            throw new Error('JS格式化失败');
        }
    }
}

// 初始化编辑器
const editor = new Editor();

// 导出编辑器实例
window.editor = editor;