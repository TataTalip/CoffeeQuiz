 (function() {
            // Находим элементы
            const btn = document.querySelector('.btn');
            const answersBlock = document.querySelector('.answers');
            const answersList = document.querySelector('.answer');
            const mainText = document.querySelector('.mainText');
            const mainQuestion = document.querySelector('.mainQuestion');
            const img = document.querySelector('.imgMainCoffee');
            const mainContent = document.querySelector('.mainContent');

            let currentQuestion = 0;
            let answers = [];

            const questions = [
                {
                    question: "Какой кофе вы предпочитаете?",
                    options: ["Крепкий", "Мягкий"]
                },
                {
                    question: "Добавлять молоко?",
                    options: ["С молоком", "Без молока"]
                },
                {
                    question: "Добавлять сахар?",
                    options: ["С сахаром", "Без сахара"]
                }
            ];

            const coffees = {
                "крепкий_с молоком_с сахаром": "Эспрессо с молоком и сахаром",
                "крепкий_с молоком_без сахара": "Эспрессо с молоком без сахара",
                "крепкий_без молока_с сахаром": "Эспрессо с сахаром",
                "крепкий_без молока_без сахара": "Эспрессо",
                "мягкий_с молоком_с сахаром": "Латте с сахаром",
                "мягкий_с молоком_без сахара": "Латте",
                "мягкий_без молока_с сахаром": "Американо с сахаром",
                "мягкий_без молока_без сахара": "Американо"
            };

            if (btn && answersBlock && mainText && mainQuestion && img && mainContent && answersList) {
                btn.addEventListener('click', showQuiz);
                btn.addEventListener('touchstart', showQuiz);
            }

            function showQuiz(e) {
                e?.preventDefault();
                
                answersBlock.style.display = 'block';
                btn.style.display = 'none';
                mainText.style.display = 'none';
                img.style.backgroundColor = 'white';
                mainQuestion.textContent = 'Choose your coffee';
                
                answersList.innerHTML = '';
                currentQuestion = 0;
                answers = [];
                showQuestion();
            }

            function showQuestion() {
                const q = questions[currentQuestion];
                
                let html = `
                    <div class="options-container fade-in">
                        <h2>${q.question}</h2>
                        <div class="options"></div>
                    </div>
                `;
                
                mainContent.innerHTML = html;
                
                // Создаем кнопки через JS
                const optionsDiv = document.querySelector('.options');
                
                q.options.forEach((option, index) => {
                    const button = document.createElement('button');
                    button.className = 'option-btn';
                    button.textContent = option;
                    button.dataset.answer = option;
                    button.dataset.index = index;
                    
                    button.addEventListener('click', function(e) {
                        saveAnswer(e.target.dataset.answer);
                    });
                    
                    optionsDiv.appendChild(button);
                });
            }

            function saveAnswer(answer) {
                answers.push(answer);
                updateAnswersList(answer);
                
                if (currentQuestion + 1 < questions.length) {
                    currentQuestion++;
                    showQuestion();
                } else {
                    calculateResult();
                }
            }

            function updateAnswersList(answer) {
                // Если это первый ответ, очищаем список
                if (answers.length === 1) {
                    answersList.innerHTML = '';
                }
                
                // Создаем элемент списка
                const li = document.createElement('li');
                
                // Текст ответа
                const span = document.createElement('span');
                span.textContent = answer;
                
                // Кнопка удаления
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '✕';
                deleteBtn.className = 'delete-btn';
                deleteBtn.setAttribute('aria-label', 'Удалить ответ');
                
                // Добавляем обработчик удаления
                deleteBtn.addEventListener('click', function() {
                    // Удаляем этот ответ из массива answers
                    const answerIndex = answers.indexOf(answer);
                    if (answerIndex !== -1) {
                        answers.splice(answerIndex, 1);
                    }
                    
                    // Удаляем элемент из DOM
                    li.remove();
                    
                    // Обновляем localStorage
                    localStorage.setItem('quizAnswers', JSON.stringify(answers));
                    
                    // Если удалили последний ответ, показываем первый вопрос заново
                    if (answers.length === 0) {
                        currentQuestion = 0;
                        showQuestion();
                    } else {
                        // Иначе обновляем текущий вопрос (перезапускаем его)
                        // Чтобы можно было выбрать другой вариант
                        showQuestion();
                    }
                });
                
                // Собираем элемент
                li.appendChild(span);
                li.appendChild(deleteBtn);
                
                // Добавляем в начало списка (слева)
                answersList.insertBefore(li, answersList.firstChild);
                
                // Сохраняем в localStorage
                localStorage.setItem('quizAnswers', JSON.stringify(answers));
            }

            function calculateResult() {
                // Собираем ключ из ответов
                const key = answers.join('_').toLowerCase();
                const result = coffees[key] || "Кофе по вашему вкусу";
                
                // Формируем описание
                const milk = answers[1] === "С молоком" ? "с молоком" : "без молока";
                const sugar = answers[2] === "С сахаром" ? "с сахаром" : "без сахара";
                
                mainContent.innerHTML = `
                    <div class="result-container fade-in">
                        <h1>Ваш кофе: <br> ${result} ☕</h1>
                        <button class="btn restart-btn">Начать заново</button>
                    </div>
                `;
                
                // Добавляем обработчик на кнопку "Заново"
                document.querySelector('.restart-btn').addEventListener('click', () => {
                    localStorage.removeItem('quizAnswers');
                    location.reload();
                });
            }

            // Проверяем, есть ли сохраненные ответы
            const savedAnswers = localStorage.getItem('quizAnswers');
            if (savedAnswers) {
                answers = JSON.parse(savedAnswers);
                // Можно добавить логику восстановления
            }
        })();