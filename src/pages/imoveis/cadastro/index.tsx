import React, { useState } from "react";
import BackTitle from "@/components/BackTitle";
import dynamic from "next/dynamic";
import { propertiesService } from "@/services/properties.service";

import { Button, Checkbox, Col, Form, Input, Row, Select } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';

const ReactQuill = dynamic(import('react-quill'), { ssr: false })

const ImovelCadastro = React.memo(function ImovelCadastro() {
    const [descricao, setDescricao] = useState<string>("");
    const [tipoImovel, setTipoImovel] = useState<string>("");
    const [imovelTitle, setImovelTitle] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [reference, setReference] = useState<string>("");
    const [siteTitle, setSiteTitle] = useState<string>("");
    const [formattedTitle, setFormattedTitle] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [neighborhood, setNeighborhood] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [garage, setGarage] = useState<string>("");
    const [rooms, setRooms] = useState<string>("");
    const [suites, setSuites] = useState<string>("");
    const [closets, setClosets] = useState<string>("");
    const [kitchen, setKitchen] = useState<string>("");
    const [diningRoom, setDiningRoom] = useState<string>("");
    const [livingRoom, setLivingRoom] = useState<string>("");
    const [serviceArea, setServiceArea] = useState<string>("");
    const [bathrooms, setBathrooms] = useState<string>("");
    const [visible, setVisible] = useState<boolean>(false);
    const [highlight, setHighlight] = useState<boolean>(false);
    const [transaction, setTransaction] = useState<string>("");

    const handleDescricaoChange = (value: string) => {
        setDescricao(value);
    };

    const submitForm = async (values: any) => {
        const data = {
            description: descricao,
            meta_title: imovelTitle,
            price,
            reference,
            title_formatted: siteTitle,
            url,
            address: `${neighborhood} - ${city}/${state}`,
            garage,
            rooms,
            suites,
            closets,
            kitchen,
            diningroom: diningRoom,
            livingroom: livingRoom,
            service_area: serviceArea,
            bathroom: bathrooms,
            transaction: transaction.toUpperCase(),
        };

        const images = values?.images?.fileList.map((item: any) => item.originFileObj)

        try {
            await propertiesService.create(data)
            .then(async (response) => {
                try {
                    for (let i = 0; i < images.length; i++) {
                    const formData = new FormData();

                        formData.append(
                            'image',
                            images[i],
                            images[i].name
                        )
                        await propertiesService.uploadImages(response.data.properties.id, formData)
                    }
                } catch (error) {
                    console.log(error)
                }
            })
            .catch((error) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)

        }
    }

    return (
        <div>
            <BackTitle 
                title="Cadastro de imóvel"
            />
            <div>
                <Form
                    layout="vertical"
                    onFinish={submitForm}
                >
                    <h2 className="font-bold text-lg text-orange-400">Informações do Imóvel</h2>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item
                            label="Titulo do imóvel"
                            name="titulo"
                            >
                                <Input
                                    placeholder="Titulo do imóvel"
                                    onChange={(e) => setImovelTitle(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Título do site" name="tituloSite">
                                <Input 
                                    placeholder="Título do site"
                                    onChange={(e) => setSiteTitle(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item label="Preço" name="preco">
                                <Input 
                                    placeholder="Preço"
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item label="Referência" name="referencia">
                                <Input 
                                    placeholder="Referência"
                                    onChange={(e) => setReference(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="URL" name="url">
                                <Input 
                                    placeholder="URL"
                                    onChange={(e) => setUrl(e.target.value)}    
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={4}>
                            <Form.Item label="Bairro" name="bairro">
                                <Input 
                                    placeholder="Bairro"
                                    onChange={(e) => setNeighborhood(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="Cidade" name="cidade">
                                <Input 
                                    placeholder="Cidade"
                                    onChange={(e) => setCity(e.target.value)}    
                                />
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item label="Estado" name="estado">
                                <Input 
                                    placeholder="Estado"
                                    onChange={(e) => setState(e.target.value)}    
                                />
                            </Form.Item>
                        </Col>
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
                        <Col span={4}>
                            <Form.Item label="Transação" name="transacao">
                                <button 
                                    onClick={() => setTransaction("venda")}
                                    type="button"
                                    className={transaction === "venda" ? "bg-orange-400 text-white font-bold py-2 px-4 rounded" : "bg-white text-orange-400 font-bold py-2 px-4 rounded"}
                                >
                                    Venda
                                </button>
                                <button 
                                    onClick={() => setTransaction("aluguel")}
                                    type="button"
                                    className={transaction === "aluguel" ? "bg-orange-400 text-white font-bold py-2 px-4 rounded" : "bg-white text-orange-400 font-bold py-2 px-4 rounded"}
                                >
                                    Aluguel
                                </button>
                            </Form.Item>
                        </Col>
                    </Row>
                    <h2 className="font-bold text-lg text-orange-400">Cômodos</h2>
                    <Row gutter={16}>
                    <Col span={2}>
                            <Form.Item label="Garagem" name="garagem">
                                <Input 
                                    type="number" 
                                    placeholder="Garagem" 
                                    onChange={(e) => setGarage(e.target.value)}                            
                                />
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item label="Quartos" name="quartos">
                                <Input 
                                    type="number" 
                                    placeholder="Quartos"
                                    onChange={(e) => setRooms(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item label="Suítes" name="suites">
                                <Input 
                                    type="number" 
                                    placeholder="Suítes"
                                    onChange={(e) => setSuites(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item label="Closets" name="closets">
                                <Input 
                                    type="number" 
                                    placeholder="Closets"
                                    onChange={(e) => setClosets(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item label="Cozinha" name="cozinha">
                                <Input 
                                    type="number" 
                                    placeholder="Cozinha"
                                    onChange={(e) => setKitchen(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item label="Sala de jantar" name="salaJantar">
                                <Input 
                                    type="number" 
                                    placeholder="Sala de jantar"
                                    onChange={(e) => setDiningRoom(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item label="Sala de estar" name="salaEstar">
                                <Input 
                                    type="number" 
                                    placeholder="Sala de estar"
                                    onChange={(e) => setLivingRoom(e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item label="Área de serviço" name="areaServico">
                                <Input 
                                    type="number" 
                                    placeholder="Área de serviço"
                                    onChange={(e) => setServiceArea(e.target.value)}    
                                />
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item label="Banheiros" name="banheiros">
                                <Input 
                                    type="number" 
                                    placeholder="Banheiros"
                                    onChange={(e) => setBathrooms(e.target.value)}    
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <h2 className="font-bold text-lg text-orange-400">Mais funcionalidades</h2>
                    <Row gutter={16}>
                        {/*CRIAR 2 CHECKBOX*/}
                        <Col span={5}>
                            <Form.Item label="Visível para todos?" name="visivel">
                                <Checkbox
                                    onChange={(e) => setVisible(e.target.checked)}
                                    checked={visible}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label="Destacar na pagina inicial?" name="destaque">
                                <Checkbox
                                    onChange={(e) => setHighlight(e.target.checked)}
                                    checked={highlight}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Clique ou arraste as imagens para o campo de Upload</p>
                    </Dragger> */}
                    <Form.Item name="images">
                        <Upload 
                            name="images" 
                            maxCount={30} 
                            accept="image/*"
                            multiple
                        >
                            <Button icon={<UploadOutlined />}>Carregar Imagens</Button>
                        </Upload>
                    </Form.Item>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="Descrição do imóvel">
                                <ReactQuill
                                    value={descricao}
                                    onChange={handleDescricaoChange}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <button type="submit" className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded">
                            Cadastrar
                        </button>
                    </Row>
                </Form>
            </div>
        </div>
    );
});

export default ImovelCadastro;