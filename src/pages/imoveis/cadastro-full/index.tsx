import React, { useCallback, useState } from "react";
import BackTitle from "@/components/BackTitle";
import dynamic from "next/dynamic";
import { propertiesService } from "@/services/properties.service";

import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import ApiCep from "cep-promise";

const ReactQuill = dynamic(import("react-quill"), { ssr: false });

interface Imovel {
  price: number | null;
  transaction: string | null;
  reference: string | null;
  status: string | null;
  garage: number | null;
  bathroom: number | null;
  bedroom: number | null;
  kitchen: number | null;
  dinning_room: number | null;
  living_room: number | null;
  service_area: number | null;
  tv_room: number | null;
  office: number | null;
  closet: number | null;
  suites: number | null;
  profile: string | null;
  situation: string | null;
  area_privative: number | null;
  area_privative_unit: string | null;
  area_built: number | null;
  area_built_unit: string | null;
  area_total: number | null;
  area_total_unit: string | null;
  area_terrain_total: number | null;
  area_terrain_total_unit: string | null;
  state: string | null;
  city: string | null;
  neighborhood: string | null;
  cep: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  iptu_type: string | null;
  description: string | null;
  title: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_website: boolean;
  published_network: boolean;
  show_neighborhood: boolean;
  show_street: boolean;
  show_condominium: boolean;
  show_price: boolean;
  watermark: boolean;
  stripe_color: string | null;
  broker_name: string | null;
  broker_email: string | null;
  broker_creci: string | null;
  broker_phone: string | null;
  condominium_name: string | null;
  condominium_total_units: number | null;
  condominium_units_per_floor: number | null;
  condominium_flooring: string | null;
  condominium_number_towers: number | null;
  condominium_caracteristics: string | null;
  nearby: string | null;
  highlight_website: boolean;
  written: boolean;
  accept_financing: boolean;
  type: string | null;
  subtype: string | null;
  images: string[];
  images_old_links: string[];
  owner_name: string | null;
  owner_id: string | null;
  owner_email: string | null;
  is_condominium: boolean;
  accept_goods: boolean | null;
  has_financing: boolean | null;
  balcony: boolean | null;
}

