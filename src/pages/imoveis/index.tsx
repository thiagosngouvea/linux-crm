import React, { useCallback, useEffect, useState } from "react";
import { propertiesService } from "@/services/linux-properties.service";
import { listsService } from "@/services/lists.service";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Segmented,
  Select,
  Table,
  Tabs,
  Upload,
  UploadProps,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { FormRegister } from "@/components/FormRegister";
import { fields } from "@/utils/fields";
import { useAuthStore } from "@/context/auth";
import dayjs from "dayjs";
import { schedulesService } from "@/services/schedules.service";

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
  const [valorMinRent, setValorMinRent] = useState<string | null>(null);
  const [valorMaxRent, setValorMaxRent] = useState<string | null>(null);

  const [cidade, setCidade] = useState<string[]>([]);
  const [bairro, setBairro] = useState<string[]>([]);
  const [negocio, setNegocio] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);
  const [tipo, setTipo] = useState<string[]>([]);
  const [condominios, setCondominios] = useState<string[]>([]);
  const [deeded, setDeeded] = useState(null);
  const [origem, setOrigem] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string[]>([]);
  const [suites, setSuites] = useState<string[]>([]);
  const [bathrooms, setBathrooms] = useState<string[]>([]);
  const [balconies, setBalconies] = useState<string[]>([]);
  const [garages, setGarages] = useState<string[]>([]);

  const [search, setSearch] = useState<string>("");

  const [visibleRegisterModal, setVisibleRegisterModal] = useState(false);

  const [dataToEdit, setDataToEdit] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);

  const [informations, setInformations] = useState<any>({});
  const [loadingInformations, setLoadingInformations] = useState(false);

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const [openModalList, setOpenModalList] = useState(false);
  const [fieldsList, setFieldsList] = useState<any[]>([]);
  const [listName, setListName] = useState<string>("");
  const [typeList, setTypeList] = useState<string>("");

  const [form] = Form.useForm();

  const [openModalMessage, setOpenModalMessage] = useState(false);
  const [openModalVisit, setOpenModalVisit] = useState(false);

  const { user } = useAuthStore();

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    setIsSuperAdmin(user?.role === "super_admin");
  }, [user]);


  const props: UploadProps = {
    name: "file",
    accept: ".xlsx",
    headers: {
      authorization: "authorization-text",
    },
    beforeUpload: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      
      Modal.info({
        title: 'Carregando',
        content: 'O upload do arquivo está em andamento. Por favor, aguarde...',
        okButtonProps: { style: { display: 'none' } }
      });

      try {
        const res = await propertiesService.uploadExcelDatabase(formData);
        await fetchData();
        Modal.destroyAll(); // Remove o modal de loading
        message.success(res?.data?.file_path?.message);
      } catch (error) {
        Modal.destroyAll(); // Remove o modal de loading em caso de erro
        message.error('Erro ao fazer upload do arquivo');
      }
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

    if ((valorMax !== null || valorMin !== null) && (negocio.some(item => item?.includes("Venda")) || negocio.length === 0)) {
      let valorMinFormatado = valorMin
      ?.replace(/[^\d]/g, "")
      .replace(/0{2}$/, "");
      let valorMaxFormatado = valorMax
      ?.replace(/[^\d]/g, "")
      .replace(/0{2}$/, "");

      // Only add the filter if we have valid min or max values
      if (
      (valorMinFormatado && valorMinFormatado !== "0") || 
      (valorMaxFormatado && valorMaxFormatado !== "0")
      ) {
      if (!valorMaxFormatado || valorMaxFormatado === "0") {
        valorMaxFormatado = "999999999";
      }
      if (!valorMinFormatado || valorMinFormatado === "0") {
        valorMinFormatado = "0";
      }

      filterBy += filterBy === "" ? "sale_price" : ",sale_price";
      filterValue +=
        filterValue === ""
        ? `${valorMinFormatado}|${valorMaxFormatado}`
        : `,${valorMinFormatado}|${valorMaxFormatado}`;
      filterType += filterType === "" ? "btw_price" : ",btw_price";
      }
    }

    if ((valorMaxRent !== null || valorMinRent !== null) && (negocio.some(item => item?.includes("Aluguel")) || negocio.length === 0)) {
      let valorMinFormatado = valorMinRent
      ?.replace(/[^\d]/g, "")
      .replace(/0{2}$/, "");
      let valorMaxFormatado = valorMaxRent
      ?.replace(/[^\d]/g, "")
      .replace(/0{2}$/, "");

      // Only add the filter if we have valid min or max values
      if (
      (valorMinFormatado && valorMinFormatado !== "0") || 
      (valorMaxFormatado && valorMaxFormatado !== "0")
      ) {
      if (!valorMaxFormatado || valorMaxFormatado === "0") {
        valorMaxFormatado = "999999999";
      }
      if (!valorMinFormatado || valorMinFormatado === "0") {
        valorMinFormatado = "0";
      }

      filterBy += filterBy === "" ? "rental_price" : ",rental_price";
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

    if (!!deeded) {
      filterBy += filterBy === "" ? "deeded" : ",deeded";
      filterValue += filterValue === "" ? `${deeded}` : `,${deeded}`;
      filterType += filterType === "" ? "ilike" : ",ilike";
    }

    if (!!titulo) {
      filterBy += filterBy === "" ? "subtitle" : ",subtitle";
      filterValue += filterValue === "" ? `${titulo}` : `,${titulo}`;
      filterType += filterType === "" ? "ilike" : ",ilike";
    }
    if (!!cidade && (!Array.isArray(cidade) || cidade.length > 0)) {
      filterBy += filterBy === "" ? "city" : ",city";
      if (Array.isArray(cidade)) {
      const filteredCidade = cidade.filter(item => !!item);
      if (filteredCidade.length > 0) {
        filterValue += filterValue === "" ? `${filteredCidade.join('|')}` : `,${filteredCidade.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${cidade}` : `,${cidade}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!bairro && (!Array.isArray(bairro) || bairro.length > 0)) {
      filterBy += filterBy === "" ? "district" : ",district";
      if (Array.isArray(bairro)) {
      const filteredBairro = bairro.filter(item => !!item);
      if (filteredBairro.length > 0) {
        filterValue += filterValue === "" ? `${filteredBairro.join('|')}` : `,${filteredBairro.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${bairro}` : `,${bairro}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!negocio && (!Array.isArray(negocio) || negocio.length > 0)) {
      filterBy += filterBy === "" ? "transaction" : ",transaction";
      if (Array.isArray(negocio)) {
      const filteredNegocio = negocio.filter(item => !!item);
      if (filteredNegocio.length > 0) {
        filterValue += filterValue === "" ? `${filteredNegocio.join('|')}` : `,${filteredNegocio.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${negocio}` : `,${negocio}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!tipo && (!Array.isArray(tipo) || tipo.length > 0)) {
      filterBy += filterBy === "" ? "type" : ",type";
      if (Array.isArray(tipo)) {
      const filteredTipo = tipo.filter(item => !!item);
      if (filteredTipo.length > 0) {
        filterValue += filterValue === "" ? `${filteredTipo.join('|')}` : `,${filteredTipo.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${tipo}` : `,${tipo}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!condominios && (!Array.isArray(condominios) || condominios.length > 0)) {
      filterBy += filterBy === "" ? "condominium_name" : ",condominium_name";
      if (Array.isArray(condominios)) {
      const filteredCondominios = condominios.filter(item => !!item);
      if (filteredCondominios.length > 0) {
        filterValue += filterValue === "" ? `${filteredCondominios.join('|')}` : `,${filteredCondominios.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${condominios}` : `,${condominios}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!status && (!Array.isArray(status) || status.length > 0)) {
      filterBy += filterBy === "" ? "status" : ",status";
      if (Array.isArray(status)) {
      const filteredStatus = status.filter(item => !!item);
      if (filteredStatus.length > 0) {
        filterValue += filterValue === "" ? `${filteredStatus.join('|')}` : `,${filteredStatus.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${status}` : `,${status}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!bedrooms && (!Array.isArray(bedrooms) || bedrooms.length > 0)) {
      filterBy += filterBy === "" ? "bedrooms" : ",bedrooms";
      if (Array.isArray(bedrooms)) {
      const filteredStatus = bedrooms.filter(item => !!item);
      if (filteredStatus.length > 0) {
        filterValue += filterValue === "" ? `${filteredStatus.join('|')}` : `,${filteredStatus.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${bedrooms}` : `,${bedrooms}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!bathrooms && (!Array.isArray(bathrooms) || bathrooms.length > 0)) {
      filterBy += filterBy === "" ? "bathrooms" : ",bathrooms";
      if (Array.isArray(bathrooms)) {
      const filteredStatus = bathrooms.filter(item => !!item);
      if (filteredStatus.length > 0) {
        filterValue += filterValue === "" ? `${filteredStatus.join('|')}` : `,${filteredStatus.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${bathrooms}` : `,${bathrooms}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!balconies && (!Array.isArray(balconies) || balconies.length > 0)) {
      filterBy += filterBy === "" ? "balconies" : ",balconies";
      if (Array.isArray(balconies)) {
      const filteredStatus = balconies.filter(item => !!item);
      if (filteredStatus.length > 0) {
        filterValue += filterValue === "" ? `${filteredStatus.join('|')}` : `,${filteredStatus.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${balconies}` : `,${balconies}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!garages && (!Array.isArray(garages) || garages.length > 0)) {
      filterBy += filterBy === "" ? "garages" : ",garages";
      if (Array.isArray(garages)) {
      const filteredStatus = garages.filter(item => !!item);
      if (filteredStatus.length > 0) {
        filterValue += filterValue === "" ? `${filteredStatus.join('|')}` : `,${filteredStatus.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${garages}` : `,${garages}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!suites && (!Array.isArray(suites) || suites.length > 0)) {
      filterBy += filterBy === "" ? "suites" : ",suites";
      if (Array.isArray(suites)) {
      const filteredStatus = suites.filter(item => !!item);
      if (filteredStatus.length > 0) {
        filterValue += filterValue === "" ? `${filteredStatus.join('|')}` : `,${filteredStatus.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${suites}` : `,${suites}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }


    try {
      let res: any;
      if (search !== "" && !!search) {
        res = await propertiesService.getInAllFields(search, page, limit);
      } else {
        res = await propertiesService.getAll(
          page,
          limit,
          filterBy,
          filterValue,
          filterType
      );
      }

      //remover properties sem imagens

      const data = res.data.properties.result;

      setProperties(data);
      setTotal(res.data.properties.total);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Erro ao buscar imóveis");
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
    deeded,
    valorMaxRent,
    valorMinRent,
    bedrooms,
    suites,
    bathrooms,
    balconies,
    garages,
    search,
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
    deeded,
    valorMaxRent,
    valorMinRent,
    bedrooms,
    suites,
    bathrooms,
    balconies,
    garages,
    search,
    fetchData,
  ]);

  const fetchInformations = useCallback(async () => {
    let filterBy = "";
    let filterValue = "";
    let filterType = "";
    
    // Add conditions similar to fetchData if you need to filter the information fields
    // For example:
    if ((valorMax !== null || valorMin !== null) && (negocio.some(item => item?.includes("Venda")) || negocio.length === 0)) {
      let valorMinFormatado = valorMin
      ?.replace(/[^\d]/g, "")
      .replace(/0{2}$/, "");
      let valorMaxFormatado = valorMax
      ?.replace(/[^\d]/g, "")
      .replace(/0{2}$/, "");

      // Only add the filter if we have valid min or max values
      if (
      (valorMinFormatado && valorMinFormatado !== "0") || 
      (valorMaxFormatado && valorMaxFormatado !== "0")
      ) {
      if (!valorMaxFormatado || valorMaxFormatado === "0") {
        valorMaxFormatado = "999999999";
      }
      if (!valorMinFormatado || valorMinFormatado === "0") {
        valorMinFormatado = "0";
      }

      filterBy += filterBy === "" ? "sale_price" : ",sale_price";
      filterValue +=
        filterValue === ""
        ? `${valorMinFormatado}|${valorMaxFormatado}`
        : `,${valorMinFormatado}|${valorMaxFormatado}`;
      filterType += filterType === "" ? "btw_price" : ",btw_price";
      }
    }

    if ((valorMaxRent !== null || valorMinRent !== null) && (negocio.some(item => item?.includes("Aluguel")) || negocio.length === 0)) {
      let valorMinFormatado = valorMinRent
      ?.replace(/[^\d]/g, "")
      .replace(/0{2}$/, "");
      let valorMaxFormatado = valorMaxRent
      ?.replace(/[^\d]/g, "")
      .replace(/0{2}$/, "");

      // Only add the filter if we have valid min or max values
      if (
      (valorMinFormatado && valorMinFormatado !== "0") || 
      (valorMaxFormatado && valorMaxFormatado !== "0")
      ) {
      if (!valorMaxFormatado || valorMaxFormatado === "0") {
        valorMaxFormatado = "999999999";
      }
      if (!valorMinFormatado || valorMinFormatado === "0") {
        valorMinFormatado = "0";
      }

      filterBy += filterBy === "" ? "rental_price" : ",rental_price";
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

    if (!!deeded) {
      filterBy += filterBy === "" ? "deeded" : ",deeded";
      filterValue += filterValue === "" ? `${deeded}` : `,${deeded}`;
      filterType += filterType === "" ? "ilike" : ",ilike";
    }

    if (!!titulo) {
      filterBy += filterBy === "" ? "subtitle" : ",subtitle";
      filterValue += filterValue === "" ? `${titulo}` : `,${titulo}`;
      filterType += filterType === "" ? "ilike" : ",ilike";
    }
    if (!!cidade && (!Array.isArray(cidade) || cidade.length > 0)) {
      filterBy += filterBy === "" ? "city" : ",city";
      if (Array.isArray(cidade)) {
      const filteredCidade = cidade.filter(item => !!item);
      if (filteredCidade.length > 0) {
        filterValue += filterValue === "" ? `${filteredCidade.join('|')}` : `,${filteredCidade.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${cidade}` : `,${cidade}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!bairro && (!Array.isArray(bairro) || bairro.length > 0)) {
      filterBy += filterBy === "" ? "district" : ",district";
      if (Array.isArray(bairro)) {
      const filteredBairro = bairro.filter(item => !!item);
      if (filteredBairro.length > 0) {
        filterValue += filterValue === "" ? `${filteredBairro.join('|')}` : `,${filteredBairro.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${bairro}` : `,${bairro}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!negocio && (!Array.isArray(negocio) || negocio.length > 0)) {
      filterBy += filterBy === "" ? "transaction" : ",transaction";
      if (Array.isArray(negocio)) {
      const filteredNegocio = negocio.filter(item => !!item);
      if (filteredNegocio.length > 0) {
        filterValue += filterValue === "" ? `${filteredNegocio.join('|')}` : `,${filteredNegocio.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${negocio}` : `,${negocio}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!tipo && (!Array.isArray(tipo) || tipo.length > 0)) {
      filterBy += filterBy === "" ? "type" : ",type";
      if (Array.isArray(tipo)) {
      const filteredTipo = tipo.filter(item => !!item);
      if (filteredTipo.length > 0) {
        filterValue += filterValue === "" ? `${filteredTipo.join('|')}` : `,${filteredTipo.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${tipo}` : `,${tipo}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!condominios && (!Array.isArray(condominios) || condominios.length > 0)) {
      filterBy += filterBy === "" ? "condominium_name" : ",condominium_name";
      if (Array.isArray(condominios)) {
      const filteredCondominios = condominios.filter(item => !!item);
      if (filteredCondominios.length > 0) {
        filterValue += filterValue === "" ? `${filteredCondominios.join('|')}` : `,${filteredCondominios.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${condominios}` : `,${condominios}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!status && (!Array.isArray(status) || status.length > 0)) {
      filterBy += filterBy === "" ? "status" : ",status";
      if (Array.isArray(status)) {
      const filteredStatus = status.filter(item => !!item);
      if (filteredStatus.length > 0) {
        filterValue += filterValue === "" ? `${filteredStatus.join('|')}` : `,${filteredStatus.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${status}` : `,${status}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!bedrooms && (!Array.isArray(bedrooms) || bedrooms.length > 0)) {
      filterBy += filterBy === "" ? "bedrooms" : ",bedrooms";
      if (Array.isArray(bedrooms)) {
      const filteredStatus = bedrooms.filter(item => !!item);
      if (filteredStatus.length > 0) {
        filterValue += filterValue === "" ? `${filteredStatus.join('|')}` : `,${filteredStatus.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${bedrooms}` : `,${bedrooms}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!bathrooms && (!Array.isArray(bathrooms) || bathrooms.length > 0)) {
      filterBy += filterBy === "" ? "bathrooms" : ",bathrooms";
      if (Array.isArray(bathrooms)) {
      const filteredStatus = bathrooms.filter(item => !!item);
      if (filteredStatus.length > 0) {
        filterValue += filterValue === "" ? `${filteredStatus.join('|')}` : `,${filteredStatus.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${bathrooms}` : `,${bathrooms}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!balconies && (!Array.isArray(balconies) || balconies.length > 0)) {
      filterBy += filterBy === "" ? "balconies" : ",balconies";
      if (Array.isArray(balconies)) {
      const filteredStatus = balconies.filter(item => !!item);
      if (filteredStatus.length > 0) {
        filterValue += filterValue === "" ? `${filteredStatus.join('|')}` : `,${filteredStatus.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${balconies}` : `,${balconies}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!garages && (!Array.isArray(garages) || garages.length > 0)) {
      filterBy += filterBy === "" ? "garages" : ",garages";
      if (Array.isArray(garages)) {
      const filteredStatus = garages.filter(item => !!item);
      if (filteredStatus.length > 0) {
        filterValue += filterValue === "" ? `${filteredStatus.join('|')}` : `,${filteredStatus.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${garages}` : `,${garages}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }

    if (!!suites && (!Array.isArray(suites) || suites.length > 0)) {
      filterBy += filterBy === "" ? "suites" : ",suites";
      if (Array.isArray(suites)) {
      const filteredStatus = suites.filter(item => !!item);
      if (filteredStatus.length > 0) {
        filterValue += filterValue === "" ? `${filteredStatus.join('|')}` : `,${filteredStatus.join('|')}`;
        filterType += filterType === "" ? "in" : ",in";
      }
      } else {
      filterValue += filterValue === "" ? `${suites}` : `,${suites}`;
      filterType += filterType === "" ? "in" : ",in";
      }
    }
    setLoadingInformations(true);
    try {
      const res = await propertiesService.getFieldsInformations(
        filterBy,
        filterValue,
        filterType
      );
      setInformations(res.data.fields.result);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Erro ao buscar informações dos imóveis");
    } finally {
      setLoadingInformations(false);
    }
  }, [  
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
    deeded,
    valorMaxRent,
    valorMinRent,
    bedrooms,
    suites,
    bathrooms,
    balconies,
    garages
  ]); // Add dependencies based on your filter criteria

  useEffect(() => {
    fetchInformations();
  }, [
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
    deeded,
    valorMaxRent,
    valorMinRent,
    bedrooms,
    suites,
    bathrooms,
    balconies,
    garages,
    fetchInformations
  ]);

  const [lists, setLists] = useState<any[]>([]);

  const fetchLists = async () => {
    const res = await listsService.getAll();
    setLists(res.data.lists.result);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  console.log("informations", informations);

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

  const handleSubmitVisit = async (values: any) => {
    selectedRowIds.forEach(async (id: string) => {
      const data = {
        date: values.date.format("YYYY-MM-DD HH:mm"),
        property_id: id,
        client_name: values?.client_name,
        client_phone: values?.client_phone,
        client_email: values?.client_email,
        status: values?.status,
        description: values?.description,
      }

      await schedulesService.create(data);
    });

    message.success("Visita agendada com sucesso");
    setOpenModalVisit(false);
    form.resetFields();
  };

  const handleDuplicateProperties = async () => {
    try {
      const res = await propertiesService.duplicateProperties(selectedRowIds);
      console.log(res);
      message.success("Imóveis duplicados com sucesso");
      fetchData();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Erro ao duplicar imóveis");
    }
  };

  const handleCreateList = async () => {
    try {
      const res = await listsService.create({
        name: listName,
        fields: fieldsList
      })
      
      message.success("Lista criada com sucesso");
      setOpenModalList(false);
      setListName("");
      setFieldsList([]);
      fetchLists();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Erro ao criar lista");
    }
  };

  const handleCopyList = async () => {
    //copiar para clipboard todos os campos da lista selecionada, os campos a serrem copiados serão os que estão selecionados na lista de campo fieldsList
    // então vai pegar os valores de todos os campos do array properties e copiar para clipboard
    const fieldsString = properties.map((property) => {
      return fieldsList.map((field) => property[field]).join(" - ");
    }).join("\n");
    
    const headerRow = fieldsList.map((field) => {
      console.log("field", field);
      const fieldMapping = [
        {key: 'reference', label: 'Referência'},
        {key: 'transaction', label: 'Transação'},
        {key: 'status', label: 'Status'},
        {key: 'type', label: 'Tipo'},
        {key: 'subtype', label: 'Subtipo'}, 
        {key: 'profile', label: 'Perfil'},
        {key: 'situation', label: 'Situação'},
        {key: 'condominium_name', label: 'Nome do Condomínio'},
        {key: 'block_section_tower', label: 'Quadra/Seção/Torre'},
        {key: 'apartment_store_lot_room', label: 'Apto/Loja/Lote/Sala'},
        {key: 'floor', label: 'Andar'},
        {key: 'blocks_sections_towers_in_condominium', label: 'Quadras/Seções/Torres no Condomínio'},
        {key: 'floors_in_condominium', label: 'Andares no Condomínio'},
        {key: 'units_per_floor_condominium', label: 'Unidades por Andar'},
        {key: 'units_in_condominium', label: 'Unidades no Condomínio'},
        {key: 'state', label: 'Estado'},
        {key: 'city', label: 'Cidade'},
        {key: 'district', label: 'Bairro'},
        {key: 'street', label: 'Rua'},
        {key: 'number', label: 'Número'},
        {key: 'complement', label: 'Complemento'},
        {key: 'area', label: 'Área'},
        {key: 'measurement_unit', label: 'Unidade de Medida'},
        {key: 'bedrooms', label: 'Quartos'},
        {key: 'suites', label: 'Suítes'},
        {key: 'bathrooms', label: 'Banheiros'},
        {key: 'balconies', label: 'Varandas'},
        {key: 'garages', label: 'Vagas'},
        {key: 'covered_garages', label: 'Vagas Cobertas'},
        {key: 'corner_property', label: 'Imóvel de Esquina'},
        {key: 'solar_position', label: 'Posição Solar'},
        {key: 'proximity_to_sea', label: 'Proximidade do Mar'},
        {key: 'subtitle', label: 'Subtítulo'},
        {key: 'property_description', label: 'Descrição do Imóvel'},
        {key: 'condominium_description', label: 'Descrição do Condomínio'},
        {key: 'role', label: 'Função'},
        {key: 'responsible1', label: 'Responsável 1'},
        {key: 'contact_responsible1', label: 'Contato Responsável 1'},
        {key: 'responsible2', label: 'Responsável 2'},
        {key: 'contact_responsible2', label: 'Contato Responsável 2'},
        {key: 'contact_link_responsible2', label: 'Link Contato Responsável 2'},
        {key: 'key_responsible', label: 'Responsável pela Chave'},
        {key: 'contact_key_responsible', label: 'Contato Responsável pela Chave'},
        {key: 'sale_price', label: 'Preço de Venda'},
        {key: 'sale_conditions', label: 'Condições de Venda'},
        {key: 'rental_price', label: 'Preço de Aluguel'},
        {key: 'rental_conditions', label: 'Condições de Aluguel'},
        {key: 'property_tax', label: 'IPTU'},
        {key: 'property_tax_period', label: 'Período IPTU'},
        {key: 'condominium_fee', label: 'Taxa de Condomínio'},
        {key: 'included_in_condominium', label: 'Incluído no Condomínio'},
        {key: 'other_fees', label: 'Outras Taxas'},
        {key: 'fees_description', label: 'Descrição das Taxas'},
        {key: 'deeded', label: 'Escriturado'},
        {key: 'financing_accepted', label: 'Aceita Financiamento'},
        {key: 'has_financing', label: 'Possui Financiamento'},
        {key: 'commission', label: 'Comissão'},
        {key: 'accepts_assets', label: 'Aceita Permuta'},
        {key: 'occupation', label: 'Ocupação'},
        {key: 'exclusive', label: 'Exclusivo'},
        {key: 'notes', label: 'Observações'},
        {key: 'capture_link', label: 'Link de Captura'},
        {key: 'site_link', label: 'Link do Site'},
        {key: 'olx_link', label: 'Link OLX'},
        {key: 'update_message', label: 'Mensagem de Atualização'},
        {key: 'construction_year', label: 'Ano de Construção'},
        {key: 'delivery_forecast', label: 'Previsão de Entrega'},
        {key: 'builder', label: 'Construtora'},
        {key: 'user', label: 'Usuário'},
        {key: 'created_at', label: 'Criado em'},
        {key: 'updated_at', label: 'Atualizado em'}
      ].find(f => f.key === field);
      console.log("fieldMapping", fieldMapping);
      return fieldMapping?.label || field;
    }).join(" - ");

    const fullString = headerRow + "\n" + fieldsString;

    navigator.clipboard.writeText(fullString);
    message.success("Lista copiada para clipboard");
  };

  const [messagem, setMessagem] = useState("");
  const [camposSelecionados, setCamposSelecionados] = useState<string[][]>([]);
  const [rules, setRules] = useState("");


  const fetchMessage = async () => {
    const imoveisInfo = camposSelecionados.map((campos: string[], index: number) => {
      return `Imóvel ${index + 1}: ${campos.join(" - ")}`;
    }).join("\n");

    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: imoveisInfo, rules: rules }),
      });
      const data = await response.json();
      setMessagem(data.question);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Erro ao criar mensagem");
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-center text-orange-400 mb-4">
          Listagem de Imóveis
        </h1>
        {/*criar uma barra de pesquisa*/}
        <div className="md:flex xs:grid justify-between">
          <div className="md:absolute xs:top-4 md:top-0 md:grid">
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                // router.push("/imoveis/cadastro");
                setVisibleRegisterModal(true);
                setDataToEdit({
                  reference: "",
                  type: "",
                  transaction: "",
                  status: "",
                  condominium_name: "",
                  subtype: "",
                  profile: "",
                  situation: "",
                  exclusive: "",
                  commission: "",
                  state: "",
                  city: "",
                  district: "",
                  street: "",
                  number: "",
                  complement: "",
                  area: "",
                  measurement_unit: "",
                  block_section_tower: "",
                  apartment_store_lot_room: "",
                  floor: "",
                  bedrooms: "",
                  suites: "",
                  bathrooms: "",
                  balconies: "",
                  garages: "",
                  covered_garages: "",
                  blocks_sections_towers_in_condominium: "",
                  units_in_condominium: "",
                  units_per_floor_condominium: "",
                  sale_price: "",
                  sale_conditions: "",
                  accepts_assets: "",
                  condominium_fee: "",
                  included_in_condominium: "",
                  other_fees: "",
                  fees_description: "",
                  deeded: "",
                  has_financing: "",
                  financing_accepted: "",
                  occupation: "",
                  corner_property: "",
                  solar_position: "",
                  proximity_to_sea: "",
                  role: "",
                  responsible1: "",
                  contact_responsible1: "",
                  key_responsible: "",
                  contact_key_responsible: "",
                  responsible2: "",
                  contact_responsible2: "",
                  contact_link_responsible2: "",
                  construction_year: "",
                  delivery_forecast: "",
                  builder: "",
                  capture_link: "",
                  site_link: "",
                  olx_link: "",
                  update_message: "",
                  subtitle: "",
                  property_description: "",
                  condominium_description: "",
                  notes: "",
                });
                setIsEditing(false);
              }}
            >
              Cadastrar
            </button>
          </div>
          <Modal
            title="Cadastrar Imóvel"
            visible={visibleRegisterModal}
            width={"90%"}
            onCancel={() => setVisibleRegisterModal(false)}
            centered
            footer={null}
          >
            <FormRegister
              data={dataToEdit}
              informations={informations}
              isEditing={isEditing}
              setVisibleRegisterModal={setVisibleRegisterModal}
            />
          </Modal>
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
                  name: ["valor_min_rent"],
                  value: valorMinRent,
                },
                {
                  name: ["valor_max_rent"],
                  value: valorMaxRent,
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
                  name: ["deeded"],
                  value: deeded,
                },
                {
                  name: ["bedrooms"],
                  value: bedrooms,
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
                    label={<span className="font-bold">Subtitulo</span>}
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
                    label={<span className="font-bold">Transação</span>}
                    name="negocio"
                  >
                    <Select
                      placeholder="Selecione"
                      allowClear
                      mode="tags"
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
                      <Select.Option value="Venda">Venda</Select.Option>
                      <Select.Option value="Aluguel">Aluguel</Select.Option>
                      <Select.Option value="Venda/Aluguel">
                        Venda/Aluguel
                      </Select.Option>
                      <Select.Option value="Venda Repasse">
                        Venda Repasse
                      </Select.Option>
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
                      mode="tags"
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
              </Row>
              <Row gutter={16}>
              <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Valor Mínimo Venda</span>}
                    name="valor_min"
                  >
                    <Input
                      // disabled
                      disabled={(!negocio.some(item => item?.includes("Venda")) && negocio.length > 0)}
                      allowClear
                      placeholder="R$ 0,00"
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
                    label={<span className="font-bold">Valor Máximo Venda</span>}
                    name="valor_max"
                  >
                    <Input
                      // disabled
                      disabled={(!negocio.some(item => item?.includes("Venda")) && negocio.length > 0)}
                      allowClear
                      placeholder="R$ 1.000.000,00"
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(/\D/g, "");
                        const formatted = new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                        }).format(Number(inputValue) / 100);
                        console.log("formatted", formatted);
                        setValorMax(formatted);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Valor Mínimo Aluguel</span>}
                    name="valor_min_rent"
                  >
                    <Input
                        // disabled
                        disabled={(!negocio.some(item => item?.includes("Aluguel")) && negocio.length > 0)}
                        allowClear
                        placeholder="R$ 0,00"
                        onChange={(e) => {
                        const inputValue = e.target.value.replace(/\D/g, "");
                        const formatted = new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                        }).format(Number(inputValue) / 100);
                        setValorMinRent(formatted);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Valor Máximo Aluguel</span>}
                    name="valor_max_rent"
                  >
                    <Input
                      // disabled
                      disabled={(!negocio.some(item => item?.includes("Aluguel")) && negocio.length > 0)}
                      allowClear
                      placeholder="R$ 1.000.000,00"
                      onChange={(e) => {
                        const inputValue = e.target.value.replace(/\D/g, "");
                        const formatted = new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          minimumFractionDigits: 2,
                        }).format(Number(inputValue) / 100);
                        console.log("formatted", formatted);
                        setValorMaxRent(formatted);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Tipo de Imóvel</span>}
                    name="tipo_imovel"
                  >
                    <Select
                      placeholder="Selecione"
                      allowClear
                      mode="tags"
                      onChange={(value) => {
                        setTipo(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      loading={loadingInformations}
                    >
                      {informations?.type?.map((item: any) => (
                        <Select.Option key={item} value={item}>
                          {item}
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
                    <Select
                      placeholder="Selecione"
                      allowClear
                      mode="tags"
                      onChange={(value) => {
                        setCidade(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      loading={loadingInformations}
                    >
                      {informations?.cities?.map((city: any) => (
                        <Select.Option key={city} value={city}>
                          {city}
                        </Select.Option>
                      ))}
                    </Select>
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
                      mode="tags"
                      onChange={(value) => {
                        setBairro(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      loading={loadingInformations}
                    >
                      {informations?.district?.map((item: any) => (
                        <Select.Option key={item} value={item}>
                          {item}
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
                      mode="tags"
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
                      loading={loadingInformations}
                    >
                      {informations?.condominium_name?.map((item: any) => (
                        <Select.Option key={item} value={item}>
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Escriturado</span>}
                    name="deeded"
                  >
                    <Select
                      placeholder="Selecione"
                      allowClear
                      onChange={(value) => {
                        setDeeded(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Select.Option value={true}>Sim</Select.Option>
                      <Select.Option value={false}>Não</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Dormitórios</span>}
                    name="bedrooms"
                  >
                    <Select
                      placeholder="Selecione"
                      mode="tags"
                      allowClear
                      onChange={(value) => {
                        setBedrooms(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Select.Option value={1}>1</Select.Option>
                      <Select.Option value={2}>2</Select.Option>
                      <Select.Option value={3}>3</Select.Option>
                      <Select.Option value={4}>4</Select.Option>
                      <Select.Option value={5}>5</Select.Option>
                      <Select.Option value={6}>6</Select.Option>
                      <Select.Option value={7}>7</Select.Option>
                      <Select.Option value={8}>8</Select.Option>
                      <Select.Option value={9}>9</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Suites</span>}
                    name="suites"
                  >
                    <Select
                      placeholder="Selecione"
                      mode="tags"
                      allowClear
                      onChange={(value) => {
                        setSuites(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Select.Option value={1}>1</Select.Option>
                      <Select.Option value={2}>2</Select.Option>
                      <Select.Option value={3}>3</Select.Option>
                      <Select.Option value={4}>4</Select.Option>
                      <Select.Option value={5}>5</Select.Option>
                      <Select.Option value={6}>6</Select.Option>
                      <Select.Option value={7}>7</Select.Option>
                      <Select.Option value={8}>8</Select.Option>
                      <Select.Option value={9}>9</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Banheiros</span>}
                    name="bathrooms"
                  >
                    <Select
                      placeholder="Selecione"
                      mode="tags"
                      allowClear
                      onChange={(value) => {
                        setBathrooms(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Select.Option value={1}>1</Select.Option>
                      <Select.Option value={2}>2</Select.Option>
                      <Select.Option value={3}>3</Select.Option>
                      <Select.Option value={4}>4</Select.Option>
                      <Select.Option value={5}>5</Select.Option>
                      <Select.Option value={6}>6</Select.Option>
                      <Select.Option value={7}>7</Select.Option>
                      <Select.Option value={8}>8</Select.Option>
                      <Select.Option value={9}>9</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Varandas</span>}
                    name="balconies"
                  >
                    <Select
                      placeholder="Selecione"
                      mode="tags"
                      allowClear
                      onChange={(value) => {
                        setBalconies(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Select.Option value={1}>1</Select.Option>
                      <Select.Option value={2}>2</Select.Option>
                      <Select.Option value={3}>3</Select.Option>
                      <Select.Option value={4}>4</Select.Option>
                      <Select.Option value={5}>5</Select.Option>
                      <Select.Option value={6}>6</Select.Option>
                      <Select.Option value={7}>7</Select.Option>
                      <Select.Option value={8}>8</Select.Option>
                      <Select.Option value={9}>9</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} xl={6}>
                  <Form.Item
                    label={<span className="font-bold">Garagens</span>}
                    name="garages"
                  >
                    <Select
                      placeholder="Selecione"
                      mode="tags"
                      allowClear
                      onChange={(value) => {
                        setGarages(value);
                      }}
                      showSearch
                      filterOption={(input, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Select.Option key="1" value="1">1</Select.Option>
                      <Select.Option key="2" value="2">2</Select.Option>
                      <Select.Option key="3" value="3">3</Select.Option>
                      <Select.Option key="4" value="4">4</Select.Option>
                      <Select.Option key="5" value="5">5</Select.Option>
                      <Select.Option key="6" value="6">6</Select.Option>
                      <Select.Option key="7" value="7">7</Select.Option>
                      <Select.Option key="8" value="8">8</Select.Option>
                      <Select.Option key="9" value="9">9</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                {/* <Col xs={24} sm={12} md={8} xl={6}>
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
                </Col> */}
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={24} xl={24}>
                  <Form.Item
                    label={<span className="font-bold">Busca Geral</span>}
                    name="search"
                  >
                    <Input 
                      placeholder="Buscar por referência, título, endereço..." 
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
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
      <div className="flex flex-wrap justify-start gap-4 mb-4">
        <button 
          disabled={selectedRowIds.length === 0} 
          className={`bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto ${selectedRowIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={handleDuplicateProperties}
        >
          Duplicar
        </button>
        <button 
          disabled={selectedRowIds.length === 0} 
          className={`bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto ${selectedRowIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={() => setOpenModalList(true)}
        >
          Criar / Copiar Lista
        </button>
        <button 
          disabled={selectedRowIds.length === 0} 
          className={`bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto ${selectedRowIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={() => setOpenModalMessage(true)}
        >
          Criar Mensagem
        </button>
        <button 
          disabled={selectedRowIds.length === 0} 
          className={`bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto ${selectedRowIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={() => setOpenModalVisit(true)}
        >
          Agendar Visita
        </button>

        {isSuperAdmin && (
          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            <button 
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto" 
              onClick={() => {
                Modal.confirm({
                  title: 'Confirmação',
                  content: 'Tem certeza que deseja excluir todos os imóveis do banco de dados?',
                  onOk: async () => {
                    await propertiesService.deleteAllProperties();
                    fetchData();
                  }
                });
              }}
            >
              Excluir Todos
            </button>
            <Upload {...props}>
              <Button icon={<UploadOutlined />} className="w-full sm:w-auto">
                Importar Imóveis
              </Button>
            </Upload>
          </div>
        )}
      </div>
      <Modal
        title="Mensagem"
        open={openModalMessage}
        onCancel={() => setOpenModalMessage(false)}
        footer={null}
        width={"90%"}
      >
        <Form
          layout="vertical"
        >
          <Form.Item label="Regras" name="rules"> 
            <Input.TextArea
              placeholder="Digite as regras"
              onChange={(e) => setRules(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Campos" name="fields">
            <Select
              placeholder="Selecione o campo"
          onChange={(value) => {
            //pegar os imoveis selecionados
            const selectedProperties = properties.filter((property) => selectedRowIds.includes(property.id));

            //em selectedProperties, pegar os campos que estão no value
            const selectedFields = selectedProperties.map((property) => {
              return value.map((field: string) => property[field]);
            });

            setCamposSelecionados(selectedFields);
          }}
          style={{ width: '100%' }}
          mode="multiple"
          showSearch
          allowClear
        >
            {fields.map((field) => (
              <Select.Option key={field.key} value={field.key}>{field.label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        </Form>

        <div className="mt-4">
          <p className="text-sm">Valores Selecionados:</p>
          {camposSelecionados.map((campos, index) => (
            <p key={index} className="text-sm ml-2">
              Imóvel {index + 1}: {campos.join(", ")}
            </p>
          ))}
        </div>

        <div className="mt-4">
          <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" onClick={fetchMessage}>
            Gerar Mensagem
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm whitespace-pre-line">Mensagem: {messagem}</p>
        </div>
      </Modal>
      <Modal
        title="Lista Personalizada"
        open={openModalList}
        onCancel={() => setOpenModalList(false)}
        footer={null}
        width={"90%"}
      >
        <Segmented
        //vai ter duas opções: criar e selecionar
        options={[
          {
            label: "Criar",
            value: "create",
          },
          {
            label: "Selecionar",
            value: "select",
          }
        ]}
        onChange={(value) => {
          setTypeList(value as string );
        }}
        />
            <Form
              layout="vertical"
            >
          <Form.Item label="Selecione a lista" name="list">
            <Select
              placeholder="Selecione a lista"
              onChange={(value) => {
                const list = lists.find((list) => list.id === value);
                setFieldsList(list.fields);
              }}
            >
              {lists && lists?.map((list) => (
                <Select.Option key={list.id} value={list.id}>{list.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          {typeList === "create" && (
          <Form.Item label="Nome da Lista" name="name">
            <Input
              placeholder="Digite o nome da lista"
              onChange={(e) => setListName(e.target.value)}
            />
          </Form.Item>
          )}
          <Form.Item label="Selecione os campos para inserir na lista" name="name">
            <div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {fields.map((field) => (
                  <div
                    key={field.key}
                    className={`p-2 border rounded cursor-pointer ${
                      fieldsList.includes(field.key) ? 'bg-orange-500 text-white' : 'bg-white'
                    }`}
                    onClick={() => {
                      if (fieldsList.includes(field.key)) {
                        setFieldsList(fieldsList.filter(f => f !== field.key));
                      } else {
                        setFieldsList([...fieldsList, field.key]);
                      }
                    }}
                  >
                    {field.label}
                  </div>
                ))}
              </div>
            </div>
          </Form.Item>
        </Form>
        {typeList === "create" && (
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleCreateList}
            >
              Criar
            </button>
          )}
        {typeList === "select" && (
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleCopyList}
            >
              Copiar
            </button>
          )}
      </Modal>
      <Modal
        title="Visita"
        open={openModalVisit}
        onCancel={() => setOpenModalVisit(false)}
        footer={null}
        width={"90%"}
      >
       <Form 
          layout="vertical"
          form={form}
          onFinish={handleSubmitVisit}
           >
          <Form.Item
            label="Data"
            name="date"
            rules={[{ required: true, message: "Por favor selecione a data e o horário" }]}
          >
            <DatePicker
              format="DD/MM/YYYY HH:mm"
              showTime
              style={{ width: "100%" }}
              disabledDate={(current) => {
                return current && current < dayjs().startOf('day');
              }}
              allowClear
              onChange={(value) => {
                if (value) {
                  form.setFieldsValue({ date: value });
                }
              }}
            />
          </Form.Item>

          {/* <Form.Item
            label="Imóvel"
            name="property_id"
            rules={[
              { required: true, message: "Por favor selecione o imóvel" },
            ]}
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                option?.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {properties.map((property: any) => (
                <Select.Option 
                key={property.id} 
                value={property.id}
                >
                  {property.reference}
                  </Select.Option>
              ))}
            </Select>
          </Form.Item> */}

          <Form.Item
            label="Nome do Cliente"
            name="client_name"
            rules={[
              { required: true, message: "Por favor insira o nome do cliente" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Telefone do Cliente"
            name="client_phone"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email do Cliente"
            name="client_email"
            rules={[
              { type: "email", message: "Email inválido" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[
              { required: true, message: "Por favor selecione o status" },
            ]}
          >
            <Select>
              <Select.Option value="confirmed">Confirmado</Select.Option>
              <Select.Option value="pending">Pendente</Select.Option>
              <Select.Option value="canceled">Cancelado</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Descrição" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <div className="flex justify-end">
            <button onClick={() => {
              setOpenModalVisit(false);
              form.resetFields();
            }} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
              Cancelar
            </button>
            <button key="submit" type="submit" className=" ml-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md" >
              Salvar
            </button>
          </div>
        </Form>
      </Modal>

      <Table
        rowKey={(record) => record.id || record.reference}
        rowSelection={{
          type: 'checkbox',
          getCheckboxProps: (record) => ({
            name: record.reference,
            key: record.id || record.reference
          }),
          onChange: (selectedRowKeys: React.Key[], selectedRows) => {
            const validKeys = Array.isArray(selectedRowKeys) ? selectedRowKeys : [];
            setSelectedRowIds(validKeys as string[]);
          },
          selectedRowKeys: selectedRowIds,
        }}
        columns={[
          {
            title: "Referência",
            dataIndex: "reference",
            key: "reference",
            width: 100,
          },
          {
            title: "Preço de Venda",
            dataIndex: "sale_price",
            key: "sale_price",
            width: 100,
          },
          {
            title: "Transação",
            dataIndex: "transaction",
            key: "transaction",
            width: 100,
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 100,
          },
          {
            title: "Tipo",
            dataIndex: "type",
            key: "type",
            width: 130,
          },
          {
            title: "Subtipo",
            dataIndex: "subtype",
            key: "subtype",
            width: 100,
          },
          {
            title: "Perfil",
            dataIndex: "profile",
            key: "profile",
            width: 300,
          },
          {
            title: "Cidade",
            dataIndex: "city",
            key: "city",
            width: 150,
          },
          {
            title: "Bairro",
            dataIndex: "district",
            key: "district",
            width: 300,
          },
          {
            title: "Situação",
            dataIndex: "situation",
            key: "situation",
            width: 300,
          },
          {
            title: "Subtitulo",
            dataIndex: "subtitle",
            key: "subtitle",
            width: 500,
          },
          {
            title: "Nome do Condominio",
            dataIndex: "condominium_name",
            key: "condominium_name",
            width: 300,
          },
          {
            title: "Bloco / Quadra / Torre",
            dataIndex: "block_section_tower",
            key: "block_section_tower",
            width: 300,
          },
          {
            title: "Ap / Loja / Lote / Sala",
            dataIndex: "apartment_store_lot_room",
            key: "apartment_store_lot_room",
            width: 300,
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
                      setVisibleRegisterModal(true);
                      setDataToEdit(record);
                      setIsEditing(true);
                    }}
                  />
                  <DeleteOutlined
                    className="text-orange-500 hover:text-orange-700 text-xl"
                    onClick={() => {
                      Modal.confirm({
                        title: 'Confirmação',
                        content: 'Tem certeza que deseja excluir este imóvel?',
                        okText: 'Sim',
                        cancelText: 'Não',
                        okType: 'danger',
                        onOk: async () => { 
                          try {
                            await propertiesService.deleteProperties(record.id);
                            // Refresh data after deletion
                            fetchData();
                          } catch (error: any) {
                            Modal.error({
                              title: 'Erro',
                              content: error?.response?.data?.message || "Erro ao deletar imóvel"
                            });
                          }
                        }
                      });
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
    </div>
  );
}
