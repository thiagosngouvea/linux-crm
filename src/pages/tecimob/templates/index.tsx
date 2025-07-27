import React, { useState } from "react";
import {
  Button,
  Input,
  Card,
  Typography,
  Row,
  Col,
  Modal,
  Space,
  Divider,
  Select,
  Switch,
} from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { tecimobService } from "../../../services/tecimob.service";
import type { UploadFile } from "antd/es/upload/interface";
import html2canvas from "html2canvas";
import { parse } from "cookie";
import Cookies from "js-cookie";
import Logo from "../../../assets/logo.png";
import { IoIosBed } from "react-icons/io";
import { BiSolidCarGarage } from "react-icons/bi";
import { TbSquareRoundedNumber1 } from "react-icons/tb";
import { FaBath } from "react-icons/fa6";
import { BiCloset } from "react-icons/bi";
import { FaKitchenSet } from "react-icons/fa6";
import { TbRulerMeasure } from "react-icons/tb";
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

const { Title, Text } = Typography;
const { Option } = Select;

interface TemplateData {
  transaction: string | number;
  calculated_price: string;
  title: string;
  rooms: any;
  backgroundImage: string;
  firstImage: string;
  secondImage: string;
  thirdImage: string;
  reference: string;
  show_rooms?: boolean; // Adicionar esta propriedade
}

