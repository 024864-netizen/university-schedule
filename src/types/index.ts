export interface RecordItem {
    id: number;
    title: string;
    text: string;
    category: "schedule" | "groups" | "feedback";
}

export type Theme = "light" | "dark";

export type LoadingState =
    | { status: "loading" }
    | { status: "success" }
    | { status: "empty" }
    | { status: "error"; message: string };
