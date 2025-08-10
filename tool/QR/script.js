let currentQR = null;
let currentLogo = null;
let currentTheme = 'classic';
let currentPattern = 'square';
let qrHistory = [];
let batchQRs = [];

// 主题配置
const themes = {
    classic: { fg: '#000000', bg: '#ffffff' },
    blue: { fg: '#1e3a8a', bg: '#dbeafe' },
    purple: { fg: '#7c3aed', bg: '#f3e8ff' },
    green: { fg: '#059669', bg: '#d1fae5' },
    red: { fg: '#dc2626', bg: '#fee2e2' }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    generateQR();
    setupEventListeners();
    loadHistory();
});

function setupEventListeners() {
    // 主题选择
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelector('.theme-option.active').classList.remove('active');
            this.classList.add('active');
            currentTheme = this.dataset.theme;
            
            const customColors = document.getElementById('customColors');
            if (currentTheme === 'custom') {
                customColors.style.display = 'block';
            } else {
                customColors.style.display = 'none';
            }
            generateQR();
        });
    });

    // 样式选择
    document.querySelectorAll('.pattern-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelector('.pattern-option.active').classList.remove('active');
            this.classList.add('active');
            currentPattern = this.dataset.pattern;
            generateQR();
        });
    });

    // 实时更新
    document.getElementById('qrText').addEventListener('input', generateQR);
    document.getElementById('qrSize').addEventListener('change', generateQR);
    document.getElementById('foregroundColor').addEventListener('change', generateQR);
    document.getElementById('backgroundColor').addEventListener('change', generateQR);

    // Logo上传
    document.getElementById('logoUpload').addEventListener('change', handleLogoUpload);
}