interface ImovelImage {
    updated_at: string;
    created_at: string;
    id: string;
    gallery: number;
    caption: string | null;
    order: number;
    property_id: string;
    file_url: {
      large: string;
      medium: string;
    };
    is_external: boolean;
  }

  interface ImovelArea {
    name: string;
    title: string;
    value: string;
    measure: string;
  }

  interface ImovelRoomExtra {
    is_covered?: {
      name: string;
      title: string;
      value: boolean;
    };
    [key: string]: any;
  }

  interface ImovelRoom {
    name: string;
    title: string;
    value: string;
    title_formated: string;
    extra?: ImovelRoomExtra;
  }

  interface ImovelRooms {
    [key: string]: ImovelRoom;
  }

  interface ImovelAreas {
    [key: string]: ImovelArea;
  }

  interface ImovelPricesPerArea {
    [key: string]: {
      title: string;
      price: string;
    };
  }

  interface ImovelCountry {
    updated_at: string;
    created_at: string;
    id: string;
    name: string;
  }

  interface ImovelState {
    updated_at: string;
    created_at: string;
    id: string;
    name: string;
    acronym: string;
    country_id: string;
  }

  interface ImovelCity {
    updated_at: string;
    created_at: string;
    id: string;
    name: string;
    real_estate_id: string | null;
    state_id: string;
    state: ImovelState;
  }

  interface ImovelNeighborhood {
    updated_at: string;
    created_at: string;
    id: string;
    name: string;
    city_id: string;
    real_estate_id: string | null;
    city: ImovelCity;
    state: ImovelState;
    country: ImovelCountry;
  }

  interface ImovelRealEstate {
    updated_at: string;
    created_at: string;
    id: string;
    blocked: boolean;
    name: string;
    contact_email: string;
    neighborhood_id: string;
    address_cep: string;
    address_street: string;
    address_number: string;
    address_complement: string;
    social_medias: {
      instagram?: string;
      facebook?: string;
      [key: string]: string | undefined;
    };
    has_coordinates: boolean;
    file_url: string;
    header_background: string;
    header_type: string;
    maps_latitude: string;
    maps_longitude: string;
    is_address_shown: boolean;
    type: string;
    cpf_cnpj: string;
    serial: number;
    resale_id: string;
    is_paying: boolean;
    mailboxes_count: number;
    redirect_mails_count: number;
    users_count: number;
    with_grouped_condos: boolean;
    with_guru: boolean;
    with_guru_portal: boolean;
    recurring_charge: boolean;
    plan: number;
    receiving_method: string | null;
    has_installment: boolean;
    can_use_financial: boolean;
    financial_user_id: string;
    has_free_days: boolean;
  }

  interface ImovelTypeRoomField {
    name: string;
    title: string;
    is_default: boolean;
    extra?: Array<{
      name: string;
      title: string;
    }>;
  }

  interface ImovelTypeInformationField {
    name: string;
    title: string;
  }

  interface ImovelTypeAreaField {
    name: string;
    title: string;
    measures: string[];
    is_primary: boolean;
  }

  interface ImovelType {
    updated_at: string;
    created_at: string;
    id: string;
    title: string;
    primary_area: string;
    rooms_fields: ImovelTypeRoomField[];
    information_fields: ImovelTypeInformationField[];
    area_fields: ImovelTypeAreaField[];
  }

  interface ImovelSubtype {
    updated_at: string;
    created_at: string;
    id: string;
    title: string;
    type: ImovelType;
  }

  interface ImovelSituation {
    updated_at: string;
    created_at: string;
    id: string;
    title: string;
    order: number;
  }

  interface Imovel {
    updated_at: string;
    created_at: string;
    id: string;
    calculated_price: string;
    previous_price: string | null;
    condominium_price: string | null;
    taxes_price: string | null;
    territorial_tax_price: string | null;
    territorial_tax_type: string | null;
    total_price: string;
    transaction: number;
    reference: string;
    profile: number;
    situation_id: string;
    land_type: string | null;
    near_sea: boolean | null;
    solar_position_id: string | null;
    is_property_titled: boolean;
    is_deeded: boolean;
    is_corner: boolean;
    is_on_network: boolean;
    is_season_available: boolean;
    primary_area: ImovelArea;
    areas: ImovelAreas;
    rooms: ImovelRooms;
    prices_per_area: ImovelPricesPerArea;
    is_financeable_mcmv: boolean | null;
    has_finance: boolean;
    is_financeable: boolean;
    taxes_description: string | null;
    tour_360: string | null;
    send_summary_every: string | null;
    meta_title: string;
    meta_description: string;
    custom_url: string | null;
    description: string;
    title_formatted: string;
    max_people: number | null;
    real_estate_id: string;
    network_type: string;
    can_send_summary: boolean;
    delivery_forecast: string | null;
    lifetime: string | null;
    is_exchangeable: boolean;
    exchange_note: string | null;
    exchange_max_price: string | null;
    incorporation: string | null;
    video_embed_url: string | null;
    zone_id: string | null;
    status: string;
    site_link: string;
    is_grouped_condo: boolean;
    active: boolean;
    has_furniture: boolean;
    created_on_site: boolean;
    warranties: string | null;
    formatted_condo_position: string | null;
    matriculation: string | null;
    informations: Record<string, any>;
    address_formatted: string;
    zip_code: string | null;
    street_address: string;
    street_number: string;
    complement_address: string | null;
    maps_latitude: string | null;
    maps_longitude: string | null;
    maps_heading: string | null;
    maps_pitch: string | null;
    maps_zoom: number;
    maps_street_zoom: number | null;
    video: string | null;
    occupation_note: string;
    furniture_note: string;
    private_note: string;
    negotiation_note: string | null;
    is_published: boolean;
    is_home_published: boolean | null;
    is_network_published: boolean;
    is_neighborhood_shown: boolean;
    is_street_shown: boolean;
    is_complement_shown: boolean;
    is_street_number_shown: boolean;
    is_exact_map_shown: boolean;
    is_map_shown: boolean;
    is_streetview_shown: boolean;
    is_floor_shown: boolean;
    is_apartment_number_shown: boolean;
    is_commission_combined: boolean;
    is_keys_ready: boolean;
    is_condominium_shown: boolean;
    is_applying_watermark: boolean;
    has_owner_authorization: boolean;
    has_sale_card: boolean;
    should_apply_watermark: boolean;
    price_financial_index_id: string;
    subtype_id: string;
    user_id: string;
    people_id: string;
    condominium_id: string;
    neighborhood_id: string;
    exclusive_until: string | null;
    is_exclusive: boolean;
    is_featured: boolean;
    is_exclusivity_expired: boolean;
    is_renovation_expired: boolean;
    next_review_at: string | null;
    last_review_at: string | null;
    network_property_url: string | null;
    keys_location: string | null;
    price: string;
    static_street_view_url: string | null;
    stripe_text: string | null;
    stripe_background: string;
    is_draft: boolean;
    is_blocked: boolean;
    is_price_shown: boolean;
    price_alternative_text: string | null;
    title: string;
    itr: string | null;
    country: ImovelCountry;
    state: ImovelState;
    city: ImovelCity;
    real_estate: ImovelRealEstate;
    type: ImovelType;
    neighborhood: ImovelNeighborhood;
    permissions: string[];
    situation: ImovelSituation;
    subtype: ImovelSubtype;
    images: ImovelImage[];
  }


// Dimensões recomendadas para status do WhatsApp: 1080x1920 (9:16)
const WHATSAPP_STATUS_WIDTH = 1080;
const WHATSAPP_STATUS_HEIGHT = 1920;

