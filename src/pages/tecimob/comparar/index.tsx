import React, { useEffect, useState } from 'react';
import { Table, Modal, message, notification, Select } from 'antd';
import { tecimobService } from '@/services/tecimob.service';
import { propertiesService } from '@/services/linux-properties.service';
import { tecimobPropertiesService } from '@/services/tecimob-properties.service';
import { parse } from 'cookie';
import Cookies from 'js-cookie';


function Comparar({ token }: { token: string }) {
  const [imoveis, setImoveis] = useState([]);
  const [imoveisLinux, setImoveisLinux] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);
  const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [messageLogin, setMessageLogin] = useState('');

  const [openModalSync, setOpenModalSync] = useState(false)

  const [actions, setActions] = useState<any>(null);


  const handleLogin = async (e: any) => {
    e.preventDefault();
    await tecimobService.login(email, password)
            .then((res) => {

                if(res.data.data.message === "Usuário não encontrado."){
                    setMessageLogin("Usuário não encontrado");
                } else if (res.data.data.message === "Senha inválida.") {
                    setMessageLogin("Senha inválida");
                } else if (res.data.data.access_token){
                    Cookies.set("token.tecimob", res.data.data.access_token);
                    setModalLogin(false);
                    window.location.reload();
                }
            })
  }

  const fetchImoveis = async () => {
    setLoading(true);
    try {
      const response = await tecimobPropertiesService.getAll(
        1,
        10000,
        "",
        "",
        ""
      );

      const response2 = await tecimobService.getImoveis(token);

      console.log('response2', response2);

      const formattedData = response?.data?.properties?.map((property: any) => ({
          ...property,
          reference: property.reference,
          status: property.status,
          calculated_price: typeof property.calculated_price === 'string' 
          ? property.calculated_price
              .replace('R$', '')
              .replace(/\./g, '')
              .replace(',00', '')
              .trim()
          : property.calculated_price,
          site_link: property.site_link.split('?user_id=')[0],
          address_formatted: property.address_formatted,
          type: property.type.title,
          subtype: property.subtype.title,
          state: property.address_formatted.split('/')[1],
          // Corrigido para pegar a cidade corretamente mesmo se houver hífens no nome
          city: property.address_formatted.split('/')[0].includes('-')
            ? property.address_formatted.split('/')[0].split('-').slice(1).join('-').trim()
            : property.address_formatted.split('/')[0].trim(),
          district: property.address_formatted.split('/')[0].split('-')[0],
          street: property.street,
          street_number: property.number,
        }));
      setImoveis(formattedData);  
    } catch (error: any) {
      message.error(`Erro ao buscar imóveis Tecimob: ${error?.response?.data?.status === 401 ? 'Token inválido' : 'Erro ao buscar imóveis'}`);
      if (error?.response?.data?.status === 401) {
        setModalLogin(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImoveis();
  }, []);

  const fetchImoveisLinux = async () => {
    setLoading(true);
    try {
      const references = imoveis.map((imovel: any) => imovel.reference);
      const response = await propertiesService.getInLinuxReference(references);

      const formattedData = response?.data?.properties?.map((property: any) => ({
        reference: property.reference,
        status: property.status,
        calculated_price: property.sale_price === "" ? (property.rental_price === "" ? null : property.rental_price) : property.sale_price,
        ...property
      }));
      
      setImoveisLinux(formattedData);
    } catch (error) {
      message.error('Erro ao buscar imóveis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imoveis.length > 0) {
      fetchImoveisLinux();
    }
  }, [imoveis]);

  const imoveisEmComum = imoveis
    .filter((imovel: any) => imoveisLinux.some((imoveilinux: any) => imoveilinux.reference === imovel.reference))
    .map((imovel: any) => {
      const imoveiLinux: any = imoveisLinux.find((il: any) => il.reference === imovel.reference);
      return {
        ...imovel,
        status_linux: imoveiLinux?.status,
        calculated_price_linux: imoveiLinux?.calculated_price
      };
    });


  // Mapeamento de campos equivalentes entre as bases
  const fieldMapping = {
    'Quartos': {
      linux: 'bedrooms',
      tecimob: 'rooms.bedroom.value'
    },
    'Suites': {
      linux: 'suites',
      tecimob: 'rooms.suite.value'
    },
    'Banheiros': {
      linux: 'bathrooms',
      tecimob: 'rooms.bathroom.value'
    },
    'Garagens': {
      linux: 'garages',
      tecimob: 'rooms.garage.value'
    },
    // Campos básicos
    'Referência': {
      linux: 'reference',
      tecimob: 'reference'
    },
    'Status': {
      linux: 'status',
      tecimob: 'status'
    },
    'Transação': {
      linux: 'transaction',
      tecimob: 'transaction',
      transform: (value: any) => {
        if (typeof value === 'number') {
          return value === 1 ? 'Venda' : 'Aluguel';
        }
        return value;
      }
    },

    // Tipo e subtipo
    'Tipo de Imóvel': {
      linux: 'type',
      tecimob: 'type'
    },
    'Subtipo de Imóvel': {
      linux: 'subtype',
      tecimob: 'subtype',
    },
    // Localização
    'Estado': {
      linux: 'state',
      tecimob: 'state',
      transform: (value: any) => {
        if (typeof value === 'string' && value.includes('/')) {
          const parts = value.split('/');
          return parts.length > 1 ? parts[1].trim() : '';
        }
        return value;
      }
    },
    'Cidade': {
      linux: 'city',
      tecimob: 'address_formatted',
      transform: (value: any) => {
        // Exemplo: "Maurício de Nassau - Caruaru/PE" -> "Caruaru"
        if (typeof value === 'string' && value.includes('/')) {
          // Pega a parte antes do '/' (ex: "Maurício de Nassau - Caruaru")
          const beforeSlash = value.split('/')[0];
          // Pega a parte depois do '-' (ex: " Caruaru")
          if (beforeSlash.includes('-')) {
            return beforeSlash.split('-')[1].trim();
          }
        }
        return value;
      }
    },
    'Bairro': {
      linux: 'district',
      tecimob: 'district',
      transform: (value: any) => {
        // Se vier "Maurício de Nassau - Caruaru/PE" tem que transformar em "Maurício de Nassau"
        if (typeof value === 'string' && value.includes('/')) {
          // Pega a parte antes do '/'
          const beforeSlash = value.split('/')[0];
          // Se tiver '-', pega a parte antes do '-'
          let bairro = beforeSlash.includes('-')
            ? beforeSlash.split('-')[0].trim()
            : beforeSlash.trim();

          // Normaliza o case: primeira letra de cada palavra maiúscula, exceto preposições comuns
          bairro = bairro
            .toLowerCase()
            .split(' ')
            .map((word, idx) => {
              // Lista de preposições que normalmente ficam minúsculas exceto se for a primeira palavra
              const preposicoes = ['do', 'da', 'dos', 'das', 'de'];
              if (preposicoes.includes(word) && idx !== 0) {
                return word;
              }
              return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');

          return bairro;
        }
        if (typeof value === 'string') {
          // Normaliza o case mesmo se não houver '/'
          let bairro = value.trim();
          bairro = bairro
            .toLowerCase()
            .split(' ')
            .map((word, idx) => {
              const preposicoes = ['do', 'da', 'dos', 'das', 'de'];
              if (preposicoes.includes(word) && idx !== 0) {
                return word;
              }
              return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');
          return bairro;
        }
        return value;
      }
    },
    'Rua': {
      linux: 'street_address',
      tecimob: 'street'
    },
    'Número': {
      linux: 'street_number',
      tecimob: 'number'
    },
    'Complemento': {
      linux: 'complement_address',
      tecimob: 'complement'
    },

    // Preços
    'Valor da Venda': {
      linux: 'sale_price',
      tecimob: 'calculated_price',
      transform: (value: any, obj: any) => {
        // Only transform if it's a sale transaction
        if (obj?.transaction !== 1) return null;
        
        if (typeof value === 'string' && value.includes('R$')) {
          let numeric = value
            .replace('R$', '')
            .replace(/\./g, '')
            .trim();
          // Remove ',00' at the end if present
          numeric = numeric.replace(/,00$/, '');
          return numeric;
        }
        return value;
      }
    },
    'Valor do Aluguel': {
      linux: 'rental_price',
      tecimob: 'calculated_price',
      transform: (value: any, obj: any) => {
        // Only transform if it's a rental transaction
        if (obj?.transaction !== 2) return null;

        if (typeof value === 'string') {
          let numeric = value
            .replace('R$', '')
            .replace(/\./g, '')
            .replace(',00', '')
            .trim();

          return numeric;

        }
        return value;
      }
    },
    // condominium_fee: {
    //   linux: 'condominium_price',
    //   tecimob: 'condominium_fee'
    // },

    // Características do imóvel
    'Área': {
      linux: 'area',
      tecimob: 'areas.primary_area.value',
      transform: (value: any, obj: any) => {
        if (value === null || value === undefined) {
          // Se built_area.value for null, pegar de ground_total_area.value
          const groundTotalValue = getNestedValue(obj, 'areas.ground_total_area.value');
          if (groundTotalValue !== null && groundTotalValue !== undefined) {
            let normalizedValue = String(groundTotalValue);
            // For area values, convert decimal comma to dot and remove thousands separators
            if (normalizedValue.includes(',') && normalizedValue.includes('.')) {
              // Format like 3.321,86 -> 3321.86
              normalizedValue = normalizedValue.replace(/\./g, '').replace(',', '.');
            } else if (normalizedValue.includes(',')) {
              // Format like 3321,86 -> 3321.86
              normalizedValue = normalizedValue.replace(',', '.');
            }
            // Normalize decimal format: remove trailing zeros and ensure consistent format
            const num = parseFloat(normalizedValue);
            return isNaN(num) ? normalizedValue : num.toString();
          }
          return null;
        }
        let normalizedValue = String(value);
        // For area values, convert decimal comma to dot and remove thousands separators
        if (normalizedValue.includes(',') && normalizedValue.includes('.')) {
          // Format like 3.321,86 -> 3321.86
          normalizedValue = normalizedValue.replace(/\./g, '').replace(',', '.');
        } else if (normalizedValue.includes(',')) {
          // Format like 3321,86 -> 3321.86
          normalizedValue = normalizedValue.replace(',', '.');
        }
        // Normalize decimal format: remove trailing zeros and ensure consistent format
        const num = parseFloat(normalizedValue);
        return isNaN(num) ? normalizedValue : num.toString();
      }
    },
    'Unidade de Medida': {
      linux: 'areas.primary_area.measure',
      tecimob: 'measurement_unit'
    },

    // Informações adicionais
    'Previsão de Entrega': {
      linux: 'delivery_forecast',
      tecimob: 'delivery_forecast',
      transform: (value: any) => {
        if (typeof value === 'string' && value === "") {
          return null;
        }
        return value;
      }
    },
    // 'Link do Site': {
    //   linux: 'site_link',
    //   tecimob: 'site_link',
    //   transform: (value: any) => {
    //     if (typeof value === 'string' && value.includes('?user_id=')) {
    //       return value.split('?user_id=')[0];
    //     }
    //     return value;
    //   }
    // },
  };

  // Função para obter valor de um objeto usando path string (ex: "data.type")
  const getNestedValue = (obj: any, path: string) => {
    if (!obj) return null;
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : null, obj);
  };

  // Função para comparar valores considerando as transformações necessárias
  const compareValues = (tecimobValue: any, linuxValue: any, fieldConfig: any, fullTecimobObj: any, fieldName?: string) => {
    // Lógica especial para Subtipo de Imóvel: se o valor do Linux for "Padrão", considera como igual
    if (fieldName === 'Subtipo de Imóvel' && linuxValue === 'Padrão') {
      return true;
    }

    if (typeof fieldConfig === 'string') {
      return tecimobValue === linuxValue;
    }

    const transformFn = fieldConfig.transform || ((v: any) => v);
    const tecimobTransformed = transformFn(tecimobValue, fullTecimobObj);
    const linuxTransformed = transformFn(linuxValue, fullTecimobObj);

    // Normaliza os valores antes de comparar
    const normalizeValue = (value: any) => {
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') {
        return value
          .replace('R$', '')
          .replace(/\./g, '')
          .replace(',00', '')
          .trim();
      }
      return String(value);
    };

    return normalizeValue(tecimobTransformed) === normalizeValue(linuxTransformed);
  };


  // Nova variável com todas as diferenças detalhadas
  const todasDiferencas = {
    // Imóveis que existem no Tecimob mas não no Linux
    imoveisApenasNoTecimob: imoveis.filter((imovel: any) => 
      !imoveisLinux.some((imoveilinux: any) => imoveilinux.reference === imovel.reference)
    ),
    
    // Imóveis que existem no Linux mas não no Tecimob
    imoveisApenasNoLinux: imoveisLinux.filter((imovel: any) => 
      !imoveis.some((imoveitecimob: any) => imoveitecimob.reference === imovel.reference)
    ),
    
    // Imóveis com diferenças em campos equivalentes
    imoveisComDiferencas: imoveisEmComum
      .map((imovelTecimob: any) => {
        const imovelLinux = imoveisLinux.find((il: any) => il.reference === imovelTecimob.reference);
        
        const diferencas: any = {
          referencia: imovelTecimob.reference,
          campos: {}
        };

        // Comparar todos os campos mapeados
        Object.entries(fieldMapping).forEach(([campo, config]) => {
          // Skip if field is not selected and there are selected fields
          if (selectedFields.length > 0 && !selectedFields.includes(campo)) {
            return;
          }

          const tecimobValue = typeof config === 'string' 
            ? imovelTecimob[config]
            : getNestedValue(imovelTecimob, config.tecimob);

          const linuxValue = typeof config === 'string'
            ? imovelLinux?.[config]
            : getNestedValue(imovelLinux, config.linux);

          if (!compareValues(tecimobValue, linuxValue, config, imovelTecimob, campo)) {
            diferencas.campos[campo] = {
              tecimob: tecimobValue,
              linux: linuxValue,
              temDiferenca: true
            };
          }
        });

        return diferencas;
      })
      .filter((diff: any) => Object.keys(diff.campos).length > 0)
  };


  const handleSincronizar = (record: any) => {
    setOpenModalSync(true);
    setActions(record);

  }

  // Colunas para a tabela de diferenças
  const columnsDetalhados = [
    {
      title: 'Referência',
      dataIndex: 'referencia',
      key: 'referencia',
    },
    {
      title: 'Quantidade de Diferenças',
      dataIndex: 'campos',
      key: 'campos',
      render: (campos: any) => Object.keys(campos ?? {}).length
    },
    {
      title: 'Ações',
      dataIndex: 'actions',
      key: 'actions',
      render: (actions: any, record: any) => (
        <div className="flex items-center gap-2">
          <button className="text-blue-500" onClick={() => {
            handleSincronizar(record);
          }}>Sincronizar</button>
        </div>
      )
    }
  ];

  const expandedRowRender = (record: any) => {
    const diffColumns = [
      {
        title: 'Campo',
        dataIndex: 'campo',
        key: 'campo',
        width: '20%'
      },
      {
        title: 'Tecimob',
        dataIndex: 'tecimob',
        key: 'tecimob',
        render: (text: any) => (
          <div className="text-red-600">{String(text ?? 'Não informado')}</div>
        )
      },
      {
        title: 'Sistema',
        dataIndex: 'linux',
        key: 'linux',
        render: (text: any) => (
          <div className="text-green-600">{String(text ?? 'Não informado')}</div>
        )
      }
    ];

    const data = Object.entries(record.campos ?? {}).map(([campo, valores]: [string, any], index) => ({
      key: index,
      campo: campo,
      tecimob: valores.tecimob,
      linux: valores.linux
    }));

    return (
      <Table
        columns={diffColumns}
        dataSource={data}
        pagination={false}
      />
    );
  };

  // Get available fields for the select component
  const availableFields = Object.keys(fieldMapping);

  const handleUpdateBaseTecimob = async () => {
    setLoading(true);
    try {
      const response = await tecimobService.getImoveis(token);
      const properties = response?.data?.data || [];
      // Processa em lotes para evitar sobrecarga e problemas de concorrência
      const batchSize = 10;
      for (let i = 0; i < properties.length; i += batchSize) {
        const batch = properties.slice(i, i + batchSize);
        await Promise.all(
          batch.map((property: any) => tecimobPropertiesService.create(property))
        );
      }

      message.success('Base atualizada com sucesso');
    } catch (error: any) {
      message.error(`Erro ao buscar imóveis Tecimob: ${error?.response?.data?.status === 401 ? 'Token inválido' : 'Erro ao buscar imóveis'}`);
      if (error?.response?.data?.status === 401) {
        setModalLogin(true);
      }
    } finally {
      setLoading(false);
    }
  }

  
  const handleSincronizarBase = async () => {
    setLoading(true);
    try {
      const response = await tecimobService.getImovelByReference(token, actions?.referencia);
      const property = response?.data?.data || [];

      // const typesResponse = await tecimobService.getTypes(token);

      // const types = typesResponse?.data?.data || [];

      // const type = types.find((type: any) => type.id === property.type_id);

      const data = {
        ...property,
        ...actions?.campos
      }

      // Processa em lotes para evitar sobrecarga e problemas de concorrência
      // const batchSize = 10;
      // for (let i = 0; i < properties.length; i += batchSize) {
      //   const batch = properties.slice(i, i + batchSize);
      //   await Promise.all(
      //     batch.map((property: any) => tecimobPropertiesService.create(property))
      //   );
      // }

      message.success('Base atualizada com sucesso');
    } catch (error: any) {
      message.error(`Erro ao buscar imóveis Tecimob: ${error?.response?.data?.status === 401 ? 'Token inválido' : 'Erro ao buscar imóveis'}`);
      if (error?.response?.data?.status === 401) {
        setModalLogin(true);
      }
    } finally {
      setLoading(false);
    }
  }

  console.log('actions*****', actions);
  return (
    <div>
        <Modal
            open={modalLogin}
            onCancel={() => setModalLogin(false)}
            footer={null}
            title="O seu token está expirado, por favor, entre com o seu email e senha"
        >
            <div className="p-6 space-y-4 md:space-y-6">
                {messageLogin && <p className="text-red-500">{messageLogin}</p>}
                <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="name@company.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                            Senha
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </Modal>

        <div className="space-y-4">
            <button 
            className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={() => {
              handleUpdateBaseTecimob();
            }}>
                Atualizar Base Tecimob
            </button>
            <div className="flex items-center gap-2 mb-4">
                <h1 className='text-2xl font-bold text-orange-500'>Imóveis com inconsistências</h1>
                <span className="px-3 py-1 text-sm font-semibold bg-orange-100 text-orange-700 rounded-full">
                    {todasDiferencas.imoveisComDiferencas.length}
                </span>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione os campos para comparação
                </label>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Selecione os campos para comparar"
                    value={selectedFields}
                    onChange={setSelectedFields}
                    options={availableFields.map(field => ({
                        label: field,
                        value: field
                    }))}
                    allowClear
                />
            </div>
            <Modal
                open={openModalSync}
                onCancel={() => setOpenModalSync(false)}
                footer={null}
                title="Sincronizar Base Tecimob"
            >
                <div>
                    <p className="text-lg font-semibold mb-4">
                        Referência: {actions?.referencia}
                    </p>
                    <div className="mb-4">
                        <h3 className="text-md font-medium mb-2">Campos que serão alterados:</h3>
                        {actions?.campos && Object.entries(actions.campos).map(([campo, dados]: [string, any]) => (
                            <div key={campo} className="mb-3 p-3 border rounded-lg bg-gray-50">
                                <p className="font-medium text-gray-800">{campo}</p>
                                <div className="mt-2 space-y-1">
                                    <p className="text-sm">
                                        <span className="text-red-600 font-medium">Tecimob:</span> {String(dados.tecimob ?? 'Não informado')}
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-green-600 font-medium">→ Será alterado para:</span> {String(dados.linux ?? 'Não informado')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 mb-2">
                        Tem certeza que deseja sincronizar a base Tecimob? Esta ação irá atualizar os dados dos imóveis.
                    </p>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg text-sm px-4 py-2"
                        onClick={() => setOpenModalSync(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm px-4 py-2"
                        onClick={() => {
                            handleSincronizarBase();
                            // setOpenModalSync(false);
                        }}
                    >
                        Sincronizar
                    </button>
                </div>
            </Modal>


            <Table 
                dataSource={todasDiferencas.imoveisComDiferencas} 
                loading={loading} 
                columns={columnsDetalhados}
                rowKey="referencia"
                expandable={{
                    expandedRowRender,
                    expandRowByClick: true,
                    expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
                    onExpand: (expanded, record) => {
                        setExpandedRowKey(expanded ? record.referencia : null);
                    }
                }}
            />
        </div>
    </div>
  );
}

export default Comparar;

export const getServerSideProps = async (ctx: any) => {
  const cookies = parse(ctx.req.headers.cookie || '');
  const token = cookies['token.tecimob'];

  if (!token) {
    return { props: {} };
  }

  return {
    props: { token },
  };
};
