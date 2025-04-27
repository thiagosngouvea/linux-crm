import api from "./api.service";


const getAll = async (
    page = 1,
    per_page = 8,
    filterBy = "",
    filterValue?: string,
    filterType = ""
) =>
  await api.get(
    `/lists?page=${page}&per_page=${per_page}&orderBy=name&orderType=ASC${
    !!filterValue
    ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}`
    : ""
  }`
);


const create = async (data: any) => await api.post(`/lists`, data);

const update = async (id: any, data: any) => await api.put(`/lists/${id}`, data);

const remove = async (id: any) => await api.delete(`/lists/${id}`);

export const listsService = {
  getAll,
  create,
  update,
  remove
};
