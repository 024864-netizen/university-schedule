import { useState } from "react";

interface NewRecord {
    title: string;
    text: string;
    category: "schedule" | "groups" | "feedback";
}

interface RecordFormProps {
    onAdd: (record: NewRecord) => void;
}

export function RecordForm({ onAdd }: RecordFormProps) {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [category, setCategory] =
        useState<NewRecord["category"]>("schedule");
    const [error, setError] = useState("");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!title.trim() || !text.trim()) {
            setError("Заповніть усі поля.");
            return;
        }

        onAdd({
            title: title.trim(),
            text: text.trim(),
            category,
        });

        setTitle("");
        setText("");
        setCategory("schedule");
        setError("");
    }

    return (
        <form onSubmit={handleSubmit} className="record-form">
            <h2>Додати запис</h2>

            <label>
                Назва
                <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                />
            </label>

            <label>
                Опис
                <textarea
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    required
                />
            </label>

            <label>
                Категорія
                <select
                    value={category}
                    onChange={(event) =>
                        setCategory(event.target.value as NewRecord["category"])
                    }
                >
                    <option value="schedule">Розклад</option>
                    <option value="groups">Групи</option>
                    <option value="feedback">Відгуки</option>
                </select>
            </label>

            {error && <p role="alert">{error}</p>}

            <button type="submit">Додати</button>
        </form>
    );
}