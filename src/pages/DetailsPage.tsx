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
                <h2>Запис не знайдено</h2>
                <Link to="/">Повернутися до списку</Link>
            </section>
        );
    }

    return (
        <article className="card">
            <h2>{record.title}</h2>
            <p>{record.text}</p>
            <p>Категорія: {record.category}</p>
            <Link to="/">← Назад до списку</Link>
        </article>
    );
}