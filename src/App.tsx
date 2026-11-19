
import { useEffect, useState } from "react";
import type { RecordItem } from "./types";
import { Layout } from "./components/Layout";
import { Header } from "./components/Header";
import { RecordList } from "./components/RecordList";
import { RecordForm } from "./components/RecordForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DetailsPage } from "./pages/DetailsPage";

const API_URL = "http://localhost:3000/api/v1/disciplines";

export default function App() {
    const [records, setRecords] = useState<RecordItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    async function loadRecords() {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}?limit=100`);

            if (!response.ok) {
                throw new Error("Не вдалося завантажити дисципліни");
            }

            const result = await response.json();
            setRecords(result.data);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Помилка завантаження");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadRecords();
    }, []);

    async function addRecord(record: Omit<RecordItem, "id" | "created_at">) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(record),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Не вдалося додати дисципліну");
        }

        await loadRecords();
    }

    const filteredRecords = records.filter((record) =>
        `${record.code} ${record.name} ${record.description}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Layout>
                <Header search={search} onSearchChange={setSearch} />

                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <RecordForm onAdd={addRecord} />

                                {loading ? (
                                    <p>Завантаження...</p>
                                ) : error ? (
                                    <p role="alert">{error}</p>
                                ) : (
                                    <RecordList records={filteredRecords} />
                                )}
                            </>
                        }
                    />
                    <Route
                        path="/details/:id"
                        element={<DetailsPage records={records} />}
                    />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}