function switchTab(tabName) {
    // 更新tab按钮状态
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');

    // 显示对应内容
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    const button = document.querySelector('.file-input-button');
    
    if (file) {
        button.textContent = `📁 ${file.name}`;
        button.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        
        const reader = new FileReader();
        reader.onload = function(e) {
            currentLogo = e.target.result;
            const preview = document.getElementById('logoPreview');
            preview.innerHTML = `<img src="${currentLogo}" alt="Logo">`;
            generateQR();
        };
        reader.readAsDataURL(file);
    } else {
        button.textContent = '📁 选择Logo文件';
        button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
}

function generateQR() {
    const text = document.getElementById('qrText').value.trim();
    const size = parseInt(document.getElementById('qrSize').value);
    
    // 验证输入
    if (!text) {
        document.getElementById('textError').style.display = 'block';
        return;
    } else {
        document.getElementById('textError').style.display = 'none';
    }

    try {
        // 清空之前的二维码
        const qrcodeDiv = document.getElementById('qrcode');
        qrcodeDiv.innerHTML = '';

        // 创建二维码
        const qr = qrcode(0, 'M');
        qr.addData(text);
        qr.make();

        // 获取颜色
        let fgColor, bgColor;
        if (currentTheme === 'custom') {
            fgColor = document.getElementById('foregroundColor').value;
            bgColor = document.getElementById('backgroundColor').value;
        } else {
            fgColor = themes[currentTheme].fg;
            bgColor = themes[currentTheme].bg;
        }

        // 创建Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;

        // 绘制二维码
        drawQRCode(ctx, qr, size, fgColor, bgColor, currentPattern);

        // 添加Logo
        if (currentLogo) {
            addLogoToCanvas(ctx, currentLogo, size);
        }

        // 显示二维码
        qrcodeDiv.appendChild(canvas);
        currentQR = canvas;

        // 添加到历史记录
        addToHistory(text, canvas.toDataURL(), currentTheme, currentPattern);

        // 显示成功消息
        const successMsg = document.getElementById('generateSuccess');
        successMsg.style.display = 'block';
        setTimeout(() => successMsg.style.display = 'none', 2000);

    } catch (error) {
        console.error('生成二维码时出错:', error);
        document.getElementById('textError').textContent = '生成二维码时出错，请检查输入内容';
        document.getElementById('textError').style.display = 'block';
    }
}

function generateBatchQR() {
    const batchText = document.getElementById('batchText').value.trim();
    if (!batchText) {
        alert('请输入批量生成的内容');
        return;
    }

    const lines = batchText.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
        alert('请输入有效的内容');
        return;
    }

    const previewDiv = document.getElementById('batchPreview');
    previewDiv.innerHTML = '<div style="text-align: center; padding: 20px; color: #667eea;">🚀 正在生成中...</div>';
    batchQRs = [];

    const size = parseInt(document.getElementById('qrSize').value);
    let processedCount = 0;
    
    const processNextItem = () => {
        if (processedCount >= lines.length) {
            const successDiv = document.createElement('div');
            successDiv.style.cssText = 'text-align: center; padding: 15px; background: #d4edda; color: #155724; border-radius: 8px; margin-bottom: 15px;';
            successDiv.innerHTML = `🎉 成功生成 ${batchQRs.length} 个二维码！`;
            previewDiv.insertBefore(successDiv, previewDiv.firstChild);
            return;
        }

        const text = lines[processedCount].trim();
        const index = processedCount;
        processedCount++;

        try {
            const qr = qrcode(0, 'M');
            qr.addData(text);
            qr.make();

            // 获取颜色
            let fgColor, bgColor;
            if (currentTheme === 'custom') {
                fgColor = document.getElementById('foregroundColor').value;
                bgColor = document.getElementById('backgroundColor').value;
            } else {
                fgColor = themes[currentTheme].fg;
                bgColor = themes[currentTheme].bg;
            }

            // 创建预览用的小尺寸canvas
            const previewCanvas = document.createElement('canvas');
            const previewCtx = previewCanvas.getContext('2d');
            previewCanvas.width = 150;
            previewCanvas.height = 150;

            drawQRCode(previewCtx, qr, 150, fgColor, bgColor, currentPattern);

            // 创建完整尺寸的canvas
            const fullCanvas = document.createElement('canvas');
            const fullCtx = fullCanvas.getContext('2d');
            fullCanvas.width = size;
            fullCanvas.height = size;

            drawQRCode(fullCtx, qr, size, fgColor, bgColor, currentPattern);

            // 如果是第一个，清空"生成中"提示
            if (index === 0) {
                previewDiv.innerHTML = '';
            }

            // 创建预览项
            const batchItem = document.createElement('div');
            batchItem.className = 'batch-item';
            batchItem.innerHTML = `
                <div style="margin-bottom: 10px;">${previewCanvas.outerHTML}</div>
                <div class="batch-item-text">${text.length > 20 ? text.substring(0, 20) + '...' : text}</div>
                <button class="history-btn reuse" onclick="downloadSingleBatch(${index})" style="margin-top: 8px; font-size: 12px; width: 100%;">📥 下载</button>
            `;
            previewDiv.appendChild(batchItem);

            // 保存到批量数组
            batchQRs.push({
                text: text,
                canvas: fullCanvas,
                dataUrl: fullCanvas.toDataURL(),
                index: index
            });

            // 添加到历史记录
            addToHistory(text, fullCanvas.toDataURL(), currentTheme, currentPattern);

            // 如果有logo，异步添加
            if (currentLogo) {
                addLogoToCanvas(previewCtx, currentLogo, 150);
                addLogoToCanvas(fullCtx, currentLogo, size).then(() => {
                    // Logo添加完成后更新dataUrl
                    batchQRs[batchQRs.length - 1].dataUrl = fullCanvas.toDataURL();
                });
            }

        } catch (error) {
            console.error(`生成第${index + 1}个二维码时出错:`, error);
            
            if (index === 0) {
                previewDiv.innerHTML = '';
            }
            
            const errorItem = document.createElement('div');
            errorItem.className = 'batch-item';
            errorItem.style.borderColor = '#dc3545';
            errorItem.innerHTML = `
                <div style="color: #dc3545; padding: 20px; text-align: center;">
                    ❌ 生成失败<br>
                    <small>${text.length > 15 ? text.substring(0, 15) + '...' : text}</small>
                </div>
            `;
            previewDiv.appendChild(errorItem);
        }

        // 继续处理下一个
        setTimeout(processNextItem, 100);
    };

    // 开始处理
    processNextItem();
}

