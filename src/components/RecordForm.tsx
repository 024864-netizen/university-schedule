
import { useState } from "react";

interface NewRecord {
    code: string;
    name: string;
    credits: number;
    semester: number;
    description: string;
}

interface RecordFormProps {
    onAdd: (record: NewRecord) => Promise<void>;
}

export function RecordForm({ onAdd }: RecordFormProps) {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [credits, setCredits] = useState(3);
    const [semester, setSemester] = useState(1);
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await onAdd({
                code: code.trim(),
                name: name.trim(),
                credits,
                semester,
                description: description.trim(),
            });

            setCode("");
            setName("");
            setCredits(3);
            setSemester(1);
            setDescription("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Помилка додавання");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="record-form">
            <h2>Додати дисципліну</h2>

            <label>
                Код дисципліни
                <input value={code} onChange={(e) => setCode(e.target.value)} required />
            </label>

            <label>
                Назва дисципліни
                <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>

            <label>
                Кількість кредитів
                <input
                    type="number"
                    min="1"
                    max="60"
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    required
                />
            </label>

            <label>
                Семестр
                <input
                    type="number"
                    min="1"
                    max="12"
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    required
                />
            </label>

            <label>
                Опис
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>

            {error && <p role="alert">{error}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Збереження..." : "Додати дисципліну"}
            </button>
        </form>
    );
}
