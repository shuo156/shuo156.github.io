const SaveManager = {
    MAX_SAVES: CONFIG.MAX_SAVES,
    
    save(slotId) {
        try {
            localStorage.setItem(`save_${slotId}`, JSON.stringify({
                timestamp: new Date().toLocaleString(),
                gameState: {...gameState},
                gameTime: {...gameTime}
            }));
            addEvent(`已存档 ${slotId}`);
            return true;
        } catch (e) {
            addEvent('存档失败');
            return false;
        }
    },
    
    load(slotId) {
        try {
            const data = JSON.parse(localStorage.getItem(`save_${slotId}`));
            if (!data) return false;
            Object.assign(gameState, data.gameState);
            Object.assign(gameTime, data.gameTime);
            addEvent(`已读取存档 ${slotId}`);
            updateStatus();
            return true;
        } catch (e) {
            addEvent('读档失败');
            return false;
        }
    },
    
    delete(slotId) {
        localStorage.removeItem(`save_${slotId}`);
        addEvent(`已删除存档 ${slotId}`);
    },
    
    getAllSaves() {
        return Array.from({length: this.MAX_SAVES}, (_, i) => 
            this.getSaveInfo(i + 1)).filter(Boolean);
    },

    getSaveInfo(slotId) {
        try {
            const data = JSON.parse(localStorage.getItem(`save_${slotId}`));
            return data ? {
                slotId,
                timestamp: data.timestamp,
                intimacy: data.gameState.intimacy,
                days: data.gameState.days
            } : null;
        } catch {
            return null;
        }
    }
};