
import { pool } from "../config/database.js";

export const findAll = async (limit = 10, offset = 0) => {
    const [rows] = await pool.execute(
        `SELECT id, code, name, credits, semester, description, created_at
     FROM disciplines
     ORDER BY id
     LIMIT ? OFFSET ?`,
        [Number(limit), Number(offset)]
    );

    return rows;
};

export const countAll = async () => {
    const [rows] = await pool.execute(
        "SELECT COUNT(*) AS total FROM disciplines"
    );

    return rows[0].total;
};
export const findById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT id, code, name, credits, semester, description, created_at
     FROM disciplines
     WHERE id = ?`,
        [Number(id)]
    );

    return rows[0] || null;
};

export const create = async (data) => {
    const { code, name, credits, semester, description } = data;

    const [result] = await pool.execute(
        `INSERT INTO disciplines (code, name, credits, semester, description)
     VALUES (?, ?, ?, ?, ?)`,
        [code, name, credits, semester, description ?? null]
    );

    return findById(result.insertId);
};

export const update = async (id, data) => {
    const { code, name, credits, semester, description } = data;

    const [result] = await pool.execute(
        `UPDATE disciplines
     SET code = ?, name = ?, credits = ?, semester = ?, description = ?
     WHERE id = ?`,
        [code, name, credits, semester, description ?? null, Number(id)]
    );

    if (result.affectedRows === 0) return null;

    return findById(id);
};

export const remove = async (id) => {
    const [result] = await pool.execute(
        "DELETE FROM disciplines WHERE id = ?",
        [Number(id)]
    );

    return result.affectedRows > 0;
};
