
export const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            success: false,
            message: "Запис із таким кодом уже існує",
            errors: [],
        });
    }

    if (err.code === "ER_CHECK_CONSTRAINT_VIOLATED") {
        return res.status(422).json({
            success: false,
            message: "Дані не відповідають обмеженням бази даних",
            errors: [],
        });
    }

    const status = err.status || err.statusCode || 500;

    res.status(status).json({
        success: false,
        message: status === 500
            ? "Внутрішня помилка сервера"
            : err.message,
        errors: err.errors || [],
    });
};
