
import * as repository from "../repositories/disciplineRepository.js";

export const getAllDisciplines = async (page = 1, limit = 10) => {
    const currentPage = Math.max(1, Number(page) || 1);
    const currentLimit = Math.min(100, Math.max(1, Number(limit) || 10));

    const offset = (currentPage - 1) * currentLimit;

    const [data, total] = await Promise.all([
        repository.findAll(currentLimit, offset),
        repository.countAll(),
    ]);

    return {
        data,
        pagination: {
            page: currentPage,
            limit: currentLimit,
            total,
            totalPages: Math.ceil(total / currentLimit),
        },
    };
};

export const getDisciplineById = async (id) =>
    repository.findById(id);

export const createDiscipline = async (data) =>
    repository.create(data);

export const updateDiscipline = async (id, data) =>
    repository.update(id, data);

export const deleteDiscipline = async (id) =>
    repository.remove(id);
