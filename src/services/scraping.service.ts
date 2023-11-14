import apiScraping from "./apiScraping.service";
import api from "./api.service";
import axios from "axios";


const Osvaldo = async ( pages: string | number ) => await apiScraping.get(`/scraping/osvaldo?pages=${pages}`);

export const getScrapingAmancio = async (page: any) => {
    const response = await axios.get(`https://www.imobiliariaamancio.com.br/api/listings?pagina=${page}`);
    return response;
}

export const getScrapingOlx = async (params: string) => {
    const response = await api.get(`/properties/scraping/olx?query=${params}`);
    return response;
}


export const scrapingService = {
    Osvaldo,
    getScrapingAmancio,
    getScrapingOlx
};

  