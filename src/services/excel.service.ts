import api from "./api.service";


const getAll = async (
    page = 1,
    per_page = 8,
    filterBy = "",
    filterValue?: string,
    filterType = ""
) =>
  await api.get(
    `/excel?page=${page}&per_page=${per_page}&orderBy=created_at&orderType=DESC${
    !!filterValue
    ? `&filterBy=${filterBy}&filterValue=${filterValue}&filterType=${filterType}`
    : ""
  }`
);


const create = async (data: any) => await api.post(`/excel`, data);

const update = async (id: any, data: any) => await api.put(`/excel/${id}`, data);

const uploadExcel = async (data: any) => await api.post(`/excel/upload-excel`, data ,{
  headers: {
    "Content-Type": "multipart/form-data"
  }
});



export const excelService = {
  getAll,
  create,
  update,
  uploadExcel
};
