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
                    <Col xs={24} sm={12} md={8} xl={6}>
                        <Form.Item label="Referência" name="referencia">
                            <Input
                            placeholder="AP0001"
                            onChange={(e) => setReferencia(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} xl={6}>
                        <Form.Item label="Titulo" name="titulo">
                            <Input
                            placeholder="Ex: Apartamento em Copacabana..."
                            onChange={(e) => setTitulo(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} xl={6}>
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
                  <Col xs={24} sm={12} md={8} xl={6}>
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
                        setImages(images ?? record?.images_old_links);
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
          />
          <Modal
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
          </Modal>
        </div>
      </div>
    </div>
  );
}
