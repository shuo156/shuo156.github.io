// KaTeX 渲染
document.addEventListener("DOMContentLoaded", function() {
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, {
      delimiters: [
        {left: "$$", right: "$$", display: true},
        {left: "\\(", right: "\\)", display: false}
      ]
    });
  }
});

// 卡片翻转
document.addEventListener("DOMContentLoaded", function() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    card.addEventListener('click', function() {
      this.classList.toggle('flipped');
    });
  });
  
  // 移动端：点击背面返回
  document.querySelectorAll('.card-back').forEach(back => {
    back.addEventListener('click', function(e) {
      if (window.innerWidth < 768) {
        e.stopPropagation();
        this.closest('.card').classList.remove('flipped');
      }
    });
  });
});

// 主题切换
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const icon = document.querySelector('.theme-toggle i');
  
  if (currentTheme === 'dark') {
    html.removeAttribute('data-theme');
    if (icon) {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  } else {
    html.setAttribute('data-theme', 'dark');
    if (icon) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
  }
}

// 阶段切换
function showStage(grade) {
  const contents = document.querySelectorAll('.stage-content');
  const buttons = document.querySelectorAll('.stage-selector .btn');
  
  // 隐藏所有内容
  contents.forEach(content => {
    content.classList.remove('active');
  });
  
  // 显示选中的内容
  const activeContent = document.getElementById(grade);
  if (activeContent) {
    activeContent.classList.add('active');
  }
  
  // 更新按钮状态
  buttons.forEach(button => {
    button.classList.remove('btn-primary');
    button.classList.add('btn-outline-primary');
  });
  
  // 设置活动按钮
  let activeButtonText;
  if (grade === 'grade1') activeButtonText = 'Grade 10';
  else if (grade === 'grade2') activeButtonText = 'Grade 11';
  else activeButtonText = 'Grade 12';
  
  buttons.forEach(button => {
    if (button.textContent.trim() === activeButtonText) {
      button.classList.remove('btn-outline-primary');
      button.classList.add('btn-primary');
    }
  });
}

// 初始化
document.addEventListener("DOMContentLoaded", function() {
  // 初始化主题切换图标
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    const icon = document.createElement('i');
    icon.className = 'fas fa-moon';
    themeToggle.appendChild(icon);
  }
  
  // 初始化阶段选择器
  showStage('grade1');
});