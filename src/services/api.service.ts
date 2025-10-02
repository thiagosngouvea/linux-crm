import axios from "axios";
import Cookies from "js-cookie";
import { notification } from "antd";

export const URLFiles = "https://linuximoveis.nyc3.digitaloceanspaces.com/propertiesImages";

const api = () => {
  const defaultOptions = {
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    },
  };

  let instance = axios.create(defaultOptions);

  // if (typeof window !== "undefined") {
  instance.interceptors.request.use(function (config) {
    // Verificar se estamos em uma página pública que não precisa de token
    const isPublicRoute = typeof window !== "undefined" && 
      window.location.pathname.startsWith('/imoveis/questionario/');
    
    if (!isPublicRoute) {
      const token = Cookies.get("SS$S");
      if (token) {
        let sessionParsed = JSON.parse(token);
        if (sessionParsed && sessionParsed.token) {
          config.headers.Authorization = `Bearer ${sessionParsed.token}`;
        }
      }
    }

    return config;
  });

  instance.interceptors.response.use(
    function (config) {
      return config;
    },
    function (error) {
      let status = error?.response?.status;
      const isPublicRoute = typeof window !== "undefined" && 
        window.location.pathname.startsWith('/imoveis/questionario/');
      
      if (
        window &&
        status === 401 &&
        error?.config?.url !== "/sessions" &&
        !isPublicRoute
      ) {
        notification.error({
          message: "Por favor, faça o login para continuar",
        });
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default api();
