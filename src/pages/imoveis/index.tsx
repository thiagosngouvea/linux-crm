import React, { useCallback, useEffect, useState } from "react";
import { propertiesService } from "@/services/properties.service";
import { Button, Col, Form, Image, Input, Modal, Row, Select, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

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
  const [valorMin, setValorMin] = useState<string | null>(null)
  const [valorMax, setValorMax] = useState<string | null>(null)

  const router = useRouter();

  const fetchData = useCallback(async () => {
    let filterBy = "";
    let filterValue = "";
    let filterType = "";
  
    if (valorMax !== null || valorMin !== null) {
      let valorMinFormatado = valorMin?.replace(/[^\d]/g, "").replace(/0{2}$/, "");
      let valorMaxFormatado = valorMax?.replace(/[^\d]/g, "").replace(/0{2}$/, "");
  
      if (valorMaxFormatado === "0" || valorMaxFormatado === null) {
        valorMaxFormatado = "999999999";
      }
  
      if (valorMinFormatado === "0" && valorMaxFormatado === "0") {
        filterBy = "";      // Remover o filtro por completo
        filterValue = "";
        filterType = "";
      } else {
        filterBy += filterBy === "" ? "price" : ",price";
        filterValue += filterValue === "" ? `${valorMinFormatado}|${valorMaxFormatado}` : `,${valorMinFormatado}|${valorMaxFormatado}`;
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

    if(!!titulo) {
        filterBy += filterBy === "" ? "title_formatted" : ",title_formatted";
        filterValue += filterValue === "" ? `${titulo}` : `,${titulo}`;
        filterType += filterType === "" ? "ilike" : ",ilike";
    }

    try {
      const res = await propertiesService.getAll(
        page,
        limit,
        filterBy,
        filterValue,
        filterType
      );
      setProperties(res.data.properties.result);
      setTotal(res.data.properties.total);
    } catch (error: any) {
      console.log("error", error);
    }
  }, [page, limit, valorMax, valorMin, tipoImovel, referencia, titulo]);
  

  useEffect(() => {
    fetchData();
  }, [page, limit, valorMax, valorMin, tipoImovel, referencia, titulo]);

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
                        name: ['tipoImovel'],
                        value: tipoImovel,
                    },
                    {
                        name: ['referencia'],
                        value: referencia,
                    },
                    {
                        name: ['titulo'],
                        value: titulo,
                    },
                    {
                        name: ['valor_min'],
                        value: valorMin,
                    },
                    {
                        name: ['valor_max'],
                        value: valorMax,
                    },
                ]}
            >
                <Row
                    gutter={16}
                >
                    <Col span={4}>
                        <Form.Item label="Tipo do imóvel" name="tipoImovel">
                            <Select
                            placeholder="Tipo do imóvel"
                            onChange={(e) => setTipoImovel(e)}
                            showSearch
                            allowClear
                            options={[
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Apartamento
                                    </span>
                                ),
                                options: [
                                    {
                                    label: "Alto Padrão",
                                    value: "apartamento-alto-padrao",
                                    },
                                    { label: "Cobertura", value: "apartamento-cobertura" },
                                    {
                                    label: "Cobertura Duplex",
                                    value: "apartamento-cobertura-duplex",
                                    },
                                    {
                                    label: "Cobertura Linear",
                                    value: "apartamento-cobertura-linear",
                                    },
                                    {
                                    label: "Cobertura Triplex",
                                    value: "apartamento-cobertura-triplex",
                                    },
                                    {
                                    label: "Com área externa",
                                    value: "apartamento-area-externa",
                                    },
                                    { label: "Conjugado", value: "apartamento-conjugado" },
                                    { label: "Duplex", value: "apartamento-duplex" },
                                    { label: "Flat", value: "apartamento-flat" },
                                    { label: "Garden", value: "apartamento-garden" },
                                    { label: "Kitnet", value: "apartamento-kitnet" },
                                    { label: "Loft", value: "apartamento-loft" },
                                    { label: "Padrão", value: "apartamento-padrao" },
                                    { label: "Penthouse", value: "apartamento-penthouse" },
                                    { label: "Studio", value: "apartamento-studio" },
                                    { label: "Triplex", value: "apartamento-triplex" },
                                    { label: "Térreo", value: "apartamento-terreo" },
                                ],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Casa
                                    </span>
                                ),
                                options: [
                                    { label: "Alto Padrão", value: "casa-alto-padrao" },
                                    { label: "Alvenaria", value: "casa-alvenaria" },
                                    { label: "Chalé", value: "casa-chale" },
                                    { label: "Duplex", value: "casa-duplex" },
                                    { label: "Geminada", value: "casa-geminada" },
                                    { label: "kitnet", value: "casa-kitnet" },
                                    { label: "Linear", value: "casa-linear" },
                                    { label: "Madeira", value: "casa-madeira" },
                                    { label: "Mista", value: "casa-mista" },
                                    { label: "Padrão", value: "casa-padrao" },
                                    { label: "Sobrado", value: "casa-sobrado" },
                                    { label: "Pré-moldada", value: "casa-pre-moldada" },
                                    { label: "Sobreloja", value: "casa-sobreloja" },
                                    { label: "Sobreposta", value: "casa-sobreposta" },
                                    { label: "Triplex", value: "casa-triplex" },
                                    { label: "Térrea", value: "casa-terrea" },
                                    { label: "Vila", value: "casa-vila" },
                                    { label: "em Condomínio", value: "casa-em-condominio" },
                                ],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Terreno
                                    </span>
                                ),
                                options: [
                                    { label: "Lote", value: "terreno-lote" },
                                    { label: "Terreno", value: "terreno" },
                                    {
                                    label: "em Condomínio",
                                    value: "terreno-em-condominio",
                                    },
                                    {
                                    label: "em Loteamento",
                                    value: "terreno-em-loteamento",
                                    },
                                ],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Sítio
                                    </span>
                                ),
                                options: [
                                    { label: "Sítio", value: "sitio" },
                                    { label: "Haras", value: "sitio-haras" },
                                ],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Garagem
                                    </span>
                                ),
                                options: [
                                    { label: "Box", value: "garagem-box" },
                                    { label: "Garagem Externa", value: "garagem-externa" },
                                    {
                                    label: "Garagem Externa Coberta",
                                    value: "garagem-externa-coberta",
                                    },
                                    { label: "Garagem Interna", value: "garagem-interna" },
                                ],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Fazenda
                                    </span>
                                ),
                                options: [
                                    { label: "Fazenda", value: "fazenda" },
                                    { label: "Haras", value: "fazenda-haras" },
                                    { label: "Lavoura", value: "fazenda-lavoura" },
                                    { label: "Mista", value: "fazenda-mista" },
                                    { label: "Pecuária", value: "fazenda-pecuaria" },
                                ],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Chácara
                                    </span>
                                ),
                                options: [{ label: "Chácara", value: "chacara" }],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Rancho
                                    </span>
                                ),
                                options: [{ label: "Rancho", value: "rancho" }],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Pousada
                                    </span>
                                ),
                                options: [{ label: "Pousada", value: "pousada" }],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Sala
                                    </span>
                                ),
                                options: [
                                    {
                                    label: "Andar Comercial",
                                    value: "sala-andar-comercial",
                                    },
                                    { label: "Comercial", value: "sala-comercial" },
                                ],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Loja
                                    </span>
                                ),
                                options: [
                                    { label: "Loja", value: "loja" },
                                    {
                                    label: "Ponto Comercial",
                                    value: "loja-ponto-comercial",
                                    },
                                ],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Flat
                                    </span>
                                ),
                                options: [{ label: "Flat", value: "flat" }],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Sobrado
                                    </span>
                                ),
                                options: [
                                    { label: "Alto padrão", value: "sobrado-alto-padrao" },
                                    { label: "Geminado", value: "sobrado-geminado" },
                                    { label: "Padrão", value: "sobrado-padrao" },
                                    {
                                    label: "em Condomínio",
                                    value: "sobrado-em-condominio",
                                    },
                                ],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Prédio
                                    </span>
                                ),
                                options: [
                                    { label: "Comercial", value: "predio-comercial" },
                                    { label: "Residencial", value: "predio-comercial" },
                                ],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Indústria
                                    </span>
                                ),
                                options: [{ label: "Indústria", value: "industria" }],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Pavilhão/Galpão
                                    </span>
                                ),
                                options: [
                                    {
                                    label: "Em condomínio",
                                    value: "pavilhao-galpao-condominio",
                                    },
                                    {
                                    label: "Industrial",
                                    value: "pavilhao-galpao-industrial",
                                    },
                                    {
                                    label: "Logístico",
                                    value: "pavilhao-galpao-logistico",
                                    },
                                    {
                                    label: "Salão Comercial",
                                    value: "pavilhao-galpao-salao-comercial",
                                    },
                                ],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Área
                                    </span>
                                ),
                                options: [
                                    { label: "Comercial", value: "area-comercial" },
                                    { label: "Industrial", value: "area-industrial" },
                                    {
                                    label: "Reflorestamento",
                                    value: "area-reflorestamento",
                                    },
                                    { label: "Residencial", value: "area-residencial" },
                                    {
                                    label: "Residencial/Comercial",
                                    value: "area-residencial-comercial",
                                    },
                                    { label: "Rural", value: "area-rural" },
                                ],
                                },
                                {
                                label: (
                                    <span className="font-bold text-sm text-black">
                                    Ponto Comercial
                                    </span>
                                ),
                                options: [
                                    {
                                    label: "Andar Comercial",
                                    value: "ponto-comercial-andar-comercial",
                                    },
                                    {
                                    label: "Comercio",
                                    value: "ponto-comercial-comercio",
                                    },
                                    {
                                    label: "Indústria",
                                    value: "ponto-comercial-industria",
                                    },
                                ],
                                },
                            ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Form.Item label="Referência" name="referencia">
                            <Input
                            placeholder="AP0001"
                            onChange={(e) => setReferencia(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Titulo" name="titulo">
                            <Input
                            placeholder="Ex: Apartamento em Copacabana..."
                            onChange={(e) => setTitulo(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                    <Form.Item label="Valor Mínimo" name="valor_min">
                      <Input
                        placeholder="Digite o valor mínimo"
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, '');
                          const formatted = new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 2,
                          }).format(Number(inputValue) / 100);
                          setValorMin(formatted);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item label="Valor Máximo" name="valor_max">
                      <Input
                        placeholder="Digite o valor máximo"
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, '');
                          const formatted = new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 2,
                          }).format(Number(inputValue) / 100);
                          setValorMax(formatted);
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
            </Form>
          </div>
        </div>
        <div className="">
          <Table
            columns={[
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
              },
              {
                title: "Referência",
                dataIndex: "reference",
                key: "reference",
              },
              {
                title: "Titulo",
                dataIndex: "title",
                key: "title",
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
                        setImages(images);
                      }}
                    >
                      Ver Imagens
                    </button>
                  );
                },
              },
              {
                title: "Ações",
                dataIndex: "actions",
                key: "actions",
                align: "center",
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
          />
          <Modal
            title="Imagens retiradas via web scraping"
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
            <Image.PreviewGroup>
              {images.map((image, index) => (
                <Image
                  key={index}
                  width={200}
                  height={120}
                  src={"https://" + image}
                  alt="foto-imovel"
                />
              ))}
            </Image.PreviewGroup>
          </Modal>
        </div>
      </div>
    </div>
  );
}
