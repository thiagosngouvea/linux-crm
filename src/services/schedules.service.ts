import api from "./api.service";


const getAll = async (
    page = 1,
    per_page = 8,
    filterBy = "",
    filterValue?: string,
    filterType = ""
) =>
  await api.get(
    `/schedules?page=${page}&per_page=${per_page}&orderBy=created_at&orderType=DESC${
    !!filterValue
    ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}`
    : ""
  }`
);


const create = async (data: any) => await api.post(`/schedules`, data);

const update = async (id: any, data: any) => await api.put(`/schedules/${id}`, data);

const remove = async (id: any) => await api.delete(`/schedules/${id}`);

export const schedulesService = {
  getAll,
  create,
  update,
  remove
};
