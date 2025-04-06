import api from "./api.service";


const getAll = async (
    page = 1,
    per_page = 8,
    filterBy = "",
    filterValue?: string,
    filterType = ""
) =>
  await api.get(
    `/users?page=${page}&per_page=${per_page}&orderBy=created_at&orderType=DESC${
    !!filterValue
    ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}`
    : ""
  }`
);


const create = async (data: any) => await api.post(`/users`, data);

const update = async (id: any, data: any) => await api.put(`/users/${id}`, data);

const remove = async (id: any) => await api.delete(`/users/${id}`);

export const userService = {
  getAll,
  create,
  update,
  remove
};
