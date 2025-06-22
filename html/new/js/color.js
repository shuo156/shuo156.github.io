// color.js

class ColorPreview {
    constructor(editor) {
        this.editor = editor;
        this.colorPreviewEnabled = true;
        this.previewElements = new Map(); // 存储颜色预览元素
        this.init();
    }

    init() {
        this.setupStyles();
        this.setupEventListeners();
        this.createColorPreviews();
    }

    setupStyles() {
        // 添加颜色预览的样式
        const style = document.createElement('style');
        style.textContent = `
            .color-preview {
                position: absolute;
                width: 12px;
                height: 12px;
                border-radius: 3px;
                border: 1px solid rgba(0, 0, 0, 0.2);
                pointer-events: none;
                transition: transform 0.15s ease;
            }

            .color-preview:hover {
                transform: scale(1.5);
                z-index: 1000;
            }

            .color-preview-wrapper {
                position: relative;
                display: inline-block;
                margin-left: 4px;
            }

            .color-preview-tooltip {
                position: absolute;
                background: var(--editor-bg);
                color: var(--text-color);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.2s;
                pointer-events: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                border: 1px solid var(--border-color);
            }

            .color-preview:hover + .color-preview-tooltip {
                opacity: 1;
            }

            @media (max-width: 768px) {
                .color-preview {
                    width: 10px;
                    height: 10px;
                }

                .color-preview-tooltip {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // 监听编辑器内容变化
        this.editor.addEventListener('input', () => {
            this.updateColorPreviews();
        });

        // 监听滚动事件，更新预览位置
        this.editor.addEventListener('scroll', () => {
            this.updatePreviewPositions();
        });

        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.updatePreviewPositions();
        });
    }

    createColorPreviews() {
        this.clearPreviews();
        const text = this.editor.value;
        const colorMatches = this.findColorPatterns(text);
        
        colorMatches.forEach(match => {
            const preview = this.createPreviewElement(match);
            if (preview) {
                this.previewElements.set(match.color, preview);
            }
        });

        this.updatePreviewPositions();
    }

    findColorPatterns(text) {
        const patterns = [
            // #RGB
            /#([0-9A-Fa-f]{3})\b/g,
            // #RGBA
            /#([0-9A-Fa-f]{4})\b/g,
            // #RRGGBB
            /#([0-9A-Fa-f]{6})\b/g,
            // #RRGGBBAA
            /#([0-9A-Fa-f]{8})\b/g,
            // rgb(r,g,b)
            /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/g,
            // rgba(r,g,b,a)
            /rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([0-1]?.?\d*)\s*\)/g,
            // hsl(h,s,l)
            /hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)/g,
            // hsla(h,s,l,a)
            /hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([0-1]?.?\d*)\s*\)/g,
            // CSS命名颜色
            /\b(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)\b/gi
        ];

        const colors = [];
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const color = match[0];
                const index = match.index;
                colors.push({ color, index });
            }
        });

        return colors;
    }

    createPreviewElement(match) {
        const wrapper = document.createElement('div');
        wrapper.className = 'color-preview-wrapper';

        const preview = document.createElement('div');
        preview.className = 'color-preview';
        preview.style.backgroundColor = match.color;

        const tooltip = document.createElement('div');
        tooltip.className = 'color-preview-tooltip';
        tooltip.textContent = match.color;

        wrapper.appendChild(preview);
        wrapper.appendChild(tooltip);

        return wrapper;
    }

    updatePreviewPositions() {
        requestAnimationFrame(() => {
            const text = this.editor.value;
            const lines = text.split('\n');
            let lineHeight = parseInt(getComputedStyle(this.editor).lineHeight);
            let charWidth = this.getCharacterWidth();

            this.previewElements.forEach((preview, color) => {
                const index = text.indexOf(color);
                if (index === -1) {
                    preview.remove();
                    this.previewElements.delete(color);
                    return;
                }

                const beforeText = text.substring(0, index);
                const lineCount = beforeText.split('\n').length - 1;
                const lastLineBreak = beforeText.lastIndexOf('\n');
                const column = lastLineBreak === -1 ? index : index - lastLineBreak - 1;

                const top = lineHeight * lineCount - this.editor.scrollTop;
                const left = column * charWidth - this.editor.scrollLeft;

                preview.style.position = 'absolute';
                preview.style.top = `${top + 4}px`;
                preview.style.left = `${left + charWidth * color.length + 4}px`;

                if (!preview.parentElement) {
                    this.editor.parentElement.appendChild(preview);
                }
            });
        });
    }

    getCharacterWidth() {
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.style.whiteSpace = 'pre';
        span.style.font = getComputedStyle(this.editor).font;
        span.textContent = 'X';
        document.body.appendChild(span);
        const width = span.getBoundingClientRect().width;
        document.body.removeChild(span);
        return width;
    }

    clearPreviews() {
        this.previewElements.forEach(preview => preview.remove());
        this.previewElements.clear();
    }

    updateColorPreviews() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }

        this.updateTimeout = setTimeout(() => {
            this.createColorPreviews();
        }, 100);
    }

    // 转换颜色格式
    convertColor(color) {
        if (color.startsWith('#')) {
            // 处理十六进制颜色
            if (color.length === 4) {
                // #RGB 转 #RRGGBB
                return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
            }
            return color;
        } else if (color.startsWith('rgb')) {
            // 处理 RGB/RGBA 颜色
            const values = color.match(/\d+/g);
            if (values.length >= 3) {
                const [r, g, b] = values;
                return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
            }
        } else if (color.startsWith('hsl')) {
            // 处理 HSL/HSLA 颜色
            const values = color.match(/\d+/g);
            if (values.length >= 3) {
                const [h, s, l] = values;
                return this.hslToHex(h, s, l);
            }
        }
        return color;
    }

    componentToHex(c) {
        const hex = parseInt(c).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    // 启用/禁用颜色预览
    toggle() {
        this.colorPreviewEnabled = !this.colorPreviewEnabled;
        if (this.colorPreviewEnabled) {
            this.createColorPreviews();
        } else {
            this.clearPreviews();
        }
    }
}

// 导出类
window.ColorPreview = ColorPreview;

// 在编辑器初始化时创建颜色预览实例
document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    if (editor) {
        window.colorPreview = new ColorPreview(editor);
    }
});