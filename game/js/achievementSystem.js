const AchievementSystem = {
    check() {
        Object.entries(achievements).forEach(([key, ach]) => {
            if (key !== 'eventAchievements' && 
                !gameState.achievements.has(ach.id) && 
                ach.check(gameState, gameTime)) {
                this.unlock(ach);
            }
        });
    },

    unlock(ach) {
        gameState.achievements.add(ach.id);
        DialogSystem.showAchievementUnlock(ach);
    },

    getProgress() {
        const total = Object.keys(achievements).length - 1 + 
                     Object.keys(achievements.eventAchievements).length;
        return Math.floor((gameState.achievements.size / total) * 100);
    }
};