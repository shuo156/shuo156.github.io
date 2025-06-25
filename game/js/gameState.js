const gameState = {
    // 基础属性
    intimacy: CONFIG.INITIAL_STATE.intimacy,
    mood: CONFIG.INITIAL_STATE.mood,
    energy: CONFIG.INITIAL_STATE.energy,
    hunger: CONFIG.INITIAL_STATE.hunger,
    days: CONFIG.INITIAL_STATE.days,
    
    // 收集内容
    events: [],          // 事件历史
    achievements: new Set(), // 已获得成就
    foodDiscovered: 0,   // 发现的食物数量
    
    // 物品栏
    inventory: {
        food: 5,
        toys: 2,
        gifts: 1
    },

    // 游戏统计
    stats: {
        totalEvents: 0,
        totalInteractions: 0,
        favoriteFood: null,
        bestMood: 0
    }
};