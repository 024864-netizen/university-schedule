import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
    charset: "utf8mb4",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "university_schedule",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

pool.getConnection()
    .then((connection) => {
        console.log("Успішне підключення до MariaDB!");
        connection.release();
    })
    .catch((error) => {
        console.error("Помилка підключення до бази:", error.message);
    });
