// script.js
// 依赖：opentype.js
let font1 = null;
let font2 = null;
let combinedGlyphs = [];

const font1Input = document.getElementById('font1');
const font2Input = document.getElementById('font2');
const textInput = document.getElementById('textInput');
const previewArea = document.getElementById('preview');
const exportBtn = document.getElementById('exportFont');

// 加载字体
function loadFont(fileInput, callback) {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const font = opentype.parse(e.target.result);
            callback(font);
        } catch (err) {
            alert('字体文件无法解析: ' + err);
        }
    };
    reader.readAsArrayBuffer(file);
}

font1Input.addEventListener('change', () => {
    loadFont(font1Input, f => {
        font1 = f;
        console.log('字体1已加载:', font1.names.fullName.en || '未知');
    });
});

font2Input.addEventListener('change', () => {
    loadFont(font2Input, f => {
        font2 = f;
        console.log('字体2已加载:', font2.names.fullName.en || '未知');
    });
});

// 输入文字后生成可选择字形
textInput.addEventListener('input', () => {
    const text = textInput.value.trim();
    previewArea.innerHTML = '';
    combinedGlyphs = [];

    if (!text || !font1 || !font2) {
        previewArea.innerHTML = '<p style="color:#777">请先加载两个字体文件并输入文字。</p>';
        return;
    }

    for (const char of text) {
        const container = document.createElement('div');
        container.className = 'char-block';

        const glyph1 = font1.charToGlyph(char);
        const glyph2 = font2.charToGlyph(char);

        const span1 = document.createElement('span');
        span1.textContent = char;
        span1.style.fontFamily = 'font1';
        span1.style.display = 'inline-block';
        span1.style.margin = '0 4px';
        span1.style.cursor = 'pointer';
        span1.title = '字体1';

        const span2 = document.createElement('span');
        span2.textContent = char;
        span2.style.fontFamily = 'font2';
        span2.style.display = 'inline-block';
        span2.style.margin = '0 4px';
        span2.style.cursor = 'pointer';
        span2.title = '字体2';

        const label = document.createElement('p');
        label.textContent = char;
        label.className = 'char-label';

        let selectedFont = 1;
        combinedGlyphs.push(glyph1);

        function selectFont(n) {
            selectedFont = n;
            combinedGlyphs[text.indexOf(char)] = (n === 1) ? glyph1 : glyph2;
            span1.style.border = (n === 1) ? '2px solid dodgerblue' : '2px solid transparent';
            span2.style.border = (n === 2) ? '2px solid dodgerblue' : '2px solid transparent';
        }

        span1.onclick = () => selectFont(1);
        span2.onclick = () => selectFont(2);
        selectFont(1);

        container.appendChild(label);
        container.appendChild(span1);
        container.appendChild(span2);
        previewArea.appendChild(container);
    }

    // 动态插入字体样式
    const s1 = document.createElement('style');
    s1.innerHTML = `
        @font-face { font-family: 'font1'; src: url(${URL.createObjectURL(font1Input.files[0])}); }
        @font-face { font-family: 'font2'; src: url(${URL.createObjectURL(font2Input.files[0])}); }
    `;
    document.head.appendChild(s1);
});

// 导出新字体
exportBtn.addEventListener('click', () => {
    if (!combinedGlyphs.length) {
        alert('请先选择字符！');
        return;
    }

    const newFont = new opentype.Font({
        familyName: 'MixedFont',
        styleName: 'Regular',
        unitsPerEm: font1.unitsPerEm || 1000,
        ascender: font1.ascender || 800,
        descender: font1.descender || -200,
        glyphs: combinedGlyphs
    });

    const buffer = newFont.toArrayBuffer();
    const blob = new Blob([buffer], { type: 'font/ttf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'MixedFont.ttf';
    a.click();
});