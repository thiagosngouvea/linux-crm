import api from "./api.service";


const getAll = async (
    page = 1,
    per_page = 8,
    filterBy = "",
    filterValue?: string,
    filterType = ""
) =>
  await api.get(
    `/tecimob-properties?page=${page}&per_page=${per_page}&orderBy=created_at&orderType=DESC${
    !!filterValue
    ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}`
    : ""
  }`
);


const create = async (data: any) => await api.post(`/tecimob-properties`, data);

const update = async (id: any, data: any) => await api.put(`/tecimob-properties/${id}`, data);

const remove = async (id: any) => await api.delete(`/tecimob-properties/${id}`);

export const tecimobPropertiesService = {
  getAll,
  create,
  update,
  remove
};
