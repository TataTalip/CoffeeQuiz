 export const steps = [
        {
            key: "beverage",
            question: "Что выберешь?",
            options: [
                { label: "Кофе", value: "Кофе" },
                { label: "Чай", value: "Чай" },
                { label: "Какао / Шоколад", value: "Какао / Шоколад" }
            ]
        },
        {
            key: "milk",
            question: "Добавить молоко?",
            options: [
                { label: "Без молока", value: null },
                { label: "Обычое", value: "обычном молоке" },
                { label: "Овсяное", value: "овсяном молоке" },
                { label: "Миндальное", value: "миндальном молоке" },
                { label: "Кокосовое", value: "кокосовом молоке" }
            ]
        },
        {
            key: "syrup",
            question: "Добавить сироп?",
            options: [{ label: "Без сиропа", value: null },
            { label: "Карамель", value: "карамелью" },
            { label: "Ваниль", value: "ванилью" },
            { label: "Орех", value: "орехом" },
            { label: "Шоколад", value: "шоколадом" }],
            condition: (answers) => answers.beverage === "Кофе"
        },
        {
            key: "ice",
            question: "Добавить лёд?",
            options: [
                { label: "Да", value: "Да" },
                { label: "Нет", value: "Нет" },
            ],
            condition: (answers) => answers.beverage !== "Какао / Шоколад"
        },
        {
            key:"cream",
            question:"Добавить взбитые сливки?",
            options:[
                {
                    label:"Да",value:"Да"
                },
                {
                    label:"Нет",value:"Нет"
                },

            ],
            condition: (answers) => {
                  if (answers.beverage === "Кофе" || answers.beverage === "Чай") {
                return answers.milk && answers.milk.value !== null;
            }
            return false;
            }
        }
    ];