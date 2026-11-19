
import * as service from "../services/disciplineService.js";

const handleError = (error, res, next) => {
    if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            success: false,
            message: "Такий код дисципліни вже існує",
            errors: [],
        });
    }

    next(error);
};

export const getAll = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        if (
            !Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Некоректні параметри пагінації",
                errors: [],
            });
        }

        const result = await service.getAllDisciplines(page, limit);

        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        handleError(error, res, next);
    }
};

export const getOne = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                success: false,
                message: "Некоректний ID дисципліни",
                errors: [],
            });
        }

        const discipline = await service.getDisciplineById(id);

        if (!discipline) {
            return res.status(404).json({
                success: false,
                message: "Дисципліну не знайдено",
                errors: [],
            });
        }

        res.status(200).json({
            success: true,
            data: discipline,
        });
    } catch (error) {
        handleError(error, res, next);
    }
};

export const create = async (req, res, next) => {
    try {
        const { code, name, credits, semester, description } = req.body;
        const errors = [];

        if (!code || typeof code !== "string" || !code.trim()) {
            errors.push({ field: "code", message: "Введіть код дисципліни" });
        }

        if (!name || typeof name !== "string" || !name.trim()) {
            errors.push({ field: "name", message: "Введіть назву дисципліни" });
        }

        if (!Number.isInteger(credits) || credits < 1 || credits > 60) {
            errors.push({ field: "credits", message: "Кредити мають бути від 1 до 60" });
        }

        if (!Number.isInteger(semester) || semester < 1 || semester > 12) {
            errors.push({ field: "semester", message: "Семестр має бути від 1 до 12" });
        }

        if (description !== undefined && typeof description !== "string") {
            errors.push({ field: "description", message: "Опис має бути текстом" });
        }

        if (errors.length) {
            return res.status(422).json({
                success: false,
                message: "Помилка перевірки даних",
                errors,
            });
        }

        const discipline = await service.createDiscipline({
            code: code.trim(),
            name: name.trim(),
            credits,
            semester,
            description: description || "",
        });

        res.status(201).json({
            success: true,
            data: discipline,
        });
    } catch (error) {
        handleError(error, res, next);
    }
};

export const update = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                success: false,
                message: "Некоректний ID дисципліни",
                errors: [],
            });
        }

        const current = await service.getDisciplineById(id);

        if (!current) {
            return res.status(404).json({
                success: false,
                message: "Дисципліну не знайдено",
                errors: [],
            });
        }

        const { code, name, credits, semester, description } = req.body;
        const errors = [];

        if (code !== undefined && (typeof code !== "string" || !code.trim())) {
            errors.push({ field: "code", message: "Код не може бути порожнім" });
        }

        if (name !== undefined && (typeof name !== "string" || !name.trim())) {
            errors.push({ field: "name", message: "Назва не може бути порожньою" });
        }

        if (credits !== undefined &&
            (!Number.isInteger(credits) || credits < 1 || credits > 60)) {
            errors.push({ field: "credits", message: "Кредити мають бути від 1 до 60" });
        }

        if (semester !== undefined &&
            (!Number.isInteger(semester) || semester < 1 || semester > 12)) {
            errors.push({ field: "semester", message: "Некоректний семестр" });
        }

        if (description !== undefined && typeof description !== "string") {
            errors.push({ field: "description", message: "Опис має бути текстом" });
        }

        if (errors.length) {
            return res.status(422).json({
                success: false,
                message: "Помилка перевірки даних",
                errors,
            });
        }

        const updated = await service.updateDiscipline(id, {
            code: code !== undefined ? code.trim() : current.code,
            name: name !== undefined ? name.trim() : current.name,
            credits: credits !== undefined ? credits : current.credits,
            semester: semester !== undefined ? semester : current.semester,
            description: description !== undefined ? description : current.description,
        });

        res.status(200).json({
            success: true,
            data: updated,
        });
    } catch (error) {
        handleError(error, res, next);
    }
};

export const remove = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({
                success: false,
                message: "Некоректний ID дисципліни",
                errors: [],
            });
        }

        const deleted = await service.deleteDiscipline(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Дисципліну не знайдено",
                errors: [],
            });
        }

        res.status(204).send();
    } catch (error) {
        handleError(error, res, next);
    }
};
