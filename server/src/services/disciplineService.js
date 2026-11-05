import * as repository from "../repositories/disciplineRepository.js";

export const getAllDisciplines = (page = 1, limit = 10) => {
  const all = repository.findAll();

  const start = (page - 1) * limit;

  return {
    data: all.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: all.length,
      totalPages: Math.ceil(all.length / limit),
    },
  };
};

export const getDisciplineById = (id) => {
  return repository.findById(id);
};

export const createDiscipline = (data) => {
  return repository.create(data);
};

export const updateDiscipline = (id, data) => {
  return repository.update(id, data);
};

export const deleteDiscipline = (id) => {
  return repository.remove(id);
};