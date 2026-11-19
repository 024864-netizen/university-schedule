import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import disciplineRoutes from "./routes/disciplineRoutes.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { pool } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
}));

app.use(express.json());
app.use(requestLogger);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "University Schedule API is running",
  });
});

app.use("/api/v1/disciplines", disciplineRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

const startServer = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Успішне підключення до MariaDB!");
        connection.release();

        app.listen(PORT, () => {
            console.log(`Сервер запущено: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Помилка підключення до бази даних:", error.message);
        process.exit(1);
    }
};

startServer();