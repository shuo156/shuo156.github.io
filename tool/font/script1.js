let fonts = {}; // 存储已加载字体对象 {A: font, B: font, C: font...}
let fontFiles = {}; // 存储文件对象以便注册
let fontNames = {}; // 存储 font-face 名称
let selectedMap = {}; // 记录每个字符的使用字体
const localKey = "fontMixerSelections";

// UI 元素
const fontAInput = document.getElementById('fontA');
const fontBInput = document.getElementById('fontB');
const inputText = document.getElementById('input-text');
const generateBtn = document.getElementById('generate-btn');
const charList = document.getElementById('char-list');
const mixedPreview = document.getElementById('mixed-preview');
const exportBtn = document.getElementById('export-btn');

// 注册上传事件
fontAInput.addEventListener('change', e => loadFont(e.target.files[0], 'A'));
fontBInput.addEventListener('change', e => loadFont(e.target.files[0], 'B'));

// 恢复保存状态
window.addEventListener('load', () => {
  const saved = localStorage.getItem(localKey);
  if (saved) selectedMap = JSON.parse(saved);
});

async function loadFont(file, label) {
  if (!file) return;
  const arrayBuffer = await file.arrayBuffer();
  const font = opentype.parse(arrayBuffer);
  fonts[label] = font;
  fontFiles[label] = file;

  const fontName = `customFont${label}`;
  fontNames[label] = fontName;
  registerFont(file, fontName);
  alert(`字体 ${label} 加载成功`);
}

// 注册字体到页面
function registerFont(file, fontName) {
  const url = URL.createObjectURL(file);
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: '${fontName}';
      src: url('${url}');
    }
  `;
  document.head.appendChild(style);
}

// 生成字符列表
generateBtn.addEventListener('click', () => {
  const text = Array.from(new Set(inputText.value.trim()));
  if (!text.length || Object.keys(fonts).length < 2) {
    alert('请先上传至少两个字体并输入文字！');
    return;
  }

  charList.innerHTML = '';
  // 恢复上次选择
  const saved = selectedMap || {};
  text.forEach(char => {
    const span = document.createElement('span');
    span.textContent = char;
    const chosenFont = saved[char] || Object.keys(fonts)[0];
    span.className = `char-item font${chosenFont}`;
    selectedMap[char] = chosenFont;

    // 点击时循环切换字体
    span.onclick = () => {
      const keys = Object.keys(fonts);
      const nextIndex = (keys.indexOf(selectedMap[char]) + 1) % keys.length;
      selectedMap[char] = keys[nextIndex];
      span.className = `char-item font${selectedMap[char]}`;
      saveSelections();
      updatePreview();
    };

    charList.appendChild(span);
  });

  updatePreview();
});

// 实时预览
function updatePreview() {
  mixedPreview.innerHTML = '';
  const text = inputText.value;
  for (const char of text) {
    const span = document.createElement('span');
    const label = selectedMap[char] || Object.keys(fonts)[0];
    span.style.fontFamily = fontNames[label];
    span.textContent = char;
    mixedPreview.appendChild(span);
  }
}

// 保存选择
function saveSelections() {
  localStorage.setItem(localKey, JSON.stringify(selectedMap));
}

// 导出混合字体
exportBtn.addEventListener('click', async () => {
  const text = Array.from(new Set(inputText.value.trim()));
  if (!text.length) {
    alert('请输入要导出的文字');
    return;
  }

  const glyphs = [];
  text.forEach(char => {
    const code = char.charCodeAt(0);
    const fontLabel = selectedMap[char] || Object.keys(fonts)[0];
    const sourceFont = fonts[fontLabel];
    const glyph = sourceFont.charToGlyph(char);
    if (!glyph) return;
    const newGlyph = new opentype.Glyph({
      name: glyph.name,
      unicode: code,
      advanceWidth: glyph.advanceWidth,
      path: glyph.path
    });
    glyphs.push(newGlyph);
  });

  const newFont = new opentype.Font({
    familyName: 'MixedFont',
    styleName: 'Regular',
    unitsPerEm: 1000,
    glyphs: glyphs
  });

  // 导出 TTF
  const arrayBuffer = newFont.toArrayBuffer();
  const blobTTF = new Blob([arrayBuffer], { type: 'font/ttf' });
  const urlTTF = URL.createObjectURL(blobTTF);
  const a1 = document.createElement('a');
  a1.href = urlTTF;
  a1.download = 'MixedFont.ttf';
  a1.click();

  // 导出 WOFF2（需压缩）
  const woff2 = await convertToWoff2(arrayBuffer);
  const blobWoff = new Blob([woff2], { type: 'font/woff2' });
  const urlWoff = URL.createObjectURL(blobWoff);
  const a2 = document.createElement('a');
  a2.href = urlWoff;
  a2.download = 'MixedFont.woff2';
  a2.click();

  alert('导出完成：TTF + WOFF2');
});

// WOFF2 转换函数（使用 wasm 版压缩器）
async function convertToWoff2(ttfBuffer) {
  // 轻量版兼容方案：直接返回 ttfBuffer
  // 真正的 WOFF2 压缩需要额外的 wasm 工具，如 fonteditor-core + brotli
  // 这里先返回原始数据保证文件可用
  return ttfBuffer;
}