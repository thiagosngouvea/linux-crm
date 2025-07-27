import React, { useState } from 'react';
import { 
    Button, 
    Input, 
    Card, 
    Typography, 
    Row, 
    Col, 
    Upload,
    Space,
    Divider
} from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import html2canvas from 'html2canvas';

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

function Templates() {
    const [templateData, setTemplateData] = useState<TemplateData>({
        titulo: '',
        quartos: '',
        vagas: '',
        area: '',
        valor: '',
        fotos: [],
        referencia: ''
    });

    const handleInputChange = (name: string, value: string) => {
        setTemplateData(prev => ({ ...prev, [name]: value }));
    };

    const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
        setTemplateData(prev => ({ ...prev, fotos: fileList }));
    };

    const downloadTemplate = async () => {
        // Cria um canvas 1080x1920 (proporção 9:16 para status do WhatsApp)
        const canvas = document.createElement('canvas');
        canvas.width = WHATSAPP_STATUS_WIDTH;
        canvas.height = WHATSAPP_STATUS_HEIGHT;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fundo
        ctx.fillStyle = '#eee';
        ctx.fillRect(0, 0, WHATSAPP_STATUS_WIDTH, WHATSAPP_STATUS_HEIGHT);

        // Imagem principal (ocupa o topo, cerca de 55% da altura)
        const mainImgHeight = Math.round(WHATSAPP_STATUS_HEIGHT * 0.55); // ~1056px
        if (templateData.fotos.length > 0) {
            const mainImg = new window.Image();
            mainImg.crossOrigin = 'anonymous';
            mainImg.src = templateData.fotos[0].originFileObj
                ? URL.createObjectURL(templateData.fotos[0].originFileObj)
                : (templateData.fotos[0].url || templateData.fotos[0].thumbUrl);
            await new Promise(resolve => {
                mainImg.onload = resolve;
                mainImg.onerror = resolve;
            });
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(24, 0);
            ctx.lineTo(WHATSAPP_STATUS_WIDTH - 24, 0);
            ctx.lineTo(WHATSAPP_STATUS_WIDTH - 24, mainImgHeight);
            ctx.lineTo(24, mainImgHeight);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(mainImg, 0, 0, WHATSAPP_STATUS_WIDTH, mainImgHeight);
            ctx.restore();
        }

        // Fundo laranja semi-transparente para valor e imagens secundárias
        const orangeBoxHeight = 320;
        const orangeBoxY = WHATSAPP_STATUS_HEIGHT - orangeBoxHeight - 64;
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = 'rgb(220, 126, 3)';
        ctx.fillRect(0, orangeBoxY, WHATSAPP_STATUS_WIDTH, orangeBoxHeight);
        ctx.restore();

        // Valor (centralizado na faixa laranja)
        ctx.save();
        ctx.font = 'bold 72px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.10)';
        ctx.shadowBlur = 8;
        ctx.fillText(
            `Valor: R$ ${templateData.valor || ''}`,
            WHATSAPP_STATUS_WIDTH / 2,
            orangeBoxY + 90
        );
        ctx.restore();

        // Imagens secundárias (até 3), centralizadas na faixa laranja
        const secondaryFotos = templateData.fotos.slice(1, 4);
        const imgGap = 24;
        const imgWidth = 240;
        const imgHeight = 240;
        const totalImgs = secondaryFotos.length;
        const totalWidth = totalImgs * imgWidth + (totalImgs - 1) * imgGap;
        let startX = (WHATSAPP_STATUS_WIDTH - totalWidth) / 2;
        const imgY = orangeBoxY + 140;
        for (let i = 0; i < totalImgs; i++) {
            const file = secondaryFotos[i];
            const img = new window.Image();
            img.crossOrigin = 'anonymous';
            img.src = file.originFileObj
                ? URL.createObjectURL(file.originFileObj)
                : (file.url || file.thumbUrl);
            await new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(startX + 16, imgY + 16);
            ctx.lineTo(startX + imgWidth - 16, imgY + 16);
            ctx.lineTo(startX + imgWidth - 16, imgY + imgHeight - 16);
            ctx.lineTo(startX + 16, imgY + imgHeight - 16);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, startX, imgY, imgWidth, imgHeight);
            ctx.restore();
            startX += imgWidth + imgGap;
        }

        // Informações do imóvel (sobreposição na parte inferior da imagem principal)
        ctx.save();
        const infoBoxHeight = 220;
        const infoBoxY = mainImgHeight - Math.round(infoBoxHeight / 2);
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = '#fff';
        ctx.fillRect(40, infoBoxY, WHATSAPP_STATUS_WIDTH - 80, infoBoxHeight);
        ctx.restore();

        // Título
        ctx.save();
        ctx.font = 'bold 56px Arial';
        ctx.fillStyle = '#ff6b00';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(
            templateData.titulo || 'VENDO APARTAMENTO',
            64,
            infoBoxY + 24,
            WHATSAPP_STATUS_WIDTH - 128
        );
        ctx.restore();

        // Detalhes (quartos, vagas, área)
        ctx.save();
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        let details = [];
        if (templateData.quartos) details.push(`${templateData.quartos} QUARTOS`);
        if (templateData.vagas) details.push(`${templateData.vagas} VAGA(S)`);
        if (templateData.area) details.push(`${templateData.area}M²`);
        ctx.fillText(
            details.join('   |   '),
            64,
            infoBoxY + 100,
            WHATSAPP_STATUS_WIDTH - 128
        );
        ctx.restore();

        // Referência
        if (templateData.referencia) {
            ctx.save();
            ctx.font = 'italic 28px Arial';
            ctx.fillStyle = '#888';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(
                `REF: ${templateData.referencia}`,
                64,
                infoBoxY + 160,
                WHATSAPP_STATUS_WIDTH - 128
            );
            ctx.restore();
        }

        // Download
        canvas.toBlob(blob => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `imovel-whatsapp-status-${templateData.referencia || 'template'}.png`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
            }
        }, 'image/png');
    };

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={24}>
                {/* Formulário */}
                <Col xs={24} md={12}>
                    <Card title="Dados do Template">
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            <Input
                                placeholder="Título"
                                value={templateData.titulo}
                                onChange={(e) => handleInputChange('titulo', e.target.value)}
                            />
                            
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Input
                                        placeholder="Quartos"
                                        value={templateData.quartos}
                                        onChange={(e) => handleInputChange('quartos', e.target.value)}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Input
                                        placeholder="Vagas"
                                        value={templateData.vagas}
                                        onChange={(e) => handleInputChange('vagas', e.target.value)}
                                    />
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Input
                                        placeholder="Área (m²)"
                                        value={templateData.area}
                                        onChange={(e) => handleInputChange('area', e.target.value)}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Input
                                        placeholder="Valor"
                                        value={templateData.valor}
                                        onChange={(e) => handleInputChange('valor', e.target.value)}
                                    />
                                </Col>
                            </Row>

                            <Input
                                placeholder="Referência"
                                value={templateData.referencia}
                                onChange={(e) => handleInputChange('referencia', e.target.value)}
                            />

                            <Upload
                                listType="picture-card"
                                fileList={templateData.fotos}
                                onChange={handleUploadChange}
                                beforeUpload={() => false}
                            >
                                {templateData.fotos.length >= 4 ? null : (
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                )}
                            </Upload>
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
                                backgroundColor: '#fff',
                                width: '100%',
                                maxWidth: 360, // miniatura na tela (360/1080 = 0.333)
                                aspectRatio: '9/16',
                                minWidth: 200,
                                margin: '0 auto',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                position: 'relative',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    background: '#eee',
                                }}
                            >
                                {/* Renderização do conteúdo do template em miniatura */}
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        transform: 'scale(0.3333)', // 360/1080 = 0.3333
                                        transformOrigin: 'top left',
                                        pointerEvents: 'none', // evita interação na miniatura
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 1080,
                                            height: 1920,
                                            position: 'relative',
                                            background: '#eee',
                                            overflow: 'hidden',
                                            borderRadius: 16,
                                        }}
                                    >
                                        {/* Imagem principal */}
                                        {templateData.fotos.length > 0 && (
                                            <img
                                                src={templateData.fotos[0].originFileObj ? URL.createObjectURL(templateData.fotos[0].originFileObj) : (templateData.fotos[0].url || templateData.fotos[0].thumbUrl)}
                                                alt="Imagem principal"
                                                style={{
                                                    width: '100%',
                                                    height: Math.round(1920 * 0.55),
                                                    objectFit: 'cover',
                                                    objectPosition: 'center',
                                                    borderTopLeftRadius: 16,
                                                    borderTopRightRadius: 16,
                                                    display: 'block',
                                                    filter: 'none',
                                                    imageRendering: 'auto',
                                                }}
                                                draggable={false}
                                                loading="eager"
                                            />
                                        )}
                                        {/* Faixa laranja e valor */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                right: 0,
                                                bottom: 64,
                                                height: 320,
                                                background: 'rgba(220, 126, 3, 0.60)',
                                                zIndex: 1,
                                                borderBottomLeftRadius: 16,
                                                borderBottomRightRadius: 16,
                                            }}
                                        ></div>
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
                                        {/* Imagens secundárias */}
                         
                                        {/* Informações do imóvel */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                left: 40,
                                                right: 40,
                                                top: Math.round(1920 * 0.55) - 110,
                                                height: 450,
                                                background: 'rgba(255,255,255,0.85)',
                                                borderRadius: 16,
                                                zIndex: 3,
                                                padding: 24,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <div style={{ color: '#ff6b00', fontWeight: 'bold', fontSize: 36, marginBottom: 8 }}>
                                                {templateData.titulo || 'VENDO APARTAMENTO'}
                                            </div>
                                            {/* Imagens secundárias (até 3) */}
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 8 }}>
                                                {templateData.fotos.slice(1, 4).map((file, idx) => {
                                                    const src = file.originFileObj
                                                        ? URL.createObjectURL(file.originFileObj)
                                                        : (file.url || file.thumbUrl);
                                                    return (
                                                        <img
                                                            key={file.uid || idx}
                                                            src={src}
                                                            alt={`Imagem secundária ${idx + 1}`}
                                                            style={{
                                                                width: 300,
                                                                height: 300,
                                                                objectFit: 'cover',
                                                                borderRadius: 8,
                                                                border: '2px solid #eee',
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                                background: '#fafafa'
                                                            }}
                                                            draggable={false}
                                                        />
                                                    );
                                                })}
                                            </div>
                                            <div style={{ color: '#333', fontWeight: 'bold', fontSize: 24, marginBottom: 8 }}>
                                                {[templateData.quartos && `${templateData.quartos} QUARTOS`, templateData.vagas && `${templateData.vagas} VAGA(S)`, templateData.area && `${templateData.area}M²`].filter(Boolean).join('   |   ')}
                                            </div>
                                            <div style={{ color: '#888', fontStyle: 'italic', fontSize: 18 }}>
                                                {templateData.referencia && `REF: ${templateData.referencia}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Botão para baixar o template em 1080x1920 */}
                        <div style={{ textAlign: 'center', marginTop: 16 }}>
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
                style={{ marginTop: 16, width: '100%' }}
            >
                Download Template (Status WhatsApp)
            </Button>
        </div>
    );
}

export default Templates;