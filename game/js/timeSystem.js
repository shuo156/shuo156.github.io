const gameTime = {
    hour: 8,
    day: 1,
    
    updateTime() {
        this.hour++;
        if (this.hour >= 24) {
            this.hour = 0;
            this.day++;
            this.dailyUpdate();
        }
    },
    
    getTimeOfDay() {
        const h = this.hour;
        if (h >= 5 && h < 12) return '早上';
        if (h >= 12 && h < 14) return '中午';
        if (h >= 14 && h < 18) return '下午';
        if (h >= 18 && h < 22) return '晚上';
        return '深夜';
    },
    
    dailyUpdate() {
        gameState.hunger = Math.max(0, gameState.hunger - 20);
        gameState.energy = Math.min(100, gameState.energy + 50);
        gameState.mood = Math.max(0, gameState.mood - 10);
        addEvent('新的一天开始了！');
    }
};