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
            { label: "Regular", value: "regular" },
            { label: "Oat", value: "oat" },
            { label: "Almond", value: "almond" },
            { label: "Coconut", value: "coconut" }
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
            { label: "No", value: "No" },
        ],
        condition: (answers) => answers.beverage !== "Cocoa / Chocolate"
    },
    {
        key: "cream",
        question: "Add whipped cream?",
        options: [
            { label: "Yes", value: "Yes" },
            { label: "No", value: "No" },
        ],
        condition: (answers) => {
            if (answers.beverage === "Coffee" || answers.beverage === "Tea") {
                return answers.milk && answers.milk.value !== null;
            }
            return false;
        }
    }
];