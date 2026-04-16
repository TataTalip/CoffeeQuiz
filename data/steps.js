// data/steps.js
export const steps = [
    {
        key: "beverage",
        question: "What would you like?",
        options: [
            { label: "Coffee", value: "Coffee" },
            { label: "Tea", value: "Tea" },
            { label: "Cocoa / Chocolate", value: "Cocoa / Chocolate" }
        ]
    },
    {
        key: "milk",
        question: "Add milk?",
        options: [
            { label: "No milk", value: null },
            { label: "Regular", value: "regular milk" },
            { label: "Oat", value: "oat milk" },
            { label: "Almond", value: "almond milk" },
            { label: "Coconut", value: "coconut milk" }
        ]
    },
    {
        key: "syrup",
        question: "Add syrup?",
        options: [
            { label: "No syrup", value: null },
            { label: "Caramel", value: "caramel" },
            { label: "Vanilla", value: "vanilla" },
            { label: "Hazelnut", value: "hazelnut" },
            { label: "Chocolate", value: "chocolate" }
        ],
        condition: (answers) => answers.beverage === "Coffee"
    },
    {
        key: "ice",
        question: "Add ice?",
        options: [
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" }
        ],
        condition: (answers) => answers.beverage !== "Cocoa / Chocolate"
    },
    {
        key: "cream",
        question: "Add whipped cream?",
        options: [
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" }
        ],
       condition: (answers) => {
            // Сливки ТОЛЬКО для:
            // 1. Кофе с молоком
            // 2. Какао/Шоколад (всегда, даже без молока)
            
            // Для кофе - только если есть молоко
            if (answers.beverage === "Coffee") {
                return answers.milk && answers.milk.value !== null;
            }
            
            // Для какао/шоколада - всегда показываем сливки
            if (answers.beverage === "Cocoa / Chocolate") {
                return true;
            }
            
            // Для чая - никогда не показываем сливки
            return false;
        }
    }
];