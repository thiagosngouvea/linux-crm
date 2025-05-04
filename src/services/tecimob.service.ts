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
  return await axios.post(`https://api.gerenciarimoveis-cf.com.br/api/properties/${id}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getPrecoImovel = async (id: string, token: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/financial/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const alterarPrecoImovel = async (id: string, token: string, data: any) => {
  return await axios.patch(`https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/financial`, {
    ...data,
  }
  ,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getDescricaoImovel = async (id: string, token: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/description/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const alterarDescricaoImovel = async (id: string, token: string, data: any) => {
  return await axios.patch(`https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/description`, {
    ...data,
  }
  ,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getPublicacaoImovel = async (id: string, token: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/publish/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const alterarPublicacaoImovel = async (id: string, token: string, data: any) => {
  return await axios.patch(`https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/publish`, {
    ...data,
  }
  ,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getImoveis = async (token: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}



export const tecimobService = { 
  login,
  inativarImovel,
  adicionarNotaImovel,
  ativarImovel,
  alterarPrecoImovel,
  getPrecoImovel,
  getDescricaoImovel,
  alterarDescricaoImovel,
  getPublicacaoImovel,
  alterarPublicacaoImovel,
  getImoveis
};
  