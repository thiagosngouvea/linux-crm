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
import { useRouter } from "next/router";

const ReactQuill = dynamic(import("react-quill"), { ssr: false });

interface Imovel {
  exclusivity: boolean | null;
  price: string | null;
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
  condominium_value: string | null;
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
  owner_phone: string | null;
  sec_owner_name: string | null;
  sec_owner_id: string | null;
  sec_owner_email: string | null;
  sec_owner_phone: string | null;
  is_condominium: boolean;
  accept_goods: boolean | null;
  has_financing: boolean | null;
  balcony: boolean | null;
  commission: string | number | null;
  tax_value: string | null;
  tax_description: string | null;
  sales_conditions: string | null;
  rent_conditions: string | null;
  iptu_value: string | null;
  sun_position: string | null;
  corner_property: boolean | null;
  is_busy: boolean | null;
  capture_link: string | null;
  site_link: string | null;
  olx_link: string | null;
}

const ImovelCadastro = React.memo(function ImovelCadastro() {
  const [price, setPrice] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<string>("aluguel");
  const [reference, setReference] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [garage, setGarage] = useState<number>(0);
  const [coveredGarage, setCoveredGarage] = useState<number>(0);
  const [bathroom, setBathroom] = useState<number>(0);
  const [bedroom, setBedroom] = useState<number>(0);
  const [kitchen, setKitchen] = useState<number>(0);
  const [dinningRoom, setDinningRoom] = useState<number>(0);
  const [livingRoom, setLivingRoom] = useState<number>(0);
  const [serviceArea, setServiceArea] = useState<number>(0);
  const [tvRoom, setTvRoom] = useState<number>(0);
  const [office, setOffice] = useState<number>(0);
  const [closet, setCloset] = useState<number>(0);
  const [suites, setSuites] = useState<number>(0);
  const [profile, setProfile] = useState<string | null>(null);
  const [situation, setSituation] = useState<string | null>(null);
  const [areaPrivative, setAreaPrivative] = useState<number | null>(null);
  const [areaPrivativeUnit, setAreaPrivativeUnit] = useState<string | null>(
    null
  );
  const [areaBuilt, setAreaBuilt] = useState<number | null>(null);
  const [areaBuiltUnit, setAreaBuiltUnit] = useState<string | null>(null);
  const [areaTotal, setAreaTotal] = useState<number | null>(null);
  const [areaTotalUnit, setAreaTotalUnit] = useState<string | null>(null);
  const [areaTerrainTotal, setAreaTerrainTotal] = useState<number | null>(null);
  const [areaTerrainTotalUnit, setAreaTerrainTotalUnit] = useState<
    string | null
  >(null);
  const [state, setState] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [neighborhood, setNeighborhood] = useState<string | null>(null);
  const [cep, setCep] = useState<string | null>(null);
  const [street, setStreet] = useState<string | null>(null);
  const [number, setNumber] = useState<string | null>(null);
  const [complement, setComplement] = useState<string | null>(null);
  const [iptuType, setIptuType] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [metaTitle, setMetaTitle] = useState<string | null>(null);
  const [metaDescription, setMetaDescription] = useState<string | null>(null);
  const [publishedWebsite, setPublishedWebsite] = useState<boolean>(false);
  const [publishedNetwork, setPublishedNetwork] = useState<boolean>(false);
  const [showNeighborhood, setShowNeighborhood] = useState<boolean>(false);
  const [showStreet, setShowStreet] = useState<boolean>(false);
  const [showCondominium, setShowCondominium] = useState<boolean>(false);
  const [showPrice, setShowPrice] = useState<boolean>(false);
  const [watermark, setWatermark] = useState<boolean>(false);
  const [stripeColor, setStripeColor] = useState<string | null>(null);
  const [brokerName, setBrokerName] = useState<string | null>(null);
  const [brokerEmail, setBrokerEmail] = useState<string | null>(null);
  const [brokerCreci, setBrokerCreci] = useState<string | null>(null);
  const [brokerPhone, setBrokerPhone] = useState<string | null>(null);
  const [condominiumName, setCondominiumName] = useState<string | null>(null);
  const [condominiumTotalUnits, setCondominiumTotalUnits] = useState<
    number | null
  >(null);
  const [condominiumUnitsPerFloor, setCondominiumUnitsPerFloor] = useState<
    number | null
  >(null);
  const [condominiumFlooring, setCondominiumFlooring] = useState<string | null>(
    null
  );
  const [condominiumNumberTowers, setCondominiumNumberTowers] = useState<
    number | null
  >(null);
  const [condominiumCaracteristics, setCondominiumCaracteristics] = useState<
    string | null
  >(null);
  const [nearby, setNearby] = useState<string | null>(null);
  const [highlightWebsite, setHighlightWebsite] = useState<boolean>(false);
  const [written, setWritten] = useState<boolean>(false);
  const [acceptFinancing, setAcceptFinancing] = useState<boolean>(false);
  const [type, setType] = useState<string | null>(null);
  const [subtype, setSubtype] = useState<string | null>(null);
  // const [images, setImages] = useState<string[]>([]);
  const [imagesOldLinks, setImagesOldLinks] = useState<string[]>([]);
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);
  const [ownerPhone, setOwnerPhone] = useState<string | null>(null);
  const [isCondominium, setIsCondominium] = useState<boolean>(false);
  const [acceptGoods, setAcceptGoods] = useState<boolean | null>(null);
  const [hasFinancing, setHasFinancing] = useState<boolean | null>(null);
  const [balcony, setBalcony] = useState<number | null>(null);
  const [exclusivity, setExclusivity] = useState<boolean | null>(null);
  const [commission, setCommission] = useState<string | null>(null);
  const [taxValue, setTaxValue] = useState<string | null>(null);
  const [taxDescription, setTaxDescription] = useState<string | null>(null);
  const [salesConditions, setSalesConditions] = useState<string | null>(null);
  const [iptuValue, setIptuValue] = useState<string | null>(null);
  const [sunPosition, setSunPosition] = useState<string | null>(null);
  const [cornerProperty, setCornerProperty] = useState<boolean | null>(null);
  const [condominiumValue, setCondominiumValue] = useState<string | null>(null);
  const [secOwnerName, setSecOwnerName] = useState<string | null>(null);
  const [secOwnerId, setSecOwnerId] = useState<string | null>(null);
  const [secOwnerEmail, setSecOwnerEmail] = useState<string | null>(null);
  const [secOwnerPhone, setSecOwnerPhone] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState<boolean | null>(null);
  const [rentConditions, setRentConditions] = useState<string | null>(null);
  const [captureLink, setCaptureLink] = useState<string | null>(null);
  const [siteLink, setSiteLink] = useState<string | null>(null);
  const [olxLink, setOlxLink] = useState<string | null>(null);
  const [proximitySea, setProximitySea] = useState<string | null>(null);
  const [keyResponsibleName, setKeyResponsibleName] = useState<string | null>(null);
  const [keyResponsibleId, setKeyResponsibleId] = useState<string | null>(null);
  const [keyResponsibleEmail, setKeyResponsibleEmail] = useState<string | null>(null);
  const [keyResponsiblePhone, setKeyResponsiblePhone] = useState<string | null>(null);
  const [sectionAddress, setSectionAddress] = useState<string | null>(null);
  const [storeAddress, setStoreAddress] = useState<string | null>(null);
  const [floorNumber, setFloorNumber] = useState<number | null>(null);

  const [invalidOrRemovedImages, setInvalidOrRemovedImages] = useState<


    string[]
  >([]);
  const [images, setImages] = useState<
    Array<{ name: string; file: File | null }>
  >([]);

  const router = useRouter();

  const submitForm = async (values: any) => {
    await propertiesService
      .create(values)
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

        if (response.status === 201) {
          notification.success({
            message: "Imóvel cadastrado com sucesso!",
          });
          setPrice(null);
          setTransaction("aluguel");
          setReference(null);
          setStatus(null);
          setGarage(0);
          setBathroom(0);
          setBedroom(0);
          setKitchen(0);
          setDinningRoom(0);
          setLivingRoom(0);
          setServiceArea(0);
          setTvRoom(0);
          setOffice(0);
          setCloset(0);
          setSuites(0);
          setProfile(null);
          setSituation(null);
          setAreaPrivative(null);
          setAreaPrivativeUnit(null);
          setAreaBuilt(null);
          setAreaBuiltUnit(null);
          setAreaTotal(null);
          setAreaTotalUnit(null);
          setAreaTerrainTotal(null);
          setAreaTerrainTotalUnit(null);
          setState(null);
          setCity(null);
          setNeighborhood(null);
          setCep(null);
          setStreet(null);
          setNumber(null);
          setComplement(null);
          setIptuType(null);
          setDescription(null);
          setTitle(null);
          setMetaTitle(null);
          setMetaDescription(null);
          setPublishedWebsite(false);
          setPublishedNetwork(false);
          setShowNeighborhood(false);
          setShowStreet(false);
          setShowCondominium(false);
          setShowPrice(false);
          setWatermark(false);
          setStripeColor(null);
          setBrokerName(null);
          setBrokerEmail(null);
          setBrokerCreci(null);
          setBrokerPhone(null);
          setCondominiumName(null);
          setCondominiumTotalUnits(null);
          setCondominiumUnitsPerFloor(null);
          setCondominiumFlooring(null);
          setCondominiumNumberTowers(null);
          setCondominiumCaracteristics(null);
          setNearby(null);
          setHighlightWebsite(false);
          setWritten(false);
          setAcceptFinancing(false);
          setType(null);
          setSubtype(null);
          setOwnerName(null);
          setOwnerId(null);
          setOwnerEmail(null);
          setOwnerPhone(null);
          setIsCondominium(false);
          setAcceptGoods(null);
          setHasFinancing(null);
          setBalcony(null);
          setExclusivity(null);
          setCommission(null);
          setTaxValue(null);
          setTaxDescription(null);
          setSalesConditions(null);
          setIptuValue(null);
          setSunPosition(null);
          setCornerProperty(null);
          setCondominiumValue(null);
          setSecOwnerName(null);
          setSecOwnerId(null);
          setSecOwnerEmail(null);
          setSecOwnerPhone(null);
          setIsBusy(null);
          setRentConditions(null);
          setCaptureLink(null);
          setSiteLink(null);
          setOlxLink(null);
          setImages([]);
        }
      })
      .catch((error) => {
        notification.error({
          message: "Erro ao cadastrar o imóvel",
        });
      });
  };

  return (
    <div>
      <BackTitle title="Cadastro de Imóvel" />
      <div>
        <Form
          layout="vertical"
          onFinish={submitForm}
          fields={[
            { name: "title", value: title },
            { name: "meta_title", value: metaTitle },
            { name: "price", value: price },
            { name: "reference", value: reference },
            { name: "cep", value: cep },
            { name: "street", value: street },
            { name: "neighborhood", value: neighborhood },
            { name: "city", value: city },
            { name: "state", value: state },
            { name: "complement", value: complement },
            { name: "type", value: type },
            { name: "subtype", value: subtype },
            { name: "nearby", value: nearby || undefined },
            { name: "transaction", value: transaction },
            { name: "accept_financing", value: acceptFinancing },
            { name: "written", value: written },
            { name: "watermark", value: watermark },
            { name: "images", value: images },
            { name: "owner_name", value: ownerName },
            { name: "owner_id", value: ownerId },
            { name: "owner_email", value: ownerEmail },
            { name: "profile", value: profile },
            { name: "status", value: status },
            { name: "garage", value: garage },
            { name: "bathroom", value: bathroom },
            { name: "bedroom", value: bedroom },
            { name: "kitchen", value: kitchen },
            { name: "dinning_room", value: dinningRoom },
            { name: "living_room", value: livingRoom },
            { name: "suite", value: suites },
            { name: "area_built", value: areaBuilt },
            { name: "area_built_unit", value: areaBuiltUnit },
            { name: "area_total", value: areaTotal },
            { name: "area_total_unit", value: areaTotalUnit },
            { name: "area_privative", value: areaPrivative },
            { name: "area_privative_unit", value: areaPrivativeUnit },
            { name: "area_terrain_total", value: areaTerrainTotal },
            { name: "area_terrain_total_unit", value: areaTerrainTotalUnit },
            { name: "condominium_name", value: condominiumName },
            { name: "condominium_flooring", value: condominiumFlooring },
            { name: "condominium_number_towers", value: condominiumNumberTowers },
            { name: "condominium_total_units", value: condominiumTotalUnits },
            { name: "condominium_units_per_floor", value: condominiumUnitsPerFloor },
            { name: "condominium_caracteristics", value: condominiumCaracteristics || undefined },
            { name: "highlight_website", value: highlightWebsite },
            { name: "description", value: description },
            { name: "meta_description", value: metaDescription },
            { name: "published_website", value: publishedWebsite },
            { name: "published_network", value: publishedNetwork },
            { name: "show_neighborhood", value: showNeighborhood },
            { name: "show_street", value: showStreet },
            { name: "show_condominium", value: showCondominium },
            { name: "show_price", value: showPrice },
            { name: "stripe_color", value: stripeColor },
            { name: "broker_name", value: brokerName },
            { name: "broker_email", value: brokerEmail },
            { name: "broker_creci", value: brokerCreci },
            { name: "broker_phone", value: brokerPhone },
            { name: "section_address", value: sectionAddress },
            { name: "store_address", value: storeAddress },
            { name: "floor_number", value: floorNumber },
            { name: "number", value: number },
            { name: "iptu_type", value: iptuType },
            { name: "iptu_value", value: iptuValue },
            { name: "sun_position", value: sunPosition },
            { name: "corner_property", value: cornerProperty },
            { name: "condominium_value", value: condominiumValue },
            { name: "sec_owner_name", value: secOwnerName },
            { name: "sec_owner_id", value: secOwnerId },
            { name: "sec_owner_email", value: secOwnerEmail },
            { name: "sec_owner_phone", value: secOwnerPhone },
            { name: "is_busy", value: isBusy },
            { name: "rent_conditions", value: rentConditions },
            { name: "capture_link", value: captureLink },
            { name: "site_link", value: siteLink },
            { name: "olx_link", value: olxLink },
            { name: "proximity_sea", value: proximitySea },
            { name: "key_responsible_name", value: keyResponsibleName },
            { name: "key_responsible_id", value: keyResponsibleId },
            { name: "key_responsible_email", value: keyResponsibleEmail },
            { name: "key_responsible_phone", value: keyResponsiblePhone },
            { name: "invalid_or_removed_images", value: invalidOrRemovedImages },
            { name: "images_old_links", value: imagesOldLinks },
            { name: "has_financing", value: hasFinancing },
            { name: "balcony", value: balcony },
            { name: "exclusivity", value: exclusivity },
            { name: "commission", value: commission },
            { name: "tax_value", value: taxValue },
            { name: "tax_description", value: taxDescription },
            { name: "sales_conditions", value: salesConditions },
            { name: "service_area", value: serviceArea },
            { name: "tv_room", value: tvRoom },
            { name: "closet", value: closet },
            { name: "situation", value: situation },
            { name: "covered_garage", value: coveredGarage },
            { name: "office", value: office },
            { name: "owner_phone", value: ownerPhone },
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
                  onChange={(e) => setTitle(e.target.value)}
                  name="title"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Referência" name="reference">
                <Input
                  placeholder="Referência"
                  onChange={(e) => setReference(e.target.value)}
                  name="reference"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Tipo do imóvel" name="type">
                <Select
                  placeholder="Tipo do imóvel"
                  onChange={(value) => setType(value)}
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
              <Form.Item label="Disponivel" name="status">
                <button
                  onClick={() => setStatus("Disponível")}
                  type="button"
                  className={
                    status === "Disponível"
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Sim
                </button>
                <button
                  onClick={() => setStatus("Excluído")}
                  type="button"
                  className={
                    status === "Excluído"
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Não
                </button>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Transação" name="transaction">
                <button
                  onClick={() => setTransaction("venda")}
                  type="button"
                  className={
                    transaction === "venda"
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Venda
                </button>
                <button
                  onClick={() => setTransaction("aluguel")}
                  type="button"
                  className={
                    transaction === "aluguel"
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Aluguel
                </button>
              </Form.Item>
            </Col>

            {/* <Col xs={24} sm={24} md={12} xl={6}>
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
            </Col> */}
          </Row>
          {transaction === "venda" && (
            <>
              <h2 className="font-bold text-lg text-orange-400">
                Informações adicionais para Venda
              </h2>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Valor de Venda" name="price">
                    <Input
                      placeholder="Digite o valor de venda"
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(/\D/g, "");
                        const formatted = new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                        }).format(Number(inputValue) / 100);
                        setPrice(formatted);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Condições da Venda" name="sales_conditions">
                    <Select
                      placeholder="Condições da Venda"
                      onChange={(value) => setSalesConditions(value)}
                      showSearch
                      allowClear
                      mode="tags"
                      options={[
                        { label: "Nenhum", value: null },
                        { label: "À vista", value: "a-vista" },
                        { label: "Financiado", value: "financiado" },
                        { label: "Permuta", value: "permuta" },
                        { label: "Outros", value: "outros" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Período do IPTU" name="iptu_type">
                    <Select
                      placeholder="Período do IPTU"
                      onChange={(value) => setIptuType(value)}
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
                {iptuType !== null && (
                  <Col xs={24} sm={24} md={12} xl={6}>
                    <Form.Item label="Valor do IPTU" name="iptu_value">
                      <Input
                        placeholder="Digite o valor do IPTU"
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, "");
                          const formatted = new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            minimumFractionDigits: 2,
                          }).format(Number(inputValue) / 100);
                          setIptuValue(formatted);
                        }}
                      />
                    </Form.Item>
                  </Col>
                )}
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Valor das Taxas" name="tax_value">
                    <Input
                      placeholder="Digite o valor das Taxas"
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(/\D/g, "");
                        const formatted = new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                        }).format(Number(inputValue) / 100);
                        setTaxValue(formatted);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={18} xl={18}>
                  <Form.Item label="Descrição das Taxas" name="tax_description">
                    <Input.TextArea
                      placeholder="Descreva as taxas"
                      name="tax_description"
                      //quando escrever mudar o state
                      onChange={(e) => {
                        setTaxDescription(e.target.value);
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Escriturado" name="written">
                    <button
                      onClick={() => setWritten(true)}
                      type="button"
                      className={
                        written === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setWritten(false)}
                      type="button"
                      className={
                        written === false
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
                    label="Aceita Bens na Negociação?"
                    name="accept_goods"
                  >
                    <button
                      onClick={() => setAcceptGoods(true)}
                      type="button"
                      className={
                        acceptGoods === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setAcceptGoods(false)}
                      type="button"
                      className={
                        acceptGoods === false
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Não
                    </button>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Tem Financiamento?" name="has_financing">
                    <button
                      onClick={() => setHasFinancing(true)}
                      type="button"
                      className={
                        hasFinancing === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setHasFinancing(false)}
                      type="button"
                      className={
                        hasFinancing === false
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
                    label="Aceita Financiamento"
                    name="accept_financing"
                  >
                    <button
                      onClick={() => setAcceptFinancing(true)}
                      type="button"
                      className={
                        acceptFinancing === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setAcceptFinancing(false)}
                      type="button"
                      className={
                        acceptFinancing === false
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Não
                    </button>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Está Ocupado?" name="is_busy">
                    <button
                      onClick={() => setIsBusy(true)}
                      type="button"
                      className={
                        isBusy === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setIsBusy(false)}
                      type="button"
                      className={
                        isBusy === false
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Não
                    </button>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Imóvel de Esquina" name="corner_property">
                    <button
                      onClick={() => setCornerProperty(true)}
                      type="button"
                      className={
                        cornerProperty === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setCornerProperty(false)}
                      type="button"
                      className={
                        cornerProperty === false
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Não
                    </button>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Posição Solar" name="sun_position">
                    <Select
                      placeholder="Posição Solar"
                      onChange={(value) =>
                        setSunPosition(value)
                      }
                      showSearch
                      allowClear
                      options={[
                        { label: "Norte", value: "norte" },
                        { label: "Sul", value: "sul" },
                        { label: "Leste", value: "leste" },
                        { label: "Oeste", value: "oeste" },
                        { label: "Nordeste", value: "nordeste" },
                        { label: "Noroeste", value: "noroeste" },
                        { label: "Sudeste", value: "sudeste" },
                        { label: "Sudoeste", value: "sudoeste" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          {transaction === "aluguel" && (
            <>
              <h2 className="font-bold text-lg text-orange-400">
                Informações adicionais para Aluguel
              </h2>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Valor do Aluguel" name="price">
                    <Input
                      placeholder="Digite o valor do Aluguel"
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(/\D/g, "");
                        const formatted = new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                        }).format(Number(inputValue) / 100);
                        setPrice(formatted);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item
                    label="Condições do Aluguel"
                    name="rent_conditions"
                  >
                    <Select
                      placeholder="Condições de Aluguel"
                      onChange={(value) => setRentConditions(value)}
                      showSearch
                      allowClear
                      value={rentConditions || undefined}
                    >
                      <Select.Option value="mensal">Mensal</Select.Option>
                      <Select.Option value="anual">Anual</Select.Option>
                      <Select.Option value="temporada">Temporada</Select.Option>
                      <Select.Option value="diaria">Diária</Select.Option>
                      <Select.Option value="semestral">Semestral</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Período do IPTU" name="iptu_type">
                    <Select
                      placeholder="Período do IPTU"
                      onChange={(value) => setIptuType(value)}
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
                {iptuType !== null && (
                  <Col xs={24} sm={24} md={12} xl={6}>
                    <Form.Item label="Valor do IPTU" name="iptu_value">
                      <Input
                        placeholder="Digite o valor do IPTU"
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, "");
                          const formatted = new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            minimumFractionDigits: 2,
                          }).format(Number(inputValue) / 100);
                          setIptuValue(formatted);
                        }}
                      />
                    </Form.Item>
                  </Col>
                )}
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Valor das Taxas" name="tax_value">
                    <Input
                      placeholder="Digite o valor das Taxas"
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(/\D/g, "");
                        const formatted = new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                        }).format(Number(inputValue) / 100);
                        setTaxValue(formatted);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={18} xl={18}>
                  <Form.Item label="Descrição das Taxas" name="tax_description">
                    <Input.TextArea
                      placeholder="Descreva as taxas"
                      onChange={(e) => setTaxDescription(e.target.value)}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Escriturado" name="written">
                    <button
                      onClick={() => setWritten(true)}
                      type="button"
                      className={
                        written === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setWritten(false)}
                      type="button"
                      className={
                        written === false
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
                    label="Aceita Bens na Negociação?"
                    name="accept_goods"
                  >
                    <button
                      onClick={() => setAcceptGoods(true)}
                      type="button"
                      className={
                        acceptGoods === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setAcceptGoods(false)}
                      type="button"
                      className={
                        acceptGoods === false
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Não
                    </button>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Tem Financiamento?" name="has_financing">
                    <button
                      onClick={() => setHasFinancing(true)}
                      type="button"
                      className={
                        hasFinancing === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setHasFinancing(false)}
                      type="button"
                      className={
                        hasFinancing === false
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
                    label="Aceita Financiamento"
                    name="accept_financing"
                  >
                    <button
                      onClick={() => setAcceptFinancing(true)}
                      type="button"
                      className={
                        acceptFinancing === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setAcceptFinancing(false)}
                      type="button"
                      className={
                        acceptFinancing === false
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Não
                    </button>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Está Ocupado?" name="is_busy">
                    <button
                      onClick={() => setIsBusy(true)}
                      type="button"
                      className={
                        isBusy === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setIsBusy(false)}
                      type="button"
                      className={
                        isBusy === false
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Não
                    </button>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Imóvel de Esquina" name="corner_property">
                    <button
                      onClick={() => setCornerProperty(true)}
                      type="button"
                      className={
                        cornerProperty === true
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setCornerProperty(false)}
                      type="button"
                      className={
                        cornerProperty === false
                          ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                          : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                      }
                    >
                      Não
                    </button>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Posição Solar" name="sun_position">
                    <Select
                      placeholder="Posição Solar"
                      onChange={(value) => setSunPosition(value)}
                      showSearch
                      allowClear
                      options={[
                        { label: "Nascente", value: "nascente" },
                        { label: "Poente", value: "poente" },
                        { label: "Norte", value: "norte" },
                        { label: "Sul", value: "sul" },
                        { label: "Leste", value: "leste" },
                        { label: "Oeste", value: "oeste" },
                        { label: "Nordeste", value: "nordeste" },
                        { label: "Noroeste", value: "noroeste" },
                        { label: "Sudeste", value: "sudeste" },
                        { label: "Sudoeste", value: "sudoeste" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          <hr className="my-4" />
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="É Condominio?" name="is_condominium">
                <button
                  onClick={() => setIsCondominium(true)}
                  type="button"
                  className={
                    isCondominium === true
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Sim
                </button>
                <button
                  onClick={() => setIsCondominium(false)}
                  type="button"
                  className={
                    isCondominium === false
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Não
                </button>
              </Form.Item>
            </Col>
          </Row>
          {isCondominium && (
            <>
              <h2 className="font-bold text-lg text-orange-400">Condomínio</h2>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Nome do condomínio" name="condominium_name">
                    <Input
                      placeholder="Nome do condomínio"
                      onChange={(e) => setCondominiumName(e.target.value)}
                      name="condominium_name"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item
                    label="Valor do Condomínio"
                    name="condominium_value"
                  >
                    <Input
                      placeholder="Digite o valor do Condomínio"
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(/\D/g, "");
                        const formatted = new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                        }).format(Number(inputValue) / 100);
                        setCondominiumValue(formatted);
                      }}
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
                      onChange={(e) =>
                        setCondominiumTotalUnits(Number(e.target.value))
                      }
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
                      onChange={(e) =>
                        setCondominiumUnitsPerFloor(Number(e.target.value))
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={6}>
                  <Form.Item label="Pavimentação" name="condominium_flooring">
                    <Input
                      placeholder="Pavimentação"
                      onChange={(e) => setCondominiumFlooring(e.target.value)}
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
                      onChange={(e) =>
                        setCondominiumNumberTowers(Number(e.target.value))
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12}>
                  <Form.Item
                    label="O que vem incluso no condomínio?"
                    name="condominium_caracteristics"
                  >
                    <Select
                      mode="tags"
                      placeholder="Características"
                      onChange={(value) => setCondominiumCaracteristics(value)}
                      showSearch
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
          <h2 className="font-bold text-lg text-orange-400">Informações</h2>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Subtipo do imóvel" name="subtype">
                <Select
                  placeholder="Subtipo do imóvel"
                  onChange={(value) => setSubtype(value)}
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
              <Form.Item label="Perfil do Imóvel" name="profile">
                <Input
                  placeholder="Ex.: Residencial em Condomínio"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setProfile(inputValue);
                  }}
                  name="profile"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Situação" name="situation">
                <Select
                  placeholder="Situação"
                  onChange={(value) => setSituation(value)}
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
              <Form.Item label="Proximidade do Mar" name="proximity_sea">
                <Input
                  placeholder="Proximidade do Mar"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    setProximitySea(inputValue);
                  }}
                  name="proximity_sea"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Proximidades" name="nearby">
                <Select
                  placeholder="Selecione ou Escreva"
                  onChange={(value) => setNearby(value)}
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
              <Form.Item label="Comissão" name="commission">
                <Input
                  placeholder="Digite o valor da Comissão"
                  onChange={(e) => {
                    const inputValue = e.target.value.replace(/\D/g, "");
                    const formatted = new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    }).format(Number(inputValue) / 100);
                    setCommission(formatted);
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Área total" name="area_total">
                <Input
                  type="number"
                  placeholder="Área total"
                  onChange={(e) => {
                    const inputValue = Number(e.target.value);
                    setAreaTotal(inputValue);
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Unidade" name="area_total_unit">
                <Select
                  placeholder="Unidade"
                  onChange={(value) => setAreaTotalUnit(value)}
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
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Exclusividade" name="exclusivity">
                <button
                  onClick={() => setExclusivity(true)}
                  type="button"
                  className={
                    exclusivity === true
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Sim
                </button>
                <button
                  onClick={() => setExclusivity(false)}
                  type="button"
                  className={
                    exclusivity === false
                      ? "bg-orange-400 text-white font-bold py-2 px-4 rounded"
                      : "bg-white text-orange-400 font-bold py-2 px-4 rounded"
                  }
                >
                  Não
                </button>
              </Form.Item>
            </Col>
          </Row>
          <h2 className="font-bold text-lg text-orange-400">Endereço</h2>
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
                        setState(response.state);
                        setCity(response.city);
                        setNeighborhood(response.neighborhood);
                        setStreet(response.street);
                        setCep(response.cep);
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
                  onChange={(e) => setStreet(e.target.value)}
                  name="street"
                />

              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} xl={4}>
              <Form.Item label="Bairro" name="neighborhood">
                <Input
                  placeholder="Bairro"
                  onChange={(e) => setNeighborhood(e.target.value)}
                  name="neighborhood"
                />

              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} xl={4}>
              <Form.Item label="Cidade" name="city">
                <Input
                  placeholder="Cidade"
                  onChange={(e) => setCity(e.target.value)}
                  name="city"
                />

              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} xl={4}>
              <Form.Item label="Estado" name="state">
                <Input
                  placeholder="Estado"
                  onChange={(e) => setState(e.target.value)}
                  name="state"
                />

              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} xl={4}>
              <Form.Item label="Complemento" name="complement">
                <Input
                  placeholder="Complemento"
                  onChange={(e) => setComplement(e.target.value)}
                  name="complement"
                />

              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Bloco-Quadra-Torre" name="section_address">
                <Input
                  placeholder="Bloco-Quadra-Torre"
                  onChange={(e) => setSectionAddress(e.target.value)}
                  name="section_address"
                />

              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Ap-Loja-Lote-Sala" name="store_address">
                <Input
                  placeholder="Ap-Loja-Lote-Sala"
                  onChange={(e) => setStoreAddress(e.target.value)}
                  name="store_address"
                />

              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Nº do Andar" name="floor_number">
                <Input
                  type="number"
                  placeholder="Nº do Andar"
                  onChange={(e) => setFloorNumber(Number(e.target.value))}
                />

              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} xl={6}>
              <Form.Item label="Nº da Residência" name="number">
                <Input
                  placeholder="Nº da Residência"
                  onChange={(e) => setNumber(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <h2 className="font-bold text-lg text-orange-400">Cômodos</h2>
          <Row gutter={16}>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Garagem" name="garage">
                <Input
                  type="number"
                  placeholder="Garagem"
                  onChange={(e) => setGarage(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={8}>
              <Form.Item label="Cobertura das Garagens" name="covered_garage">
                <Input
                  type="number"
                  placeholder="Cobertura das Garagens"
                  onChange={(e) => setCoveredGarage(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Dormitórios" name="bedroom">
                <Input
                  type="number"
                  placeholder="Dormitórios"
                  onChange={(e) => setBedroom(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Suítes" name="suites">
                <Input
                  type="number"
                  placeholder="Suítes"
                  onChange={(e) => setSuites(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Closets" name="closet">
                <Input
                  type="number"
                  placeholder="Closets"
                  onChange={(e) => setCloset(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Cozinha" name="kitchen">
                <Input
                  type="number"
                  placeholder="Cozinha"
                  onChange={(e) => setKitchen(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Sala de jantar" name="dinning_room">
                <Input
                  type="number"
                  placeholder="Sala de jantar"
                  onChange={(e) => setDinningRoom(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Sala de estar" name="living_room">
                <Input
                  type="number"
                  placeholder="Sala de estar"
                  onChange={(e) => setLivingRoom(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Área de serviço" name="service_area">
                <Input
                  type="number"
                  placeholder="Área de serviço"
                  onChange={(e) => setServiceArea(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Banheiros" name="bathroom">
                <Input
                  type="number"
                  placeholder="Banheiros"
                  onChange={(e) => setBathroom(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Escritórios" name="office">
                <Input
                  type="number"
                  placeholder="Escritórios"
                  onChange={(e) => setOffice(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Sala de TV" name="tv_room">
                <Input
                  type="number"
                  placeholder="Sala de TV"
                  onChange={(e) => setTvRoom(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8} md={6} xl={4}>
              <Form.Item label="Varandas" name="balcony">
                <Input
                  type="number"
                  placeholder="Varandas"
                  onChange={(e) => setBalcony(Number(e.target.value))}
                />
              </Form.Item>
            </Col>
          </Row>
          <h2 className="font-bold text-lg text-orange-400">Corretor</h2>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Nome" name="broker_name">
                <Input
                  placeholder="Nome"
                  onChange={(e) => setBrokerName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="CRECI" name="broker_creci">
                <Input
                  placeholder="CRECI"
                  onChange={(e) => setBrokerCreci(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="E-mail" name="broker_email">
                <Input
                  placeholder="E-mail"
                  onChange={(e) => setBrokerEmail(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Telefone" name="broker_phone">
                <Input
                  placeholder="Telefone"
                  onChange={(e) => setBrokerPhone(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <h2 className="font-bold text-lg text-orange-400">
            Proprietário / Responsável pelo imóvel
          </h2>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Nome" name="owner_name">
                <Input
                  placeholder="Nome"
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="E-mail" name="owner_email">
                <Input
                  placeholder="E-mail"
                  onChange={(e) => setOwnerEmail(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Telefone" name="owner_phone">
                <Input
                  placeholder="Telefone"
                  onChange={(e) => setOwnerPhone(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Nome (Secundário)" name="sec_owner_name">
                <Input
                  placeholder="Nome"
                  onChange={(e) => setSecOwnerName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="E-mail (Secundário)" name="sec_owner_email">
                <Input
                  placeholder="E-mail"
                  onChange={(e) => setSecOwnerEmail(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Telefone (Secundário)" name="sec_owner_phone">
                <Input
                  placeholder="Telefone"
                  onChange={(e) => setSecOwnerPhone(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <h2 className="font-bold text-lg text-orange-400">
            Responsável pela Chave
          </h2>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Nome" name="key_responsible_name">
                <Input
                  placeholder="Nome"
                  onChange={(e) => setKeyResponsibleName(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="E-mail" name="key_responsible_email">
                <Input
                  placeholder="E-mail"
                  onChange={(e) => setKeyResponsibleEmail(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={6}>
              <Form.Item label="Telefone" name="key_responsible_phone">
                <Input
                  placeholder="Telefone"
                  onChange={(e) => setKeyResponsiblePhone(e.target.value)}
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
                  value={description ?? ""}
                  onChange={(value) => setDescription(value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} xl={8}>
              <Form.Item label="Link de Captação" name="capture_link">
                <Input
                  placeholder="Link de Captação"
                  onChange={(e) => setCaptureLink(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={8}>
              <Form.Item label="Link do Site" name="site_link">
                <Input
                  placeholder="Link do Site"
                  onChange={(e) => setSiteLink(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} xl={8}>
              <Form.Item label="Link da OLX" name="olx_link">
                <Input
                  placeholder="Link da OLX"
                  onChange={(e) => setOlxLink(e.target.value)}
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
