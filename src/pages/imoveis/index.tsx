import React, { useCallback, useEffect, useState } from "react";
import { propertiesService } from "@/services/properties.service";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import PropertyCard from "@/components/PropertyCard";

export default function Imoveis() {
  const [properties, setProperties] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [visible, setVisible] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [tipoImovel, setTipoImovel] = useState("");
  const [referencia, setReferencia] = useState("");
  const [titulo, setTitulo] = useState("");
  const [valorMin, setValorMin] = useState<string | null>(null);
  const [valorMax, setValorMax] = useState<string | null>(null);

  const [cities, setCities] = useState<Record<string, string[]>>({});
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [condominiums, setCondominiums] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [cidade, setCidade] = useState<string>("");
  const [bairro, setBairro] = useState<string>("");
  const [negocio, setNegocio] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [condominios, setCondominios] = useState<string>("");
  const [origem, setOrigem] = useState<string>("");

  const router = useRouter();

  const fetchData = useCallback(async () => {
    let filterBy = "";
    let filterValue = "";
    let filterType = "";

    if (valorMax !== null || valorMin !== null) {
      let valorMinFormatado = valorMin
        ?.replace(/[^\d]/g, "")
        .replace(/0{2}$/, "");
      let valorMaxFormatado = valorMax
        ?.replace(/[^\d]/g, "")
        .replace(/0{2}$/, "");

      if (valorMaxFormatado === "0" || valorMaxFormatado === null) {
        valorMaxFormatado = "999999999";
      }

      if (valorMinFormatado === "0" && valorMaxFormatado === "0") {
        filterBy = ""; // Remover o filtro por completo
        filterValue = "";
        filterType = "";
      } else {
        filterBy += filterBy === "" ? "price" : ",price";
        filterValue +=
          filterValue === ""
            ? `${valorMinFormatado}|${valorMaxFormatado}`
            : `,${valorMinFormatado}|${valorMaxFormatado}`;
        filterType += filterType === "" ? "btw_price" : ",btw_price";
      }
    }

    if (!!tipoImovel) {
      filterBy += filterBy === "" ? "subtype" : ",subtype";
      filterValue += filterValue === "" ? `${tipoImovel}` : `,${tipoImovel}`;
      filterType += filterType === "" ? "ilike" : ",ilike";
    }

    if (!!referencia) {
      filterBy += filterBy === "" ? "reference" : ",reference";
      filterValue += filterValue === "" ? `${referencia}` : `,${referencia}`;
      filterType += filterType === "" ? "ilike" : ",ilike";
    }

    if (!!titulo) {
      filterBy += filterBy === "" ? "meta_title" : ",meta_title";
      filterValue += filterValue === "" ? `${titulo}` : `,${titulo}`;
      filterType += filterType === "" ? "ilike" : ",ilike";
    }

    if (!!cidade) {
      filterBy += filterBy === "" ? "city" : ",city";
      filterValue += filterValue === "" ? `${cidade}` : `,${cidade}`;
      filterType += filterType === "" ? "ilike" : ",ilike";
    }

    if (!!bairro) {
      filterBy += filterBy === "" ? "neighborhood" : ",neighborhood";
      filterValue += filterValue === "" ? `${bairro}` : `,${bairro}`;
      filterType += filterType === "" ? "ilike" : ",ilike";
    }

    if (!!negocio) {
      filterBy += filterBy === "" ? "transaction" : ",transaction";
      filterValue += filterValue === "" ? `${negocio}` : `,${negocio}`;
      filterType += filterType === "" ? "ilike" : ",ilike";
    }

    if (!!tipo) {
      filterBy += filterBy === "" ? "type" : ",type";
      filterValue += filterValue === "" ? `${tipo}` : `,${tipo}`;
      filterType += filterType === "" ? "ilike" : ",ilike";
    }

    if (!!condominios) {
      filterBy += filterBy === "" ? "condominium_name" : ",condominium_name";
      filterValue += filterValue === "" ? `${condominios}` : `,${condominios}`;
      filterType += filterType === "" ? "ilike" : ",ilike";
    }

    if (!!status) {
      filterBy += filterBy === "" ? "status" : ",status";
      filterValue += filterValue === "" ? `${status}` : `,${status}`;
      filterType += filterType === "" ? "ilike" : ",ilike";
    }

    if (!!origem) {
      filterBy += filterBy === "" ? "url" : ",url";
      filterValue += filterValue === "" ? `${origem}` : `,${origem}`;
      filterType += filterType === "" ? "ilike" : ",ilike";
    }
    
    //adicionar filtro para buscar só oq tiver images

    




    try {
      const res = await propertiesService.getAll(
        page,
        limit,
        filterBy,
        filterValue,
        filterType
      );

      //remover properties sem imagens

      const data = res.data.properties.result.filter(
        (property: any) => property.images.length > 0
      );

      setProperties(data);
      setTotal(res.data.properties.total);
    } catch (error: any) {
      console.log("error", error);
    }
  }, [
    page,
    limit,
    valorMax,
    valorMin,
    tipoImovel,
    referencia,
    titulo,
    cidade,
    bairro,
    negocio,
    status,
    tipo,
    condominios,
    origem,
  ]);

  useEffect(() => {
    fetchData();
  }, [
    page,
    limit,
    valorMax,
    valorMin,
    tipoImovel,
    referencia,
    titulo,
    cidade,
    bairro,
    negocio,
    status,
    tipo,
    condominios,
    origem,
    fetchData,
  ]);

  const getNeighborhoods = useCallback(async () => {
    await propertiesService
      .getNeighborhoodsByCity(cidade)
      .then((response: any) => {
        // const data = response.data.neighborhoods.filter((neighborhood: string) =>  neighborhood !== "Não Informado")
        setNeighborhoods(response.data.neighborhoods.neighborhoods);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [cidade]);

  useEffect(() => {
    getNeighborhoods();
  }, [getNeighborhoods, cidade]);

  const getCities = useCallback(async () => {
    await propertiesService
      .getCities()
      .then((response: any) => {
        setCities(response.data.cities_states.result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getCities();
  }, [getCities]);

  const getCondominiums = useCallback(async () => {
    await propertiesService
      .getCondominiums()
      .then((response: any) => {
        const data = response.data.condominiums.filter(
          (condominium: string) => condominium !== "Não Informado"
        );
        setCondominiums(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getCondominiums();
  }, [getCondominiums]);

  const getTypes = useCallback(async () => {
    await propertiesService
      .getTypes()
      .then((response: any) => {
        console.log(response.data.types);
        const data = response.data.types.map((type: string) => {
          if (type?.includes("Pavilhão/Galpão")) {
            return type?.replace("Pavilhão/Galpão", "Galpão");
          }
          return type;
        });

        const removeNull = data.filter((type: string) => type !== null);
        setTypes(removeNull);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getTypes();
  }, [getTypes]);

  const [filters, setFilters] = useState([{ field: "", value: "" }]);

  const handleAddFilter = () => {
    setFilters([...filters, { field: "", value: "" }]);
  };

  const handleRemoveFilter = (index: number) => {
    const updatedFilters = filters.filter((_, i) => i !== index);
    setFilters(updatedFilters);
  };

  const handleFieldChange = (index: number, field: string) => {
    const updatedFilters = filters.map((filter, i) =>
      i === index ? { ...filter, field } : filter
    );
    setFilters(updatedFilters);
  };

  const handleValueChange = (index: number, value: string) => {
    const updatedFilters = filters.map((filter, i) =>
      i === index ? { ...filter, value } : filter
    );
    setFilters(updatedFilters);
  };

  const handleSubmit = () => {
    // Lógica para submissão do formulário com os filtros
    console.log(filters);
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-center text-orange-400 mb-4">
          Listagem de Imóveis
        </h1>
        {/*criar uma barra de pesquisa*/}
        <div className="flex justify-between">
          <div className="absolute top-4">
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                router.push("/imoveis/cadastro");
              }}
            >
              Cadastrar
            </button>
          </div>
          <div className="mb-4 w-full">
            <Form
              layout="vertical"
              fields={[
                {
                  name: ["tipoImovel"],
                  value: tipoImovel,
                },
                {
                  name: ["referencia"],
                  value: referencia,
                },
                {
                  name: ["titulo"],
                  value: titulo,
                },
                {
                  name: ["valor_min"],
                  value: valorMin,
                },
                {
                  name: ["valor_max"],
                  value: valorMax,
                },
                {
                  name: ["negocio"],
                  value: negocio,
                },
                {
                  name: ["tipo_imovel"],
                  value: tipo,
                },
                {
                  name: ["cidade"],
                  value: cidade,
                },
                {
                  name: ["bairro"],
                  value: bairro,
                },
                {
                  name: ["condominios"],
                  value: condominios,
                },
                {
                  name: ["status"],
                  value: status,
                },
                {
                  name: ["origem"],
                  value: origem,
                },
              ]}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Referência</span>}
                    name="referencia"
                  >
                    <Input
                      placeholder="AP0001"
                      onChange={(e) => setReferencia(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Título</span>}
                    name="titulo"
                  >
                    <Input
                      placeholder="Ex: Apartamento em Copacabana..."
                      onChange={(e) => setTitulo(e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Valor Mínimo</span>}
                    name="valor_min"
                  >
                    <Input
                      placeholder="Digite o valor mínimo"
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(/\D/g, "");
                        const formatted = new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                        }).format(Number(inputValue) / 100);
                        setValorMin(formatted);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Valor Máximo</span>}
                    name="valor_max"
                  >
                    <Input
                      placeholder="Digite o valor máximo"
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(/\D/g, "");
                        const formatted = new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                        }).format(Number(inputValue) / 100);
                        setValorMax(formatted);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Negócio</span>}
                    name="negocio"
                  >
                    <Select
                      placeholder="Selecione"
                      allowClear
                      onChange={(value) => {
                        setNegocio(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Select.Option value="Venda">Comprar</Select.Option>
                      <Select.Option value="Aluguel">Alugar</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Status</span>}
                    name="status"
                  >
                    <Select
                      placeholder="Selecione"
                      allowClear
                      onChange={(value) => {
                        setStatus(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Select.Option value="Disponível">
                        Disponível
                      </Select.Option>
                      <Select.Option value="Excluído">Excluído</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Tipo de Imóvel</span>}
                    name="tipo_imovel"
                  >
                    <Select
                      placeholder="Selecione"
                      allowClear
                      onChange={(value) => {
                        setTipo(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {types.map((type) => (
                        <Select.Option key={type} value={type}>
                          {type}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Cidade</span>}
                    name="cidade"
                  >
                    {cities.PE && (
                      <Select
                        placeholder="Selecione"
                        allowClear
                        onChange={(value) => {
                          setCidade(value);
                        }}
                        options={[
                          {
                            label: (
                              <span className="font-bold text-sm text-black">
                                Pernambuco
                              </span>
                            ),
                            options: cities.PE.map((city) => ({
                              label: city,
                              value: city,
                            })),
                          },
                          {
                            label: (
                              <span className="font-bold text-sm text-black">
                                Paraíba
                              </span>
                            ),
                            options: cities.PB.map((city) => ({
                              label: city,
                              value: city,
                            })),
                          },
                          {
                            label: (
                              <span className="font-bold text-sm text-black">
                                Alagoas
                              </span>
                            ),
                            options: cities.AL.map((city) => ({
                              label: city,
                              value: city,
                            })),
                          },
                        ]}
                        showSearch
                        filterOption={(input, option: any) =>
                          option?.value
                            ?.toLowerCase()
                            ?.indexOf(input?.toLowerCase()) >= 0
                        }
                      >
                        {/* {cities.PE.map((city) => (
                              <Select.Option key={city} value={city}>{city}</Select.Option>
                            ))} */}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Bairro</span>}
                    name="bairro"
                  >
                    <Select
                      placeholder="Selecione"
                      allowClear
                      onChange={(value) => {
                        setBairro(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {neighborhoods.map((neighborhood) => (
                        <Select.Option key={neighborhood} value={neighborhood}>
                          {neighborhood}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Condomínios</span>}
                    name="condominios"
                  >
                    <Select
                      placeholder="Selecione"
                      allowClear
                      onChange={(value) => {
                        setCondominios(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          ?.normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .toLowerCase()
                          .indexOf(
                            input
                              ?.normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "")
                              .toLowerCase()
                          ) >= 0
                      }
                    >
                      {condominiums.map((condominium) => (
                        <Select.Option key={condominium} value={condominium}>
                          {condominium}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Origem</span>}
                    name="origem"
                  >
                    <Select
                      placeholder="Selecione"
                      allowClear
                      onChange={(value) => {
                        setOrigem(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          ?.normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .toLowerCase()
                          .indexOf(
                            input
                              ?.normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "")
                              .toLowerCase()
                          ) >= 0
                      }
                    >
                      <Select.Option value="grego">Grego Imoveis</Select.Option>
                      <Select.Option value="liberato">
                        Imobiliaria Liberato
                      </Select.Option>
                      <Select.Option value="amancio">
                        Imobiliaria Amancio
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={
                      <span className="font-bold">Filtros Personalizados</span>
                    }
                    name="tipoImovel"
                  >
                    <button
                      className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => setVisible(true)}
                    >
                      Abrir Filtros
                    </button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="grid justify-items-center grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 xl:-mx-8">
          {properties.map((property) => (
            <PropertyCard
              id={property?.id}
              key={property?.id}
              meta_title={property?.meta_title}
              images={property?.images}
              price={property?.price}
              transaction={property?.transaction}
              bedroom={property?.bedroom}
              garage={property?.garage}
              suites={property?.suites}
              url={property?.url}
              reference={property?.reference}
            />
          ))}
        </div>
        <Modal
          title="Filtros Personalizados"
          visible={visible}
          width={"90%"}
          onCancel={() => setVisible(false)}
          centered
          footer={
            <Button type="primary" onClick={() => setVisible(false)}>
              Fechar
            </Button>
          }
        >
          {filters.map((filter, index) => (
            <Row gutter={16} key={index}>
              <Col xs={24} sm={8}>
                <Form.Item label={`Campo de Filtro #${index + 1}`}>
                  <Select
                    placeholder="Selecione o campo"
                    onChange={(value) => handleFieldChange(index, value)}
                    showSearch
                    allowClear
                  >
                    <Select.Option value="referencia">Referência</Select.Option>
                    <Select.Option value="titulo">Título</Select.Option>
                    <Select.Option value="valor_min">
                      Valor Mínimo
                    </Select.Option>
                    <Select.Option value="valor_max">
                      Valor Máximo
                    </Select.Option>
                    {/* Adicione outras opções de campo conforme necessário */}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Valor">
                  <Input
                    placeholder="Digite o valor"
                    value={filter.value}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <MinusCircleOutlined
                  onClick={() => handleRemoveFilter(index)}
                  className="dynamic-delete-button"
                />
              </Col>
            </Row>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={handleAddFilter}
              icon={<PlusOutlined />}
            >
              Adicionar Filtro
            </Button>
          </Form.Item>
          <div className="flex gap-4">
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Filtrar
            </button>
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setFilters([]);
                setVisible(false);
              }}
            >
              Limpar
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

{
  /* <Table
            columns={[
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                width: 100,
              },
              {
                title: "Transação",
                dataIndex: "transaction",
                key: "transaction",
                width: 100,
              },
              {
                title: "Referência",
                dataIndex: "reference",
                key: "reference",
                width: 100,
              },
              {
                title: "Titulo",
                dataIndex: "meta_title",
                key: "meta_title",
                width: 400,
              },
              {
                title: "Endereço",
                dataIndex: "city",
                key: "city",
                render: (address: any, record: any) => {       
                  return (
                    <div>
                      <p>{record?.neighborhood} - {address}</p>
                    </div>
                  );
                },
              },
              {
                title: "Preço",
                dataIndex: "price",
                key: "price",
              },
              {
                title: "Imagens",
                dataIndex: "images",
                key: "images",
                render: (images: any[], record: any) => {
                  return (
                    <button
                      className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => {
                        setVisible(true);
                        setImages(images ?? record?.images_old_links);
                      }}
                    >
                      Ver Imagens
                    </button>
                  );
                },
              },
              {
                title: "Fonte dos Dados",
                dataIndex: "url",
                key: "url",
                width: 100,
                render: (url) => {
                  console.log("url", url)
                  if(url !== null && url !== "") {
                    return (
                      <a href={url} target="_black">
                        Clique aqui
                      </a>
                    );
                  } else {
                    return (
                      <p>Não Informado</p>
                    )
                  }
                },
              },
              {
                title: "Ações",
                dataIndex: "actions",
                key: "actions",
                align: "center",
                //fixar a coluna de ações
                fixed: "right",
                width: 100,
                render: (actions: any[], record: any) => {
                  return (
                    <div className="flex justify-around">
                      <EditOutlined
                        className="text-orange-500 hover:text-orange-700 text-xl"
                        onClick={() => {
                          router.push(`/imoveis/editar/${record.id}`);
                        }}
                      />
                      <DeleteOutlined
                        className="text-orange-500 hover:text-orange-700 text-xl"
                        onClick={() => {
                          router.push(`/imoveis/excluir/${record.url}`);
                        }}
                      />
                    </div>
                  );
                },
              },
            ]}
            dataSource={properties}
            size="small"
            scroll={{ x: 1300 }}
            pagination={{
              total: total,
              pageSize: limit,
              current: page,
              onChange: (page, pageSize) => {
                setPage(page);
                setLimit(pageSize || 10);
              },
            }}
          /> */
}
{
  /* <Modal
            title="Fotos do Imovel"
            visible={visible}
            width={"80%"}
            onCancel={() => setVisible(false)}
            centered
            footer={
              <Button type="primary" onClick={() => setVisible(false)}>
                Fechar
              </Button>
            }
          >
            {!!images && images.length > 0 && (
            <Image.PreviewGroup>
              {images.map((image, index) => (
                <Image
                  key={index}
                  width={200}
                  height={120}
                  src={image.includes("http") ? image : "https://" + image}
                  alt="foto-imovel"
                />
              ))}
            </Image.PreviewGroup>
            )}
          </Modal> */
}
