import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Row,
  Table,
  Tooltip,
  Input,
  Col,
  Select,
  Modal,
  Button,
} from "antd";
import { NumericFormat } from "react-number-format";
import { excelService } from "@/services/excel.service";
import moment from "moment";
import { EditOutlined, SwapOutlined, SyncOutlined } from "@ant-design/icons";
import { propertiesService } from "@/services/properties.service";
import { parseCookies } from "nookies";
import { tecimobService } from "@/services/tecimob.service";

interface DadosExcelProps {
  id?: string;
  reference: string;
  capture_link: string;
  capture_link_situation: string;
  capture_link_price: string;
  site_link_situation: string;
  site_link_price: string;
  site_link: string;
  comparison: string;
}

const DadosExcel = React.memo(function DadosExcel({
  token,
}: {
  token: string;
}) {
  const [data, setData] = useState<DadosExcelProps[]>([]);

  const [reference, setReference] = useState<string>("");
  const [capture_link_situation, setCaptureLinkSituation] =
    useState<string>("");
  const [capture_link_price, setCaptureLinkPrice] = useState<string>("");
  const [site_link_situation, setSiteLinkSituation] = useState<string>("");
  const [site_link_price, setSiteLinkPrice] = useState<string>("");
  const [comparison, setComparison] = useState<string>("");

  const [visible, setVisible] = useState<boolean>(false);
  const [editData, setEditData] = useState<DadosExcelProps | null>(null);

  const [modalSync, setModalSync] = useState<boolean>(false);
  const [syncData, setSyncData] = useState<any>(null);

  console.log("***editData", editData);

  const fetchData = useCallback(async () => {
    let filterBy = "";
    let filterValue = "";
    let filterType = "";

    if (reference) {
      filterBy = "reference";
      filterValue = reference;
      filterType = "ilike";
    }

    if (capture_link_situation) {
      filterBy = "capture_link_situation";
      filterValue = capture_link_situation;
      filterType = "eq";
    }

    if (capture_link_price) {
      filterBy = "capture_link_price";
      filterValue = capture_link_price;
      filterType = "eq";
    }

    if (site_link_situation) {
      filterBy = "site_link_situation";
      filterValue = site_link_situation;
      filterType = "eq";
    }

    if (site_link_price) {
      filterBy = "site_link_price";
      filterValue = site_link_price;
      filterType = "eq";
    }

    if (comparison && comparison !== "Preço Divergente e Disponível") {
      filterBy = "comparison";
      filterValue = comparison;
      filterType = "eq";
    }

    try {
      const response = await excelService.getAll(
        1,
        1000,
        filterBy,
        filterValue,
        filterType
      );
      if (comparison === "Preço Divergente e Disponível") {
        const data = response?.data?.excel?.result.filter(
          (item: any) =>
            item?.capture_link_price?.replace(",00", "") !==
              item?.site_link_price?.replace(",00", "") &&
            (item?.capture_link_situation && item?.site_link_situation) ===
              "Disponível"
        );
        setData(data);
        return;
      }
      setData(response?.data?.excel?.result);
    } catch (error) {
      console.log(error);
    }
  }, [
    reference,
    capture_link_situation,
    capture_link_price,
    site_link_situation,
    site_link_price,
    comparison,
  ]);

  const fetchDataTecimob = useCallback(
    async (reference: string) => {
      try {
        const response = await propertiesService.getInTecimobByReference(
          reference,
          token
        );

        setSyncData(response?.data?.data[0]);
      } catch (error) {
        console.log(error);
      }
    },
    [reference, token]
  );

  console.log("***syncData", syncData);

  useEffect(() => {
    let tokenTecimob;
    tokenTecimob = localStorage.getItem("access_token");
    console.log("***token", tokenTecimob);
    fetchData();
  }, [
    fetchData,
    reference,
    capture_link_situation,
    capture_link_price,
    site_link_situation,
    site_link_price,
    comparison,
  ]);

  return (
    <>
      <Form layout="vertical">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item label="Referência">
              <Input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Situação do Link de Captação">
              <Select
                value={capture_link_situation}
                onChange={(value) => setCaptureLinkSituation(value)}
                allowClear
              >
                <Select.Option value="Disponível">Disponível</Select.Option>
                <Select.Option value="Indisponível">Indisponível</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Preço do Link de Captação">
              <NumericFormat
                onValueChange={(values) => {
                  const { formattedValue, value } = values;
                  setCaptureLinkPrice(formattedValue);
                }}
                thousandSeparator="."
                decimalSeparator=","
                placeholder="Pesquisar preço"
                customInput={Input}
                className="w-full p-1 border rounded-md"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item label="Situação do Link do Site">
              <Select
                value={site_link_situation}
                onChange={(value) => setSiteLinkSituation(value)}
                allowClear
              >
                <Select.Option value="Disponível">Disponível</Select.Option>
                <Select.Option value="Indisponível">Indisponível</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Preço do Link do Site">
              <NumericFormat
                onValueChange={(values) => {
                  const { formattedValue, value } = values;
                  setSiteLinkPrice(formattedValue);
                }}
                thousandSeparator="."
                decimalSeparator=","
                placeholder="Pesquisar preço"
                customInput={Input}
                className="w-full p-1 border rounded-md"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Comparação">
              <Select
                value={comparison}
                onChange={(value) => setComparison(value)}
                allowClear
              >
                <Select.Option value="Diferença de disponibilidade">
                  Diferença de disponibilidade
                </Select.Option>
                <Select.Option value="Indisponível em ambos">
                  Indisponível em ambos
                </Select.Option>
                <Select.Option value="Disponível em ambos">
                  Disponível em ambos
                </Select.Option>
                <Select.Option value="Preço Divergente e Disponível">
                  Preço Divergente e Disponível
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        columns={[
          {
            title: "Referência",
            dataIndex: "reference",
            key: "reference",
            width: 150,
            fixed: "left",
            render: (text: string) => <a>{text}</a>,
          },
          {
            title: "Link de Captação",
            dataIndex: "capture_link",
            key: "capture_link",
            width: 200,
            render: (text: string) => {
              return (
                <Tooltip title={text}>
                  <a
                    className="truncate line-clamp-1"
                    href={text}
                    target="_blank"
                  >
                    {text.length > 20 ? `${text.substring(0, 20)}...` : text}
                  </a>
                </Tooltip>
              );
            },
          },
          {
            title: "Situacao do Link de Captação",
            dataIndex: "capture_link_situation",
            key: "capture_link_situation",
            width: 200,
            render: (text: string, record: any) => {
              return (
                <span
                  className={`${
                    record.capture_link_situation === record.site_link_situation
                      ? "bg-green-600 "
                      : "bg-red-600"
                  } flex text-white font-bold w-32 justify-center`}
                >
                  {text}
                </span>
              );
            },
          },
          {
            title: "Preço do Link de Captação",
            dataIndex: "capture_link_price",
            key: "capture_link_price",
            width: 200,
            render: (text: string, record: any) => {
              return (
                <span
                  className={`${
                    record.capture_link_price === record.site_link_price
                      ? "bg-green-600 "
                      : "bg-red-600"
                  } flex text-white font-bold w-32 justify-center`}
                >
                  {text && `R$ ${text}`}
                </span>
              );
            },
          },
          {
            title: "Link do Site",
            dataIndex: "site_link",
            key: "site_link",
            width: 200,
            render: (text: string) => {
              return (
                <Tooltip title={text}>
                  <a
                    className="truncate line-clamp-1"
                    href={text}
                    target="_blank"
                  >
                    {text.length > 20 ? `${text.substring(0, 20)}...` : text}
                  </a>
                </Tooltip>
              );
            },
          },
          {
            title: "Situação do Link do Site",
            dataIndex: "site_link_situation",
            key: "site_link_situation",
            width: 200,
            render: (text: string, record: any) => {
              return (
                <span
                  className={`${
                    record.site_link_situation === record.capture_link_situation
                      ? "bg-green-600 "
                      : "bg-red-600"
                  } flex text-white font-bold w-32 justify-center`}
                >
                  {text}
                </span>
              );
            },
          },
          {
            title: "Preço do Link do Site",
            dataIndex: "site_link_price",
            key: "site_link_price",
            width: 200,
            render: (text: string, record: any) => {
              return (
                <span
                  className={`${
                    record.site_link_price === record.capture_link_price
                      ? "bg-green-600 "
                      : "bg-red-600"
                  } flex text-white font-bold w-32 justify-center`}
                >
                  {text && `R$ ${text}`}
                </span>
              );
            },
          },
          {
            title: "Comparação de Disponibilidade",
            dataIndex: "comparison",
            key: "comparison",
            width: 300,
          },
          {
            title: "Última Checagem",
            dataIndex: "updated_at",
            key: "updated_at",
            width: 300,
            render: (text: string) => {
              return <span>{moment(text).format("DD/MM/YYYY HH:mm:ss")}</span>;
            },
          },
          {
            title: "Ações",
            dataIndex: "actions",
            key: "actions",
            align: "center",
            fixed: "right",
            width: 100,
            render: (text, record) => {
              return (
                <div className="flex gap-4">
                  <div
                    className="text-orange-400 text-lg cursor-pointer"
                    onClick={() => {
                      setVisible(true);
                      setEditData(record);
                    }}
                  >
                    <EditOutlined size={30} />
                  </div>
                  <Tooltip title="Sincronizar com Tecimob">
                    <div
                      className="text-orange-400 text-lg cursor-pointer"
                      onClick={async () => {
                        await fetchDataTecimob(record.reference);
                        setEditData(record);
                        setModalSync(true);
                      }}
                    >
                      <SyncOutlined size={30} />
                    </div>
                  </Tooltip>
                </div>
              );
            },
          },
        ]}
        dataSource={data}
        scroll={{ x: 1300 }}
        pagination={{
          showSizeChanger: true,
          showTotal: (total, range) =>
            `Mostrando ${range[0]}-${range[1]} de ${total}`,
          pageSizeOptions: ["10", "20", "50", "100", "250", "500", "1000"],
          position: ["topRight", "bottomRight"],
        }}
      />
      <Modal
        title="Sincronizar com Tecimob"
        open={modalSync}
        onCancel={() => {
          setModalSync(false);
          setSyncData(null);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setModalSync(false);
              setSyncData(null);
            }}
          >
            Fechar
          </Button>,
        ]}
      >
        <div>
          <div className="flex">
              <div className="w-1/2">
                <h1 className="font-bold text-lg">Valor Atual</h1>
                <p>{syncData?.calculated_price ? syncData?.calculated_price : 'Sem informações'}</p>
              </div>
              <div className="w-1/2">
                <h1 className="font-bold text-lg">Novo Valor</h1>
                <p>{editData?.capture_link_price ? editData?.capture_link_price : 'Sem informações'}</p>
              </div>
              <Tooltip title="Sincronizar com Tecimob">
                <SwapOutlined 
                  size={60}
                  className="cursor-pointer"
                />
              </Tooltip>
          </div>
          <div className="flex">
              <div className="w-1/2">
                <h1 className="font-bold text-lg">Status Atual</h1>
                <p>{syncData?.status ?? 'Sem informações'}</p>
              </div>
            {editData?.capture_link_situation && (
              <div className="w-1/2">
                <h1 className="font-bold text-lg">Novo Status</h1>
                <p>{editData?.capture_link_situation ?? 'Sem informações'}</p>
              </div>
            )}
            <Tooltip title="Sincronizar com Tecimob">
              <SwapOutlined 
                size={60}
                className="cursor-pointer"
                onClick={async () => {
                  if(editData?.capture_link_situation === 'Indisponível'){ 
                    await tecimobService.inativarImovel(syncData?.id, token);
                  }
                  if(editData?.capture_link_situation === 'Disponível'){
                    await tecimobService.ativarImovel(syncData?.id, token);
                  }}
                }
              />
            </Tooltip>
          </div>
        </div>
      </Modal>
      <Modal
        title="Editar Dados"
        open={visible}
        okButtonProps={{
          disabled: !editData,
          color: "primary",
        }}
        onCancel={() => {
          setVisible(false);
          setEditData(null);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setVisible(false);
              setEditData(null);
            }}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={async () => {
              await tecimobService.inativarImovel(syncData?.id, token);
              setVisible(false);
              setEditData(null);
            }}
          >
            Aceitar
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          fields={[
            { name: ["reference"], value: editData?.reference },
            {
              name: ["capture_link_situation"],
              value: editData?.capture_link_situation,
            },
            {
              name: ["capture_link_price"],
              value: editData?.capture_link_price,
            },
            {
              name: ["site_link_situation"],
              value: editData?.site_link_situation,
            },
            { name: ["site_link_price"], value: editData?.site_link_price },
            { name: ["comparison"], value: editData?.comparison },
          ]}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="Referência" name="reference">
                <Input
                  type="text"
                  onChange={(e) =>
                    setEditData(
                      editData
                        ? { ...editData, reference: e.target.value }
                        : null
                    )
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Situação do Link de Captação"
                name="capture_link_situation"
              >
                <Select
                  onChange={(value) =>
                    setEditData(
                      editData
                        ? { ...editData, capture_link_situation: value }
                        : null
                    )
                  }
                  allowClear
                >
                  <Select.Option value="Disponível">Disponível</Select.Option>
                  <Select.Option value="Indisponível">
                    Indisponível
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Preço do Link de Captação"
                name="capture_link_price"
              >
                <Input
                  type="text"
                  onChange={(e) =>
                    setEditData(
                      editData
                        ? { ...editData, capture_link_price: e.target.value }
                        : null
                    )
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Situação do Link do Site"
                name="site_link_situation"
              >
                <Select
                  onChange={(value) =>
                    setEditData(
                      editData
                        ? { ...editData, site_link_situation: value }
                        : null
                    )
                  }
                  allowClear
                >
                  <Select.Option value="Disponível">Disponível</Select.Option>
                  <Select.Option value="Indisponível">
                    Indisponível
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="Preço do Link do Site" name="site_link_price">
                <Input
                  type="text"
                  onChange={(e) =>
                    setEditData(
                      editData
                        ? { ...editData, site_link_price: e.target.value }
                        : null
                    )
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Comparação" name="comparison">
                <Select
                  onChange={(value) =>
                    setEditData(
                      editData ? { ...editData, comparison: value } : null
                    )
                  }
                  allowClear
                >
                  <Select.Option value="Diferença de disponibilidade">
                    Diferença de disponibilidade
                  </Select.Option>
                  <Select.Option value="Indisponível em ambos">
                    Indisponível em ambos
                  </Select.Option>
                  <Select.Option value="Disponível em ambos">
                    Disponível em ambos
                  </Select.Option>
                  <Select.Option value="Preço Divergente e Disponível">
                    Preço Divergente e Disponível
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
});

export default DadosExcel;

export const getServerSideProps = async (ctx: any) => {
  const { ["token.tecimob"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      props: {},
    };
  }

  return {
    props: {
      token,
    },
  };
};
