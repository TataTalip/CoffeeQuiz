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

// START
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
        ice: null,
        cream: null
    };

    render();
}

function shouldShowStep(stepObj) {
    if (!stepObj.condition) return true;
    return stepObj.condition(answers);
}

// RENDER
function render() {
    renderQuestion();
    renderAnswers();
}

// QUESTION
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
            // For syrup and milk, pass the entire object
            if (current.key === "syrup" || current.key === "milk") {
                handleAnswer(current.key, option); // Pass entire object
            } else {
                handleAnswer(current.key, option.value !== undefined ? option.value : option.label);
            }
        });

        container.appendChild(button);
    });
}

// SAVE ANSWER
function handleAnswer(key, value) {
    // For syrup and milk, save entire object (with label and value)
    if (key === "syrup" || key === "milk") {
        answers[key] = value; // value is the entire object { label, value }
    }
    // For others, save as is
    else {
        answers[key] = value;
    }

    if (key === "beverage" && value !== "Coffee") {
        answers.syrup = null;
    }

    step++;
    render();
}

// DELETE ANSWER
function deleteAnswer(key) {
    const order = ["beverage", "milk", "syrup", "ice", "cream"];
    const index = order.indexOf(key);

    for (let i = index; i < order.length; i++) {
        answers[order[i]] = null;
    }

    step = index;
    render();
}

// LABELS
function getAnswerLabel(key, value) {
    if (key === "milk") {
        if (!value || value.value === null) return "No milk";
        return `Milk: ${value.label}`;
    }
    if (key === "syrup") {
        if (!value || value.value === null) return "No syrup";
        return `Syrup: ${value.label}`;
    }
    if (key === "ice") return value === "Yes" ? "With ice" : "No ice";
    if (key === "cream") return value === "Yes" ? "With whipped cream" : "No whipped cream";
    if (key === "beverage") return value;
    return value;
}

// RENDER ANSWERS LIST
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

// DRINK GENERATION
function generateDrink() {
    const { beverage, milk, syrup, ice, cream } = answers;

    // ☕ COFFEE
    if (beverage === "Coffee") {

        if (!milk || milk.value === null) {
            let name = "Americano";
            let img = images.espresso;

            // Syrup - take value from object
            if (syrup && syrup.value !== null && syrup.value !== "No syrup") {
                name += " with " + syrup.value;
                img = images.espresso;
            }
            if (ice === "Yes") {
                name = "Iced " + name;
                img = images.americano_ice;
            }

            return { name, img };
        }

        if (milk && milk.value !== null) {
            let name = "Latte with " + milk.value;
            let img = images.latte;

            // Ice
            if (ice === "Yes") {
                name = "Iced " + name;
                img = images.iced_latte;
            }

            // Syrup - take value from object
            if (syrup && syrup.value !== null && syrup.value !== "No syrup") {
                name += " with " + syrup.value;
                img = images.iced_latte_syrup;
            }

            // Whipped cream
            if (cream === "Yes") {
                name += " with whipped cream";
                img = images.iced_latte_cream;
            }

            return { name, img };
        }
    }

    // 🍵 TEA
    if (beverage === "Tea") {
        let name = "Tea";
        let img = images.tea_hot;

        // Ice
        if (ice === "Yes") {
            name = "Iced tea";
            img = images.iced_tea;
        }

        // Milk (if selected and not "No milk")
        if (milk && milk.value !== null) {
            // If already has "iced", add "with milk"
            if (name.includes("Iced")) {
                name += ` with ${milk.value}`;
                img = images.tea_milk_ice;
            } else {
                name += ` with ${milk.value}`;
                img = images.tea_milk;
            }
        }

        return { name, img };
    }

    // 🍫 COCOA / CHOCOLATE
    if (beverage === "Cocoa / Chocolate") {
        let name = "Hot chocolate / cocoa";
        let img = images.hot_choc;

        if (milk && milk.value !== null) {
            name += " with " + milk.value;
        }
        if (cream === "Yes") {
            name += " with whipped cream";
            img = images.hot_choc_cream;
        }

        return { name, img };
    }

    return { name: "Something tasty ☕", img: images.espresso };
}

// 👉 RESULT
function showResult() {
    const drink = generateDrink();

    mainContent.innerHTML = `
        <h1>${drink.name}</h1>
        <img src="${drink.img}" class="resImg">
        <button class="btn">Start over</button>
    `;

    document.querySelector('.btn').addEventListener('click', reset);
}

function reset() {
    location.reload();
}