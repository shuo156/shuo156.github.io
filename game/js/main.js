function gameLoop() {
    UISystem.updateStatus();
    EventSystem.checkEvents();
    AchievementSystem.check();
    gameTime.updateTime();
}

function initGame() {
    // 初始化存档系统
    createSaveLoadUI();
    addSaveLoadButton();
    
    // 添加基础操作按钮
    const actions = [
        {id: 'feed', text: '喂食'},
        {id: 'play', text: '玩耍'},
        {id: 'rest', text: '休息'}
    ];
    
    const actionMenu = document.getElementById('actions');
    actions.forEach(action => {
        const button = document.createElement('button');
        button.textContent = action.text;
        button.onclick = () => interact(action.id);
        actionMenu.appendChild(button);
    });

    // 开始游戏
    addEvent('游戏开始！遇见了可爱的法法~');
    gameLoop();
    
    // 设置定时器
    setInterval(gameLoop, 60000); // 每分钟更新
    setInterval(() => SaveManager.save(1), CONFIG.AUTO_SAVE_INTERVAL); // 自动存档
}

function interact(action) {
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
}

// 启动游戏
window.onload = initGame;