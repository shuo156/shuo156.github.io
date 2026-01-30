import datetime

def generate_html(page_title, article_title, paragraphs, filename):
    now_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    
    # 扩展功能 1：计算字数和预计阅读时间
    total_text = "".join(paragraphs)
    word_count = len(total_text)
    read_time = max(1, word_count // 300)  # 假设每分钟读300字

    # 生成段落HTML
    content_html = ""
    for p in paragraphs:
        if p.strip():
            content_html += f"<p>　　{p}</p>\n"

    # HTML 模板升级
    html_template = f"""
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>{page_title}</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <link rel="stylesheet" href="https://shuo156.github.io/css/apple.css">
    <script src="https://shuo156.github.io/js/apple.js"></script>

    <style>
        /* 强制覆盖：标题居中及扩展样式 */
        h1 {{
            text-align: center !important;
            margin-top: 20px;
            font-size: 32px;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.03em;
        }}

        .meta-info {{
            text-align: center;
            color: var(--text-secondary);
            font-size: 13px;
            margin-bottom: 40px;
            display: flex;
            justify-content: center;
            gap: 15px;
        }}

        .article-content p {{
            margin: 24px 0;
            line-height: 1.8;
            text-align: justify;
        }}

        /* 扩展：iOS 风格的卡片脚注 */
        .footer-note {{
            margin-top: 60px;
            padding: 20px;
            background: rgba(128, 128, 128, 0.05);
            border-radius: 15px;
            text-align: center;
            font-size: 12px;
            color: var(--text-secondary);
        }}
    </style>
</head>

<body>

    <div id="progress-bar"></div>

    <button class="theme-toggle" onclick="toggleTheme(event)">
        <i class="fa-solid fa-sun" id="themeIcon"></i>
    </button>

    <button id="scrollTopBtn" onclick="window.scrollTo({{top: 0, behavior: 'smooth'}})">
        <i class="fa-solid fa-arrow-up"></i>
    </button>

    <div class="container">

        <h1>{article_title}</h1>

        <div class="meta-info">
            <span><i class="fa-regular fa-calendar"></i> {now_time}</span>
            <span><i class="fa-regular fa-file-lines"></i> {word_count} 字</span>
            <span><i class="fa-regular fa-clock"></i> 预计阅读 {read_time} 分钟</span>
        </div>

        <div class="article-content" id="articleBody">
            {content_html}
        </div>

        <div class="footer-note">
            <p>© {datetime.datetime.now().year} All Rights Reserved.</p>
        </div>
    </div>

    <nav class="bottom-nav">
        <a href="/" class="nav-item">
            <i class="fa-solid fa-house"></i>
            <span>首页</span>
        </a>

        <button class="nav-item" onclick="toggleFontSize()">
            <i class="fa-solid fa-font"></i>
            <span>字号</span>
        </button>

        <button class="nav-item" onclick="sharePage()">
            <i class="fa-solid fa-arrow-up-from-bracket"></i>
            <span>分享</span>
        </button>
    </nav>

</body>
</html>
"""

    with open(filename, "w", encoding="utf-8") as f:
        f.write(html_template)

    print(f"\n✅ 苹果风页面已生成：{filename}")
    print(f"📊 统计信息：{word_count}字，预计阅读{read_time}分钟\n")


def main():
    print("=" * 40)
    print("   Apple Style Article Generator v2.0")
    print("=" * 40)

    page_title = input("\n请输入网页标题 (Tab Title)：")
    article_title = input("请输入文章标题 (H1 Title)：")

    try:
        num = int(input("请输入段落数量："))
    except ValueError:
        num = 1

    paragraphs = []
    print("\n[ 请输入正文内容 ]")
    for i in range(num):
        text = input(f"第 {i+1} 段：")
        paragraphs.append(text)

    filename = input("\n保存文件名 (直接回车默认 article.html)：") or "article.html"
    if not filename.endswith(".html"):
        filename += ".html"

    generate_html(page_title, article_title, paragraphs, filename)

if __name__ == "__main__":
    main()
