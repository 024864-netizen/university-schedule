import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import disciplineRoutes from "./routes/disciplineRoutes.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});