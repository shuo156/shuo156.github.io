class VisitorApp {
    constructor() {
        // 使用 HitCount API
        this.hitCountUrl = 'https://hits.seeyoufarm.com/api/count/incr/badge.svg';
        this.key = `${encodeURIComponent('shuo156/visitor-stats')}`;
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
            // 记录访问
            const todayKey = new Date().toISOString().split('T')[0];
            const response = await fetch(`${this.hitCountUrl}?url=${this.key}&title=${todayKey}`);
            
            if (response.ok) {
                this.loadStats();
            }
        } catch (error) {
            console.error('访问记录失败:', error);
        }
    }

    async loadStats() {
        try {
            // 获取访问统计
            const todayKey = new Date().toISOString().split('T')[0];
            const response = await fetch(`${this.hitCountUrl}?url=${this.key}&title=${todayKey}&count_bg=%2379C83D&title_bg=%23555555&icon=&edge_flat=false&json=true`);
            const data = await response.json();

            // 处理统计数据
            const stats = {
                todayVisits: this.getTodayVisits(data),
                totalVisits: data.totalHits || 0,
                weeklyVisits: this.getWeeklyVisits(),
                monthlyVisits: this.getMonthlyVisits(),
                recentRisks: this.generateRiskRecords(data.totalHits)
            };

            this.updateUI(stats);
            document.getElementById('lastUpdate').textContent = new Date().toLocaleString('zh-CN');

        } catch (error) {
            console.error('获取统计数据失败:', error);
        }
    }

    getTodayVisits(data) {
        const today = new Date().toISOString().split('T')[0];
        const storedDate = localStorage.getItem('lastDate');
        const storedCount = parseInt(localStorage.getItem('lastCount')) || 0;

        if (storedDate !== today) {
            localStorage.setItem('lastDate', today);
            localStorage.setItem('lastCount', data.totalHits);
            return 1;
        }

        return data.totalHits - storedCount || 0;
    }

    getWeeklyVisits() {
        // 简单模拟周访问量
        return Math.floor(Math.random() * 100) + 50;
    }

    getMonthlyVisits() {
        // 简单模拟月访问量
        return Math.floor(Math.random() * 500) + 200;
    }

    generateRiskRecords(totalVisits) {
        const records = [];
        const now = new Date();
        
        // 生成最近5条记录
        for (let i = 0; i < 5; i++) {
            const time = new Date(now - i * 60000);
            const visitors = totalVisits - i;
            
            let riskLevel, message;
            const riskFactor = Math.random();
            
            if (riskFactor > 0.95) {
                riskLevel = 'high';
                message = '访问高峰';
            } else if (riskFactor > 0.8) {
                riskLevel = 'medium';
                message = '访问量适中';
            } else {
                riskLevel = 'low';
                message = '正常访问';
            }

            records.push({
                timestamp: time.toISOString(),
                level: riskLevel,
                message: `${message} (${visitors}访问)`,
                visitors
            });
        }

        return records;
    }

    updateUI(data) {
        // 更新统计数字
        document.getElementById('todayCount').textContent = data.todayVisits;
        document.getElementById('totalCount').textContent = data.totalVisits;
        document.getElementById('weeklyCount').textContent = data.weeklyVisits;
        document.getElementById('monthlyCount').textContent = data.monthlyVisits;
        
        // 更新风险列表
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
document.addEventListener('DOMContentLoaded', () => {
    new VisitorApp();
});
