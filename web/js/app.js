class VisitorApp {
    constructor() {
        this.username = 'shuo156';
        this.repo = 'web';
        // 使用 moe-counter API
        this.counterBaseUrl = 'https://moe-counter.glitch.me';
        this.init();
    }

    init() {
        this.updateTime();
        this.recordVisit();
        this.loadStats();
        
        // 更新时间
        setInterval(() => this.updateTime(), 1000);
        // 每分钟更新统计
        setInterval(() => this.loadStats(), 60000);
    }

    updateTime() {
        const now = new Date();
        document.getElementById('currentTime').textContent = 
            now.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
    }

    async recordVisit() {
        try {
            const pageId = `${this.username}-${this.repo}`;
            // 记录访问
            await fetch(`${this.counterBaseUrl}/${pageId}`);
            
            // 更新本地存储的访问记录
            const today = new Date().toISOString().split('T')[0];
            const lastDate = localStorage.getItem('lastVisitDate');
            if (lastDate !== today) {
                localStorage.setItem('lastVisitDate', today);
                localStorage.setItem('todayVisits', '1');
            } else {
                const todayVisits = (parseInt(localStorage.getItem('todayVisits')) || 0) + 1;
                localStorage.setItem('todayVisits', todayVisits.toString());
            }

            this.loadStats();
        } catch (error) {
            console.error('访问记录失败:', error);
        }
    }

    async loadStats() {
        try {
            const pageId = `${this.username}-${this.repo}`;
            const today = new Date().toISOString().split('T')[0];
            
            // 获取今日访问量
            const todayVisits = parseInt(localStorage.getItem('todayVisits')) || 0;
            
            // 模拟获取总访问量（实际值会通过图片显示）
            const totalVisits = await this.getApproximateCount();

            const stats = {
                todayVisits,
                totalVisits,
                recentVisits: this.generateRecentVisits(totalVisits)
            };

            this.updateUI(stats, pageId);
            document.getElementById('lastUpdate').textContent = new Date().toLocaleString('zh-CN');
        } catch (error) {
            console.error('获取统计数据失败:', error);
        }
    }

    async getApproximateCount() {
        // 从localStorage获取上次记录的总数
        const lastTotal = parseInt(localStorage.getItem('lastTotalCount')) || 0;
        const newTotal = lastTotal + Math.floor(Math.random() * 3) + 1; // 模拟增量
        localStorage.setItem('lastTotalCount', newTotal.toString());
        return newTotal;
    }

    generateRecentVisits(totalCount) {
        const visits = [];
        const now = new Date();
        
        for (let i = 0; i < 5; i++) {
            const time = new Date(now - i * 60000);
            const status = this.getRandomStatus();
            
            visits.push({
                timestamp: time.toISOString(),
                count: totalCount - i,
                status: status
            });
        }
        
        return visits;
    }

    getRandomStatus() {
        const statuses = [
            { level: 'low', message: '正常访问' },
            { level: 'medium', message: '访问量适中' },
            { level: 'high', message: '访问高峰' }
        ];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    updateUI(data, pageId) {
        // 更新计数器
        document.getElementById('todayCount').textContent = data.todayVisits;
        document.getElementById('totalCount').textContent = data.totalVisits;
        
        // 更新访问记录
        const riskList = document.getElementById('riskList');
        riskList.innerHTML = data.recentVisits.map(visit => `
            <div class="risk-item">
                <span>${new Date(visit.timestamp).toLocaleString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })}</span>
                <div class="visit-info">
                    <span class="visit-count">访问量: ${visit.count}</span>
                    <span class="risk-level ${visit.status.level}">${visit.status.message}</span>
                </div>
            </div>
        `).join('');

        // 更新 moe-counter 图片
        const counterContainer = document.getElementById('moeCounter');
        if (counterContainer) {
            counterContainer.innerHTML = `
                <img src="${this.counterBaseUrl}/${pageId}" alt="访问计数" title="访问计数" />
            `;
        }
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    new VisitorApp();
});
