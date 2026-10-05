const cardsContainer = document.querySelector(".cards");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");

let records = [];
let lastFocusedElement = null;

/* Тема */

const themeButton = document.createElement("button");
themeButton.type = "button";
themeButton.textContent = "Перемкнути тему";
themeButton.className = "theme-toggle";
document.body.prepend(themeButton);

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    applyTheme(savedTheme);
} else {
    const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    applyTheme(systemDark ? "dark" : "light");
}

themeButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme;
    applyTheme(currentTheme === "dark" ? "light" : "dark");
});

/* Модальне вікно */

const modal = document.createElement("dialog");
modal.className = "record-modal";

const modalTitle = document.createElement("h2");
const modalText = document.createElement("p");
const modalClose = document.createElement("button");

modalClose.type = "button";
modalClose.textContent = "Закрити";

modal.append(modalTitle, modalText, modalClose);
document.body.append(modal);

function openModal(record, trigger) {
    lastFocusedElement = trigger;

    modalTitle.textContent = record.title;
    modalText.textContent = record.text;

    modal.showModal();
    modalClose.focus();
}

function closeModal() {
    modal.close();

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
    }
});

/* Відображення карток */

function renderRecords(items) {
    cardsContainer.textContent = "";

    if (items.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "За вашим запитом нічого не знайдено.";
        cardsContainer.append(emptyMessage);
        return;
    }

    items.forEach((record) => {
        const card = document.createElement("article");
        card.className = "card";

        const title = document.createElement("h3");
        title.textContent = record.title;

        const text = document.createElement("p");
        text.textContent = record.text;

        const footer = document.createElement("div");
        footer.className = "card-footer";

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Детальніше";
        button.dataset.id = record.id;

        footer.append(button);
        card.append(title, text, footer);
        cardsContainer.append(card);
    });
}

/* Фільтрація */

function filterRecords(items) {
    const searchText = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const category = categoryFilter
        ? categoryFilter.value
        : "all";

    return items.filter((record) => {
        const matchesText =
            record.title.toLowerCase().includes(searchText) ||
            record.text.toLowerCase().includes(searchText);

        const matchesCategory =
            category === "all" || record.category === category;

        return matchesText && matchesCategory;
    });
}

function updateFilters() {
    renderRecords(filterRecords(records));
}

if (searchInput) {
    searchInput.addEventListener("input", updateFilters);
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", updateFilters);
}

/* Делегування подій */

if (cardsContainer) {
    cardsContainer.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-id]");

        if (!button) {
            return;
        }

        const record = records.find(
            (item) => String(item.id) === button.dataset.id
        );

        if (record) {
            openModal(record, button);
        }
    });
}

/* Fetch */

async function loadRecords() {
    if (!cardsContainer) {
        return;
    }

    cardsContainer.textContent = "Завантаження даних...";

    try {
        const response = await fetch("data.json");
    

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        records = await response.json();
        updateFilters();
    } catch (error) {
        cardsContainer.textContent = "";

        const errorMessage = document.createElement("p");
        errorMessage.textContent =
            "Не вдалося завантажити дані. Спробуйте ще раз.";

        const retryButton = document.createElement("button");
        retryButton.type = "button";
        retryButton.textContent = "Повторити";

        retryButton.addEventListener("click", loadRecords);

        cardsContainer.append(errorMessage, retryButton);

        console.error("Помилка завантаження:", error);
    }
}

loadRecords();