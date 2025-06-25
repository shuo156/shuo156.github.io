// 错误处理
window.onerror = function(msg, url, line) {
    console.error('Error:', msg);
    console.error('URL:', url);
    console.error('Line:', line);
    document.body.innerHTML += `<div style="color:red; padding: 20px;">
        Error: ${msg}<br>
        File: ${url}<br>
        Line: ${line}
    </div>`;
    return false;
};

// 辅助函数
function addEvent(text) {
    if (typeof UISystem !== 'undefined') {
        UISystem.addEvent(text);
    } else {
        console.error('UISystem not defined');
        document.getElementById('eventLog').innerHTML += `<p>${text}</p>`;
    }
}

// 游戏主循环
function gameLoop() {
    try {
        UISystem.updateStatus();
        checkAndUpdateState();
        gameTime.updateTime();
    } catch (e) {
        console.error('Error in gameLoop:', e);
    }
}

// 状态检查和更新
function checkAndUpdateState() {
    // 检查并更新状态
    if (gameState.hunger <= 20) {
        gameState.mood = Math.max(0, gameState.mood - 5);
        addEvent('法法感觉有点饿了...');
    }
    if (gameState.energy <= 10) {
        gameState.mood = Math.max(0, gameState.mood - 5);
        addEvent('法法非常疲惫...');
    }
}

// 互动函数
function interact(action) {
    try {
        switch(action) {
            case 'feed':
                if (gameState.inventory.food > 0) {
                    gameState.inventory.food--;
                    gameState.hunger = Math.min(100, gameState.hunger + 30);
                    gameState.mood = Math.min(100, gameState.mood + 10);
                    addEvent('给法法喂食，法法看起来很满足！');
                } else {
                    addEvent('食物不足！');
                }
                break;
                
            case 'play':
                if (gameState.energy >= 20) {
                    gameState.energy -= 20;
                    gameState.mood = Math.min(100, gameState.mood + 15);
                    gameState.intimacy += 2;
                    addEvent('和法法玩耍，度过了愉快的时光！');
                } else {
                    addEvent('法法太累了，需要休息...');
                }
                break;
                
            case 'rest':
                gameState.energy = Math.min(100, gameState.energy + 30);
                gameState.mood = Math.min(100, gameState.mood + 5);
                addEvent('法法美美地睡了一觉。');
                break;
        }
        gameLoop();
    } catch (e) {
        console.error('Error in interact:', e);
        addEvent('进行互动时出现错误...');
    }
}

// 游戏初始化
function initGame() {
    console.log('Starting game initialization...');
    try {
        // 检查必要的系统是否存在
        if (!UISystem) throw new Error('UISystem not loaded');
        if (!gameState) throw new Error('gameState not loaded');
        if (!gameTime) throw new Error('gameTime not loaded');
        if (!CONFIG) throw new Error('CONFIG not loaded');
        
        // 初始化 UI
        console.log('Initializing UI...');
        
        // 添加基础操作按钮
        const actions = [
            {id: 'feed', text: '喂食'},
            {id: 'play', text: '玩耍'},
            {id: 'rest', text: '休息'}
        ];
        
        const actionMenu = document.getElementById('actions');
        if (!actionMenu) throw new Error('Actions menu element not found');
        
        // 清空现有按钮
        actionMenu.innerHTML = '';
        
        // 添加新按钮
        actions.forEach(action => {
            const button = document.createElement('button');
            button.textContent = action.text;
            button.onclick = () => interact(action.id);
            actionMenu.appendChild(button);
        });

        // 初始化状态显示
        UISystem.updateStatus();

        // 开始游戏
        console.log('Game initialized successfully');
        addEvent('游戏开始！遇见了可爱的法法~');
        gameLoop();
        
        // 设置定时器
        setInterval(gameLoop, 60000); // 每分钟更新一次
        setInterval(() => {
            try {
                if (typeof SaveManager !== 'undefined') {
                    SaveManager.save(1);
                }
            } catch (e) {
                console.error('Auto-save error:', e);
            }
        }, CONFIG.AUTO_SAVE_INTERVAL);

    } catch (e) {
        console.error('Error during game initialization:', e);
        document.body.innerHTML += `<div style="color:red; padding: 20px;">
            初始化游戏时出错：${e.message}<br>
            请刷新页面重试
        </div>`;
    }
}

// 等待页面加载完成后启动游戏
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    initGame();
});

// 备用启动方式
window.onload = () => {
    if (!window.gameInitialized) {
        console.log('Window loaded, initializing game (backup)...');
        initGame();
    }
};