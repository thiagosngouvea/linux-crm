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

const getImovelDetails = async (token: string, id: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties/${id}?include=rate%2Cstages%2Cis_under_negotiation%2Cuser%2Ccondominium%2Ccondo_characteristics%2Ccharacteristics%2Cestablishments%2Cpeople%2Cpeople.primary_phone%2Ccover_image%2Cpermissions%2Creal_estate.primary_domain%2Csituation%2Cagent%2Csolar_position%2Cexchange_types&count=matcheds_sent%2Cmatcheds_new%2Cdocuments%2Cdeals_without_pipeline%2Cnotes%2Cnotes_auth%2Cbookings_active`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getUniqueImovel = async (token: string, id: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getImovelByReference = async (token: string, reference: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties?filter%5Breference%5D=${reference}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getPeople = async (token: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/people?sort=-updated_at&include=user&with_cellphone_number=true&limit=20000&offset=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getUsers = async (token: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/users?sort=by_name&filter%5Brealtor%5D=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getSolarPosition = async (token: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties/solar-positions?sort=order`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getTypes = async (token: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/types?sort=order`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getCondos = async (token: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/condos?sort=updated_at&include=establishments&limit=15&offset=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getSituations = async (token: string, by_type_id?: string) => {
  let url = `https://api.gerenciarimoveis-cf.com.br/api/properties/situations?sort=order`;
  if (by_type_id) {
    url += `&filter%5Bby_type_id%5D=${by_type_id}`;
  }
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


//Endpoints de criar imoveis via api
const criarImovelPartialOne = async (
  token: string,
  {
    is_property_titled,
    is_deeded,
    is_corner,
    has_furniture,
    is_condo,
    reference,
    user_id,
    people_id,
    agent_id,
    condo_position,
    situation_id,
    subtype_id,
    profile,
    lifetime,
    incorporation,
    solar_position_id,
    land_type,
    near_sea,
    delivery_forecast,
    condominium_id
  }: {
    is_property_titled: boolean,
    is_deeded: boolean,
    is_corner: boolean,
    has_furniture: boolean,
    is_condo: boolean,
    reference: string,
    user_id: string,
    people_id: string,
    agent_id: string,
    condo_position: string,
    situation_id: string,
    subtype_id: string,
    profile: string,
    lifetime: string,
    incorporation: string,
    solar_position_id: string,
    land_type: number,
    near_sea: string,
    delivery_forecast: string,
    condominium_id: string
  }
) => {
  const payload = {
    is_property_titled,
    is_deeded,
    is_corner,
    has_furniture,
    is_condo,
    reference,
    user_id,
    people_id,
    agent_id,
    condo_position,
    situation_id,
    subtype_id,
    profile,
    lifetime,
    incorporation,
    solar_position_id,
    land_type,
    near_sea,
    delivery_forecast,
    condominium_id
  };

  return await axios.post(
    `https://api.gerenciarimoveis-cf.com.br/api/properties/partial`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

const getRooms = async (token: string, id: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/rooms/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


const patchImovelRooms = async (
  token: string,
  id: string,
  data: {
    transaction?: any,
    is_draft?: boolean,
    type?: {
      id: string,
      title: string,
      order: number,
      information_fields: Array<{
        name: string,
        title: string
      }>,
      rooms_fields: Array<{
        name: string,
        title: string,
        is_default: boolean,
        extra?: Array<{
          name: string,
          title: string
        }>
      }>,
      area_fields: Array<{
        name: string,
        title: string,
        measures: string[],
        is_primary: boolean
      }>,
      slug: string,
      symbol: string,
      primary_area: string
    },
    rooms: {
      [key: string | number]: {
        value: any,
        title?: string,
        name?: string,
        title_formated?: string,
        extra?: {
          [extraKey: string | number]: {
            name?: string,
            title?: string,
            value?: any
          }
        }
      }
    }
  }
) => {
  return await axios.patch(
    `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/rooms`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

const getAreas = async (token: string, id: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/areas/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


const patchImovelAreas = async (
  token: string,
  id: string,
  data: {
    transaction?: any,
    is_draft?: boolean,
    type: {
      id: string,
      title: string,
      order: number,
      information_fields: Array<{
        name: string,
        title: string
      }>,
      rooms_fields: Array<{
        name: string,
        title: string,
        is_default: boolean,
        extra?: Array<{
          name: string,
          title: string
        }>
      }>,
      area_fields: Array<{
        name: string,
        title: string,
        measures: string[],
        is_primary: boolean
      }>,
      slug: string,
      symbol: string,
      primary_area: string
    },
    areas: {
      [key: string]: {
        value: string,
        measure: string,
        name: string
      }
    }
  }
) => {
  return await axios.patch(
    `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/areas`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}


const getPropertiesTypes = async (token: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties/types?sort=`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getFinancialIndexes = async (token: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/financial-indexes?sort=-real_estate_id`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getFinancial = async (token: string, id: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/financial/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}



/**
 * Atualiza os dados financeiros de um imóvel.
 * 
 * Exemplo de data:
 * {
 *   "is_season_available": false,
 *   "transaction": "1",
 *   "is_draft": true,
 *   "price_financial_index_id": "eae1796b-bc96-43b1-b574-0ee7528b9ae4",
 *   "taxes_description": "haddad",
 *   "is_financeable_mcmv": false,
 *   "is_exchangeable": true,
 *   "exchange_note": "asdfg",
 *   "is_price_shown": false,
 *   "price_alternative_text": "Consulte",
 *   "max_people": null,
 *   "territorial_tax_type": 1,
 *   "is_financeable": false,
 *   "has_finance": false,
 *   "warranties": null,
 *   "previous_price": "10.000.000.000,00",
 *   "is_shown_previous_price": true,
 *   "price": "100.000.000,00",
 *   "taxes_price": "10.000,00",
 *   "condominium_price": "20.000,00",
 *   "territorial_tax_price": "100.000,00",
 *   "exchange_max_price": "R$10.000,00",
 *   "exchange_types_id": [
 *     "5d217d2e-4167-4fab-98a0-230fa5a2150d",
 *     "547b2e22-fe51-41c3-a1b0-439b16eee45b",
 *     "477cb884-a249-4b2a-9764-3839a1b05746",
 *     "fa7be966-14c5-402e-ace8-ef14af142969",
 *     "1f372b14-788d-4a65-ba9b-33368a4574a4",
 *     "60109a7f-d33b-4e2c-942f-f2fb895a2335",
 *     "24274e19-446e-423e-8d82-36c38c157101",
 *     "aed416ec-3744-49fc-839c-3242f4723447",
 *     "79e896bd-04d8-4ae6-a76c-9f4366dc6c23"
 *   ],
 *   "territorial_tax_financial_index_id": "eae1796b-bc96-43b1-b574-0ee7528b9ae4",
 *   "condominium_financial_index_id": "eae1796b-bc96-43b1-b574-0ee7528b9ae4",
 *   "taxes_financial_index_id": "eae1796b-bc96-43b1-b574-0ee7528b9ae4"
 * }
 */
const patchFinancial = async (
  token: string,
  id: string,
  data: {
    is_season_available?: boolean,
    transaction?: string,
    is_draft?: boolean,
    price_financial_index_id?: string,
    taxes_description?: string,
    is_financeable_mcmv?: boolean,
    is_exchangeable?: boolean,
    exchange_note?: string,
    is_price_shown?: boolean,
    price_alternative_text?: string,
    max_people?: number | null,
    territorial_tax_type?: number,
    is_financeable?: boolean,
    has_finance?: boolean,
    warranties?: any,
    previous_price?: string,
    is_shown_previous_price?: boolean,
    price?: string,
    taxes_price?: string,
    condominium_price?: string,
    territorial_tax_price?: string,
    exchange_max_price?: string,
    exchange_types_id?: string[],
    territorial_tax_financial_index_id?: string,
    condominium_financial_index_id?: string,
    taxes_financial_index_id?: string
  }
) => {
  return await axios.patch(
    `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/financial`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

const patchInitialInformation = async (
  token: string,
  id: string,
  data: {
    transaction?: number,
    is_draft?: boolean,
    user_id?: string,
    people_id?: string,
    subtype_id?: string,
    condominium_id?: string,
    reference?: string,
    profile?: number,
    land_type?: any,
    near_sea?: any,
    is_property_titled?: boolean,
    is_deeded?: boolean,
    is_corner?: boolean,
    informations?: any,
    delivery_forecast?: any,
    incorporation?: any,
    lifetime?: any,
    situation_id?: string,
    has_furniture?: boolean,
    agent_id?: string | null,
    solar_position_id?: string | null,
    condo_position?: any,
    type_id?: string,
    is_condo?: boolean,
    isFinishing?: boolean
  }
) => {
  return await axios.patch(
    `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/initial-informations`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

const getInitialInformation = async (token: string, id: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/initial-informations/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getCharacteristics = async (token: string, id: string) => {
  return await axios.get(`https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/characteristics/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


//type_id vem da requisição anterior
const getAllCharacteristicsByType = async (token: string, type_id: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/properties/characteristics?sort=by_title&order_col=title&order_rule=asc&filter%5Btype_id%5D=${type_id}`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const patchCharacteristics = async (
  token: string,
  id: string,
  data: {
    transaction?: number,
    is_draft?: boolean,
    type_id?: string,
    characteristics: Array<{
      id: string,
      quantity?: string,
      isChecked: boolean
    }>,
    is_condo?: boolean
  }
) => {
  return await axios.patch(
    `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/characteristics`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

const getCharacteristicsByTitle = async (token: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/properties/characteristics?sort=by_title`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


const getCondoCharacteristics = async (token: string, id: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/condo-characteristics/`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const patchCondoCharacteristics = async (
  token: string,
  id: string,
  data: {
    transaction: number,
    is_draft: boolean,
    condo_characteristics: Array<{
      id: string,
      isChecked: boolean
    }>,
    is_condo: boolean
  }
) => {
  return await axios.patch(
    `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/condo-characteristics/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

const getCountries = async (token: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/addresses/countries?sort=name`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getLocation = async (token: string, id: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/location`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getStates = async (token: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/addresses/states?sort=name&filter%5Bcountry_id%5D=dfb22ce9-8112-4e60-bc92-ecdba85b1ddc`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getCities = async (token: string, state_id: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/addresses/cities?sort=-updated_at&filter%5Bid%5D=${state_id}`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getNeighborhoods = async (token: string, city_id: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/addresses/neighborhoods?sort=-updated_at&filter%5Bid%5D=${city_id}`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

interface PatchLocationInformations {
  apartment_number?: { value: string };
  floor?: { value: string };
  units_per_floor?: { value: string };
  floors_number?: { value: string };
  towers_number?: { value: string };
}

interface PatchLocationType {
  id: string;
  title: string;
  order: number;
  information_fields: Array<{ name: string; title: string }>;
  rooms_fields: Array<{
    name: string;
    title: string;
    is_default: boolean;
    extra?: Array<{ name: string; title: string }>;
  }>;
  area_fields: Array<{
    name: string;
    title: string;
    measures: string[];
    is_primary: boolean;
  }>;
  slug: string;
  symbol: string;
  primary_area: string;
}

export interface PatchLocationData {
  transaction: number;
  is_draft: boolean;
  condominium_id: string;
  informations: PatchLocationInformations;
  zip_code: string;
  street_address: string;
  street_number: string;
  complement_address: string;
  maps_latitude: number | null;
  maps_longitude: number | null;
  maps_heading: number | null;
  maps_pitch: number | null;
  maps_zoom: number;
  maps_street_zoom: number | null;
  is_neighborhood_shown: boolean;
  is_street_shown: boolean;
  is_exact_map_shown: boolean;
  is_condominium_shown: boolean;
  is_floor_shown: boolean;
  is_apartment_number_shown: boolean;
  is_streetview_shown: boolean;
  is_map_shown: boolean;
  is_complement_shown: boolean;
  is_street_number_shown: boolean;
  is_streetview_active: boolean;
  zone_id: string | null;
  type: PatchLocationType;
  country_id: string;
  state_id: string;
  city_id: string;
  neighborhood_id: string;
  is_shared_address: boolean;
  locate_map: boolean;
}

const patchLocation = async (
  token: string,
  id: string,
  data: PatchLocationData
) => {
  return await axios.patch(
    `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/location`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getEstablishments = async (token: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/establishments?sort=by_title&order_col=title&order_rule=asc`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getEstablishmentsById = async (token: string, id: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/establishments/`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

type Establishment = {
  id: string;
  isChecked: boolean;
};

type PatchEstablishmentsData = {
  transaction: number;
  is_draft: boolean;
  establishments: Establishment[];
};

const patchEstablishments = async (
  token: string,
  id: string,
  data: PatchEstablishmentsData
) => {
  return await axios.patch(
    `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/establishments/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getDescription = async (token: string, id: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/description/`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

type Portal = {
  id: string;
  file_url: string;
  max: number;
};

type PatchDescriptionData = {
  transaction: number;
  is_draft: boolean;
  title: string;
  description: string;
  condo_description: string | null;
  portals: Portal[];
};

const patchDescription = async (
  token: string,
  id: string,
  data: PatchDescriptionData
) => {
  return await axios.patch(
    `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/description/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getComplementies = async (token: string, id: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/complementies/`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

type PatchComplementiesData = {
  transaction: number;
  is_draft: boolean;
  video: string | null;
  tour_360: string | null;
};

const patchComplementies = async (
  token: string,
  id: string,
  data: PatchComplementiesData
) => {
  return await axios.patch(
    `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/complementies/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getCadastralSituation = async (token: string, id: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/properties/cadastral-situations?sort=-updated_at`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getPrivate = async (token: string, id: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/private/`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

type PatchPrivateData = {
  transaction: number;
  is_draft: boolean;
  is_commission_combined: boolean;
  negotiation_note: string;
  matriculation: string;
  itr: string;
  occupation_note: string;
  private_note: string;
  furniture_note: string;
  has_owner_authorization: boolean;
  has_sale_card: boolean;
  is_exclusive: boolean;
  exclusive_until: string;
  is_keys_ready: boolean;
  keys_location: string;
  type_id: string;
  cadastral_situations: {
    id: string;
    isChecked: boolean;
  }[];
};

const patchPrivate = async (token: string, id: string, data: PatchPrivateData) => {
  return await axios.patch(
    `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/private/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getImagesArea = async (token: string, id: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/images-area/`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const getImages = async (token: string, id: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/images?sort=&filter%5Bgallery%5D=1`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// image
// name
// order
// gallery
const uploadImage = async (token: string, id: string, data: FormData) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/images`;
  return await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }).then(async (response) => {
    await axios.post(`https://api.gerenciarimoveis-cf.com.br/api/properties/${id}/images/audits`);
  }).catch(error => {
    console.error(error);
    throw error;
  });
}


const getPublish = async (token: string, id: string) => {
  const url = `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/publish/`;
  return await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

interface PatchPublishData {
  transaction: number;
  is_draft: boolean;
  is_published: boolean;
  is_featured: boolean;
  featured_lists_id: string[];
  is_network_published: boolean;
  portal_real_estate_options: Record<string, any>;
  real_estate_with_guru_portal: boolean;
  site_link: string;
  email: string | null;
  should_send_owner_report: boolean | null;
  is_should_send_owner_report: boolean;
  custom_url: string | null;
  meta_description: string | null;
  next_review_at: string | null;
  stripe_text: string;
  stripe_background: string;
  without_default_stage_id: boolean;
  default_stage_id: string | null;
  ddi: number;
  phone: string;
  email_message: string;
  email_subject: string;
  meta_title: string;
  send_to_owner: boolean;
  with_review: boolean;
}

const patchPublish = async (
  token: string,
  id: string,
  data: PatchPublishData
) => {
  return await axios.patch(
    `https://api.gerenciarimoveis-cf.com.br/api/properties/partial/${id}/publish/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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
  getImoveis,
  getImovelDetails,
  getUniqueImovel,
  getImovelByReference,
  getPropertiesTypes,
  getFinancialIndexes,
  getFinancial,
  patchFinancial,
  getCharacteristics,
  getAllCharacteristicsByType,
  patchCharacteristics,
  getCharacteristicsByTitle,
  getCondoCharacteristics,
  patchCondoCharacteristics,
  getCountries,
  getLocation,
  getStates,
  getCities,
  getNeighborhoods,
  patchLocation,
  getEstablishments,
  getEstablishmentsById,
  patchEstablishments,
  getDescription,
  patchDescription,
  getComplementies,
  patchComplementies,
  getCadastralSituation,
  getPrivate,
  patchPrivate,
  getImagesArea,
  getImages,
  uploadImage,
  getPublish,
  patchPublish,
  patchInitialInformation,
  getTypes,
  getSituations,
  criarImovelPartialOne,
  getRooms,
  patchImovelRooms,
  getAreas,
  patchImovelAreas,
  getPeople,
  getUsers,
  getInitialInformation,
};
  