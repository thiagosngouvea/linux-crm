import api from "./api.service";

const login = async ( email: string, password: string ) => {
  return await api.post("/sessions", {
    email,
    password,
  });
};

export const sessionService = { login };