function Templates({ token }: { token: string }) {
  const [templateData, setTemplateData] = useState<TemplateData>({
    transaction: 0,
    title: "",
    rooms: {},
    backgroundImage: "",
    firstImage: "",
    secondImage: "",
    thirdImage: "",
    reference: "",
    calculated_price: "",
    show_rooms: true,
  });

  const [showEditForm, setShowEditForm] = useState(false);
  const [reference, setReference] = useState<string>("");
  const [imovel, setImovel] = useState<any>({});
  const [originalRooms, setOriginalRooms] = useState<any>(null);

  const [modalLogin, setModalLogin] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [messageLogin, setMessageLogin] = useState('');

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

  const handleInputChange = (name: string, value: string | boolean | any) => { // Aceitar mais tipos
    setTemplateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (imageUrl: string, imageType: 'backgroundImage' | 'firstImage' | 'secondImage' | 'thirdImage') => {
    setTemplateData(prev => ({
      ...prev,
      [imageType]: imageUrl
    }));
  };

  const downloadTemplate = async () => {
    const templateElement = document.getElementById('template-content');
  
    if (!templateElement) {
      console.error('Elemento do template não encontrado');
      return;
    }
  
    const width = 1080;
    const height = 1920;
  
    toPng(templateElement, {
      width,
      height,
      pixelRatio: 2, // Maior qualidade
      cacheBust: true,
      backgroundColor: '#ffffff',
      style: {
        transform: 'none',
        position: 'relative',
        top: '0',
        left: '0',
      },
    })
      .then((dataUrl) => {
        saveAs(dataUrl, 'template.png');
      })
      .catch((err) => {
        console.error('Erro ao exportar imagem:', err);
      });
  };

  const handleSearch = async () => {
    await tecimobService
      .getImovelByReference(token, reference)
      .then(async (res) => {
        await tecimobService
          .getUniqueImovel(token, res.data.data[0].id)
          .then((res) => {
            console.log(res.data.data);
            setImovel(res.data.data);
            
            const fullRooms = {
                bathroom: {
                    title_formated: res?.data?.data?.rooms?.bathroom?.title_formated,
                    icon: <FaBath size={64}/>,
                    priority: 6,
                    value: res?.data?.data?.rooms?.bathroom?.value
                },
                bedroom: {
                    title_formated: `${res?.data?.data?.rooms?.bedroom?.value} ${res?.data?.data?.rooms?.bedroom?.value > 1 ? ' QUARTOS' : ' QUARTO'} `,
                    icon: <IoIosBed size={64} />,
                    priority: 1,
                    value: res?.data?.data?.rooms?.bedroom?.value
                },
                closet: {
                    title_formated: res?.data?.data?.rooms?.closet?.title_formated,
                    icon: <BiCloset size={64}/>,
                    priority: 7,
                    value: res?.data?.data?.rooms?.closet?.value
                },
                garage: {
                    title_formated: `${res?.data?.data?.rooms?.garage?.value} ${res?.data?.data?.rooms?.garage?.value > 1 ? ' VAGAS' : ' VAGA'} `,
                    icon: <BiSolidCarGarage size={64}/>,
                    priority: 2,
                    value: res?.data?.data?.rooms?.garage?.value
                },
                dinningroom: {
                    title_formated: res?.data?.data?.rooms?.dinningroom?.title_formated,
                    icon: <FaKitchenSet size={64}/>,
                    priority: 5,
                    value: res?.data?.data?.rooms?.dinningroom?.value
                },
                kitchen: {
                    title_formated: res?.data?.data?.rooms?.kitchen?.title_formated,
                    icon: <FaKitchenSet size={64}/>,
                    priority: 4,
                    value: res?.data?.data?.rooms?.kitchen?.value
                },
                suite: {
                    title_formated: res?.data?.data?.rooms?.suite?.title_formated,
                    value: res?.data?.data?.rooms?.suite?.value
                },
                primary_area: {
                    title_formated: res?.data?.data?.primary_area?.value?.replace(',00', '') + res?.data?.data?.primary_area?.measure,
                    icon: <TbRulerMeasure size={64} />,
                    priority: 3,
                    value: res?.data?.data?.primary_area?.value,
                    measure: res?.data?.data?.primary_area?.measure
                },
            };

            // Guardar os cômodos originais
            setOriginalRooms(fullRooms);
            
            setTemplateData({
                transaction: res.data.data.transaction,
                title: (() => {
                  let title = res.data.data.title || "";
                  if (title.includes(" p/ ")) {
                    return title.split(" p/ ")[0].trim();
                  }
                  if (title.includes(" à Venda")) {
                    return title.split(" à Venda")[0].trim();
                  }
                  return title;
                })(),
                rooms: fullRooms,
                reference: res.data.data.reference,
                backgroundImage: res.data.data.images[0]?.file_url?.large || "",
                firstImage: res.data.data.images[2]?.file_url?.large || "",
                secondImage: res.data.data.images[3]?.file_url?.large || "",
                thirdImage: res.data.data.images[4]?.file_url?.large || "",
                calculated_price: res.data.data.calculated_price,
                show_rooms: true,
            });
            setShowEditForm(true);
          });
      });
  };

  return (
    <div style={{ padding: 24 }}>
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
      <Row gutter={24}>
        {/* Formulário de Busca */}
        <Col xs={24} md={12}>
          <Card title="Buscar Imóvel">
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Input
                placeholder="Referência"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
              <Button type="primary" onClick={handleSearch}>
                Buscar
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Formulário de Edição */}
        {showEditForm && (
          <Col xs={24} md={24} style={{ marginTop: 24 }}>
            <Card title="Editar Template">
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <div>
                  <Text strong>Título</Text>
                  <Input
                    value={templateData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Título do imóvel"
                  />
                </div>

                <div>
                  <Text strong>Referência</Text>
                  <Input
                    value={templateData.reference}
                    onChange={(e) => handleInputChange('reference', e.target.value)}
                    placeholder="Referência do imóvel"
                  />
                </div>

                <div>
                    <Text strong>Tipo de Transação</Text>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Selecione o tipo de transação"
                        value={templateData.transaction}
                        onChange={(value) => handleInputChange('transaction', value.toString())}
                    >
                        <Option value={'1'}>Venda</Option>
                        <Option value={'2'}>Aluguel</Option>
                    </Select>
                </div>

                <div>
                    <Text strong>Valor</Text>
                    <Input
                        value={templateData.calculated_price}
                        onChange={(e) => handleInputChange('calculated_price', e.target.value)}
                        placeholder="Valor do imóvel"
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Text strong>Mostrar Cômodos</Text>
                    <Switch
                        checked={!!templateData.show_rooms}
                        checkedChildren="Sim"
                        unCheckedChildren="Não"
                        style={{ 
                            backgroundColor: "#ff9100",
                            borderColor: "#ff9100",
                            color: "#fff",
                            borderRadius: 16,
                            width: 100,
                            fontSize: 16,
                            fontWeight: 600,
                         }}
                        onChange={(checked) => {
                            if (!checked) {
                                // Desabilitar: remove tudo de rooms e deixa só primary_area
                                const primaryArea = templateData.rooms?.primary_area
                                    ? { primary_area: templateData.rooms.primary_area }
                                    : {};
                                handleInputChange('rooms', primaryArea);
                                handleInputChange('show_rooms', false);
                            } else {
                                // Habilitar: coloca de volta os cômodos originais (se possível)
                                if (originalRooms) {
                                    handleInputChange('rooms', originalRooms);
                                }
                                handleInputChange('show_rooms', true);
                            }
                        }}
                    />
                </div>

                <Divider>Imagens</Divider>

                <div>
                  <Text strong>Imagem de Fundo</Text>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Selecione a imagem de fundo"
                    value={templateData.backgroundImage}
                    onChange={(value) => handleImageSelect(value, 'backgroundImage')}
                  >
                    {imovel?.images?.map((img: ImovelImage) => (
                      <Option key={img.id} value={img.file_url.large}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img 
                            src={img.file_url.medium} 
                            alt="" 
                            style={{ width: 40, height: 40, objectFit: 'cover' }}
                          />
                          <span>Imagem {imovel.images.indexOf(img) + 1}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Text strong>Primeira Imagem</Text>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Selecione a primeira imagem"
                    value={templateData.firstImage}
                    onChange={(value) => handleImageSelect(value, 'firstImage')}
                    allowClear
                  >
                    {imovel?.images?.map((img: ImovelImage) => (
                      <Option key={img.id} value={img.file_url.large}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img 
                            src={img.file_url.medium} 
                            alt="" 
                            style={{ width: 40, height: 40, objectFit: 'cover' }}
                          />
                          <span>Imagem {imovel.images.indexOf(img) + 1}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Text strong>Segunda Imagem</Text>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Selecione a segunda imagem"
                    value={templateData.secondImage}
                    onChange={(value) => handleImageSelect(value, 'secondImage')}
                    allowClear
                  >
                    {imovel?.images?.map((img: ImovelImage) => (
                      <Option key={img.id} value={img.file_url.large}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img 
                            src={img.file_url.medium} 
                            alt="" 
                            style={{ width: 40, height: 40, objectFit: 'cover' }}
                          />
                          <span>Imagem {imovel.images.indexOf(img) + 1}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Text strong>Terceira Imagem</Text>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Selecione a terceira imagem"
                    value={templateData.thirdImage}
                    onChange={(value) => handleImageSelect(value, 'thirdImage')}
                    allowClear
                  >
                    {imovel?.images?.map((img: ImovelImage) => (
                      <Option key={img.id} value={img.file_url.large}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img 
                            src={img.file_url.medium} 
                            alt="" 
                            style={{ width: 40, height: 40, objectFit: 'cover' }}
                          />
                          <span>Imagem {imovel.images.indexOf(img) + 1}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </div>
              </Space>
            </Card>
          </Col>
        )}

        {/* Preview */}
        <Col xs={24} md={24} style={{ marginTop: 24 }}>
          <Card>
            {/* Miniatura responsiva do template 1080x1920 (9:16) */}
            <div
              id="template-preview"
              style={{
                padding: 0,
                backgroundColor: "#fff",
                width: "100%",
                maxWidth: 360, // miniatura na tela (360/1080 = 0.333)
                aspectRatio: "9/16",
                minWidth: 200,
                margin: "0 auto",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
                className="z-10"
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "5%",
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.00) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "5%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.00) 100%)",
                  }}
                />
              </div>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  background: "#eee",
                }}
              >
                {/* Renderização do conteúdo do template em miniatura */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: "scale(0.3333)", // 360/1080 = 0.3333
                    transformOrigin: "top left",
                    pointerEvents: "none", // evita interação na miniatura
                  }}
                >
                  <div
                    id="template-content"
                    style={{
                      width: 1080,
                      height: 1920,
                      position: "relative",
                      background: "#eee",
                      overflow: "hidden",
                      borderRadius: 0, // Removido para evitar faixas brancas na captura
                    }}
                  >
                    {/* Imagem principal */}
                    {templateData.backgroundImage && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "relative",
                        }}
                      >
                        <img
                          src={templateData.backgroundImage}
                          alt="Imagem principal"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                            display: "block",
                            filter: "brightness(0.8)", 
                            imageRendering: "auto",
                          }}
                          draggable={false}
                          loading="eager"
                        />
                      </div>
                    )}

                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        height: 100,
                        padding: 24,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        pointerEvents: "none",
                      }}
                      className="z-20"
                    >
                      <div
                        style={{
                          color: "#ff9100",
                          fontWeight: "bold",
                          fontSize: 128,
                          marginTop: 450,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textShadow: "0 12px 48px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25)",
                          pointerEvents: "none",
                          fontFamily:
                            "'Montserrat', 'Segoe UI', 'Arial', sans-serif",
                          letterSpacing: 4,
                        }}
                      >
                        {(templateData.transaction === '1' || templateData.transaction === 1) ? "VENDO" : "ALUGO"}
                      </div>
                      <div
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: 64,
                          marginTop: 0,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textShadow: "0 8px 32px rgba(0,0,0,0.25)",
                          pointerEvents: "none",
                          wordBreak: "break-word",
                          textAlign: "center",
                          fontFamily:
                            "'Montserrat', 'Segoe UI', 'Arial', sans-serif",
                        }}
                      >
                        {
                          (() => {
                            let title = templateData.title || "";

                            // Remove " p/ ..." and everything after
                            if (title.includes(" p/ ")) {
                              return title.split(" p/ ")[0].trim();
                            }

                            // Remove " à Venda" and everything after
                            if (title.includes(" à Venda")) {
                              return title.split(" à Venda")[0].trim();
                            }

                            return title.toUpperCase();
                          })()
                        }
                      </div>
                    </div>
                    <div
                        style={{
                          color: "#FFF",
                          fontStyle: "normal",
                          fontWeight: "bold",
                          fontSize: 40,
                          position: "absolute",
                          bottom: 670,
                          left: 10,
                          textAlign: "center",
                          zIndex: 4,
                        }}
                      >
                        {templateData.reference}
                      </div>
                    {/* Informações do imóvel */}
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: Math.round(1920 * 0.65),
                        height: 500,
                        background: (templateData.transaction === '1' || templateData.transaction === 1) ? "rgba(255, 140, 0, 0.70)" : "rgba(0, 81, 255, 0.7)",
                        zIndex: 3,
                        padding: 24,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          color: "#333",
                          fontWeight: "bold",
                          fontSize: 32,
                          marginBottom: 8,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "stretch",
                          gap: 0,
                          width: "100%",
                        }}
                      >
                        {Object.entries(templateData.rooms)
                          .filter(([_, value]: [string, any]) => value && value.priority !== undefined && !value?.title_formated?.includes("undefined") && value?.title_formated !== undefined)
                          .sort((a: [string, any], b: [string, any]) => a[1].priority - b[1].priority)
                          .slice(0, 3)
                          .map(([key, value]: [string, any]) => {
                            const isQuartos = value?.title_formated?.toLowerCase().includes("quartos");
                            const suite = templateData.rooms?.suite;
                            return (
                              <div
                                key={key}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  flexDirection: "column",
                                  flex: "1 1 0",
                                  justifyContent: "center",
                                  minWidth: 0,
                                }}
                              >
                                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", justifyContent: "center" }}>
                                  {value?.icon && <span style={{ display: "flex", alignItems: "center", marginTop: isQuartos ? 40 : 30 }}>{value.icon}</span>}
                                  <span style={{ marginTop: isQuartos ? 0 : 30}}>{value?.title_formated.toUpperCase()}</span>
                                </span>
                                {isQuartos && suite?.title_formated && (
                                  <span style={{ marginTop: -45, color: "#fff" }}>{suite.title_formated.toUpperCase()}</span>
                                )}
                              </div>
                            );
                          })}
                      </div>
                      <div
                        style={{
                          color: "#fff",
                          fontWeight: "medium",
                          fontSize: 36,
                          marginBottom: 8,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        VALOR{" "}
                        <span
                          style={{
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 48,
                            marginLeft: 8,
                          }}
                        >
                        {templateData?.calculated_price}
                        </span>
                      </div>
                      
                      {/* Imagens secundárias (até 3) */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 16,
                          marginBottom: 8,
                        }}
                      >
                        {[templateData.firstImage, templateData.secondImage, templateData.thirdImage]
                          .filter(Boolean)
                          .map((imageUrl, idx) => (
                            <img
                              key={idx}
                              src={imageUrl}
                              alt={`Imagem secundária ${idx + 1}`}
                              style={{
                                width: 320,
                                height: 300,
                                objectFit: "cover",
                                borderRadius: 16,
                                border: "2px solid #eee",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                background: "#fafafa",
                              }}
                              draggable={false}
                            />
                          ))}
                      </div>
                    </div>
                      <img
                        src={Logo.src}
                        alt="Logo"
                        style={{
                          position: "absolute",
                          bottom: 30,
                          left: 0,
                          width: "auto",
                          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15)) contrast(1.2) brightness(1.1)",
                          imageRendering: "crisp-edges",
                          WebkitFilter: "drop-shadow(0 2px 8px rgba(0,0,0,0.15)) contrast(1.2) brightness(1.1)",
                        }}
                        draggable={false}
                        loading="eager"
                        decoding="async"
                        className="z-1000"
                      />
                      <div 
                      style={{ 
                        position: "absolute", 
                        bottom: 30, 
                        right: 100, 
                        color: "#fff", 
                        fontSize: 32, 
                        fontWeight: "normal", 
                        textAlign: "center",  
                        filter: "brightness(1.2)",
                        zIndex: 1000,
                        fontFamily:
                            "'Montserrat', 'Segoe UI', 'Arial', sans-serif",
                        }}>
                            <span style={{ display: "flex", alignItems: "center", fontFamily: "'Montserrat', 'Segoe UI', 'Arial', sans-serif" }}>
                              ENTRE EM CONTATO
                            </span>
                            <span style={{ display: "flex", alignItems: "center", fontWeight: "bold", fontSize: 48, fontFamily: "'Montserrat', 'Segoe UI', 'Arial', sans-serif" }}>
                              81 99476-4467
                            </span>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Botão para baixar o template em 1080x1920 */}
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={downloadTemplate}
              >
                Baixar imagem para Status do WhatsApp
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Templates;

export const getServerSideProps = async (ctx: any) => {
  const cookies = parse(ctx.req.headers.cookie || "");
  const token = cookies["token.tecimob"];

  if (!token) {
    return { props: {} };
  }

  return {
    props: { token },
  };
};
