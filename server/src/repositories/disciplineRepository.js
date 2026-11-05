let disciplines = [
  {
    id: 1,
    code: "WEB101",
    name: "Вебпрограмування",
    credits: 4,
    semester: 1,
    description: "Основи веброзробки та REST API",
  },
  {
    id: 2,
    code: "JS102",
    name: "JavaScript",
    credits: 5,
    semester: 2,
    description: "Програмування мовою JavaScript",
  },
  {
    id: 3,
    code: "DB103",
    name: "Бази даних",
    credits: 3,
    semester: 1,
    description: "Основи роботи з базами даних",
  },
];

let nextId = 4;

export const findAll = () => disciplines;

export const findById = (id) =>
  disciplines.find((discipline) => discipline.id === Number(id));

export const create = (data) => {
  const discipline = {
    id: nextId++,
    ...data,
  };

  disciplines.push(discipline);
  return discipline;
};

export const update = (id, data) => {
  const index = disciplines.findIndex(
    (discipline) => discipline.id === Number(id)
  );

  if (index === -1) return null;

  disciplines[index] = {
    ...disciplines[index],
    ...data,
  };

  return disciplines[index];
};

export const remove = (id) => {
  const index = disciplines.findIndex(
    (discipline) => discipline.id === Number(id)
  );

  if (index === -1) return false;

  disciplines.splice(index, 1);
  return true;
};