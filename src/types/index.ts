export interface RecordItem {
    id: number;
    code: string;
    name: string;
    credits: number;
    semester: number;
    description: string;
    created_at?: string;
}

export type Theme = "light" | "dark";

export type LoadingState =
    | { status: "loading" }
    | { status: "success" }
    | { status: "empty" }
    | { status: "error"; message: string };
