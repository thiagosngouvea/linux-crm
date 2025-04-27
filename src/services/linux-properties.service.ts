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
    `/linux-properties?page=${page}&per_page=${per_page}&orderBy=created_at&orderType=DESC${
    !!filterValue
    ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}`
    : ""
  }`
);

const getInAllFields = async (search: string, page = 1, per_page = 8) => await api.get(`/linux-properties/search?page=${page}&per_page=${per_page}&search=${search}`);

const getByUrl = async (url: string) => await api.get(`/linux-properties/${url}`);

const getFieldsInformations = async (
  filterBy = "",
  filterValue?: string,
  filterType = ""
) =>
  await api.get(
    `/linux-properties/informations/list?page=${1}&per_page=${500000}${
      !!filterValue
        ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}`
        : ""
    }`
  );

const getFieldsInformationsByCondominiumName = async (condominiumName: string) => await api.get(`/linux-properties/condominium-name/list`, {
  params: {
    condominiumName
  }
});

const getById = async (id: any) => await api.get(`/linux-properties/single/${id}`);

const create = async (data: any) => await api.post(`/linux-properties`, data);

const update = async (id: any, data: any) => await api.put(`/linux-properties/${id}`, data);

const getNeighborhoods = async () => await api.get(`/linux-properties/neighborhoods/list`);

const getNeighborhoodsByCity = async (city: string | null) => await api.get(`/linux-properties/neighborhoods/${city}`);

const getCities = async () => await api.get(`/cities-states/`);

const getCondominiums = async () => await api.get(`/linux-properties/condominiums/list`);

const getTypes = async () => await api.get(`/linux-properties/types/list`);

const uploadImages = async (id:string, data: any) => await api.post(`/linux-properties/images/${id}`, data ,{
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

const uploadExcel = async (data: any) => await api.post(`/linux-properties/upload-excel`, data ,{
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

const getInTecimobByReference = async (reference: string, token: string) => await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/linux-properties?sort=-calculated_price&filter%5Breference%5D=${reference}&limit=50&offset=1&count=deals&with_grouped_condos=true`, {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});

const deleteProperties = async (id: any) => await api.delete(`/linux-properties/${id}`);

const duplicateProperties = async (ids: any[]) => await api.post(`/linux-properties/duplicate-properties`, {
  ids
});

const getNextReference = async (prefix: string) => await api.get(`/linux-properties/next-reference/${prefix}`);

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
  getInTecimobByReference,
  getFieldsInformations,
  deleteProperties,
  getFieldsInformationsByCondominiumName,
  getInAllFields,
  duplicateProperties,
  getNextReference
};
