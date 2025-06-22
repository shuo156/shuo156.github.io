// file-handler.js

class FileHandler {
    constructor() {
        this.currentPath = '/storage/emulated/0/';
        this.currentUser = 'shuo156';
        this.lastUpdateTime = '2025-06-22 09:26:47';
        this.maxFileSize = 100 * 1024 * 1024; // 100MB
        this.supportedFormats = {
            text: ['.txt', '.js', '.html', '.css', '.json', '.md', '.xml', '.csv'],
            image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
            video: ['.mp4', '.webm', '.ogg'],
            audio: ['.mp3', '.wav', '.ogg'],
            archive: ['.zip', '.rar', '.7z']
        };

        this.init();
    }

    init() {
        this.setupFileUpload();
        this.setupChunkedUpload();
        this.setupDragAndDrop();
        this.setupFileOperations();
    }

    setupFileUpload() {
        const uploadArea = document.createElement('div');
        uploadArea.className = 'file-upload-area';
        uploadArea.innerHTML = `
            <div class="upload-container">
                <input type="file" id="fileInput" multiple class="file-input" />
                <label for="fileInput" class="upload-label">
                    <svg class="upload-icon" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                    <span>选择文件或拖放至此处</span>
                </label>
                <div class="upload-progress" style="display: none;">
                    <div class="progress-bar"></div>
                    <div class="progress-text">0%</div>
                </div>
            </div>
            <div class="file-list"></div>
        `;

        document.querySelector('.main-container').appendChild(uploadArea);

        // 文件选择处理
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files);
        });
    }

    setupChunkedUpload() {
        this.chunkSize = 1024 * 1024; // 1MB chunks
        this.uploadQueue = [];
        this.isUploading = false;
    }

    setupDragAndDrop() {
        const dropZone = document.querySelector('.file-upload-area');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        dropZone.addEventListener('dragenter', () => dropZone.classList.add('drag-over'));
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
        dropZone.addEventListener('drop', (e) => {
            dropZone.classList.remove('drag-over');
            this.handleFileSelect(e.dataTransfer.files);
        });
    }

    setupFileOperations() {
        // 文件操作按钮
        const fileOps = document.createElement('div');
        fileOps.className = 'file-operations';
        fileOps.innerHTML = `
            <button class="op-button" data-op="copy">
                <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                复制
            </button>
            <button class="op-button" data-op="move">
                <svg viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>
                移动
            </button>
            <button class="op-button" data-op="delete">
                <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                删除
            </button>
        `;

        document.querySelector('.file-upload-area').appendChild(fileOps);

        // 添加事件监听
        fileOps.addEventListener('click', (e) => {
            const button = e.target.closest('.op-button');
            if (!button) return;

            const operation = button.dataset.op;
            const selectedFiles = this.getSelectedFiles();

            switch (operation) {
                case 'copy':
                    this.copyFiles(selectedFiles);
                    break;
                case 'move':
                    this.moveFiles(selectedFiles);
                    break;
                case 'delete':
                    this.deleteFiles(selectedFiles);
                    break;
            }
        });
    }

    async handleFileSelect(files) {
        const fileList = document.querySelector('.file-list');
        const progressBar = document.querySelector('.upload-progress');
        const progressText = document.querySelector('.progress-text');

        for (const file of files) {
            if (file.size > this.maxFileSize) {
                this.showError(`文件 ${file.name} 超过大小限制`);
                continue;
            }

            const fileItem = this.createFileListItem(file);
            fileList.appendChild(fileItem);

            // 大文件使用分片上传
            if (file.size > this.chunkSize) {
                await this.uploadLargeFile(file, fileItem);
            } else {
                await this.uploadFile(file, fileItem);
            }
        }
    }

    createFileListItem(file) {
        const item = document.createElement('div');
        item.className = 'file-item';
        
        const extension = file.name.split('.').pop().toLowerCase();
        const fileType = this.getFileType(extension);
        
        item.innerHTML = `
            <div class="file-icon ${fileType}">
                <svg viewBox="0 0 24 24">
                    ${this.getFileIconPath(fileType)}
                </svg>
            </div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${this.formatFileSize(file.size)}</div>
            </div>
            <div class="file-progress">
                <div class="progress-bar"></div>
                <div class="progress-text">0%</div>
            </div>
            <div class="file-actions">
                <button class="action-button preview" title="预览">
                    <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                </button>
                <button class="action-button delete" title="删除">
                    <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
            </div>
        `;

        // 添加事件监听器
        item.querySelector('.preview').addEventListener('click', () => this.previewFile(file));
        item.querySelector('.delete').addEventListener('click', () => this.deleteFile(item));

        return item;
    }

    async uploadLargeFile(file, fileItem) {
        const chunks = Math.ceil(file.size / this.chunkSize);
        const progressBar = fileItem.querySelector('.progress-bar');
        const progressText = fileItem.querySelector('.progress-text');

        for (let i = 0; i < chunks; i++) {
            const start = i * this.chunkSize;
            const end = Math.min(start + this.chunkSize, file.size);
            const chunk = file.slice(start, end);

            try {
                await this.uploadChunk(chunk, i, chunks, file.name);
                const progress = ((i + 1) / chunks * 100).toFixed(1);
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${progress}%`;
            } catch (error) {
                this.showError(`上传失败: ${error.message}`);
                return;
            }
        }

        this.showSuccess(`文件 ${file.name} 上传完成`);
    }

    async uploadChunk(chunk, index, total, fileName) {
        // 模拟分片上传
        return new Promise((resolve) => {
            setTimeout(resolve, 500);
        });
    }

    async uploadFile(file, fileItem) {
        const progressBar = fileItem.querySelector('.progress-bar');
        const progressText = fileItem.querySelector('.progress-text');

        // 模拟上传进度
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            progressBar.style.width = `${i}%`;
            progressText.textContent = `${i}%`;
        }

        this.showSuccess(`文件 ${file.name} 上传完成`);
    }

    getFileType(extension) {
        for (const [type, extensions] of Object.entries(this.supportedFormats)) {
            if (extensions.includes(`.${extension}`)) {
                return type;
            }
        }
        return 'other';
    }

    getFileIconPath(type) {
        const icons = {
            text: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
            image: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
            video: 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z',
            audio: 'M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z',
            archive: 'M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm0-4H6v-2h8v2z',
            other: 'M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z'
        };
        return icons[type] || icons.other;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    previewFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('div');
            preview.className = 'file-preview-modal';
            
            const content = document.createElement('div');
            content.className = 'preview-content';

            const type = this.getFileType(file.name.split('.').pop().toLowerCase());
            
            switch (type) {
                case 'image':
                    content.innerHTML = `<img src="${e.target.result}" alt="${file.name}">`;
                    break;
                case 'video':
                    content.innerHTML = `<video controls src="${e.target.result}"></video>`;
                    break;
                case 'audio':
                    content.innerHTML = `<audio controls src="${e.target.result}"></audio>`;
                    break;
                case 'text':
                    content.innerHTML = `<pre>${e.target.result}</pre>`;
                    break;
                default:
                    content.innerHTML = `<div class="no-preview">无法预览此类型文件</div>`;
            }

            preview.appendChild(content);
            preview.addEventListener('click', (e) => {
                if (e.target === preview) preview.remove();
            });

            document.body.appendChild(preview);
        };

        if (this.getFileType(file.name.split('.').pop().toLowerCase()) === 'text') {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    }

    deleteFile(fileItem) {
        if (confirm('确定要删除此文件吗？')) {
            fileItem.remove();
        }
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// 添加样式
const style = document.createElement('style');
style.textContent = `
    .file-upload-area {
        padding: 20px;
        border: 2px dashed var(--border-color);
        border-radius: 8px;
        margin: 20px;
        transition: all 0.3s ease;
    }

    .file-upload-area.drag-over {
        border-color: var(--primary-color);
        background: rgba(var(--primary-color-rgb), 0.1);
    }

    .upload-container {
        text-align: center;
        padding: 20px;
    }

    .file-input {
        display: none;
    }

    .upload-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        padding: 20px;
        border-radius: 8px;
        background: var(--bg-color);
        transition: all 0.3s ease;
    }

    .upload-label:hover {
        background: var(--hover-color);
    }

    .upload-icon {
        width: 48px;
        height: 48px;
        fill: var(--primary-color);
    }

    .file-list {
        margin-top: 20px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
    }

    .file-item {
        display: flex;
        align-items: center;
        padding: 10px;
        background: var(--editor-bg);
        border-radius: 8px;
        box-shadow: 0 2px 4px var(--shadow-color);
    }

    .file-icon {
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }

    .file-icon svg {
        width: 100%;
        height: 100%;
        fill: var(--text-color);
    }

    .file-info {
        flex: 1;
        overflow: hidden;
    }

    .file-name {
        font-weight: 500;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .file-size {
        font-size: 12px;
        color: var(--text-color);
        opacity: 0.7;
    }

    .file-progress {
        width: 100px;
        height: 4px;
        background: var(--border-color);
        border-radius: 2px;
        overflow: hidden;
        margin: 0 10px;
    }

    .progress-bar {
        height: 100%;
        background: var(--primary-color);
        width: 0;
        transition: width 0.3s ease;
    }

    .progress-text {
        font-size: 12px;
        color: var(--text-color);
        text-align: center;
        margin-top: 4px;
    }

    .file-actions {
        display: flex;
        gap: 8px;
    }

    .action-button {
        border: none;
        background: none;
        padding: 4px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.3s ease;
    }

    .action-button:hover {
        background: var(--hover-color);
    }

    .action-button svg {
        width: 20px;
        height: 20px;
        fill: var(--text-color);
    }

    .file-preview-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .preview-content {
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
        background: var(--editor-bg);
        padding: 20px;
        border-radius: 8px;
    }

    .preview-content img,
    .preview-content video {
        max-width: 100%;
        max-height: 80vh;
    }

    .preview-content pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        padding: 10px;
        background: var(--bg-color);
        border-radius: 4px;
    }

    .no-preview {
        padding: 40px;
        text-align: center;
        color: var(--text-color);
    }

    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 4px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    }

    .toast.error {
        background: #f44336;
    }

    .toast.success {
        background: #4caf50;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @media (max-width: 768px) {
        .file-list {
            grid-template-columns: 1fr;
        }

        .file-item {
            flex-wrap: wrap;
        }

        .file-progress {
            width: 100%;
            margin: 10px 0;
        }

        .file-actions {
            width: 100%;
            justify-content: flex-end;
            margin-top: 10px;
        }

        .action-button {
            padding: 8px;
        }

        .action-button svg {
            width: 24px;
            height: 24px;
        }
    }
`;
document.head.appendChild(style);

// 初始化文件处理器
const fileHandler = new FileHandler();

// 导出实例
window.fileHandler = fileHandler;