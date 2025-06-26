        // 题库数据
        const questions = [
            {
                id: 1,
                type: "集合",
                content: "已知集合A = {x | -2 ≤ x ≤ 3}, B = {x | x < 0}，则A ∩ B = ________。",
                answer: "[-2, 0)"
            },
            {
                id: 2,
                type: "函数",
                content: "函数f(x) = x² - 4x + 3的最小值是________。",
                answer: "-1"
            },
            {
                id: 3,
                type: "不等式",
                content: "解不等式: |2x - 1| < 3",
                answer: "(-1, 2)"
            },
            {
                id: 4,
                type: "函数",
                content: "若f(x) = 2x - 1, g(x) = x² + 1, 则g(f(2)) = ________。",
                answer: "10"
            },
            {
                id: 5,
                type: "三角函数",
                content: "已知sinα = 3/5, α∈(0, π/2), 则cosα = ________。",
                answer: "4/5"
            },
            {
                id: 6,
                type: "指数函数",
                content: "计算: 2³ × 4⁻¹ ÷ 8²⁄³ = ________。",
                answer: "1/4"
            },
            {
                id: 7,
                type: "向量",
                content: "已知向量a = (2, -1), b = (-3, 4), 则a·b = ________。",
                answer: "-10"
            },
            {
                id: 8,
                type: "立体几何",
                content: "正方体的对角线长为6√3 cm，则其体积是________ cm³。",
                answer: "216"
            },
            {
                id: 9,
                type: "概率",
                content: "同时抛掷两枚均匀的骰子，点数之和为7的概率是________。",
                answer: "1/6"
            },
            {
                id: 10,
                type: "解析几何",
                content: "过点(2, -1)且与直线3x - 2y + 4 = 0垂直的直线方程是________。",
                answer: "2x + 3y - 1 = 0"
            },
            {
                id: 11,
                type: "数列",
                content: "等差数列{aₙ}中，a₁ = 3, a₅ = 11，则a₁₀ = ________。",
                answer: "21"
            },
            {
                id: 12,
                type: "对数函数",
                content: "若log₂(x-1) + log₂(x+1) = 3，则x = ________。",
                answer: "3"
            },
            {
                id: 13,
                type: "三角函数",
                content: "tan(π/3) + sin(π/6) = ________。",
                answer: "√3 + 0.5"
            },
            {
                id: 14,
                type: "导数",
                content: "函数f(x) = x³ - 3x在x=1处的导数值是________。",
                answer: "0"
            },
            {
                id: 15,
                type: "平面向量",
                content: "已知点A(1,2), B(4,6)，则向量AB的模为________。",
                answer: "5"
            },
            {
                id: 16,
                type: "不等式",
                content: "解不等式: x² - 5x + 6 > 0",
                answer: "(-∞, 2) ∪ (3, ∞)"
            },
            {
                id: 17,
                type: "集合",
                content: "全集U={1,2,3,4,5}, A={1,3,5}, B={2,3,4}, 则A∪B的补集是________。",
                answer: "∅"
            },
            {
                id: 18,
                type: "函数",
                content: "函数f(x) = 1/(x-2)的定义域是________。",
                answer: "(-∞, 2) ∪ (2, ∞)"
            },
            {
                id: 19,
                type: "立体几何",
                content: "圆锥底面半径r=3，高h=4，则侧面积是________。(π取3.14)",
                answer: "47.1"
            },
            {
                id: 20,
                type: "概率",
                content: "从1,2,3,4,5中任取两个数，其和为偶数的概率是________。",
                answer: "0.4"
            }
        ];

        // 用户答题数据
        let userData = {
            completed: 0,
            correct: 0,
            wrongList: []
        };

        // 初始化页面
        document.addEventListener('DOMContentLoaded', function() {
            renderQuestions();
            updateStats();
            
            // 年级选择事件
            document.querySelectorAll('.grade-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (!this.classList.contains('active')) {
                        document.querySelector('.grade-btn.active').classList.remove('active');
                        this.classList.add('active');
                        
                        if (this.textContent === '高二' || this.textContent === '高三') {
                            alert('高二和高三内容正在开发中，敬请期待！');
                        }
                    }
                });
            });
            
            // 查看错题本事件
            document.getElementById('wrong-notes-btn').addEventListener('click', function() {
                renderWrongNotes();
                document.getElementById('wrong-notes').style.display = 'block';
            });
            
            // 随机出题事件
            document.getElementById('random-btn').addEventListener('click', function() {
                renderQuestions(true);
                document.getElementById('wrong-notes').style.display = 'none';
            });
            
            // 重置进度事件
            document.getElementById('reset-btn').addEventListener('click', function() {
                if (confirm('确定要重置所有进度吗？此操作不可撤销。')) {
                    userData = {
                        completed: 0,
                        correct: 0,
                        wrongList: []
                    };
                    renderQuestions();
                    updateStats();
                    document.getElementById('wrong-notes').style.display = 'none';
                    alert('进度已重置！');
                }
            });
        });

        // 渲染题目
        function renderQuestions(randomize = false) {
            const container = document.getElementById('question-container');
            container.innerHTML = '';
            
            let qList = [...questions];
            
            if (randomize) {
                // 随机排序题目
                qList.sort(() => Math.random() - 0.5);
            }
            
            qList.forEach(q => {
                const card = document.createElement('div');
                card.className = 'question-card';
                card.innerHTML = `
                    <div class="question-header">
                        <div class="question-id">${q.id}</div>
                        <div class="question-type">${q.type}</div>
                    </div>
                    <div class="question-content">${q.content}</div>
                    <div class="answer-section">
                        <input type="text" class="answer-input" id="answer-${q.id}" placeholder="请输入答案">
                        <button class="submit-btn" onclick="checkAnswer(${q.id})">提交答案</button>
                        <div class="feedback" id="feedback-${q.id}"></div>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        // 检查答案
        function checkAnswer(qId) {
            const userAnswer = document.getElementById(`answer-${qId}`).value.trim();
            const feedback = document.getElementById(`feedback-${qId}`);
            const question = questions.find(q => q.id === qId);
            
            if (!userAnswer) {
                feedback.textContent = "请输入答案！";
                feedback.className = "feedback incorrect";
                return;
            }
            
            if (userAnswer === question.answer) {
                feedback.textContent = "✓ 回答正确！";
                feedback.className = "feedback correct";
                userData.correct++;
            } else {
                feedback.textContent = `✗ 回答错误！正确答案: ${question.answer}`;
                feedback.className = "feedback incorrect";
                
                // 添加到错题本（如果尚未添加）
                if (!userData.wrongList.includes(qId)) {
                    userData.wrongList.push(qId);
                }
            }
            
            userData.completed++;
            updateStats();
        }

        // 渲染错题本
        function renderWrongNotes() {
            const wrongList = document.getElementById('wrong-list');
            wrongList.innerHTML = '';
            
            if (userData.wrongList.length === 0) {
                wrongList.innerHTML = '<p class="no-wrong">暂无错题，继续保持！</p>';
                return;
            }
            
            userData.wrongList.forEach(qId => {
                const q = questions.find(q => q.id === qId);
                const li = document.createElement('li');
                li.className = 'wrong-item';
                li.innerHTML = `
                    <div class="wrong-question">
                        <strong>${q.id}. [${q.type}]</strong> ${q.content}
                        <div><strong>正确答案:</strong> ${q.answer}</div>
                    </div>
                    <button class="remove-btn" onclick="removeWrongItem(${qId})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                wrongList.appendChild(li);
            });
        }

        // 从错题本移除
        function removeWrongItem(qId) {
            const index = userData.wrongList.indexOf(qId);
            if (index !== -1) {
                userData.wrongList.splice(index, 1);
                renderWrongNotes();
                updateStats();
            }
        }

        // 更新统计信息
        function updateStats() {
            document.getElementById('completed-count').textContent = userData.completed;
            document.getElementById('wrong-count').textContent = userData.wrongList.length;
            
            const accuracy = userData.completed > 0 ? 
                Math.round((userData.correct / userData.completed) * 100) : 0;
            document.getElementById('accuracy-rate').textContent = `${accuracy}%`;
        }