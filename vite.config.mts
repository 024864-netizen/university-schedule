import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    base: "/university-schedule/",
    build: {
        rollupOptions: {
            input: {
                index: resolve(rootDir, "index.html"),
                schedule: resolve(rootDir, "schedule.html"),
                groups: resolve(rootDir, "groups.html"),
            },
        },
    },
});