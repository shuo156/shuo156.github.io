const DialogSystem = {
    activeDialog: null,
    
    showDialog(event) {
        if (!event.opts) return false;
        
        this.activeDialog = event;
        const dialogHTML = `
            <div class="dialog-overlay">
                <div class="dialog-box">
                    <div class="dialog-content">
                        <h3>${event.title}</h3>
                        <p>${event.desc}</p>
                        <div class="dialog-options">
                            ${event.opts.map((opt, idx) => `
                                <button onclick="DialogSystem.selectOption(${idx})">
                                    ${opt.text}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', dialogHTML);
        return true;
    },
    
    selectOption(optionIndex) {
        const event = this.activeDialog;
        const option = event.opts[optionIndex];
        
        // 应用效果
        if (option.effect) {
            Object.entries(option.effect).forEach(([key, value]) => {
                gameState[key] = Math.min(100, Math.max(0, gameState[key] + value));
            });
        }
        
        // 检查成就
        this.checkEventAchievement(event.id, optionIndex);
        
        // 记录结果
        addEvent(`${event.title}: ${option.result}`);
        
        // 清理界面
        document.querySelector('.dialog-overlay').remove();
        this.activeDialog = null;
        UISystem.updateStatus();
    },
    
    checkEventAchievement(eventId, optionIndex) {
        Object.values(achievements.eventAchievements).forEach(ach => {
            if (ach.event === eventId && 
                ach.option === optionIndex && 
                !gameState.achievements.has(ach.id)) {
                    
                gameState.achievements.add(ach.id);
                this.showAchievementUnlock(ach);
            }
        });
    },
    
    showAchievementUnlock(ach) {
        const unlockHTML = `
            <div class="achievement-unlock">
                <div class="achievement-content">
                    <h4>🏆 解锁成就</h4>
                    <p>${ach.name}</p>
                    <p class="achievement-desc">${ach.desc}</p>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', unlockHTML);
        setTimeout(() => {
            const element = document.querySelector('.achievement-unlock');
            if (element) element.remove();
        }, 3000);
    }
};