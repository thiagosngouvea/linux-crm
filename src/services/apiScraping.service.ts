import axios from "axios";
import Cookies from "js-cookie";
import { notification } from "antd";

export const URLFiles = "https://linuximoveis.nyc3.digitaloceanspaces.com/propertiesImages";

const apiScraping = () => {
  const defaultOptions = {
    baseURL: 'http://localhost:3000/api/',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    },
  };

  let instance = axios.create(defaultOptions);

  return instance;
};

export default apiScraping();