const ImovelCadastro = React.memo(function ImovelCadastro() {
  const [formState, setFormState] = useState<Imovel>({
    price: null,
    transaction: "aluguel",
    reference: null,
    status: null,
    garage: 0,
    bathroom: 0,
    bedroom: 0,
    kitchen: 0,
    dinning_room: 0,
    living_room: 0,
    service_area: 0,
    tv_room: 0,
    office: 0,
    closet: 0,
    suites: 0,
    profile: null,
    situation: null,
    area_privative: null,
    area_privative_unit: null,
    area_built: null,
    area_built_unit: null,
    area_total: null,
    area_total_unit: null,
    area_terrain_total: null,
    area_terrain_total_unit: null,
    state: null,
    city: null,
    neighborhood: null,
    cep: null,
    street: null,
    number: null,
    complement: null,
    iptu_type: null,
    description: null,
    title: null,
    meta_title: null,
    meta_description: null,
    published_website: false,
    published_network: false,
    show_neighborhood: false,
    show_street: false,
    show_condominium: false,
    show_price: false,
    watermark: false,
    stripe_color: null,
    broker_name: null,
    broker_email: null,
    broker_creci: null,
    broker_phone: null,
    condominium_name: null,
    condominium_total_units: null,
    condominium_units_per_floor: null,
    condominium_flooring: null,
    condominium_number_towers: null,
    condominium_caracteristics: null,
    nearby: null,
    highlight_website: false,
    written: false,
    accept_financing: false,
    type: null,
    subtype: null,
    images: [],
    images_old_links: [],
    owner_name: null,
    owner_id: null,
    owner_email: null,

    is_condominium: false,
    accept_goods: null,
    has_financing: null,
    balcony: null,
  });

  const [invalidOrRemovedImages, setInvalidOrRemovedImages] = useState<
    string[]
  >([]);
  const [images, setImages] = useState<
    Array<{ name: string; file: File | null }>
  >([]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((formState) => ({
        ...formState,
        [event.target.name]: event.target.value,
      }));
    },
    []
  );

  const handleSelectChange = useCallback((value: string, fieldName: string) => {
    setFormState((formState) => ({
      ...formState,
      [fieldName]: value,
    }));
  }, []);

  const handleCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((formState) => ({
        ...formState,
        [event.target.name]: event.target.checked,
      }));
    },
    []
  );

  const handleArrayChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((formState) => ({
        ...formState,
        [event.target.name]: event.target.value.split(","),
      }));
    },
    []
  );

  const handleDescricaoChange = useCallback((value: string) => {
    setFormState((formState: any) => ({
      ...formState,
      description: value,
    }));
  }, []);

  const submitForm = async (values: any) => {
    try {
      await propertiesService
        .create(formState)
        .then(async (response) => {
          try {
            for (const image of images) {
              const formData = new FormData();

              if (image.file) {
                formData.append("image", image.file, image.name);
                await propertiesService.uploadImages(
                  response.data.properties.id,
                  formData
                );
              }
            }
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  console.log('formState*********',formState);

  return (
    <div>
      <BackTitle title="Cadastro de Imóvel" />
      <div>
        <Form
          layout="vertical"
          onFinish={submitForm}
          fields={[
            {
              name: "title",
              value: formState.title,
            },
            {
              name: "meta_title",
              value: formState.meta_title,
            },
            {
              name: "price",
              value: formState.price,
            },
            {
              name: "reference",
              value: formState.reference,
            },
            {
              name: "cep",
              value: formState.cep,
            },
            {
              name: "street",
              value: formState.street,
            },
            {
              name: "neighborhood",
              value: formState.neighborhood,
            },
            {
              name: "city",
              value: formState.city,
            },
            {
              name: "state",
              value: formState.state,
            },
            {
              name: "complement",
              value: formState.complement,
            },
            {
              name: "type",
              value: formState.type,
            },
            {
              name: "subtype",
              value: formState.subtype,
            },
            {
              name: "nearby",
              value: formState.nearby,
            },
            {
              name: "transaction",
              value: formState.transaction,
            },
            {
              name: "accept_financing",
              value: formState.accept_financing,
            },
            {
              name: "written",
              value: formState.written,
            },
            {
              name: "watermark",
              value: formState.watermark,
            },
            {
              name: "images",
              value: formState.images,
            },
            {
              name: "owner_name",
              value: formState.owner_name,
            },
            {
              name: "owner_id",
              value: formState.owner_id,
            },
            {
              name: "owner_email",
              value: formState.owner_email,
            },
            {
              name: "profile",
              value: formState.profile,
            },
            {
              name: "status",
              value: formState.status,
            },
            {
              name: "garage",
              value: formState.garage,
            },
            {
              name: "bathroom",
              value: formState.bathroom,
            },
            {
              name: "bedroom",
              value: formState.bedroom,
            },
            {
              name: "kitchen",
              value: formState.kitchen,
            },
            {
              name: "dinning_room",
              value: formState.dinning_room,
            },
            {
              name: "living_room",
              value: formState.living_room,
            },
            {
              name: "suite",
              value: formState.suites,
            },
            {
              name: "area_built",
              value: formState.area_built,
            },
            {
              name: "area_built_unit",
              value: formState.area_built_unit,
            },
            {
              name: "area_total",
              value: formState.area_total,
            },
            {
              name: "area_total_unit",
              value: formState.area_total_unit,
            },
            {
              name: "area_privative",
              value: formState.area_privative,
            },
            {
              name: "area_privative_unit",
              value: formState.area_privative_unit,
            },
            {
              name: "area_terrain_total",
              value: formState.area_terrain_total,
            },
            {
              name: "area_terrain_total_unit",
              value: formState.area_terrain_total_unit,
            },
            {
              name: "condominium_name",
              value: formState.condominium_name,
            },
            {
              name: "condominium_flooring",
              value: formState.condominium_flooring,
            },
            {
              name: "condominium_number_towers",
              value: formState.condominium_number_towers,
            },
            {
              name: "condominium_total_units",
              value: formState.condominium_total_units,
            },
            {
              name: "condominium_units_per_floor",
              value: formState.condominium_units_per_floor,
            },
            {
              name: "condominium_caracteristics",
              value: formState.condominium_caracteristics,
            },
            {
              name: "highlight_website",
              value: formState.highlight_website,
            },
            {
              name: "description",
              value: formState.description,
            },
            {
              name: "meta_description",
              value: formState.meta_description,
            },
            {
              name: "published_website",
              value: formState.published_website,
            },
            {
              name: "published_network",
              value: formState.published_network,
            },
            {
              name: "show_neighborhood",
              value: formState.show_neighborhood,
            },
            {
              name: "show_street",
              value: formState.show_street,
            },
            {
              name: "show_condominium",
              value: formState.show_condominium,
            },
            {
              name: "show_price",
              value: formState.show_price,
            },
            {
              name: "stripe_color",
              value: formState.stripe_color,
            },
            {
              name: "broker_name",
              value: formState.broker_name,
            },
            {
              name: "broker_email",
              value: formState.broker_email,
            },
            {
              name: "broker_creci",
              value: formState.broker_creci,
            },
            {
              name: "broker_phone",
              value: formState.broker_phone,
            },
          ]}
        >
          <h2 className="font-bold text-lg text-orange-400">
            Informações do Imóvel
          </h2>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Titulo do imóvel" name="title">
                <Input
                  placeholder="Titulo do imóvel"
                  onChange={handleInputChange}
                  name="title"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Título do site" name="meta_title">
                <Input
                  placeholder="Título do site"
                  onChange={handleInputChange}
                  name="meta_title"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Preço" name="price">
                <Input
                  placeholder="Preço"
                  onChange={handleInputChange}
                  name="price"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Referência" name="reference">
                <Input
                  placeholder="Referência"
                  onChange={handleInputChange}
                  name="reference"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={8} xl={4}>
              <Form.Item label="CEP" name="cep">
                <Input
                  placeholder="Ex: 00000-000"
                  name="cep"
                  onBlur={async (event) => {
                    const cep = event.target.value;
                    await ApiCep(cep)
                      .then((response) => {
                        setFormState((formState: any) => ({
                          ...formState,
                          state: response.state,
                          city: response.city,
                          neighborhood: response.neighborhood,
                          street: response.street,
                          cep: response.cep,
                        }));
                      })
                      .catch((error) => {
                        notification.error({
                          message: "Erro",
                          description: error?.message,
                        });
                      });
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} xl={4}>
              <Form.Item label="Rua" name="street">
                <Input
                  placeholder="Ex: rua, avenida, etc"
                  onChange={handleInputChange}
                  name="street"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} xl={4}>
              <Form.Item label="Bairro" name="neighborhood">
                <Input
                  placeholder="Bairro"
                  onChange={handleInputChange}
                  name="neighborhood"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} xl={4}>
              <Form.Item label="Cidade" name="city">
                <Input
                  placeholder="Cidade"
                  onChange={handleInputChange}
                  name="city"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} xl={4}>
              <Form.Item label="Estado" name="state">
                <Input
                  placeholder="Estado"
                  onChange={handleInputChange}
                  name="state"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} xl={4}>
              <Form.Item label="Complemento" name="complement">
                <Input
                  placeholder="Complemento"
                  onChange={handleInputChange}
                  name="complement"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Tipo do imóvel" name="type">
                <Select
                  placeholder="Tipo do imóvel"
                  onChange={(value) => handleSelectChange(value, "type")}
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
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Subtipo do imóvel" name="subtype">
                <Select
                  placeholder="Subtipo do imóvel"
                  onChange={(value) => handleSelectChange(value, "subtype")}
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
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Proximidades" name="nearby">
                <Select
                  placeholder="Selecione ou Escreva"
                  onChange={(value) => handleSelectChange(value, "nearby")}
                  showSearch
                  allowClear
                  mode="tags"
                >
                  <Select.Option value="Academia">Academia</Select.Option>
                  <Select.Option value="Aeroporto">Aeroporto</Select.Option>
                  <Select.Option value="Banco">Banco</Select.Option>
                  <Select.Option value="Bosque">Bosque</Select.Option>
                  <Select.Option value="Casa Lotérica">
                    Casa Lotérica
                  </Select.Option>
                  <Select.Option value="Cinema">Cinema</Select.Option>
                  <Select.Option value="Creche">Creche</Select.Option>
                  <Select.Option value="Escola">Escola</Select.Option>
                  <Select.Option value="Faculdade">Faculdade</Select.Option>
                  <Select.Option value="Farmácia">Farmácia</Select.Option>
                  <Select.Option value="Feiras">Feiras</Select.Option>
                  <Select.Option value="Hospital">Hospital</Select.Option>
                  <Select.Option value="Igreja">Igreja</Select.Option>
                  <Select.Option value="Lago">Lago</Select.Option>
                  <Select.Option value="Lanchonete">Lanchonete</Select.Option>
                  <Select.Option value="Metrô">Metrô</Select.Option>
                  <Select.Option value="Padaria">Padaria</Select.Option>
                  <Select.Option value="Parque">Parque</Select.Option>
                  <Select.Option value="Praça">Praça</Select.Option>
                  <Select.Option value="Quadra de Esportes">
                    Quadra de Esportes
                  </Select.Option>
                  <Select.Option value="Restaurante">Restaurante</Select.Option>
                  <Select.Option value="Shopping">Shopping</Select.Option>
                  <Select.Option value="Supermercado">
                    Supermercado
                  </Select.Option>
                  <Select.Option value="Teatro">Teatro</Select.Option>
                  <Select.Option value="Universidade">
                    Universidade
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              {/* CAMPO PARA ESCOLHER UMA COR EM HEXADECIMAL */}
              <Form.Item label="Cor da faixa" name="stripe_color">
                <Input
                  type="color"
                  onChange={handleInputChange}
                  name="stripe_color"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Escriturado" name="written">
                <button
                  onClick={() => setFormState({ ...formState, written: true })}
                  type="button"
                  className={
                    formState.written === true
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Sim
                </button>
                <button
                  onClick={() => setFormState({ ...formState, written: false })}
                  type="button"
                  className={
                    formState.written === false
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Não
                </button>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Marca D'água" name="watermark">
                <button
                  onClick={() =>
                    setFormState({ ...formState, watermark: true })
                  }
                  type="button"
                  className={
                    formState.watermark === true
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Sim
                </button>
                <button
                  onClick={() =>
                    setFormState({ ...formState, watermark: false })
                  }
                  type="button"
                  className={
                    formState.watermark === false
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Não
                </button>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Transação" name="transaction">
                <button
                  onClick={() =>
                    setFormState({ ...formState, transaction: "venda" })
                  }
                  type="button"
                  className={
                    formState.transaction === "venda"
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Venda
                </button>
                <button
                  onClick={() =>
                    setFormState({ ...formState, transaction: "aluguel" })
                  }
                  type="button"
                  className={
                    formState.transaction === "aluguel"
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Aluguel
                </button>
              </Form.Item>
            </Col>
          </Row>
          {formState.transaction === 'venda' && (
            <>
              <h2 className="font-bold text-lg text-orange-400">Informações adicionais para Venda</h2>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Condições da Venda" name="sales_conditions">
                    <Input
                      placeholder="Quais as condições da venda?"
                      onChange={handleInputChange}
                      name="sales_conditions"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item
                    label="Aceita Bens na Negociação?"
                    name="accept_goods"
                  >
                    <button
                      onClick={() =>
                        setFormState({ ...formState, accept_goods: true })
                      }
                      type="button"
                      className={
                        formState.accept_goods === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() =>
                        setFormState({ ...formState, accept_goods: false })
                      }
                      type="button"
                      className={
                        formState.accept_goods === false
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Não
                    </button>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item
                    label="Tem Financiamento?"
                    name="has_financing"
                  >
                    <button
                      onClick={() =>
                        setFormState({ ...formState, has_financing: true })
                      }
                      type="button"
                      className={
                        formState.has_financing === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() =>
                        setFormState({ ...formState, has_financing: false })
                      }
                      type="button"
                      className={
                        formState.has_financing === false
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Não
                    </button>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Aceita Financiamento" name="accept_financing">
                    <button
                      onClick={() =>
                        setFormState({ ...formState, accept_financing: true })
                      }
                      type="button"
                      className={
                        formState.accept_financing === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() =>
                        setFormState({ ...formState, accept_financing: false })
                      }
                      type="button"
                      className={
                        formState.accept_financing === false
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Não
                    </button>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="É Condominio?" name="is_condominium">
                <button
                  onClick={() =>
                    setFormState({ ...formState, is_condominium: true })
                  }
                  type="button"
                  className={
                    formState.is_condominium === true
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Sim
                </button>
                <button
                  onClick={() =>
                    setFormState({ ...formState, is_condominium: false })
                  }
                  type="button"
                  className={
                    formState.is_condominium === false
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Não
                </button>
              </Form.Item>
            </Col>
          </Row>
          {formState.is_condominium && (
            <>
              <h2 className="font-bold text-lg text-orange-400">Condominio</h2>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Nome do condomínio" name="condominium_name">
                    <Input
                      placeholder="Nome do condomínio"
                      onChange={handleInputChange}
                      name="condominium_name"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item
                    label="Total de unidades"
                    name="condominium_total_units"
                  >
                    <Input
                      type="number"
                      placeholder="Total de unidades"
                      onChange={handleInputChange}
                      name="condominium_total_units"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item
                    label="Unidades por andar"
                    name="condominium_units_per_floor"
                  >
                    <Input
                      type="number"
                      placeholder="Unidades por andar"
                      onChange={handleInputChange}
                      name="condominium_units_per_floor"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Pavimentação" name="condominium_flooring">
                    <Input
                      type="number"
                      placeholder="Pavimentação"
                      onChange={handleInputChange}
                      name="condominium_flooring"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item
                    label="Número de torres"
                    name="condominium_number_towers"
                  >
                    <Input
                      type="number"
                      placeholder="Número de torres"
                      onChange={handleInputChange}
                      name="condominium_number_towers"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item
                    label="Características"
                    name="condominium_caracteristics"
                  >
                    <Input
                      placeholder="Características"
                      onChange={handleInputChange}
                      name="condominium_caracteristics"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          <h2 className="font-bold text-lg text-orange-400">Cômodos</h2>
          <Row gutter={16}>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Garagem" name="garage">
                <Input
                  type="number"
                  placeholder="Garagem"
                  onChange={handleInputChange}
                  name="garage"
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Quartos" name="bedroom">
                <Input
                  type="number"
                  placeholder="Quartos"
                  onChange={handleInputChange}
                  name="bedroom"
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Suítes" name="suites">
                <Input
                  type="number"
                  placeholder="Suítes"
                  onChange={handleInputChange}
                  name="suites"
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Closets" name="closet">
                <Input
                  type="number"
                  placeholder="Closets"
                  onChange={handleInputChange}
                  name="closet"
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Cozinha" name="kitchen">
                <Input
                  type="number"
                  placeholder="Cozinha"
                  onChange={handleInputChange}
                  name="kitchen"
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Sala de jantar" name="dinning_room">
                <Input
                  type="number"
                  placeholder="Sala de jantar"
                  onChange={handleInputChange}
                  name="dinning_room"
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Sala de estar" name="living_room">
                <Input
                  type="number"
                  placeholder="Sala de estar"
                  onChange={handleInputChange}
                  name="living_room"
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Área de serviço" name="service_area">
                <Input
                  type="number"
                  placeholder="Área de serviço"
                  onChange={handleInputChange}
                  name="service_area"
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Banheiros" name="bathroom">
                <Input
                  type="number"
                  placeholder="Banheiros"
                  onChange={handleInputChange}
                  name="bathroom"
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Escritórios" name="office">
                <Input
                  type="number"
                  placeholder="Escritórios"
                  onChange={handleInputChange}
                  name="office"
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Sala de TV" name="tv_room">
                <Input
                  type="number"
                  placeholder="Sala de TV"
                  onChange={handleInputChange}
                  name="tv_room"
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Varanda" name="balcony">
                <button
                  onClick={() =>
                    setFormState({ ...formState, balcony: true })
                  }
                  type="button"
                  className={
                    formState.balcony === true
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Sim
                </button>
                <button
                  onClick={() =>
                    setFormState({ ...formState, balcony: false })
                  }
                  type="button"
                  className={
                    formState.balcony === false
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Não
                </button>
              </Form.Item>
            </Col>
          </Row>
          <h2 className="font-bold text-lg text-orange-400">Situação</h2>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Perfil do Imóvel" name="profile">
                <Input
                  placeholder="Sala de TV"
                  onChange={handleInputChange}
                  name="profile"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Situação" name="situation">
                <Select
                  placeholder="Situação"
                  onChange={(value) => handleSelectChange(value, "situation")}
                  showSearch
                  allowClear
                  options={[
                    { label: "Novo", value: "Novo" },
                    { label: "Usado", value: "Usado" },
                    { label: "Em construção", value: "Em construção" },
                    {
                      label: "Pronto para construir",
                      value: "Pronto para construir",
                    },
                    { label: "Pronto para morar", value: "Pronto para morar" },
                    { label: "Área de Plantio", value: "Área de Plantio" },
                    { label: "Indefinido", value: "Indefinido" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Tipo de IPTU" name="iptu_type">
                <Select
                  placeholder="Tipo de IPTU"
                  onChange={(value) => handleSelectChange(value, "iptu_type")}
                  showSearch
                  allowClear
                  options={[
                    { label: "Nenhum", value: null },
                    { label: "Anual", value: "anual" },
                    { label: "Mensal", value: "mensal" },
                    { label: "Trimestral", value: "trimestral" },
                    { label: "Semestral", value: "semestral" },
                    { label: "Indefinido", value: "indefinido" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <h2 className="font-bold text-lg text-orange-400">Área do Imóvel</h2>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} xl={4}>
              <Form.Item label="Área privativa" name="area_privative">
                <Input
                  type="number"
                  placeholder="Área privativa"
                  onChange={handleInputChange}
                  name="area_privative"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={4}>
              <Form.Item label="Unidade" name="area_privative_unit">
                <Select
                  placeholder="Unidade"
                  onChange={(value) =>
                    handleSelectChange(value, "area_privative_unit")
                  }
                  showSearch
                  allowClear
                  options={[
                    { label: "m²", value: "m²" },
                    { label: "ha", value: "ha" },
                    { label: "km²", value: "km²" },
                    { label: "ac", value: "ac" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={4}>
              <Form.Item label="Área construída" name="area_built">
                <Input
                  type="number"
                  placeholder="Área construída"
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={4}>
              <Form.Item label="Unidade" name="area_built_unit">
                <Select
                  placeholder="Unidade"
                  onChange={(value) =>
                    handleSelectChange(value, "area_built_unit")
                  }
                  showSearch
                  allowClear
                  options={[
                    { label: "m²", value: "m²" },
                    { label: "ha", value: "ha" },
                    { label: "km²", value: "km²" },
                    { label: "ac", value: "ac" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={4}>
              <Form.Item label="Área total" name="area_total">
                <Input
                  type="number"
                  placeholder="Área total"
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={4}>
              <Form.Item label="Unidade" name="area_total_unit">
                <Select
                  placeholder="Unidade"
                  onChange={(value) =>
                    handleSelectChange(value, "area_total_unit")
                  }
                  showSearch
                  allowClear
                  options={[
                    { label: "m²", value: "m²" },
                    { label: "ha", value: "ha" },
                    { label: "km²", value: "km²" },
                    { label: "ac", value: "ac" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={4}>
              <Form.Item label="Área do terreno" name="area_terrain_total">
                <Input
                  type="number"
                  placeholder="Área do terreno"
                  onChange={handleInputChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={4}>
              <Form.Item label="Unidade" name="area_terrain_total_unit">
                <Select
                  placeholder="Unidade"
                  onChange={(value) =>
                    handleSelectChange(value, "area_terrain_total_unit")
                  }
                  showSearch
                  allowClear
                  options={[
                    { label: "m²", value: "m²" },
                    { label: "ha", value: "ha" },
                    { label: "km²", value: "km²" },
                    { label: "ac", value: "ac" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <h2 className="font-bold text-lg text-orange-400">
            Visibilidade e Destaque
          </h2>
          <Row gutter={16}>
            {/*CRIAR 2 CHECKBOX*/}
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Visível para todos?" name="visivel">
                <button
                  onClick={() =>
                    setFormState({ ...formState, published_website: true })
                  }
                  type="button"
                  className={
                    formState.published_website === true
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Sim
                </button>
                <button
                  onClick={() =>
                    setFormState({ ...formState, published_website: false })
                  }
                  type="button"
                  className={
                    formState.published_website === false
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Não
                </button>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Destacar na pagina inicial?" name="destaque">
                <button
                  onClick={() =>
                    setFormState({ ...formState, highlight_website: true })
                  }
                  type="button"
                  className={
                    formState.highlight_website === true
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Sim
                </button>
                <button
                  onClick={() =>
                    setFormState({ ...formState, highlight_website: false })
                  }
                  type="button"
                  className={
                    formState.highlight_website === false
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Não
                </button>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Publicar na Rede" name="published_network">
                <button
                  onClick={() =>
                    setFormState({ ...formState, published_network: true })
                  }
                  type="button"
                  className={
                    formState.published_network === true
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Sim
                </button>
                <button
                  onClick={() =>
                    setFormState({ ...formState, published_network: false })
                  }
                  type="button"
                  className={
                    formState.published_network === false
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Não
                </button>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Mostrar Bairro" name="show_neighborhood">
                <button
                  onClick={() =>
                    setFormState({ ...formState, show_neighborhood: true })
                  }
                  type="button"
                  className={
                    formState.show_neighborhood === true
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Sim
                </button>
                <button
                  onClick={() =>
                    setFormState({ ...formState, show_neighborhood: false })
                  }
                  type="button"
                  className={
                    formState.show_neighborhood === false
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Não
                </button>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Mostrar Rua" name="show_street">
                <button
                  onClick={() =>
                    setFormState({ ...formState, show_street: true })
                  }
                  type="button"
                  className={
                    formState.show_street === true
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Sim
                </button>
                <button
                  onClick={() =>
                    setFormState({ ...formState, show_street: false })
                  }
                  type="button"
                  className={
                    formState.show_street === false
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Não
                </button>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Mostrar Condominio" name="show_condominium">
                <button
                  onClick={() =>
                    setFormState({ ...formState, show_condominium: true })
                  }
                  type="button"
                  className={
                    formState.show_condominium === true
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Sim
                </button>
                <button
                  onClick={() =>
                    setFormState({ ...formState, show_condominium: false })
                  }
                  type="button"
                  className={
                    formState.show_condominium === false
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Não
                </button>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Mostrar Preço" name="show_price">
                <button
                  onClick={() =>
                    setFormState({ ...formState, show_price: true })
                  }
                  type="button"
                  className={
                    formState.show_price === true
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Sim
                </button>
                <button
                  onClick={() =>
                    setFormState({ ...formState, show_price: false })
                  }
                  type="button"
                  className={
                    formState.show_price === false
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Não
                </button>
              </Form.Item>
            </Col>
          </Row>
          <h2 className="font-bold text-lg text-orange-400">Corretor</h2>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Nome" name="broker_name">
                <Input
                  placeholder="Nome"
                  onChange={handleInputChange}
                  name="broker_name"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="CRECI" name="broker_creci">
                <Input
                  placeholder="CRECI"
                  onChange={handleInputChange}
                  name="broker_creci"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="E-mail" name="broker_email">
                <Input
                  placeholder="E-mail"
                  onChange={handleInputChange}
                  name="broker_email"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Telefone" name="broker_phone">
                <Input
                  placeholder="Telefone"
                  onChange={handleInputChange}
                  name="broker_phone"
                />
              </Form.Item>
            </Col>
          </Row>
          <h2 className="font-bold text-lg text-orange-400">Proprietário</h2>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Nome" name="owner_name">
                <Input
                  placeholder="Nome"
                  onChange={handleInputChange}
                  name="owner_name"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="E-mail" name="owner_email">
                <Input
                  placeholder="E-mail"
                  onChange={handleInputChange}
                  name="owner_email"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="images">
            <Upload
              name="images"
              maxCount={30}
              accept="image/*"
              multiple
              onChange={({ file, fileList }) => {
                setImages((images) => {
                  const imageExists = images.some(
                    (image) => image.name === file.name
                  );
                  const isInvalidOrRemoved = invalidOrRemovedImages.includes(
                    file.name
                  );
                  const isRemoved = fileList.every(
                    (listFile) => listFile.name !== file.name
                  );

                  if (!imageExists && !isInvalidOrRemoved && !isRemoved) {
                    return [
                      ...images,
                      {
                        name: file.name,
                        file: file.originFileObj || null,
                      },
                    ];
                  }

                  return images;
                });
              }}
              onRemove={(file) => {
                setImages((images) => {
                  const newImages = images.filter(
                    (image) => image.name !== file.name
                  );
                  setInvalidOrRemovedImages((invalidOrRemovedImages) => [
                    ...invalidOrRemovedImages,
                    file.name,
                  ]);

                  return newImages;
                });
              }}
            >
              <Button icon={<UploadOutlined />}>Carregar Imagens</Button>
            </Upload>
          </Form.Item>
          <Row>
            <Col span={24}>
              <Form.Item label="Descrição do imóvel">
                <ReactQuill
                  value={formState?.description ?? ""}
                  onChange={handleDescricaoChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <button
              type="submit"
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded"
            >
              Cadastrar
            </button>
          </Row>
        </Form>
      </div>
    </div>
  );
});

export default ImovelCadastro;