function downloadSingleBatch(index) {
    if (batchQRs[index]) {
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `qrcode_${index + 1}_${timestamp}.png`;
        link.href = batchQRs[index].dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function downloadAllQR() {
    if (batchQRs.length === 0) {
        alert('请先生成批量二维码');
        return;
    }

    let downloadCount = 0;
    const downloadNext = () => {
        if (downloadCount >= batchQRs.length) {
            alert(`所有 ${batchQRs.length} 个二维码下载完成！`);
            return;
        }

        const qrData = batchQRs[downloadCount];
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `batch_qr_${downloadCount + 1}_${timestamp}.png`;
        link.href = qrData.dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        downloadCount++;
        setTimeout(downloadNext, 300);
    };

    if (confirm(`确定要下载所有 ${batchQRs.length} 个二维码吗？`)) {
        downloadNext();
    }
}

function addToHistory(text, dataUrl, theme, pattern) {
    const historyItem = {
        text: text,
        dataUrl: dataUrl,
        theme: theme,
        pattern: pattern,
        timestamp: new Date().toLocaleString()
    };

    qrHistory.unshift(historyItem);
    
    // 限制历史记录数量
    if (qrHistory.length > 50) {
        qrHistory = qrHistory.slice(0, 50);
    }

    updateHistoryDisplay();
}

function loadHistory() {
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    historyList.innerHTML = '';

    if (qrHistory.length === 0) {
        historyList.innerHTML = '<div style="text-align: center; color: #6c757d; padding: 20px;">暂无历史记录</div>';
        return;
    }

    qrHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-content">
                <div class="history-text">${item.text.length > 30 ? item.text.substring(0, 30) + '...' : item.text}</div>
                <div class="history-meta">${item.timestamp} | ${item.theme} | ${item.pattern}</div>
            </div>
            <div class="history-actions">
                <button class="history-btn reuse" onclick="reuseFromHistory(${index})">复用</button>
                <button class="history-btn delete" onclick="deleteFromHistory(${index})">删除</button>
            </div>
        `;
        historyList.appendChild(historyItem);
    });
}

function reuseFromHistory(index) {
    const item = qrHistory[index];
    document.getElementById('qrText').value = item.text;
    
    // 设置主题
    document.querySelector('.theme-option.active').classList.remove('active');
    document.querySelector(`[data-theme="${item.theme}"]`).classList.add('active');
    currentTheme = item.theme;

    // 设置样式
    document.querySelector('.pattern-option.active').classList.remove('active');
    document.querySelector(`[data-pattern="${item.pattern}"]`).classList.add('active');
    currentPattern = item.pattern;

    // 显示自定义颜色面板
    const customColors = document.getElementById('customColors');
    if (currentTheme === 'custom') {
        customColors.style.display = 'block';
    } else {
        customColors.style.display = 'none';
    }

    // 切换到单个生成tab
    switchTab('single');
    
    // 生成二维码
    generateQR();
}

function deleteFromHistory(index) {
    qrHistory.splice(index, 1);
    updateHistoryDisplay();
}

function clearHistory() {
    if (confirm('确定要清空所有历史记录吗？')) {
        qrHistory = [];
        updateHistoryDisplay();
    }
}

function drawQRCode(ctx, qr, size, fgColor, bgColor, pattern) {
    const modules = qr.getModuleCount();
    const moduleSize = size / modules;

    // 填充背景
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // 绘制二维码模块
    ctx.fillStyle = fgColor;
    for (let row = 0; row < modules; row++) {
        for (let col = 0; col < modules; col++) {
            if (qr.isDark(row, col)) {
                const x = col * moduleSize;
                const y = row * moduleSize;
                
                switch (pattern) {
                    case 'circle':
                        ctx.beginPath();
                        ctx.arc(x + moduleSize/2, y + moduleSize/2, moduleSize/2 * 0.8, 0, 2 * Math.PI);
                        ctx.fill();
                        break;
                    case 'rounded':
                        drawRoundedRect(ctx, x, y, moduleSize * 0.9, moduleSize * 0.9, moduleSize * 0.2);
                        break;
                    case 'dot':
                        ctx.beginPath();
                        ctx.arc(x + moduleSize/2, y + moduleSize/2, moduleSize/4, 0, 2 * Math.PI);
                        ctx.fill();
                        break;
                    default: // square
                        ctx.fillRect(x, y, moduleSize, moduleSize);
                        break;
                }
            }
        }
    }
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

function addLogoToCanvas(ctx, logoSrc, canvasSize) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const logoSize = canvasSize * 0.2;
            const x = (canvasSize - logoSize) / 2;
            const y = (canvasSize - logoSize) / 2;

            // 绘制白色背景圆形
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(canvasSize/2, canvasSize/2, logoSize/2 + 5, 0, 2 * Math.PI);
            ctx.fill();

            // 绘制Logo
            ctx.save();
            ctx.beginPath();
            ctx.arc(canvasSize/2, canvasSize/2, logoSize/2, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(img, x, y, logoSize, logoSize);
            ctx.restore();
            
            resolve();
        };
        img.onerror = () => resolve();
        img.src = logoSrc;
    });
}

function downloadQR(format) {
    if (!currentQR) {
        alert('请先生成二维码');
        return;
    }

    try {
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        
        if (format === 'png') {
            link.download = `qrcode_${timestamp}.png`;
            link.href = currentQR.toDataURL('image/png');
        } else if (format === 'jpg') {
            link.download = `qrcode_${timestamp}.jpg`;
            link.href = currentQR.toDataURL('image/jpeg', 0.9);
        }
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('下载失败:', error);
        alert('下载失败，请重试');
    }
                                            }
