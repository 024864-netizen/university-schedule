
const response = await fetch(
    "http://localhost:3000/api/v1/disciplines",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
            code: "LAB9TEST",
            name: "\u0422\u0435\u0441\u0442\u043e\u0432\u0430 \u0434\u0438\u0441\u0446\u0438\u043f\u043b\u0456\u043d\u0430",
            credits: 3,
            semester: 5,
            description: "\u041f\u0435\u0440\u0435\u0432\u0456\u0440\u043a\u0430 \u0437\u0431\u0435\u0440\u0456\u0433\u0430\u043d\u043d\u044f \u0434\u0430\u043d\u0438\u0445 \u0443 MariaDB",
        }),
    }
);

const result = await response.json();

console.log("Статус:", response.status);
console.log("Результат:", result);
