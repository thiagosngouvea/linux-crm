import api from "./api.service";


const getAll = async (
    page = 1,
    per_page = 8,
    filterBy = "",
    filterValue?: string,
    filterType = ""
) =>
  await api.get(
    `/properties?page=${page}&per_page=${per_page}&orderBy=created_at&orderType=DESC${
    !!filterValue
    ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}`
    : ""
  }`
);

const getByUrl = async (url: string) => await api.get(`/properties/${url}`);

const getById = async (id: any) => await api.get(`/properties/single/${id}`);

const create = async (data: any) => await api.post(`/properties`, data);

const update = async (id: any, data: any) => await api.put(`/properties/${id}`, data);

const uploadImages = async (id:string, data: any) => await api.post(`/properties/images/${id}`, data ,{
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

export const propertiesService = {
  getAll,
  getByUrl,
  getById,
  create,
  update,
  uploadImages
};
