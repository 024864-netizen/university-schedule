
import { Link, useParams } from "react-router-dom";
import type { RecordItem } from "../types";

interface DetailsPageProps {
    records: RecordItem[];
}

export function DetailsPage({ records }: DetailsPageProps) {
    const { id } = useParams<{ id: string }>();
    const record = records.find((item) => String(item.id) === id);

    if (!record) {
        return (
            <section>
                <h2>Дисципліну не знайдено</h2>
                <Link to="/">Повернутися до списку</Link>
            </section>
        );
    }

    return (
        <article className="card">
            <h2>{record.name}</h2>
            <p><strong>Код:</strong> {record.code}</p>
            <p><strong>Кредити:</strong> {record.credits}</p>
            <p><strong>Семестр:</strong> {record.semester}</p>
            <p>{record.description}</p>
            <Link to="/">← Назад до списку</Link>
        </article>
    );
}
