import axios from "axios";


const login = async ( email: string, password: string ) => {
    return await axios.post("https://api.gerenciarimoveis-cf.com.br/api/auths", {
      email,
      password,
    });
  };

const inativarImovel = async (id: string, token: string) => {
  return await axios.delete(`https://api.gerenciarimoveis-cf.com.br/api/properties/${id}/trash/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const adicionarNotaImovel = async (id: string, token: string, note: string) => {
  return await axios.post(`https://api.gerenciarimoveis-cf.com.br/api/crm/notes`, {
    property_id: id,
    note,
  }
  ,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
  
const ativarImovel = async (id: string, token: string) => {
  return await axios.put(`https://api.gerenciarimoveis-cf.com.br/api/properties/${id}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export const tecimobService = { 
  login,
  inativarImovel,
  adicionarNotaImovel,
  ativarImovel
};
  