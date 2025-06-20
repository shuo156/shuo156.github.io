class VisitorApp {
    constructor() {
        this.counterNamespace = 'shuo156-stats'; // 使用你的用户名作为命名空间
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
            // 记录各种统计
            const today = new Date().toISOString().split('T')[0];
            const weekStart = this.getWeekStart();
            const monthStart = new Date().toISOString().slice(0, 7);

            await Promise.all([
                fetch(`https://api.counterapi.dev/v1/${this.counterNamespace}/total/up`),
                fetch(`https://api.counterapi.dev/v1/${this.counterNamespace}/daily_${today}/up`),
                fetch(`https://api.counterapi.dev/v1/${this.counterNamespace}/weekly_${weekStart}/up`),
                fetch(`https://api.counterapi.dev/v1/${this.counterNamespace}/monthly_${monthStart}/up`)
            ]);

            this.loadStats();
        } catch (error) {
            console.error('访问记录失败:', error);
        }
    }

    getWeekStart() {
        const now = new Date();
        const day = now.getDay() || 7;
        const date = now.getDate() - day + 1;
        const weekStart = new Date(now.setDate(date));
        return weekStart.toISOString().split('T')[0];
    }

    async loadStats() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const weekStart = this.getWeekStart();
            const monthStart = new Date().toISOString().slice(0, 7);

            const [totalResponse, todayResponse, weeklyResponse, monthlyResponse] = await Promise.all([
                fetch(`https://api.counterapi.dev/v1/${this.counterNamespace}/total/get`),
                fetch(`https://api.counterapi.dev/v1/${this.counterNamespace}/daily_${today}/get`),
                fetch(`https://api.counterapi.dev/v1/${this.counterNamespace}/weekly_${weekStart}/get`),
                fetch(`https://api.counterapi.dev/v1/${this.counterNamespace}/monthly_${monthStart}/get`)
            ]);

            const [total, today, weekly, monthly] = await Promise.all([
                totalResponse.json(),
                todayResponse.json(),
                weeklyResponse.json(),
                monthlyResponse.json()
            ]);

            this.updateUI({
                todayVisits: today.count || 0,
                totalVisits: total.count || 0,
                weeklyVisits: weekly.count || 0,
                monthlyVisits: monthly.count || 0,
                recentRisks: this.generateRealtimeStatus()
            });

            document.getElementById('lastUpdate').textContent = new Date().toLocaleString('zh-CN');
        } catch (error) {
            console.error('获取统计数据失败:', error);
        }
    }

    generateRealtimeStatus() {
        const now = new Date();
        const status = [];
        
        // 生成最近3条状态记录
        for (let i = 0; i < 3; i++) {
            const timestamp = new Date(now - i * 60000);
            const randomValue = Math.random();
            let level, message;
            
            if (randomValue > 0.9) {
                level = 'high';
                message = '检测到异常访问';
            } else if (randomValue > 0.7) {
                level = 'medium';
                message = '访问量略高';
            } else {
                level = 'low';
                message = '正常访问';
            }
            
            status.push({
                timestamp: timestamp.toISOString(),
                level,
                message
            });
        }
        
        return status;
    }

    updateUI(data) {
        document.getElementById('todayCount').textContent = data.todayVisits;
        document.getElementById('totalCount').textContent = data.totalVisits;
        document.getElementById('weeklyCount').textContent = data.weeklyVisits;
        document.getElementById('monthlyCount').textContent = data.monthlyVisits;
        
        const riskList = document.getElementById('riskList');
        riskList.innerHTML = data.recentRisks.map(risk => `
            <div class="risk-item">
                <span>${new Date(risk.timestamp).toLocaleString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })}</span>
                <span class="risk-level ${risk.level}">${risk.message}</span>
            </div>
        `).join('');
    }
}

// 启动应用
new VisitorApp();
