import axios from "axios";
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

const getNeighborhoods = async () => await api.get(`/properties/neighborhoods/list`);

const getNeighborhoodsByCity = async (city: string | null) => await api.get(`/properties/neighborhoods/${city}`);

const getCities = async () => await api.get(`/cities-states/`);

const getCondominiums = async () => await api.get(`/properties/condominiums/list`);

const getTypes = async () => await api.get(`/properties/types/list`);

const uploadImages = async (id:string, data: any) => await api.post(`/properties/images/${id}`, data ,{
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

const uploadExcel = async (data: any) => await api.post(`/properties/upload-excel`, data ,{
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

const getInTecimobByReference = async (reference: string, token: string) => await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties?sort=-calculated_price&filter%5Breference%5D=${reference}&limit=50&offset=1&count=deals&with_grouped_condos=true`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});

export const propertiesService = {
  getAll,
  getByUrl,
  getById,
  create,
  update,
  uploadImages,
  getNeighborhoods,
  getNeighborhoodsByCity,
  getCities,
  getCondominiums,
  getTypes,
  uploadExcel,
  getInTecimobByReference
};
