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
  notification,
  Upload,
  message,
  Popconfirm,
} from "antd";
import { NumericFormat } from "react-number-format";
import { excelService } from "@/services/excel.service";
import moment from "moment";
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  SwapOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { propertiesService } from "@/services/properties.service";
import { parse } from 'cookie';
import { tecimobService } from "@/services/tecimob.service";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import type { UploadProps } from "antd";



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
  const [capture_link, setCaptureLink] = useState<string>("");
  const [capture_link_situation, setCaptureLinkSituation] =
    useState<string>("");
  const [capture_link_price, setCaptureLinkPrice] = useState<string>("");
  const [site_link, setSiteLink] = useState<string>("");
  const [site_link_situation, setSiteLinkSituation] = useState<string>("");
  const [site_link_price, setSiteLinkPrice] = useState<string>("");
  const [comparison, setComparison] = useState<string>("");

  const [referenceAdd, setReferenceAdd] = useState<string>("");
  const [capture_linkAdd, setCaptureLinkAdd] = useState<string>("");
  const [capture_link_situationAdd, setCaptureLinkSituationAdd] =
    useState<string>("");
  const [capture_link_priceAdd, setCaptureLinkPriceAdd] = useState<string>("");
  const [site_linkAdd, setSiteLinkAdd] = useState<string>("");
  const [site_link_situationAdd, setSiteLinkSituationAdd] =
    useState<string>("");
  const [site_link_priceAdd, setSiteLinkPriceAdd] = useState<string>("");
  const [comparisonAdd, setComparisonAdd] = useState<string>("");

  const [visible, setVisible] = useState<boolean>(false);
  const [editData, setEditData] = useState<DadosExcelProps | null>(null);

  const [modalSync, setModalSync] = useState<boolean>(false);
  const [syncData, setSyncData] = useState<any>(null);

  const [success, setSuccess] = useState<boolean>(false);

  const [successStatus, setSuccessStatus] = useState<boolean>(false);

  const [visibleAdd, setVisibleAdd] = useState<boolean>(false);

  const props: UploadProps = {
    name: "file",
    accept: ".xlsx",
    headers: {
      authorization: "authorization-text",
    },
    beforeUpload: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      await excelService.uploadExcel(formData).then(async () => {
        await fetchData();
      });
      return true;
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} upload concluido com sucesso.`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} upload falhou.`);
      }
    },
  };

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

  function exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Imóveis");
  
    // Adiciona cabeçalhos
    worksheet.columns = [
      { header: "Referência", key: "reference", width: 20 },
      { header: "Link Captação", key: "capture_link", width: 30 },
      { header: "Link Captação Situação", key: "capture_link_situation", width: 20 },
      { header: "Link Captação Preço", key: "capture_link_price", width: 20 },
      { header: "Link Site", key: "site_link", width: 30 },
      { header: "Link Site Situação", key: "site_link_situation", width: 20 },
      { header: "Link Site Preço", key: "site_link_price", width: 20 },
      { header: "Comparação Disponibilidade", key: "comparison", width: 30 },
    ];
  
    data.forEach((item) => worksheet.addRow(item));
  
    // Estilos para células específicas
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const captureSituationCell = row.getCell("capture_link_situation");
        const siteSituationCell = row.getCell("site_link_situation");
        const capturePriceCell = row.getCell("capture_link_price");
        const sitePriceCell = row.getCell("site_link_price");
  
        // Se "Indisponível", aplique cor vermelha
        if (captureSituationCell.value === "Indisponível") {
          captureSituationCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF0000" },
          };
          captureSituationCell.font = { color: { argb: "FFFFFFFF" } };
        }
  
        if (siteSituationCell.value === "Indisponível") {
          siteSituationCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF0000" },
          };
          siteSituationCell.font = { color: { argb: "FFFFFFFF" } };
        }
  
        // Comparação de preços
        if (capturePriceCell.value && sitePriceCell.value) {
          if (capturePriceCell.value === sitePriceCell.value) {
            capturePriceCell.fill = sitePriceCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF00FF00" },
            };
            capturePriceCell.font = sitePriceCell.font = { color: { argb: "FFFFFFFF" } };
          } else {
            capturePriceCell.fill = sitePriceCell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFF0000" },
            };
            capturePriceCell.font = sitePriceCell.font = { color: { argb: "FFFFFFFF" } };
          }
        }
      }
    });
  
    // Salva o arquivo
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, `Resultados_${new Date().toISOString().slice(0, 10)}.xlsx`);
    });
  }

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
      <div className="flex justify-end gap-4 mb-4">
        <Popconfirm
          title="Remover todos os dados"
          description="Você tem certeza?"
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          onConfirm={async () => {
            data.map(async (item) => {
              await excelService.remove(item.id);
            });
            await fetchData();
          }}
          okButtonProps={{
            danger: true,
            title: "Deletar",
          }}
          okText="Deletar"
        >
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
          Remover todos os registros
        </button>
        </Popconfirm>;
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setVisibleAdd(true);
          }}
        >
          Adicionar Captação
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            exportToExcel();
          }}
        >
          Exportar Excel
        </button>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>
            Selecione o arquivo para upload
          </Button>
        </Upload>
      </div>
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
                    {text?.length > 20 ? `${text?.substring(0, 20)}...` : text}
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
            title: "Última Atualização",
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
                  <Tooltip title="Deletar Registro">
                    <Popconfirm
                      title="Deletar Registro"
                      description="Você tem certeza?"
                      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                      onConfirm={async () => {
                        await excelService
                          .remove(record.id)
                          .then(async () => {
                            notification.success({
                              message: "Registro deletado com sucesso!",
                            });
                            await fetchData();
                          })
                          .catch((error) => {
                            notification.error({
                              message: "Erro ao deletar registro!",
                              description: error,
                            });
                          });
                      }}
                      okButtonProps={{
                        danger: true,
                        title: "Deletar",
                      }}
                      okText="Deletar"
                    >
                      <div className="text-red-400 text-lg cursor-pointer">
                        <DeleteOutlined size={30} />
                      </div>
                    </Popconfirm>
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
          setSuccess(false);
          setSuccessStatus(false);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setModalSync(false);
              setSyncData(null);
              setSuccess(false);
              setSuccessStatus(false);
            }}
          >
            Fechar
          </Button>,
        ]}
      >
        <div>
          <div className="flex">
            {!success && (
              <>
                <div className="w-1/2">
                  <h1 className="font-bold text-lg">Valor Atual</h1>
                  <p>
                    {syncData?.calculated_price
                      ? syncData?.calculated_price
                      : "Sem informações"}
                  </p>
                </div>
                <div className="w-1/2">
                  <h1 className="font-bold text-lg">Novo Valor</h1>
                  <p>
                    {editData?.capture_link_price
                      ? editData?.capture_link_price
                      : "Sem informações"}
                  </p>
                </div>
                <Tooltip title="Sincronizar com Tecimob">
                  <SwapOutlined
                    size={60}
                    className="cursor-pointer"
                    onClick={async () => {
                      const errors: string[] = [];
                      const successes: string[] = [];

                      const handleOperation = async (
                        operation: () => Promise<any>,
                        successMessage: string,
                        errorMessage: string
                      ) => {
                        try {
                          await operation();
                          successes.push(successMessage);
                        } catch (error: any) {
                          errors.push(
                            `${errorMessage}: ${error.message || error}`
                          );
                        }
                      };

                      const id = syncData?.id;
                      const price = editData?.capture_link_price?.replace(
                        "R$",
                        ""
                      );

                      await handleOperation(
                        () =>
                          tecimobService
                            .getPublicacaoImovel(id, token)
                            .then((response) => {
                              const data = {
                                ...response.data.data,
                                meta_title:
                                  response.data.data.meta_title.replace(
                                    syncData?.calculated_price
                                      .replace("R$", "")
                                      .replace(",00", ""),
                                    price
                                  ),
                              };
                              return tecimobService.alterarPublicacaoImovel(
                                id,
                                token,
                                {
                                  ...data,
                                }
                              );
                            }),
                        "Publicação atualizada com sucesso!",
                        "Erro ao atualizar publicação"
                      );

                      await handleOperation(
                        () =>
                          tecimobService
                            .getDescricaoImovel(id, token)
                            .then((response) =>
                              tecimobService.alterarDescricaoImovel(id, token, {
                                ...response.data.data,
                                description:
                                  response.data.data.description.replace(
                                    syncData?.calculated_price
                                      .replace("R$", "")
                                      .replace(",00", ""),
                                    price
                                  ),
                              })
                            ),
                        "Descrição atualizada com sucesso!",
                        "Erro ao atualizar descrição"
                      );

                      await handleOperation(
                        () =>
                          tecimobService
                            .getPrecoImovel(id, token)
                            .then((response) =>
                              tecimobService.alterarPrecoImovel(id, token, {
                                ...response.data.data,
                                price,
                              })
                            ),
                        "Preço atualizado com sucesso!",
                        "Erro ao atualizar preço"
                      );

                      if (errors.length) {
                        notification.error({
                          message: "Ocorreram alguns erros",
                          description: errors.join("\n"),
                        });
                      } else {
                        setSuccess(true);
                        notification.success({
                          message: "Operações concluídas com sucesso!",
                          description: "teste",
                        });

                        await fetchData();
                      }
                    }}
                  />
                </Tooltip>
              </>
            )}
            {success && (
              <div className="w-full">
                <h1 className="font-bold text-lg">Sucesso</h1>
                <p>Operações de alteração de preço concluídas com sucesso!</p>
              </div>
            )}
          </div>
          <div className="flex">
            {!successStatus && (
              <>
                <div className="w-1/2">
                  <h1 className="font-bold text-lg">Status Atual</h1>
                  <p>{syncData?.status ?? "Sem informações"}</p>
                </div>
                {editData?.capture_link_situation && (
                  <div className="w-1/2">
                    <h1 className="font-bold text-lg">Novo Status</h1>
                    <p>
                      {editData?.capture_link_situation ?? "Sem informações"}
                    </p>
                  </div>
                )}
                <Tooltip title="Sincronizar com Tecimob">
                  <SwapOutlined
                    size={60}
                    className="cursor-pointer"
                    onClick={async () => {
                      if (editData?.capture_link_situation === "Indisponível") {
                        await tecimobService
                          .inativarImovel(syncData?.id, token)
                          .then(async () => {
                            notification.success({
                              message: "Imóvel inativado com sucesso!",
                            });
                            setSuccessStatus(true);
                          })
                          .catch((error) => {
                            notification.error({
                              message: "Erro ao inativar imóvel!",
                              description: error,
                            });
                          });
                      }
                      if (editData?.capture_link_situation === "Disponível") {
                        await tecimobService
                          .ativarImovel(syncData?.id, token)
                          .then(async () => {
                            notification.success({
                              message: "Imóvel ativado com sucesso!",
                            });
                            setSuccessStatus(true);
                          })
                          .catch((error) => {
                            notification.error({
                              message: "Erro ao ativar imóvel!",
                              description: error,
                            });
                          });
                      }
                    }}
                  />
                </Tooltip>
              </>
            )}
            {successStatus && (
              <div className="w-full">
                <h1 className="font-bold text-lg">Sucesso</h1>
                <p>Operação de alteração de status concluida com sucesso!</p>
              </div>
            )}
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
            type="default"
            onClick={async () => {
              await excelService
                .update(editData?.id, editData)
                .then(async () => {
                  notification.success({
                    message: "Registro atualizado com sucesso!",
                  });
                  await fetchData();
                })
                .catch((error) => {
                  notification.error({
                    message: "Erro ao atualizar registro!",
                    description: error,
                  });
                });
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
      <Modal
        title="Adicionar Captação"
        open={visibleAdd}
        okButtonProps={{
          color: "primary",
        }}
        onCancel={() => {
          setVisibleAdd(false);
          setReferenceAdd("");
          setCaptureLinkAdd("");
          setCaptureLinkSituationAdd("");
          setCaptureLinkPriceAdd("");
          setSiteLinkAdd("");
          setSiteLinkSituationAdd("");
          setSiteLinkPriceAdd("");
          setComparisonAdd("");
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setVisibleAdd(false);
              setReferenceAdd("");
              setCaptureLinkAdd("");
              setCaptureLinkSituationAdd("");
              setCaptureLinkPriceAdd("");
              setSiteLinkAdd("");
              setSiteLinkSituationAdd("");
              setSiteLinkPriceAdd("");
              setComparisonAdd("");
            }}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="default"
            onClick={async () => {
              await excelService
                .create({
                  reference: referenceAdd,
                  capture_link: capture_linkAdd,
                  capture_link_situation: capture_link_situationAdd,
                  capture_link_price: capture_link_priceAdd,
                  site_link: site_linkAdd,
                  site_link_situation: site_link_situationAdd,
                  site_link_price: site_link_priceAdd,
                  comparison: comparisonAdd,
                })
                .then(async () => {
                  notification.success({
                    message: "Registro criado com sucesso!",
                  });
                  setVisibleAdd(false);
                  await fetchData();
                })
                .catch((error) => {
                  notification.error({
                    message: "Erro ao criar registro!",
                    description: error,
                  });
                });
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
            { name: ["reference"], value: referenceAdd },
            { name: ["capture_link"], value: capture_linkAdd },
            {
              name: ["capture_link_situation"],
              value: capture_link_situationAdd,
            },
            {
              name: ["capture_link_price"],
              value: capture_link_priceAdd,
            },
            { name: ["site_link"], value: site_linkAdd },
            {
              name: ["site_link_situation"],
              value: site_link_situationAdd,
            },
            { name: ["site_link_price"], value: site_link_priceAdd },
            { name: ["comparison"], value: comparisonAdd },
          ]}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="Referência" name="reference">
                <Input
                  type="text"
                  onChange={(e) => setReferenceAdd(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Link de Captação" name="capture_link">
                <Input
                  type="text"
                  onChange={(e) => setCaptureLinkAdd(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Situação do Link de Captação"
                name="capture_link_situation"
              >
                <Select
                  onChange={(value) => setCaptureLinkSituationAdd(value)}
                  allowClear
                >
                  <Select.Option value="Disponível">Disponível</Select.Option>
                  <Select.Option value="Indisponível">
                    Indisponível
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Preço do Link de Captação"
                name="capture_link_price"
              >
                <Input
                  type="text"
                  onChange={(e) => setCaptureLinkPriceAdd(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Situação do Link do Site"
                name="site_link_situation"
              >
                <Select
                  onChange={(value) => setSiteLinkSituationAdd(value)}
                  allowClear
                >
                  <Select.Option value="Disponível">Disponível</Select.Option>
                  <Select.Option value="Indisponível">
                    Indisponível
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Link do Site" name="site_linkAdd">
                <Input
                  type="text"
                  onChange={(e) => setSiteLinkAdd(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="Preço do Link do Site" name="site_link_price">
                <Input
                  type="text"
                  onChange={(e) => setSiteLinkPriceAdd(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Comparação" name="comparison">
                <Select
                  onChange={(value) => setComparisonAdd(value)}
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
  const cookies = parse(ctx.req.headers.cookie || '');
  const token = cookies['token.tecimob'];

  if (!token) {
    return { props: {} };
  }

  return {
    props: { token },
  };
};
