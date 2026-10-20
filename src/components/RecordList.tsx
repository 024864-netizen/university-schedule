import type { RecordItem } from "../types";
import { RecordCard } from "./RecordCard";

interface RecordListProps {
    records: RecordItem[];
}

export function RecordList({ records }: RecordListProps) {
    if (records.length === 0) {
        return <p>Записів не знайдено.</p>;
    }

    return (
        <section className="record-list" aria-label="Список записів">
            {records.map((record) => (
                <RecordCard key={record.id} record={record} />
            ))}
        </section>
    );
}