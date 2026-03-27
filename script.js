(function () {

    const btn = document.querySelector('.btn');
    const answersBlock = document.querySelector('.answers');
    const answersList = document.querySelector('.answer');
    const mainText = document.querySelector('.mainText');
    const mainQuestion = document.querySelector('.mainQuestion');
    const img = document.querySelector('.imgMainCoffee');
    const mainContent = document.querySelector('.mainContent');

    let step = 0;

    let answers = {
        beverage: null,
        milk: null,
        syrup: null
    };

    const steps = [
        {
            key: "beverage",
            question: "Что выберешь?",
            options: ["Кофе", "Чай"]
        },
        {
            key: "milk",
            question: "Добавить молоко?",
            options: ["Да", "Нет"]
        },
        {
            key: "syrup",
            question: "Добавить сироп?",
            options: ["Да", "Нет"]
        }
    ];

    // 👉 СТАРТ
    btn.addEventListener('click', startQuiz);

    function startQuiz() {
        answersBlock.style.display = 'block';

        mainText.style.display = 'none';
        btn.style.display = 'none';
        img.style.display = 'none';

        step = 0;
        answers = {
            beverage: null,
            milk: null,
            syrup: null
        };

        render();
    }

    // 👉 ГЛАВНЫЙ РЕНДЕР (как React)
    function render() {
        renderQuestion();
        renderAnswers();
    }
    function getAnswerLabel(key, value) {
        if (key === "beverage") {
            return value === "Кофе" ? "Кофе" : "Чай";
        }

        if (key === "milk") {
            return value === "Да" ? "С молоком" : "Без молока";
        }

        if (key === "syrup") {
            return value === "Да" ? "С сиропом" : "Без сиропа";
        }

        return value;
    }

    // 👉 ВОПРОСЫ
    function renderQuestion() {
        if (step >= steps.length) {
            showResult();
            return;
        }

        const current = steps[step];

        mainContent.innerHTML = `
            <h2>${current.question}</h2>
            <div class="options"></div>
        `;

        const container = mainContent.querySelector('.options');

        current.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-btn')

            button.addEventListener('click', () => {
                handleAnswer(current.key, option);
            });

            container.appendChild(button);
        });
    }

    // 👉 СОХРАНЕНИЕ (как setState)
    function handleAnswer(key, value) {
        answers[key] = value;
        step++;
        render();
    }

    // 👉 УДАЛЕНИЕ (ВАЖНО)
    function deleteAnswer(key) {
        const order = ["beverage", "milk", "syrup"];
        const index = order.indexOf(key);

        for (let i = index; i < order.length; i++) {
            answers[order[i]] = null;
        }

        step = index;
        render();
    }

    // 👉 СПИСОК ОТВЕТОВ
    function renderAnswers() {
        answersList.innerHTML = '';

        let hasAnswers = false;

        Object.entries(answers).forEach(([key, value]) => {
            if (!value) return;

            hasAnswers = true;

            const li = document.createElement('li');

            const span = document.createElement('span');
            span.textContent = getAnswerLabel(key, value);

            const del = document.createElement('button');
            del.textContent = '✕';
            del.classList.add('delete-btn')

            del.addEventListener('click', () => {
                deleteAnswer(key);
            });

            li.appendChild(span);
            li.appendChild(del);

            answersList.appendChild(li);
        });

        if (!hasAnswers) {
            answersList.innerHTML = '<li>No selections yet</li>';
        }
    }

    // 👉 РЕЗУЛЬТАТ
    function showResult() {
        const { beverage, milk, syrup } = answers;

        let result = "Что-то вкусное ☕";

        if (beverage === "Кофе") {
            if (milk === "Нет" && syrup === "Нет") result = "Эспрессо";
            if (milk === "Да" && syrup === "Нет") result = "Латте";
            if (milk === "Нет" && syrup === "Да") result = "Американо с сиропом";
        }

        if (beverage === "Чай") {
            result = "Чай 🍵";
        }

        mainContent.innerHTML = `
            <h1>${result}</h1>
            <button class="btn"><img src="">Заново</button>
        `;

        document.querySelector('.btn').addEventListener('click', reset);
    }

    function reset() {
        location.reload();
    }

})();