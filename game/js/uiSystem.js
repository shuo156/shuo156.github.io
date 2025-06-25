const UISystem = {
    updateStatus() {
        const statusHTML = `
            亲密度: ${gameState.intimacy}<br>
            心情: ${this.getMoodText(gameState.mood)}<br>
            体力: ${gameState.energy}<br>
            饱食度: ${gameState.hunger}<br>
            天数: ${gameTime.day} (${gameTime.getTimeOfDay()})
        `;
        document.getElementById('status').innerHTML = statusHTML;
    },

    getMoodText(mood) {
        if (mood >= 80) return '非常开心';
        if (mood >= 60) return '心情不错';
        if (mood >= 40) return '普通';
        if (mood >= 20) return '有点闷闷不乐';
        return '非常沮丧';
    },

    addEvent(text) {
        const eventLog = document.getElementById('eventLog');
        const time = gameTime.getTimeOfDay();
        eventLog.innerHTML = `<p>${time}: ${text}</p>` + eventLog.innerHTML;
        
        if (eventLog.children.length > CONFIG.MAX_EVENT_HISTORY) {
            eventLog.removeChild(eventLog.lastChild);
        }
    }
};