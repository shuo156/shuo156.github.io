import datetime


def generate_html(page_title, article_title, paragraphs, filename):

    now_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

    # ================== 字数 / 阅读时间 ==================

    total_text = "".join(paragraphs)

    word_count = len(total_text)

    read_time = max(1, round(word_count / 300))


    # ================== 正文生成 ==================

    content_html = ""

    for p in paragraphs:

        if p.strip():

            content_html += f"<p>　　{p}</p>\n"


    # ================== HTML 模板 ==================

    html_template = f"""
<!DOCTYPE html>
<html lang="zh-CN">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover">

    <title>{page_title}</title>


    <!-- FontAwesome -->
    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">


    <!-- Apple UI -->
    <link rel="stylesheet"
        href="https://shuo156.github.io/css/apple.css">

    <script src="https://shuo156.github.io/js/apple.js"></script>


    <!-- Font Override -->
    <style>

        /* ================= Apple System Font ================= */

        :root {{

            --font-stack:
                -apple-system,
                BlinkMacSystemFont,
                "SF Pro Text",
                "SF Pro Display",
                "PingFang SC",
                "Helvetica Neue",
                Arial,
                sans-serif;
        }}


        body {{
            font-family: var(--font-stack) !important;
        }}


        /* ================= Title ================= */

        h1 {{
            text-align: center !important;
            margin-top: 20px;
            font-size: 32px;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.03em;
        }}


        /* ================= Meta ================= */

        .meta-info {{
            text-align: center;
            color: var(--text-secondary);
            font-size: 13px;
            margin-bottom: 40px;

            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
        }}


        /* ================= Content ================= */

        .article-content p {{
            margin: 24px 0;
            line-height: 1.8;
            text-align: justify;
        }}


        /* ================= Footer ================= */

        .footer-note {{
            margin-top: 60px;
            padding: 20px;
            background: rgba(128,128,128,0.05);
            border-radius: 15px;
            text-align: center;
            font-size: 12px;
            color: var(--text-secondary);
        }}

    </style>

</head>


<body>

    <!-- Progress -->
    <div id="progress-bar"></div>


    <!-- Theme -->
    <button class="theme-toggle"
        onclick="toggleTheme(event)"
        id="themeBtn">

        <i class="fa-solid fa-sun" id="themeIcon"></i>

    </button>


    <!-- Scroll Top -->
    <button id="scrollTopBtn"
        onclick="window.scrollTo({{top:0,behavior:'smooth'}})">

        <i class="fa-solid fa-arrow-up"></i>

    </button>


    <!-- Main -->
    <div class="container">

        <h1>{article_title}</h1>


        <div class="meta-info">

            <span>
                <i class="fa-regular fa-calendar"></i>
                {now_time}
            </span>

            <span>
                <i class="fa-regular fa-file-lines"></i>
                {word_count} 字
            </span>

            <span>
                <i class="fa-regular fa-clock"></i>
                预计阅读 {read_time} 分钟
            </span>

        </div>


        <div class="article-content" id="articleBody">

{content_html}

        </div>


        <div class="footer-note">

            © {datetime.datetime.now().year} All Rights Reserved.

        </div>

    </div>


    <!-- Bottom Nav -->
    <nav class="bottom-nav">

        <a href="/" class="nav-item">

            <i class="fa-solid fa-house"></i>
            <span>首页</span>

        </a>


        <button class="nav-item"
            onclick="toggleFontSize()">

            <i class="fa-solid fa-font"></i>
            <span>字号</span>

        </button>


        <button class="nav-item"
            onclick="sharePage()">

            <i class="fa-solid fa-arrow-up-from-bracket"></i>
            <span>分享</span>

        </button>

    </nav>

</body>
</html>
"""


    # ================== 写入文件 ==================

    with open(filename, "w", encoding="utf-8") as f:

        f.write(html_template)


    print("\n✅ 页面生成成功：", filename)

    print(f"📊 字数：{word_count} 字")

    print(f"⏱️ 预计阅读：{read_time} 分钟\n")



def main():

    print("=" * 46)

    print("   Apple Style Article Generator v3.0")

    print("=" * 46)


    page_title = input("\n请输入网页标题 (Tab Title)：").strip()

    article_title = input("请输入文章标题 (H1 Title)：").strip()


    try:

        num = int(input("请输入段落数量："))

    except:

        num = 1


    paragraphs = []

    print("\n[ 输入正文内容 ]\n")


    for i in range(num):

        text = input(f"第 {i+1} 段：").strip()

        paragraphs.append(text)


    filename = input("\n保存文件名 (默认 article.html)：").strip() or "article.html"


    if not filename.endswith(".html"):

        filename += ".html"


    generate_html(

        page_title,

        article_title,

        paragraphs,

        filename

    )



if __name__ == "__main__":

    main()