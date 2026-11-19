
import { Link } from "react-router-dom";
import type { RecordItem } from "../types";

interface RecordCardProps {
    record: RecordItem;
}

export function RecordCard({ record }: RecordCardProps) {
    return (
        <article className="card">
            <h3>{record.name}</h3>
            <p><strong>Код:</strong> {record.code}</p>
            <p><strong>Кредити:</strong> {record.credits}</p>
            <p><strong>Семестр:</strong> {record.semester}</p>
            <p>{record.description}</p>
            <Link to={`/details/${record.id}`}>Детальніше</Link>
        </article>
    );
}
