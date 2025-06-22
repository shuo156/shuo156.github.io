// syntax-completion.js

class SyntaxCompleter {
    constructor(editor) {
        this.editor = editor;
        this.snippets = {
            // DOCTYPE 和基础结构
            '<!DOC': '<!DOCTYPE html>',
            'html': '<!DOCTYPE html>\n<html lang="zh">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    \n</body>\n</html>',
            'head': '<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>',
            'body': '<body>\n    \n</body>',

            // 常用元数据标签
            'meta': '<meta>',
            'meta:charset': '<meta charset="UTF-8">',
            'meta:vp': '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            'meta:desc': '<meta name="description" content="">',
            'meta:kw': '<meta name="keywords" content="">',
            'link': '<link rel="stylesheet" href="">',
            'script': '<script>\n    \n</script>',
            'script:src': '<script src=""></script>',
            'style': '<style>\n    \n</style>',

            // 常用HTML标签
            'div': '<div></div>',
            'div.': '<div class=""></div>',
            'div#': '<div id=""></div>',
            'p': '<p></p>',
            'span': '<span></span>',
            'a': '<a href=""></a>',
            'img': '<img src="" alt="">',
            'ul': '<ul>\n    <li></li>\n</ul>',
            'ol': '<ol>\n    <li></li>\n</ol>',
            'li': '<li></li>',
            
            // 表单元素
            'form': '<form action="" method="post">\n    \n</form>',
            'input': '<input type="text" name="">',
            'input:text': '<input type="text" name="">',
            'input:password': '<input type="password" name="">',
            'input:email': '<input type="email" name="">',
            'input:number': '<input type="number" name="">',
            'input:submit': '<input type="submit" value="">',
            'input:checkbox': '<input type="checkbox" name="">',
            'input:radio': '<input type="radio" name="">',
            'button': '<button type="button"></button>',
            'select': '<select name="">\n    <option value=""></option>\n</select>',
            'textarea': '<textarea name="" rows="4" cols="50"></textarea>',

            // HTML5语义化标签
            'header': '<header>\n    \n</header>',
            'nav': '<nav>\n    \n</nav>',
            'main': '<main>\n    \n</main>',
            'article': '<article>\n    \n</article>',
            'section': '<section>\n    \n</section>',
            'aside': '<aside>\n    \n</aside>',
            'footer': '<footer>\n    \n</footer>',

            // 表格相关
            'table': '<table>\n    <tr>\n        <td></td>\n    </tr>\n</table>',
            'tr': '<tr>\n    <td></td>\n</tr>',
            'td': '<td></td>',
            'th': '<th></th>',

            // 多媒体元素
            'video': '<video width="320" height="240" controls>\n    <source src="" type="video/mp4">\n    您的浏览器不支持视频标签\n</video>',
            'audio': '<audio controls>\n    <source src="" type="audio/mpeg">\n    您的浏览器不支持音频标签\n</audio>',
            'canvas': '<canvas id="" width="300" height="150"></canvas>',

            // CSS常用属性
            'bg': 'background: ',
            'bgc': 'background-color: ',
            'bgi': 'background-image: url("")',
            'ff': 'font-family: ',
            'fs': 'font-size: ',
            'fw': 'font-weight: ',
            'lh': 'line-height: ',
            'col': 'color: ',
            'pos': 'position: ',
            'pos:a': 'position: absolute;',
            'pos:r': 'position: relative;',
            'pos:f': 'position: fixed;',
            'd': 'display: ',
            'd:f': 'display: flex;',
            'd:g': 'display: grid;',
            'd:b': 'display: block;',
            'd:i': 'display: inline;',
            'd:n': 'display: none;',

            // Flexbox 布局
            'fld': 'flex-direction: ',
            'jc': 'justify-content: ',
            'ai': 'align-items: ',
            'gap': 'gap: ',

            // Grid 布局
            'gtc': 'grid-template-columns: ',
            'gtr': 'grid-template-rows: ',
            'gg': 'grid-gap: ',

            // 常用媒体查询
            'mq': '@media screen and (max-width: ) {\n    \n}',
            'mqm': '@media screen and (max-width: 768px) {\n    \n}',
            'mqt': '@media screen and (max-width: 1024px) {\n    \n}',

            // JavaScript常用代码段
            'log': 'console.log();',
            'fun': 'function name() {\n    \n}',
            'af': '() => {\n    \n}',
            'if': 'if () {\n    \n}',
            'for': 'for (let i = 0; i < ; i++) {\n    \n}',
            'forin': 'for (const key in object) {\n    \n}',
            'forof': 'for (const item of items) {\n    \n}',
            'fetch': 'fetch(url)\n    .then(response => response.json())\n    .then(data => {\n        \n    })\n    .catch(error => console.error("Error:", error));',

            // 常用注释
            'comment': '<!-- -->',
            'todo': '<!-- TODO: -->',
            'fixme': '<!-- FIXME: -->',
            'css-comment': '/* */',
            'js-comment': '// ',

            // Bootstrap 类
            'container': '<div class="container">\n    \n</div>',
            'row': '<div class="row">\n    \n</div>',
            'col': '<div class="col">\n    \n</div>',
            'btn': '<button class="btn btn-primary"></button>',
            'card': '<div class="card">\n    <div class="card-body">\n        <h5 class="card-title"></h5>\n        <p class="card-text"></p>\n    </div>\n</div>'
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createSuggestionBox();
    }

    setupEventListeners() {
        this.editor.addEventListener('input', (e) => this.handleInput(e));
        this.editor.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('click', () => this.hideSuggestions());
    }

    createSuggestionBox() {
        this.suggestionBox = document.createElement('div');
        this.suggestionBox.className = 'suggestion-box';
        this.suggestionBox.style.cssText = `
            position: absolute;
            display: none;
            background: var(--editor-bg);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 0 2px 6px var(--shadow-color);
        `;
        document.body.appendChild(this.suggestionBox);
    }

    handleInput(e) {
        const pos = this.editor.selectionStart;
        const text = this.editor.value;
        const beforeCursor = text.substring(0, pos);
        const word = this.getLastWord(beforeCursor);

        if (word) {
            const suggestions = this.getSuggestions(word);
            if (suggestions.length > 0) {
                this.showSuggestions(suggestions, word);
            } else {
                this.hideSuggestions();
            }
        } else {
            this.hideSuggestions();
        }
    }

    handleKeyDown(e) {
        if (this.suggestionBox.style.display === 'block') {
            const selected = this.suggestionBox.querySelector('.selected');
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.selectNext(selected);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.selectPrevious(selected);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selected) {
                        this.insertSnippet(selected.dataset.snippet);
                    }
                    break;
                case 'Tab':
                    e.preventDefault();
                    if (selected) {
                        this.insertSnippet(selected.dataset.snippet);
                    }
                    break;
                case 'Escape':
                    this.hideSuggestions();
                    break;
            }
        }
    }

    getLastWord(text) {
        const match = text.match(/[\w:.#-]+$/);
        return match ? match[0] : '';
    }

    getSuggestions(word) {
        return Object.keys(this.snippets)
            .filter(key => key.toLowerCase().startsWith(word.toLowerCase()))
            .sort((a, b) => a.length - b.length);
    }

    showSuggestions(suggestions, word) {
        const pos = this.getCaretCoordinates();
        this.suggestionBox.style.left = pos.left + 'px';
        this.suggestionBox.style.top = pos.top + 'px';
        
        this.suggestionBox.innerHTML = suggestions
            .map(s => `<div class="suggestion-item" data-snippet="${s}">
                <span class="suggestion-text">${s}</span>
                <span class="suggestion-preview">${this.getPreview(s)}</span>
            </div>`)
            .join('');

        this.suggestionBox.style.display = 'block';
        
        // 添加点击事件
        this.suggestionBox.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                this.insertSnippet(item.dataset.snippet);
            });
            item.addEventListener('mouseover', () => {
                this.suggestionBox.querySelector('.selected')?.classList.remove('selected');
                item.classList.add('selected');
            });
        });

        // 选中第一个建议
        this.suggestionBox.querySelector('.suggestion-item')?.classList.add('selected');
    }

    getPreview(snippet) {
        const content = this.snippets[snippet];
        return content.length > 50 ? content.substring(0, 47) + '...' : content;
    }

    getCaretCoordinates() {
        const pos = this.editor.selectionStart;
        const dummy = document.createElement('div');
        dummy.style.cssText = window.getComputedStyle(this.editor).cssText;
        dummy.style.height = 'auto';
        dummy.style.position = 'absolute';
        dummy.style.visibility = 'hidden';
        dummy.style.whiteSpace = 'pre-wrap';
        
        dummy.textContent = this.editor.value.substring(0, pos);
        document.body.appendChild(dummy);
        
        const rect = dummy.getBoundingClientRect();
        const editorRect = this.editor.getBoundingClientRect();
        document.body.removeChild(dummy);

        return {
            left: editorRect.left + (rect.width % editorRect.width),
            top: editorRect.top + rect.height + 5
        };
    }

    selectNext(selected) {
        const items = this.suggestionBox.querySelectorAll('.suggestion-item');
        const currentIndex = Array.from(items).indexOf(selected);
        const nextIndex = (currentIndex + 1) % items.length;
        
        selected?.classList.remove('selected');
        items[nextIndex].classList.add('selected');
        this.scrollIntoViewIfNeeded(items[nextIndex]);
    }

    selectPrevious(selected) {
        const items = this.suggestionBox.querySelectorAll('.suggestion-item');
        const currentIndex = Array.from(items).indexOf(selected);
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        
        selected?.classList.remove('selected');
        items[prevIndex].classList.add('selected');
        this.scrollIntoViewIfNeeded(items[prevIndex]);
    }

    scrollIntoViewIfNeeded(element) {
        const parent = this.suggestionBox;
        const parentRect = parent.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        if (elementRect.bottom > parentRect.bottom) {
            parent.scrollTop += elementRect.bottom - parentRect.bottom;
        } else if (elementRect.top < parentRect.top) {
            parent.scrollTop -= parentRect.top - elementRect.top;
        }
    }

    insertSnippet(snippet) {
        const start = this.editor.selectionStart;
        const text = this.editor.value;
        const beforeCursor = text.substring(0, start);
        const afterCursor = text.substring(start);
        const word = this.getLastWord(beforeCursor);
        const beforeWord = beforeCursor.substring(0, beforeCursor.length - word.length);
        
        const snippetContent = this.snippets[snippet];
        this.editor.value = beforeWord + snippetContent + afterCursor;
        
        // 设置光标位置到代码段中的占位符位置
        const placeholderPos = snippetContent.indexOf('');
        const newPos = placeholderPos !== -1
            ? beforeWord.length + placeholderPos
            : beforeWord.length + snippetContent.length;
        
        this.editor.selectionStart = this.editor.selectionEnd = newPos;
        this.hideSuggestions();
        this.editor.focus();
    }

    hideSuggestions() {
        this.suggestionBox.style.display = 'none';
    }
}

// 添加样式
const style = document.createElement('style');
style.textContent = `
    .suggestion-box {
        font-family: 'CustomFont', monospace;
        font-size: 14px;
    }
    
    .suggestion-item {
        padding: 8px 12px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
    }
    
    .suggestion-item:hover,
    .suggestion-item.selected {
        background-color: var(--hover-color);
    }
    
    .suggestion-text {
        font-weight: bold;
    }
    
    .suggestion-preview {
        color: var(--text-color);
        opacity: 0.6;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
        .suggestion-box {
            font-size: 12px;
            max-width: 90vw;
        }
        
        .suggestion-item {
            padding: 10px;
        }
        
        .suggestion-preview {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    if (editor) {
        new SyntaxCompleter(editor);
    }
});