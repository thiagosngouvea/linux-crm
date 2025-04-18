import React, { useCallback, useEffect, useState } from "react";
import { propertiesService } from "@/services/linux-properties.service";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { FormRegister } from "@/components/FormRegister";

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
      console.log("error", error);
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
      console.log("error", error);
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
      <Table
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
                          } catch (error) {
                            console.error("Error deleting property:", error);
                            Modal.error({
                              title: 'Erro',
                              content: 'Ocorreu um erro ao excluir o imóvel.'
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
