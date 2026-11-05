import * as service from "../services/disciplineService.js";

export const getAll = (req, res, next) => {
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
        message: "Invalid pagination parameters",
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      ...service.getAllDisciplines(page, limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid discipline ID",
        errors: [],
      });
    }

    const discipline = service.getDisciplineById(id);

    if (!discipline) {
      return res.status(404).json({
        success: false,
        message: "Discipline not found",
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      data: discipline,
    });
  } catch (error) {
    next(error);
  }
};

export const create = (req, res, next) => {
  try {
    const { code, name, credits, semester, description } = req.body;

    const errors = [];

    if (!code || typeof code !== "string") {
      errors.push({ field: "code", message: "Code is required" });
    }

    if (!name || typeof name !== "string") {
      errors.push({ field: "name", message: "Name is required" });
    }

    if (!Number.isInteger(credits) || credits < 1 || credits > 60) {
      errors.push({ field: "credits", message: "Credits must be from 1 to 60" });
    }

    if (!Number.isInteger(semester) || semester < 1 || semester > 12) {
      errors.push({ field: "semester", message: "Semester must be from 1 to 12" });
    }

    if (errors.length) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const existing = service.getAllDisciplines(1, 100).data
      .some((item) => item.code.toLowerCase() === code.trim().toLowerCase());

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Discipline code already exists",
        errors: [],
      });
    }

    const discipline = service.createDiscipline({
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
    next(error);
  }
};

export const update = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid discipline ID",
        errors: [],
      });
    }

    const current = service.getDisciplineById(id);

    if (!current) {
      return res.status(404).json({
        success: false,
        message: "Discipline not found",
        errors: [],
      });
    }

    const { code, name, credits, semester, description } = req.body;
    const errors = [];

    if (code !== undefined && (typeof code !== "string" || !code.trim())) {
      errors.push({ field: "code", message: "Code must not be empty" });
    }

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      errors.push({ field: "name", message: "Name must not be empty" });
    }

    if (credits !== undefined &&
        (!Number.isInteger(credits) || credits < 1 || credits > 60)) {
      errors.push({ field: "credits", message: "Credits must be from 1 to 60" });
    }

    if (semester !== undefined &&
        (!Number.isInteger(semester) || semester < 1 || semester > 12)) {
      errors.push({ field: "semester", message: "Invalid semester" });
    }

    if (errors.length) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    if (code !== undefined) {
      const duplicate = service.getAllDisciplines(1, 100).data.some(
        (item) =>
          item.id !== id &&
          item.code.toLowerCase() === code.trim().toLowerCase()
      );

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Discipline code already exists",
          errors: [],
        });
      }
    }

    const updated = service.updateDiscipline(id, {
      ...(code !== undefined && { code: code.trim() }),
      ...(name !== undefined && { name: name.trim() }),
      ...(credits !== undefined && { credits }),
      ...(semester !== undefined && { semester }),
      ...(description !== undefined && { description }),
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid discipline ID",
        errors: [],
      });
    }

    const deleted = service.deleteDiscipline(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Discipline not found",
        errors: [],
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};