import { Link } from "react-router-dom";
import type { RecordItem } from "../types";

interface RecordCardProps {
    record: RecordItem;
}

export function RecordCard({ record }: RecordCardProps) {
    return (
        <article className="card">
            <h3>{record.title}</h3>
            <p>{record.text}</p>
            <Link to={`/details/${record.id}`}>Детальніше</Link>
        </article>
    );
}
