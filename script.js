import { images } from './data/img.js'
import { steps } from './data/steps.js'


const btn = document.querySelector('.btn');
const answersBlock = document.querySelector('.answers');
const answersList = document.querySelector('.answer');
const mainText = document.querySelector('.mainText');
const img = document.querySelector('.imgMainCoffee');
const mainContent = document.querySelector('.mainContent');

let step = 0;

let answers = {
    beverage: null,
    milk: null,
    syrup: null,
    ice: null,
    cream: null
};



//  СТАРТ
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
        syrup: null,
        ice: null
    };

    render();
}

function shouldShowStep(stepObj) {
    if (!stepObj.condition) return true;
    return stepObj.condition(answers);
}

//  РЕНДЕР
function render() {
    renderQuestion();
    renderAnswers();
}

// ВОПРОС
function renderQuestion() {
    let current = steps[step];

    while (current && !shouldShowStep(current)) {
        step++;
        current = steps[step];
    }

    if (!current) {
        showResult();
        return;
    }

    mainContent.innerHTML = `
        <h2>${current.question}</h2>
        <div class="options"></div>
    `;

    const container = mainContent.querySelector('.options');

    current.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.label;
        button.classList.add('option-btn');

        button.addEventListener('click', () => {
            // Для сиропа передаем весь объект, для остальных - значение
            if (current.key === "syrup" || current.key === "milk") {
                handleAnswer(current.key, option); // Передаем весь объект
            } else {
                handleAnswer(current.key, option.value !== undefined ? option.value : option.label);
            }
        });

        container.appendChild(button);
    });
}

//  СОХРАНЕНИЕ
function handleAnswer(key, value) {
    // Для сиропа сохраняем весь объект (с label и value)
    if (key === "syrup" || key === "milk") {
        answers[key] = value; // value - это весь объект { label, value }
    }
    // Для остальных сохраняем как есть
    else {
        answers[key] = value;
    }

    if (key === "beverage" && value !== "Кофе") {
        answers.syrup = null;
    }

    step++;
    render();
}

//  УДАЛЕНИЕ
function deleteAnswer(key) {
    const order = ["beverage", "milk", "syrup", "ice", "cream"];
    const index = order.indexOf(key);

    for (let i = index; i < order.length; i++) {
        answers[order[i]] = null;
    }

    step = index;
    render();
}

//  ЛЕЙБЛЫ
function getAnswerLabel(key, value) {
    if (key === "milk") {
        if (!value || value.value === null) return "Без молока";
        return `Молоко: ${value.label}`; // Показываем "Обычное", "Овсяное" и т.д.
    }
    if (key === "syrup") {
        if (!value || value.value === null) return "Без сиропа";
        return `Сироп: ${value.label}`; // Показываем label для пользователя
    }
    if (key === "ice") return value === "Да" ? "Со льдом" : "Без льда";
    if (key === "cream") return value === "Да" ? "Со сливками" : "Без сливок";
    if (key === "beverage") return value;
    return value;
}

//  СПИСОК
function renderAnswers() {
    answersList.innerHTML = '';

    Object.entries(answers).forEach(([key, value]) => {
        if (!value) return;

        const stepObj = steps.find(s => s.key === key);
        if (stepObj && !shouldShowStep(stepObj)) return;

        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = getAnswerLabel(key, value);

        const del = document.createElement('button');
        del.textContent = '✕';
        del.classList.add('delete-btn');

        del.addEventListener('click', () => {
            deleteAnswer(key);
        });

        li.appendChild(span);
        li.appendChild(del);
        answersList.appendChild(li);
    });
}

//  ГЕНЕРАЦИЯ НАПИТКА
function generateDrink() {
    const { beverage, milk, syrup, ice, cream } = answers;

    // ☕ КОФЕ
    if (beverage === "Кофе") {

        if (!milk || milk.value === null) {
            let name = "Американо";
            let img = images.espresso;

          

            // Сироп - берем value из объекта
            if (syrup && syrup.value !== null && syrup.value !== "Без сиропа") {
                name += " с " + syrup.value; // Здесь будет "карамелью", "ванилью" и т.д.
                img = images.espresso;
            }
              if (ice === "Да") {
                name = "Айс " + name;
                img = images.americano_ice;
            }

            return { name, img };
        }

        if (milk.value !== "Без молока" && milk !== null) {
            let name = "Латте на " + milk.value;
            let img = images.latte;

            // лёд
            if (ice === "Да") {
                name = "Айс " + name;
                img = images.iced_latte;
            }

            // сироп - берем value из объекта
            if (syrup && syrup.value !== null && syrup.value !== "Без сиропа") {
                name += " с " + syrup.value; // "карамелью", "ванилью", "орехом", "шоколадом"
                img = images.iced_latte_syrop;
            }

            // взбитые сливки
            if (cream === "Да") {
                name += " со взбитыми сливками";
                img = images.iced_latte_cream;
            }

            return { name, img };
        }
    }

    // 🍵 ЧАЙ
    if (beverage === "Чай") {
        let name = "Чай";
        let img = images.tea_hot;

        // Лед
        if (ice === "Да") {
            name = "Чай со льдом";
            img = images.iced_tea;
        }

        // Молоко (если выбрано и не "Без молока")
        if (milk && milk.value !== null) {
            // Если уже есть "со льдом", добавляем "с молоком"
            if (name.includes("со льдом")) {
                name += ` на ${milk.value}`;
                img = images.tea_milk_ice


            } else {
                name += ` на ${milk.value}`;
                img=images.tea_milk
            }
        }

        return { name, img };
    }

    // 🍫 КАКАО / ШОКОЛАД
    if (beverage === "Какао / Шоколад") {
        let name = "Горячий шоколад / какао";
        let img = images.hot_choc;

        if (milk.value !== "Без молока" && milk !== null) {
            name += " на " + milk.value;

        }
        if (cream === "Да") {
            name += " со взбитыми сливками";
            img = images.hot_choc_cream
        }

        return { name, img };
    }

    return { name: "Что-то вкусное ☕", img: images.espresso };
}

// 👉 РЕЗУЛЬТАТ
function showResult() {
    const drink = generateDrink();

    mainContent.innerHTML = `
            <h1>${drink.name}</h1>
            <img src="${drink.img}" class="resImg">
            <button class="btn">Заново</button>
        `;

    document.querySelector('.btn').addEventListener('click', reset);
}

function reset() {
    location.reload();
}
