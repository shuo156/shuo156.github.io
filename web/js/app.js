class VisitorApp {
    constructor() {
        this.username = 'shuo156';
        this.repo = 'web';
        // 使用 visitor-badge 作为统计服务
        this.badgeBaseUrl = 'https://visitor-badge.laobi.icu';
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
            // 使用 visitor-badge 记录访问
            const pageId = `${this.username}-${this.repo}`;
            const response = await fetch(`${this.badgeBaseUrl}/v1/badge?page_id=${pageId}`);
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
            const pageId = `${this.username}-${this.repo}`;
            const response = await fetch(`${this.badgeBaseUrl}/v1/badge?page_id=${pageId}&json=true`);
            const data = await response.json();

            // 计算今日访问量（使用本地存储来跟踪）
            const today = new Date().toISOString().split('T')[0];
            const lastDate = localStorage.getItem('lastVisitDate');
            const lastCount = parseInt(localStorage.getItem('lastTotalCount')) || 0;
            
            if (lastDate !== today) {
                localStorage.setItem('lastVisitDate', today);
                localStorage.setItem('lastTotalCount', data.count);
                localStorage.setItem('todayCount', '1');
            } else {
                const todayCount = data.count - lastCount;
                localStorage.setItem('todayCount', todayCount.toString());
            }

            const todayCount = parseInt(localStorage.getItem('todayCount')) || 0;

            this.updateUI({
                todayVisits: todayCount,
                totalVisits: data.count,
                recentVisits: this.generateRecentVisits(data.count)
            });

            document.getElementById('lastUpdate').textContent = new Date().toLocaleString('zh-CN');
        } catch (error) {
            console.error('获取统计数据失败:', error);
        }
    }

    generateRecentVisits(totalCount) {
        const recentVisits = [];
        const now = new Date();
        
        // 生成最近的访问记录
        for (let i = 0; i < 5; i++) {
            const time = new Date(now - i * 60000);
            const status = this.getRandomStatus();
            
            recentVisits.push({
                timestamp: time.toISOString(),
                count: totalCount - i,
                status: status
            });
        }
        
        return recentVisits;
    }

    getRandomStatus() {
        const statuses = [
            { level: 'low', message: '正常访问' },
            { level: 'medium', message: '访问量适中' },
            { level: 'high', message: '访问高峰' }
        ];
        return statuses[Math.floor(Math.random() * statuses.length)];
    }

    updateUI(data) {
        // 更新访问计数
        document.getElementById('todayCount').textContent = data.todayVisits;
        document.getElementById('totalCount').textContent = data.totalVisits;
        
        // 更新实时访问列表
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

        // 可继续拓展
        }
    }
}

// 启动应用
new VisitorApp();
