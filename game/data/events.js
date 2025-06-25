const events = {
    // 随机事件
    random: [
        {
            id: 'morning_walk',
            title: '晨间散步',
            desc: '法法在院子里散步。',
            req: {time: 'morning', energy: 30},
            opts: [
                {
                    text: '一起散步',
                    result: '你们度过了愉快的时光！',
                    effect: {intimacy: 5, energy: -10, mood: 15}
                },
                {
                    text: '远远观望',
                    result: '法法注意到了你。',
                    effect: {intimacy: 2, mood: 5}
                },
                {
                    text: '叫法法',
                    result: '法法开心地跑来了！',
                    effect: {intimacy: 3, mood: 10}
                },
                {
                    text: '不打扰',
                    result: '让法法享受自己的时光。',
                    effect: {mood: 3}
                }
            ]
        },
        {
            id: 'rainy_day',
            title: '雨天时光',
            desc: '外面下着雨，法法看起来有点无聊。',
            req: {time: 'afternoon'},
            opts: [
                {
                    text: '一起看书',
                    result: '你们依偎在一起看书，很温馨。',
                    effect: {intimacy: 8, mood: 12, energy: 5}
                },
                {
                    text: '玩室内游戏',
                    result: '法法很享受游戏时光！',
                    effect: {intimacy: 6, mood: 10, energy: -8}
                },
                {
                    text: '准备点心',
                    result: '法法开心地品尝美食。',
                    effect: {intimacy: 7, mood: 8, hunger: 15}
                },
                {
                    text: '听雨声',
                    result: '享受宁静的时刻。',
                    effect: {intimacy: 4, mood: 6, energy: 10}
                }
            ]
        },
        {
            id: 'garden_discovery',
            title: '花园探索',
            desc: '法法在花园里发现了什么有趣的东西。',
            req: {time: 'afternoon', energy: 20},
            opts: [
                {
                    text: '一起查看',
                    result: '原来是一只蝴蝶！法法很兴奋。',
                    effect: {intimacy: 6, energy: -5, mood: 15}
                },
                {
                    text: '拍照记录',
                    result: '留下了美好的回忆。',
                    effect: {intimacy: 4, mood: 8}
                },
                {
                    text: '小心观察',
                    result: '法法认真的样子真可爱。',
                    effect: {intimacy: 5, mood: 10}
                },
                {
                    text: '继续散步',
                    result: '去寻找更多惊喜。',
                    effect: {energy: -8, mood: 5}
                }
            ]
        }
    ],

    // 触发式事件
    triggered: [
        {
            id: 'first_gift',
            title: '第一份礼物',
            desc: '法法似乎想送你一个礼物！',
            trigger: state => state.intimacy >= 50,
            oneTime: true,
            opts: [
                {
                    text: '开心接受',
                    result: '法法送给你一朵小花，露出灿烂的笑容！',
                    effect: {intimacy: 20, mood: 30}
                },
                {
                    text: '温柔感谢',
                    result: '法法害羞地笑了。',
                    effect: {intimacy: 15, mood: 20}
                }
            ]
        },
        {
            id: 'night_star',
            title: '星空夜晚',
            desc: '深夜，法法邀请你一起看星星。',
            trigger: state => state.intimacy >= 80 && gameTime.hour >= 22,
            oneTime: true,
            opts: [
                {
                    text: '欣然同意',
                    result: '你们在星空下度过了美好的时光。',
                    effect: {intimacy: 15, mood: 25, energy: -10}
                },
                {
                    text: '简单陪伴',
                    result: '静静地享受这温馨的时刻。',
                    effect: {intimacy: 10, mood: 15}
                }
            ]
        }
    ]
};