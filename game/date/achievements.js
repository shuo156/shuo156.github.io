const achievements = {
    // 基础成就
    start: {
        id: 'start',
        name: '初次相遇',
        desc: '遇见法法',
        check: () => true
    },
    
    // 亲密度相关成就
    friend: {
        id: 'friend',
        name: '成为朋友',
        desc: '与法法的亲密度达到10',
        check: s => s.intimacy >= 10
    },
    bestFriend: {
        id: 'best_friend',
        name: '挚友',
        desc: '与法法的亲密度达到50',
        check: s => s.intimacy >= 50
    },
    soulmate: {
        id: 'soulmate',
        name: '灵魂伴侣',
        desc: '与法法的亲密度达到100',
        check: s => s.intimacy >= 100
    },

    // 统计相关成就
    caregiver: {
        id: 'caregiver',
        name: '细心照顾',
        desc: '保持法法的心情和饱食度都在80以上',
        check: s => s.mood >= 80 && s.hunger >= 80
    },
    
    // 时间相关成就
    weekTogether: {
        id: 'week',
        name: '一周陪伴',
        desc: '陪伴法法度过7天',
        check: s => s.days >= 7
    },
    monthTogether: {
        id: 'month',
        name: '月久情深',
        desc: '陪伴法法度过30天',
        check: s => s.days >= 30
    },

    // 特殊时间成就
    nightOwl: {
        id: 'night_owl',
        name: '月下密语',
        desc: '在深夜与法法互动',
        check: (s, t) => t.hour >= 23 || t.hour <= 4
    },

    // 事件相关成就
    eventAchievements: {
        // 散步相关
        walker: {
            id: 'walker',
            name: '晨间漫步',
            desc: '第一次和法法一起散步',
            event: 'morning_walk',
            option: 0
        },
        observer: {
            id: 'observer',
            name: '默默关注',
            desc: '远远地看着法法散步',
            event: 'morning_walk',
            option: 1
        },
        
        // 雨天相关
        reader: {
            id: 'reader',
            name: '雨天读书',
            desc: '在雨天与法法一起看书',
            event: 'rainy_day',
            option: 0
        },
        rainListener: {
            id: 'rain_listener',
            name: '雨声沙沙',
            desc: '与法法一起聆听雨声',
            event: 'rainy_day',
            option: 3
        },
        
        // 探索相关
        explorer: {
            id: 'explorer',
            name: '花园探险',
            desc: '与法法一起探索花园',
            event: 'garden_discovery',
            option: 0
        },
        
        // 礼物相关
        firstGift: {
            id: 'first_gift',
            name: '珍贵礼物',
            desc: '收到法法的第一份礼物',
            event: 'first_gift',
            option: 0
        },
        
        // 夜晚相关
        starGazer: {
            id: 'star_gazer',
            name: '星空之约',
            desc: '与法法一起观星',
            event: 'night_star',
            option: 0
        }
    }
};