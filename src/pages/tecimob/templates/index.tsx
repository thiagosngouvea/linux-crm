import React, { useState } from "react";
import {
  Button,
  Input,
  Card,
  Typography,
  Row,
  Col,
  Upload,
  Space,
  Divider,
} from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { tecimobService } from "../../../services/tecimob.service";
import type { UploadFile } from "antd/es/upload/interface";
import html2canvas from "html2canvas";
import { parse } from "cookie";
import Cookies from "js-cookie";
import Logo from "../../../assets/logo.png";

const { Title, Text } = Typography;

interface TemplateData {
  titulo: string;
  quartos: string;
  vagas: string;
  area: string;
  valor: string;
  fotos: UploadFile[];
  referencia: string;
}

// Dimensões recomendadas para status do WhatsApp: 1080x1920 (9:16)
const WHATSAPP_STATUS_WIDTH = 1080;
const WHATSAPP_STATUS_HEIGHT = 1920;

function Templates({ token }: { token: string }) {
  const [templateData, setTemplateData] = useState<TemplateData>({
    titulo: "",
    quartos: "",
    vagas: "",
    area: "",
    valor: "",
    fotos: [],
    referencia: "",
  });

  const [reference, setReference] = useState<string>("");
  const [imovel, setImovel] = useState<any>({});

  const handleInputChange = (name: string, value: string) => {
    setTemplateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setTemplateData((prev) => ({ ...prev, fotos: fileList }));
  };

  const downloadTemplate = async () => {
    // Cria um canvas 1080x1920 (proporção 9:16 para status do WhatsApp)
    const canvas = document.createElement("canvas");
    canvas.width = WHATSAPP_STATUS_WIDTH;
    canvas.height = WHATSAPP_STATUS_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fundo
    ctx.fillStyle = "#eee";
    ctx.fillRect(0, 0, WHATSAPP_STATUS_WIDTH, WHATSAPP_STATUS_HEIGHT);

    // Imagem principal (ocupa toda a altura)
    if (templateData.fotos.length > 0) {
      const mainImg = new window.Image();
      mainImg.crossOrigin = "anonymous";
      mainImg.src = templateData.fotos[0].originFileObj
        ? URL.createObjectURL(templateData.fotos[0].originFileObj)
        : templateData.fotos[0].url ?? templateData.fotos[0].thumbUrl ?? "";
      await new Promise((resolve) => {
        mainImg.onload = resolve;
        mainImg.onerror = resolve;
      });
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(WHATSAPP_STATUS_WIDTH, 0);
      ctx.lineTo(WHATSAPP_STATUS_WIDTH, WHATSAPP_STATUS_HEIGHT);
      ctx.lineTo(0, WHATSAPP_STATUS_HEIGHT);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(
        mainImg,
        0,
        0,
        WHATSAPP_STATUS_WIDTH,
        WHATSAPP_STATUS_HEIGHT
      );
      ctx.restore();
    }

    // Informações do imóvel (sobreposição na parte inferior da imagem principal)
    const infoBoxY = Math.round(WHATSAPP_STATUS_HEIGHT * 0.65);
    const infoBoxHeight = 450;
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, infoBoxY, WHATSAPP_STATUS_WIDTH, infoBoxHeight);
    ctx.restore();

    // Título (laranja, bold)
    ctx.save();
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = "#ff6b00";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(
      templateData.titulo || "VENDO APARTAMENTO",
      24,
      infoBoxY + 24,
      WHATSAPP_STATUS_WIDTH - 48
    );
    ctx.restore();

    // Detalhes (quartos | vagas | área)
    ctx.save();
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const detailsArr = [
      templateData.quartos && `${templateData.quartos} QUARTOS`,
      templateData.vagas && `${templateData.vagas} VAGA(S)`,
      templateData.area && `${templateData.area}M²`,
    ].filter(Boolean);
    ctx.fillText(
      detailsArr.join("   |   "),
      24,
      infoBoxY + 80,
      WHATSAPP_STATUS_WIDTH - 48
    );
    ctx.restore();

    // Imagens secundárias (até 3)
    const secondaryFotos = templateData.fotos.slice(1, 4);
    const imgGap = 16;
    const imgWidth = 320;
    const imgHeight = 300;
    const totalImgs = secondaryFotos.length;
    const totalWidth = totalImgs * imgWidth + (totalImgs - 1) * imgGap;
    let startX = (WHATSAPP_STATUS_WIDTH - totalWidth) / 2;
    const imgY = infoBoxY + 130;

    for (let i = 0; i < totalImgs; i++) {
      const file = secondaryFotos[i];
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = file.originFileObj
        ? URL.createObjectURL(file.originFileObj)
        : file.url ?? file.thumbUrl ?? "";
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
      ctx.save();
      // Borda arredondada
      ctx.beginPath();
      const radius = 16;
      ctx.moveTo(startX + radius, imgY);
      ctx.lineTo(startX + imgWidth - radius, imgY);
      ctx.quadraticCurveTo(
        startX + imgWidth,
        imgY,
        startX + imgWidth,
        imgY + radius
      );
      ctx.lineTo(startX + imgWidth, imgY + imgHeight - radius);
      ctx.quadraticCurveTo(
        startX + imgWidth,
        imgY + imgHeight,
        startX + imgWidth - radius,
        imgY + imgHeight
      );
      ctx.lineTo(startX + radius, imgY + imgHeight);
      ctx.quadraticCurveTo(
        startX,
        imgY + imgHeight,
        startX,
        imgY + imgHeight - radius
      );
      ctx.lineTo(startX, imgY + radius);
      ctx.quadraticCurveTo(startX, imgY, startX + radius, imgY);
      ctx.closePath();
      ctx.clip();

      // Fundo claro
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(startX, imgY, imgWidth, imgHeight);

      // Imagem
      ctx.drawImage(img, startX, imgY, imgWidth, imgHeight);
      ctx.restore();

      // Borda e sombra
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(startX + radius, imgY);
      ctx.lineTo(startX + imgWidth - radius, imgY);
      ctx.quadraticCurveTo(
        startX + imgWidth,
        imgY,
        startX + imgWidth,
        imgY + radius
      );
      ctx.lineTo(startX + imgWidth, imgY + imgHeight - radius);
      ctx.quadraticCurveTo(
        startX + imgWidth,
        imgY + imgHeight,
        startX + imgWidth - radius,
        imgY + imgHeight
      );
      ctx.lineTo(startX + radius, imgY + imgHeight);
      ctx.quadraticCurveTo(
        startX,
        imgY + imgHeight,
        startX,
        imgY + imgHeight - radius
      );
      ctx.lineTo(startX, imgY + radius);
      ctx.quadraticCurveTo(startX, imgY, startX + radius, imgY);
      ctx.closePath();
      ctx.strokeStyle = "#eee";
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(0,0,0,0.08)";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();

      startX += imgWidth + imgGap;
    }

    // Referência (cinza, itálico)
    if (templateData.referencia) {
      ctx.save();
      ctx.font = "italic 18px Arial";
      ctx.fillStyle = "#888";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(
        `REF: ${templateData.referencia}`,
        24,
        infoBoxY + infoBoxHeight - 40,
        WHATSAPP_STATUS_WIDTH - 48
      );
      ctx.restore();
    }

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `imovel-whatsapp-status-${
          templateData.referencia || "template"
        }.png`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      }
    }, "image/png");
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
          });
        // console.log(res.data.data);
        // setImovel(res.data.data[0]);
      });
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={24}>
        {/* Formulário */}
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

        {/* Preview */}
        <Col xs={24} md={24}>
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
                //   zIndex: 1,-
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
                    style={{
                      width: 1080,
                      height: 1920,
                      position: "relative",
                      background: "#eee",
                      overflow: "hidden",
                      borderRadius: 16,
                    }}
                  >
                    {/* Imagem principal */}
                    {imovel?.images?.length > 0 && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%", // Ajuste para ocupar 55% do container pai (ou use '100%' se desejar)
                          position: "relative",
                        }}
                      >
                        <img
                          src={imovel?.images[0].file_url.large}
                          alt="Imagem principal"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            display: "block",
                            filter: "none",
                            imageRendering: "auto",
                          }}
                          draggable={false}
                          loading="eager"
                        />
                      </div>
                    )}
                    {/* Faixa laranja e valor */}

                    {/* <div
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                gap: 24,
                                                position: 'absolute',
                                                left: 0,
                                                right: 0,
                                                bottom: 320,
                                                zIndex: 2,
                                                justifyContent: 'center',
                                                color: 'black',
                                            }}>
                                            <span style={{ fontSize: 56, fontWeight: 'bold', textShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
                                                Valor: R$ {templateData.valor}
                                            </span>
                                        </div> */}
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        height: 100,
                        // zIndex: 1000000, // aumenta o zIndex para garantir que fique acima das sombras
                        padding: 24,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        pointerEvents: "none", // garante que não bloqueie interações abaixo
                      }}
                      className="z-20"
                    >
                      <div
                        style={{
                          color: "#ff9100", // cor mais vibrante e visível
                          fontWeight: "bold",
                          fontSize: 128,
                          marginTop: 300,
                        //   zIndex: 1000000,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textShadow: "0 12px 48px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25)", // reforça contraste
                          pointerEvents: "none",
                          fontFamily:
                            "'Montserrat', 'Segoe UI', 'Arial', sans-serif",
                          letterSpacing: 4,
                        }}
                      >
                        {imovel?.transaction === 1 ? "VENDO" : "ALUGO"}
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
                          textShadow: "0 8px 32px rgba(0,0,0,0.25)", // opcional: reforça contraste acima das sombras
                          pointerEvents: "none",
                          wordBreak: "break-word",
                          textAlign: "center",
                          fontFamily:
                            "'Montserrat', 'Segoe UI', 'Arial', sans-serif",
                        }}
                      >
                        {imovel?.title}
                      </div>
                    </div>
                    {/* Informações do imóvel */}
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: Math.round(1920 * 0.65),
                        height: 450,
                        background: "rgba(255, 140, 0, 0.50)",
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
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        {[
                          {
                            value: imovel?.rooms?.bedroom?.title_formated,
                            icon: (
                              <i
                                className="anticon"
                                style={{
                                  marginRight: 6,
                                  fontSize: 22,
                                  color: "#f37900",
                                }}
                              >
                                <span
                                  role="img"
                                  className="anticon anticon-home"
                                />
                                <svg
                                  viewBox="64 64 896 896"
                                  focusable="false"
                                  data-icon="home"
                                  width="1em"
                                  height="1em"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path d="M946.5 505L557.6 176.5a60.2 60.2 0 0 0-79.2 0L77.5 505a7.9 7.9 0 0 0-1.5 11.1l21.2 28.3a7.9 7.9 0 0 0 11.1 1.5L151 517.6V856c0 17.7 14.3 32 32 32h658c17.7 0 32-14.3 32-32V517.6l42.7 28.3a7.9 7.9 0 0 0 11.1-1.5l21.2-28.3a7.9 7.9 0 0 0-1.5-11.1zM792 848H232V504.4l280-233.3 280 233.3V848z"></path>
                                </svg>
                              </i>
                            ),
                          },
                          {
                            value: imovel?.rooms?.suite?.title_formated,
                            icon: (
                              <i
                                className="anticon"
                                style={{
                                  marginRight: 6,
                                  fontSize: 22,
                                  color: "#f37900",
                                }}
                              >
                                <span
                                  role="img"
                                  className="anticon anticon-star"
                                />
                                <svg
                                  viewBox="64 64 896 896"
                                  focusable="false"
                                  data-icon="star"
                                  width="1em"
                                  height="1em"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path d="M908.1 353.1l-246.6-36-110.2-223.4c-5.5-11.1-16.7-18.1-29-18.1s-23.5 7-29 18.1L338.5 317.1 91.9 353.1c-12.2 1.8-22.5 10.3-26.4 21.9-3.9 11.6-.7 24.3 8.1 32.8l178.4 173.9-42.1 245.5c-2.1 12.2 2.9 24.7 12.9 32.1 10 7.4 23.2 8.4 34.1 2.6L512 792.6l220.1 115.5c4.7 2.5 9.8 3.7 14.9 3.7 6.7 0 13.3-2.1 19-6.3 10-7.4 15-19.9 12.9-32.1l-42.1-245.5 178.4-173.9c8.8-8.5 12-21.2 8.1-32.8-3.9-11.6-14.2-20.1-26.4-21.9z"></path>
                                </svg>
                              </i>
                            ),
                          },
                          {
                            value: imovel?.rooms?.garage?.title_formated,
                            icon: (
                              <i
                                className="anticon"
                                style={{
                                  marginRight: 6,
                                  fontSize: 22,
                                  color: "#f37900",
                                }}
                              >
                                <span
                                  role="img"
                                  className="anticon anticon-car"
                                />
                                <svg
                                  viewBox="64 64 896 896"
                                  focusable="false"
                                  data-icon="car"
                                  width="1em"
                                  height="1em"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path d="M959.6 494.7l-54.2-162.6c-8.2-24.6-31.1-41.1-57.1-41.1H175.7c-26 0-48.9 16.5-57.1 41.1L64.4 494.7c-2.2 6.6-3.4 13.5-3.4 20.5v320.2c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-32h640v32c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V515.2c0-7-1.2-13.9-3.4-20.5zM175.7 352h692.6l54.2 162.6H121.5L175.7 352zm-47.7 483.4V515.2h768v320.2h-64v-32c0-17.7-14.3-32-32-32H224c-17.7 0-32 14.3-32 32v32h-64zm128-64c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zm512 0c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64z"></path>
                                </svg>
                              </i>
                            ),
                          },
                          // {
                          //     value: imovel?.rooms?.bathroom?.title_formated,
                          //     icon: <i className="anticon" style={{marginRight: 6, fontSize: 22, color: '#f37900'}}><span role="img" className="anticon anticon-rest" /><svg viewBox="64 64 896 896" focusable="false" data-icon="rest" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M832 112H192c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H232V184h560v656z"></path></svg></i>
                          // },
                          // {
                          //     value: imovel?.rooms?.livingroom?.title_formated,
                          //     icon: <i className="anticon" style={{marginRight: 6, fontSize: 22, color: '#f37900'}}><span role="img" className="anticon anticon-apartment" /><svg viewBox="64 64 896 896" focusable="false" data-icon="apartment" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M888 760h-56V184c0-17.7-14.3-32-32-32H224c-17.7 0-32 14.3-32 32v576h-56c-17.7 0-32 14.3-32 32v56c0 17.7 14.3 32 32 32h752c17.7 0 32-14.3 32-32v-56c0-17.7-14.3-32-32-32zm-664-24V200h576v536H224zm664 88H136v-56h752v56z"></path></svg></i>
                          // },
                          // {
                          //     value: imovel?.rooms?.diningroom?.title_formated,
                          //     icon: <i className="anticon" style={{marginRight: 6, fontSize: 22, color: '#f37900'}}><span role="img" className="anticon anticon-table" /><svg viewBox="64 64 896 896" focusable="false" data-icon="table" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M904 160H120c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h784c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 632H160V232h704v560z"></path></svg></i>
                          // },
                          // {
                          //     value: imovel?.rooms?.kitchen?.title_formated,
                          //     icon: <i className="anticon" style={{marginRight: 6, fontSize: 22, color: '#f37900'}}><span role="img" className="anticon anticon-fire" /><svg viewBox="64 64 896 896" focusable="false" data-icon="fire" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M834.9 581.1c-6.2-13.2-13.2-25.9-21.1-38.1-7.9-12.2-16.6-23.7-26.1-34.5-9.5-10.8-19.7-20.9-30.6-30.3-10.9-9.4-22.4-17.9-34.5-25.5-12.1-7.6-24.7-14.2-37.8-19.7-13.1-5.5-26.7-9.9-40.7-13.2-14-3.3-28.4-5.5-43.1-6.6-14.7-1.1-29.7-1.1-44.9 0-15.2 1.1-30.1 3.3-44.7 6.6-14.6 3.3-28.8 7.7-42.6 13.2-13.8 5.5-27.1 12.1-39.9 19.7-12.8 7.6-25.1 16.1-36.9 25.5-11.8 9.4-22.9 19.5-33.3 30.3-10.4 10.8-20.1 22.3-29.1 34.5-9 12.2-17.2 24.9-24.7 38.1-7.5 13.2-14.2 26.9-20.1 41.1-5.9 14.2-11 28.8-15.3 43.8-4.3 15-7.8 30.4-10.5 46.1-2.7 15.7-4.6 31.7-5.7 48-1.1 16.3-1.6 32.9-1.6 49.8 0 17.7 14.3 32 32 32h576c17.7 0 32-14.3 32-32 0-16.9-.5-33.5-1.6-49.8-1.1-16.3-3-32.3-5.7-48-2.7-15.7-6.2-31.1-10.5-46.1-4.3-15-9.4-29.6-15.3-43.8-5.9-14.2-12.6-27.9-20.1-41.1z"></path></svg></i>
                          // },
                          // {
                          //     value: imovel?.rooms?.service_area?.title_formated,
                          //     icon: <i className="anticon" style={{marginRight: 6, fontSize: 22, color: '#f37900'}}><span role="img" className="anticon anticon-tool" /><svg viewBox="64 64 896 896" focusable="false" data-icon="tool" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M911.6 812.1l-99.7-99.7c-6.2-6.2-16.4-6.2-22.6 0l-67.9 67.9c-6.2 6.2-6.2 16.4 0 22.6l99.7 99.7c6.2 6.2 16.4 6.2 22.6 0l67.9-67.9c6.2-6.2 6.2-16.4 0-22.6zM512 128c-212.1 0-384 171.9-384 384 0 212.1 171.9 384 384 384s384-171.9 384-384c0-212.1-171.9-384-384-384zm0 704c-176.7 0-320-143.3-320-320s143.3-320 320-320 320 143.3 320 320-143.3 320-320 320z"></path></svg></i>
                          // },
                          // {
                          //     value: imovel?.rooms?.area?.value && `${imovel?.rooms?.area?.value}m²`,
                          //     icon: <i className="anticon" style={{marginRight: 6, fontSize: 22, color: '#f37900'}}><span role="img" className="anticon anticon-border" /><svg viewBox="64 64 896 896" focusable="false" data-icon="border" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M904 160H120c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h784c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 632H160V232h704v560z"></path></svg></i>
                          // }
                        ]
                          .filter((item) => !!item.value)
                          .map((item, idx, arr) => (
                            <span
                              key={idx}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {item.icon}
                              {item.value}
                              {idx < arr.length - 1 && (
                                <span
                                  style={{ margin: "0 12px", color: "#bbb" }}
                                >
                                  |
                                </span>
                              )}
                            </span>
                          ))}
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
                        {imovel?.calculated_price}
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
                        {imovel?.images
                          ?.slice(1, 4)
                          .map((file: any, idx: any) => {
                            const src = file.file_url.large;
                            return (
                              <img
                                key={file.uid || idx}
                                src={src}
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
                            );
                          })}
                      </div>

                      <div
                        style={{
                          color: "#888",
                          fontStyle: "italic",
                          fontSize: 18,
                        }}
                      >
                        {templateData.referencia &&
                          `REF: ${templateData.referencia}`}
                      </div>
                    </div>
                      <img src={Logo.src} alt="Logo" style={{ position: "absolute", bottom: 30, left: 0 }} />
                      <div 
                      style={{ 
                        position: "absolute", 
                        bottom: 30, 
                        right: 100, 
                        color: "#fff", 
                        fontSize: 32, 
                        fontWeight: "normal", 
                        textAlign: "center", 
                        }}>
                            <span style={{ display: "flex", alignItems: "center" }}>
                              ENTRE EM CONTATO
                            </span>
                            <span style={{ display: "flex", alignItems: "center", fontWeight: "bold", fontSize: 48 }}>
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
                Baixar imagem para Status do WhatsApp (1080x1920)
              </Button>
            </div>
            {/* Fim do Card */}
          </Card>
        </Col>
      </Row>
      {/* 
            Informações sobre a imagem de fundo 
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 3,
                    padding: 24,
                    background: 'rgba(255,255,255,0.85)',
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8
                }}
            >
                <Title level={3} style={{ color: '#ff6b00', margin: 0 }}>
                    {templateData.titulo || 'VENDO APARTAMENTO'}
                </Title>

                <Row style={{ marginTop: 16 }} justify="space-between">
                    <Col>
                        <Text strong>
                            {templateData.quartos && `${templateData.quartos} QUARTOS`}
                        </Text>
                    </Col>
                    <Col>
                        <Text strong>
                            {templateData.vagas && `${templateData.vagas} VAGA(S)`}
                        </Text>
                    </Col>
                    <Col>
                        <Text strong>
                            {templateData.area && `${templateData.area}M²`}
                        </Text>
                    </Col>
                </Row>

                <Divider style={{ margin: '16px 0' }} />

                <Title level={4} style={{ margin: 0 }}>
                    {templateData.valor && `R$ ${templateData.valor}`}
                </Title>

                <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                    {templateData.referencia && `REF: ${templateData.referencia}`}
                </Text>
            </div> 
            */}
      <Button
        type="primary"
        onClick={downloadTemplate}
        style={{ marginTop: 16, width: "100%" }}
      >
        Download Template (Status WhatsApp)
      </Button>
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
