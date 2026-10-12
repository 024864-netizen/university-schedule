import "./styles.css";
import type { RecordItem, Theme } from "./types";

const cardsContainer = document.querySelector<HTMLElement>(".cards");
const searchInput = document.querySelector<HTMLInputElement>("#searchInput");
const categoryFilter = document.querySelector<HTMLSelectElement>("#categoryFilter");

let records: RecordItem[] = [];
let lastFocusedElement: HTMLElement | null = null;

/* Тема */

const themeButton = document.createElement("button");
themeButton.type = "button";
themeButton.textContent = "Перемкнути тему";
themeButton.className = "theme-toggle";
document.body.prepend(themeButton);

function applyTheme(theme: Theme): void {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light" || savedTheme === "dark") {
    applyTheme(savedTheme);
} else {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
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

function openModal(record: RecordItem, trigger: HTMLElement): void {
    lastFocusedElement = trigger;
    modalTitle.textContent = record.title;
    modalText.textContent = record.text;
    modal.showModal();
    modalClose.focus();
}

function closeModal(): void {
    modal.close();
    lastFocusedElement?.focus();
}

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", (event: MouseEvent) => {
    if (event.target === modal) {
        closeModal();
    }
});

/* Відображення карток */

function renderRecords(items: RecordItem[]): void {
    if (!cardsContainer) {
        return;
    }

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
        button.dataset.id = String(record.id);

        footer.append(button);
        card.append(title, text, footer);
        cardsContainer.append(card);
    });
}

/* Фільтрація */

function filterRecords(items: RecordItem[]): RecordItem[] {
    const searchText = searchInput?.value.trim().toLowerCase() ?? "";
    const category = categoryFilter?.value ?? "all";

    return items.filter((record) => {
        const matchesText =
            record.title.toLowerCase().includes(searchText) ||
            record.text.toLowerCase().includes(searchText);

        const matchesCategory = category === "all" || record.category === category;

        return matchesText && matchesCategory;
    });
}

function updateFilters(): void {
    renderRecords(filterRecords(records));
}

searchInput?.addEventListener("input", updateFilters);
categoryFilter?.addEventListener("change", updateFilters);

/* Делегування подій */

cardsContainer?.addEventListener("click", (event: MouseEvent) => {
    if (!(event.target instanceof Element)) {
        return;
    }

    const button = event.target.closest<HTMLButtonElement>("button[data-id]");

    if (!button) {
        return;
    }

    const record = records.find((item) => String(item.id) === button.dataset.id);

    if (record) {
        openModal(record, button);
    }
});

/* Перевірка зовнішніх даних */

function isRecord(value: unknown): value is RecordItem {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const item = value as Record<string, unknown>;

    return (
        typeof item.id === "number" &&
        typeof item.title === "string" &&
        typeof item.text === "string" &&
        (item.category === "schedule" || item.category === "groups" || item.category === "feedback")
    );
}

function isRecordArray(value: unknown): value is RecordItem[] {
    return Array.isArray(value) && value.every(isRecord);
}

/* Fetch */

async function loadRecords(): Promise<void> {
    if (!cardsContainer) {
        return;
    }

    cardsContainer.textContent = "Завантаження даних...";

    try {
       const response = await fetch(`${import.meta.env.BASE_URL}data.json`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data: unknown = await response.json();

        if (!isRecordArray(data)) {
            throw new Error("Невірний формат даних");
        }

        records = data;
        updateFilters();
    } catch (error: unknown) {
        cardsContainer.textContent = "";

        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Не вдалося завантажити дані. Спробуйте ще раз.";

        const retryButton = document.createElement("button");
        retryButton.type = "button";
        retryButton.textContent = "Повторити";
        retryButton.addEventListener("click", () => {
            void loadRecords();
        });

        cardsContainer.append(errorMessage, retryButton);
        console.error("Помилка завантаження:", error);
    }
}

void loadRecords();
