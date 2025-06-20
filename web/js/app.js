class VisitorApp {
    constructor() {
        this.apiUrl = 'https://your-api-url.vercel.app/api'; // 替换为您的API地址
        this.init();
    }

    init() {
        this.updateTime();
        this.recordVisit();
        this.loadStats();
        
        // 更新时间
        setInterval(() => this.updateTime(), 1000);
        // 定期更新统计
        setInterval(() => this.loadStats(), 60000);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toISOString().replace('T', ' ').substr(0, 19);
        document.getElementById('currentTime').textContent = timeString;
    }

    async recordVisit() {
        try {
            const response = await fetch(`${this.apiUrl}/record-visit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    page: window.location.pathname,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                })
            });
            const data = await response.json();
            if (data.success) {
                this.loadStats();
            }
        } catch (error) {
            console.error('访问记录失败:', error);
        }
    }

    async loadStats() {
        try {
            const response = await fetch(`${this.apiUrl}/stats`);
            const data = await response.json();
            this.updateUI(data);
        } catch (error) {
            console.error('获取统计数据失败:', error);
        }
    }

    updateUI(data) {
        document.getElementById('todayCount').textContent = data.todayVisits;
        document.getElementById('totalCount').textContent = data.totalVisits;
        
        const riskList = document.getElementById('riskList');
        riskList.innerHTML = data.recentRisks.map(risk => `
            <div class="risk-item">
                <span>${new Date(risk.timestamp).toLocaleString()}</span>
                <span class="risk-level ${risk.level}">${risk.message}</span>
            </div>
        `).join('');
    }
}

// 启动应用
new VisitorApp();
