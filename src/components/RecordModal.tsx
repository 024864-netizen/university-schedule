import { useEffect } from "react";
import type { RecordItem } from "../types";

interface RecordModalProps {
    record: RecordItem | null;
    onClose: () => void;
}

export function RecordModal({ record, onClose }: RecordModalProps) {
    useEffect(() => {
        if (!record) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") onClose();
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [record, onClose]);

    if (!record) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <section
                className="record-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 id="modal-title">{record.title}</h2>
                <p>{record.text}</p>
                <button type="button" onClick={onClose}>
                    Закрити
                </button>
            </section>
        </div>
    );
}