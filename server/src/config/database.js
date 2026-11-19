
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const isCloud = process.env.DB_HOST?.includes("tidbcloud.com");

export const pool = mysql.createPool({
    charset: "utf8mb4",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "university_schedule",
    ...(isCloud ? { ssl: { rejectUnauthorized: true, minVersion: "TLSv1.2" } } : {}),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

pool.getConnection()
    .then((connection) => {
        console.log("Успішне підключення до бази даних!");
        connection.release();
    })
    .catch((error) => {
        console.error("Помилка підключення до бази:", error.message);
    });
