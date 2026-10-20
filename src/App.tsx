import { useEffect, useState } from "react";
import type { RecordItem } from "./types";
import { Layout } from "./components/Layout";
import { Header } from "./components/Header";
import { RecordList } from "./components/RecordList";
import { RecordForm } from "./components/RecordForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DetailsPage } from "./pages/DetailsPage";

export default function App() {
    const [records, setRecords] = useState<RecordItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadRecords() {
            try {
                const response = await fetch(`${import.meta.env.BASE_URL}data.json`, {
                    signal: controller.signal,
                });
                if (!response.ok) throw new Error("Помилка завантаження даних");
                const data: unknown = await response.json();
                if (!Array.isArray(data)) throw new Error("Невірний формат даних");

                setRecords(data as RecordItem[]);
            } catch (err: unknown) {
                if (err instanceof Error && err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        void loadRecords();
        return () => controller.abort();
    }, []);

    const filteredRecords = records.filter((record) =>
        `${record.title} ${record.text}`.toLowerCase().includes(search.toLowerCase()),
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
                                <RecordForm
                                    onAdd={(record) =>
                                        setRecords((previous) => [
                                            ...previous,
                                            { ...record, id: Date.now() },
                                        ])
                                    }
                                />
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
                    <Route path="/details/:id" element={<DetailsPage records={records} />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}