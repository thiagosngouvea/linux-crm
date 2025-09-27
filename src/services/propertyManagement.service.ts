import api from "./api.service";


const getAll = async (
    page = 1,
    per_page = 8,
    filterBy = "",
    filterValue?: string,
    filterType = ""
) =>
  await api.get(
    `/property-management?page=${page}&per_page=${per_page}&orderBy=created_at&orderType=DESC${
    !!filterValue
    ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}`
    : ""
  }`
);


const getById = async (id: any) => await api.get(`/property-management/${id}`);

const create = async (data: any) => await api.post(`/property-management`, data);

const update = async (id: any, data: any) => await api.put(`/property-management/${id}`, data);

const remove = async (id: any) => await api.delete(`/property-management/${id}`);

export const propertyManagementService = {
  getAll,
  getById,
  create,
  update,
  remove
};
