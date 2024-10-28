import React, { useState, useEffect, useCallback } from "react";
import { Form, Row, Table, Tooltip, Input, Col, Select } from "antd";
import { NumericFormat } from 'react-number-format';
import { excelService } from "@/services/excel.service";
import moment from "moment";

interface DadosExcelProps {
    reference: string;
    capture_link: string;
    capture_link_situation: string;
    capture_link_price: string;
    site_link_situation: string;
    site_link_price: string;
    site_link: string;
    comparison: string;
}


const DadosExcel = React.memo(function DadosExcel() {

    const [data, setData] = useState<DadosExcelProps[]>([])

    const [reference, setReference] = useState<string>("");
    const [capture_link_situation, setCaptureLinkSituation] = useState<string>("");
    const [capture_link_price, setCaptureLinkPrice] = useState<string>("");
    const [site_link_situation, setSiteLinkSituation] = useState<string>("");
    const [site_link_price, setSiteLinkPrice] = useState<string>("");
    const [comparison, setComparison] = useState<string>("");

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

        if (comparison) {
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
            setData(response?.data?.excel?.result)
        } catch (error) {
            console.log(error)
        }
    }, [reference, capture_link_situation, capture_link_price, site_link_situation, site_link_price, comparison]);

    useEffect(() => {
        fetchData()
    }, [fetchData, reference, capture_link_situation, capture_link_price, site_link_situation, site_link_price, comparison]);

    return (
        <>
            <Form
                layout="vertical"
                onFinish={() => fetchData()}
            >
                <Row gutter={[16,16]}>
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
                <Row gutter={[16,16]}>
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
                                <Select.Option value="Diferença de disponibilidade">Diferença de disponibilidade</Select.Option>
                                <Select.Option value="Indisponível em ambos">Indisponível em ambos</Select.Option>
                                <Select.Option value="Disponível em ambos">Disponível em ambos</Select.Option>
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
                        render: (text: string) => <a>{text}</a>,
                    },
                    {
                        title: "Link de Captação",
                        dataIndex: "capture_link",
                        key: "capture_link",
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
                            )
                        },
                    },
                    {
                        title: "Situacao do Link de Captação",
                        dataIndex: "capture_link_situation",
                        key: "capture_link_situation",
                        render: (text: string, record: any) => {
                            return (
                                <span className={`${record.capture_link_situation === record.site_link_situation ? 'bg-green-600 ' : 'bg-red-600'} flex text-white font-bold w-32 justify-center`}>
                                    {text}
                                </span>
                            )
                        },
                    },
                    {
                        title: "Preço do Link de Captação",
                        dataIndex: "capture_link_price",
                        key: "capture_link_price",
                        render: (text: string, record: any) => {
                                return (
                                    <span className={`${record.capture_link_price === record.site_link_price ? 'bg-green-600 ' : 'bg-red-600'} flex text-white font-bold w-32 justify-center`}>
                                        {text && `R$ ${text}`}
                                    </span>
                                )
                        },
                    },
                    {
                        title: "Link do Site",
                        dataIndex: "site_link",
                        key: "site_link",
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
                            )
                        },
                    },
                    {
                        title: "Situação do Link do Site",
                        dataIndex: "site_link_situation",
                        key: "site_link_situation",
                        render: (text: string, record: any) => {
                            return (
                                <span className={`${record.site_link_situation === record.capture_link_situation  ? 'bg-green-600 ' : 'bg-red-600'} flex text-white font-bold w-32 justify-center`}>
                                    {text}
                                </span>
                            )
                        },
                    },
                    {
                        title: "Preço do Link do Site",
                        dataIndex: "site_link_price",
                        key: "site_link_price",
                        render: (text: string, record: any) => {
                            return (
                                <span className={`${record.site_link_price === record.capture_link_price ? 'bg-green-600 ' : 'bg-red-600'} flex text-white font-bold w-32 justify-center`}>
                                    {text && `R$ ${text}`}
                                </span>
                            )
                    },
                    },
                    {
                        title: "Comparação de Disponibilidade",
                        dataIndex: "comparison",
                        key: "comparison",
                    },
                    {
                        title: "Última Checagem",
                        dataIndex: "updated_at",
                        key: "updated_at",
                        render: (text: string) => {
                            return (
                                <span>
                                    {moment(text).format("DD/MM/YYYY HH:mm:ss")}
                                </span>
                            )
                        }
                    }
                ]}
                dataSource={data}
                scroll={{ x: 1300 }}
                pagination={{
                    showSizeChanger: true,
                    showTotal: (total, range) => `Mostrando ${range[0]}-${range[1]} de ${total}`,
                    pageSizeOptions: ["10", "20", "50", "100", "250", "500", "1000"],
                    position: ["topRight", "bottomRight"],
                }}

            />
        </>
    )
})


export default DadosExcel;

