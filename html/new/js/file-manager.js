// file-manager.js

class FileManager {
    constructor() {
        this.currentPath = '/storage/emulated/0/';
        this.history = [];
        this.historyIndex = -1;
        this.clipboard = null;
        this.fileList = document.getElementById('fileList');
        this.currentPathElement = document.getElementById('currentPath');
        this.searchInput = document.getElementById('fileSearch');
        
        // 文件系统权限
        this.dirHandle = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updatePathDisplay();
        this.loadRecentFiles();
        this.setupDragAndDrop();
    }

    setupEventListeners() {
        // 搜索框事件
        this.searchInput.addEventListener('input', () => this.handleSearch());

        // 文件拖放事件
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('drop', (e) => this.handleFileDrop(e));

        // 快捷键支持
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'c':
                        if (this.selectedFile) this.copyFile();
                        break;
                    case 'x':
                        if (this.selectedFile) this.cutFile();
                        break;
                    case 'v':
                        if (this.clipboard) this.pasteFile();
                        break;
                    case 'f':
                        e.preventDefault();
                        this.searchInput.focus();
                        break;
                }
            } else if (e.key === 'Delete' && this.selectedFile) {
                this.deleteFile();
            }
        });
    }

    async requestPermission() {
        try {
            this.dirHandle = await window.showDirectoryPicker({
                mode: 'readwrite'
            });
            await this.loadDirectory(this.dirHandle);
            return true;
        } catch (error) {
            console.error('权限请求失败:', error);
            return false;
        }
    }

    async loadDirectory(dirHandle, path = '') {
        this.fileList.innerHTML = '';
        this.currentPath = path || this.currentPath;
        this.updatePathDisplay();

        try {
            for await (const entry of dirHandle.values()) {
                const fileItem = this.createFileItem(entry);
                this.fileList.appendChild(fileItem);
            }
        } catch (error) {
            console.error('加载目录失败:', error);
            this.showError('无法访问该目录');
        }
    }

    createFileItem(entry) {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.dataset.name = entry.name;
        item.dataset.type = entry.kind;

        // 图标
        const icon = document.createElement('svg');
        icon.className = 'icon';
        icon.innerHTML = entry.kind === 'file' 
            ? '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>'
            : '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>';

        // 文件名
        const name = document.createElement('span');
        name.textContent = entry.name;

        item.appendChild(icon);
        item.appendChild(name);

        // 事件处理
        item.addEventListener('click', () => this.handleFileClick(entry));
        item.addEventListener('contextmenu', (e) => this.showContextMenu(e, entry));

        return item;
    }

    async handleFileClick(entry) {
        if (entry.kind === 'directory') {
            try {
                const newDirHandle = await this.dirHandle.getDirectoryHandle(entry.name);
                this.addToHistory(this.currentPath);
                await this.loadDirectory(newDirHandle, `${this.currentPath}${entry.name}/`);
            } catch (error) {
                console.error('访问目录失败:', error);
                this.showError('无法访问该目录');
            }
        } else {
            await this.openFile(entry);
        }
    }

    async openFile(fileEntry) {
        try {
            const file = await fileEntry.getFile();
            const content = await file.text();
            
            // 使用编辑器实例打开文件
            if (window.editor) {
                window.editor.createTab(fileEntry.name);
                window.editor.switchTab(fileEntry.name);
                window.editor.setContent(content);
            }

            this.addRecentFile(fileEntry.name, this.currentPath);
        } catch (error) {
            console.error('打开文件失败:', error);
            this.showError('无法打开文件');
        }
    }

    showContextMenu(e, entry) {
        e.preventDefault();
        this.selectedFile = entry;

        const menu = document.getElementById('contextMenu');
        menu.style.display = 'block';
        menu.style.left = `${e.pageX}px`;
        menu.style.top = `${e.pageY}px`;

        // 根据文件类型启用/禁用菜单项
        const items = menu.getElementsByClassName('context-menu-item');
        for (const item of items) {
            if (item.textContent === '打开' || item.textContent === '编辑') {
                item.style.display = entry.kind === 'file' ? 'block' : 'none';
            }
        }
    }

    async copyFile() {
        if (!this.selectedFile) return;

        this.clipboard = {
            action: 'copy',
            entry: this.selectedFile,
            sourcePath: this.currentPath
        };
    }

    async cutFile() {
        if (!this.selectedFile) return;

        this.clipboard = {
            action: 'cut',
            entry: this.selectedFile,
            sourcePath: this.currentPath
        };
    }

    async pasteFile() {
        if (!this.clipboard || !this.dirHandle) return;

        try {
            const { entry, action, sourcePath } = this.clipboard;
            const newName = await this.getUniqueFileName(entry.name);

            if (entry.kind === 'file') {
                const sourceFile = await entry.getFile();
                const content = await sourceFile.text();
                
                const newFileHandle = await this.dirHandle.getFileHandle(newName, { create: true });
                const writable = await newFileHandle.createWritable();
                await writable.write(content);
                await writable.close();

                if (action === 'cut') {
                    await this.deleteFileEntry(entry);
                }
            } else {
                // 处理目录复制
                await this.copyDirectory(entry, newName);
                if (action === 'cut') {
                    await this.deleteFileEntry(entry);
                }
            }

            await this.loadDirectory(this.dirHandle, this.currentPath);
            this.clipboard = null;
        } catch (error) {
            console.error('粘贴失败:', error);
            this.showError('粘贴操作失败');
        }
    }

    async deleteFile() {
        if (!this.selectedFile) return;

        if (confirm(`确定要删除 ${this.selectedFile.name} 吗？`)) {
            try {
                await this.deleteFileEntry(this.selectedFile);
                await this.loadDirectory(this.dirHandle, this.currentPath);
            } catch (error) {
                console.error('删除失败:', error);
                this.showError('删除操作失败');
            }
        }
    }

    async renameFile() {
        if (!this.selectedFile) return;

        const newName = prompt('请输入新名称:', this.selectedFile.name);
        if (!newName || newName === this.selectedFile.name) return;

        try {
            await this.dirHandle.removeEntry(this.selectedFile.name);
            await this.moveFileEntry(this.selectedFile, newName);
            await this.loadDirectory(this.dirHandle, this.currentPath);
        } catch (error) {
            console.error('重命名失败:', error);
            this.showError('重命名操作失败');
        }
    }

    async getUniqueFileName(name) {
        let newName = name;
        let counter = 1;
        
        while (true) {
            try {
                await this.dirHandle.getFileHandle(newName);
                const ext = name.includes('.') ? name.substring(name.lastIndexOf('.')) : '';
                const baseName = name.includes('.') ? name.substring(0, name.lastIndexOf('.')) : name;
                newName = `${baseName} (${counter})${ext}`;
                counter++;
            } catch {
                return newName;
            }
        }
    }

    addToHistory(path) {
        this.historyIndex++;
        this.history.splice(this.historyIndex);
        this.history.push(path);
    }

    async navigateBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            await this.loadDirectory(this.dirHandle, this.history[this.historyIndex]);
        }
    }

    async navigateForward() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            await this.loadDirectory(this.dirHandle, this.history[this.historyIndex]);
        }
    }

    async navigateUp() {
        if (this.currentPath === '/') return;

        const parentPath = this.currentPath.substring(0, this.currentPath.slice(0, -1).lastIndexOf('/') + 1);
        this.addToHistory(this.currentPath);
        await this.loadDirectory(this.dirHandle, parentPath);
    }

    updatePathDisplay() {
        this.currentPathElement.textContent = this.currentPath;
    }

    handleSearch() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const items = this.fileList.getElementsByClassName('file-item');

        for (const item of items) {
            const name = item.dataset.name.toLowerCase();
            item.style.display = name.includes(searchTerm) ? 'flex' : 'none';
        }
    }

    setupDragAndDrop() {
        this.fileList.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('file-item')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.name);
                this.draggedItem = e.target;
            }
        });

        this.fileList.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('file-item') && 
                e.target.dataset.type === 'directory') {
                e.target.classList.add('drag-over');
            }
        });

        this.fileList.addEventListener('dragleave', (e) => {
            if (e.target.classList.contains('file-item')) {
                e.target.classList.remove('drag-over');
            }
        });

        this.fileList.addEventListener('drop', async (e) => {
            e.preventDefault();
            const target = e.target.closest('.file-item');
            if (target && target.dataset.type === 'directory' && 
                this.draggedItem && target !== this.draggedItem) {
                await this.moveFileToDirectory(this.draggedItem.dataset.name, target.dataset.name);
            }
            if (target) target.classList.remove('drag-over');
        });
    }

    async moveFileToDirectory(fileName, targetDir) {
        try {
            const sourceHandle = await this.dirHandle.getFileHandle(fileName);
            const targetDirHandle = await this.dirHandle.getDirectoryHandle(targetDir);
            
            const file = await sourceHandle.getFile();
            const newFileHandle = await targetDirHandle.getFileHandle(fileName, { create: true });
            const writable = await newFileHandle.createWritable();
            await writable.write(await file.arrayBuffer());
            await writable.close();
            
            await this.dirHandle.removeEntry(fileName);
            await this.loadDirectory(this.dirHandle, this.currentPath);
        } catch (error) {
            console.error('移动文件失败:', error);
            this.showError('移动文件失败');
        }
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }, 100);
    }

    // 最近文件管理
    addRecentFile(fileName, path) {
        let recentFiles = JSON.parse(localStorage.getItem('recentFiles') || '[]');
        recentFiles = recentFiles.filter(f => f.name !== fileName);
        recentFiles.unshift({ name: fileName, path, timestamp: Date.now() });
        if (recentFiles.length > 10) recentFiles.pop();
        localStorage.setItem('recentFiles', JSON.stringify(recentFiles));
        this.updateRecentFilesList();
    }

    loadRecentFiles() {
        const recentFiles = JSON.parse(localStorage.getItem('recentFiles') || '[]');
        this.updateRecentFilesList(recentFiles);
    }

    updateRecentFilesList(files) {
        const recentList = document.querySelector('.quick-access-items');
        if (!recentList) return;

        recentList.innerHTML = '';
        files.forEach(file => {
            const item = document.createElement('div');
            item.className = 'quick-item';
            item.innerHTML = `
                <svg class="icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                <span>${file.name}</span>
            `;
            item.addEventListener('click', () => this.openRecentFile(file));
            recentList.appendChild(item);
        });
    }

    async openRecentFile(file) {
        try {
            // 尝试打开文件
            await this.navigateToPath(file.path);
            const fileHandle = await this.dirHandle.getFileHandle(file.name);
            await this.openFile(fileHandle);
        } catch (error) {
            console.error('打开最近文件失败:', error);
            this.showError('无法打开该文件');
        }
    }
}

// 初始化文件管理器
const fileManager = new FileManager();

// 导出实例
window.fileManager = fileManager;