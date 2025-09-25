import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  message,
  Spin,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  Switch,
} from "antd";
import {
  DollarOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { propertyManagementService } from "../../../services/propertyManagement.service";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface PropertyData {
  id: string;
  reference: string;
  title: string;
  address: string;
  sale_price: number;
  rental_price: number;
  type: string;
  transaction: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  city: string;
  neighborhood: string;
  responsible1: string;
  contact_responsible1: string;
}

interface PropertyManagementData {
  id: string;
  property_id: string;
  reference: string | null;
  responsible2: string | null;
  contact_responsible2: string | null;
  type: string | null;
  area: string | null;
  measurement_unit: string | null;
  transaction: string | null;
  sale_value: string | null;
  condominium_name: string | null;
  rental_value: string | null;
  neighborhood: string | null;
  city: string | null;
  street: string | null;
}

const Questionario = React.memo(function Questionario() {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [propertyLoading, setPropertyLoading] = useState(true);
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [managementData, setManagementData] =
    useState<PropertyManagementData | null>(null);

  // Estados para controlar quais campos precisam ser preenchidos
  const [needsReference, setNeedsReference] = useState(false);
  const [needsResponsible2, setNeedsResponsible2] = useState(false);
  const [needsContactResponsible2, setNeedsContactResponsible2] =
    useState(false);
  const [needsType, setNeedsType] = useState(false);
  const [needsArea, setNeedsArea] = useState(false);
  const [needsMeasurementUnit, setNeedsMeasurementUnit] = useState(false);
  const [needsTransaction, setNeedsTransaction] = useState(false);
  const [needsSaleValue, setNeedsSaleValue] = useState(false);
  const [needsCondominiumName, setNeedsCondominiumName] = useState(false);
  const [needsRentalValue, setNeedsRentalValue] = useState(false);
  const [needsNeighborhood, setNeedsNeighborhood] = useState(false);
  const [needsCity, setNeedsCity] = useState(false);
  const [needsStreet, setNeedsStreet] = useState(false);

  useEffect(() => {
    if (id) {
      loadPropertyManagementData();
    }
  }, [id]);

  const loadPropertyManagementData = async () => {
    try {
      setPropertyLoading(true);

      // Buscar dados do property management filtrando pelo property_id
      const response = await propertyManagementService.getById(id);

      if (response.data.propertyManagement) {
        const managementItem = response.data.propertyManagement;
        const property = managementItem.property;

        setManagementData(managementItem);

        setPropertyData({
          id: property.id,
          reference: property.reference,
          title: property.subtitle || `${property.type} - ${property.district}`,
          address: `${property.street}, ${property.number} - ${property.district}, ${property.city}/${property.state}`,
          sale_price: parseFloat(property.sale_price) || 0,
          rental_price: parseFloat(property.rental_price) || 0,
          type: property.type,
          transaction: property.transaction,
          status: property.status,
          bedrooms: parseInt(property.bedrooms) || 0,
          bathrooms: parseInt(property.bathrooms) || 0,
          area: parseFloat(property.area) || 0,
          description: property.property_description,
          city: property.city,
          neighborhood: property.district,
          responsible1: property.responsible1,
          contact_responsible1: property.contact_responsible1,
        });

        // Verificar quais campos estão null e precisam ser preenchidos
        setNeedsReference(managementItem.reference === null);
        setNeedsResponsible2(managementItem.responsible2 === null);
        setNeedsContactResponsible2(
          managementItem.contact_responsible2 === null
        );
        setNeedsType(managementItem.type === null);
        setNeedsArea(managementItem.area === null);
        setNeedsMeasurementUnit(managementItem.measurement_unit === null);
        setNeedsTransaction(managementItem.transaction === null);
        setNeedsSaleValue(managementItem.sale_value === null);
        setNeedsCondominiumName(managementItem.condominium_name === null);
        setNeedsRentalValue(managementItem.rental_value === null);
        setNeedsNeighborhood(managementItem.neighborhood === null);
        setNeedsCity(managementItem.city === null);
        setNeedsStreet(managementItem.street === null);

        // Pré-preencher formulário com dados da propriedade quando os campos do management estão null
        form.setFieldsValue({
          reference: managementItem.reference || property.reference,
          responsible2: managementItem.responsible2 || property.responsible2,
          contact_responsible2:
            managementItem.contact_responsible2 ||
            property.contact_responsible2,
          type: managementItem.type || property.type,
          area: managementItem.area || property.area,
          measurement_unit:
            managementItem.measurement_unit || property.measurement_unit,
          transaction: managementItem.transaction || property.transaction,
          sale_value: managementItem.sale_value || property.sale_price,
          condominium_name:
            managementItem.condominium_name || property.condominium_name,
          rental_value: managementItem.rental_value || property.rental_price,
          neighborhood: managementItem.neighborhood || property.district,
          city: managementItem.city || property.city,
          street: managementItem.street || property.street,
        });
      } else {
        message.error("Propriedade não encontrada no sistema de gerenciamento");
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      message.error("Erro ao carregar dados da propriedade");
    } finally {
      setPropertyLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      if (!managementData) {
        message.error("Dados não encontrados");
        return;
      }

      // Preparar dados para atualização - apenas campos que estavam null
      const updateData: any = {};

      if (needsReference && values.reference)
        updateData.reference = values.reference;
      if (needsResponsible2 && values.responsible2)
        updateData.responsible2 = values.responsible2;
      if (needsContactResponsible2 && values.contact_responsible2)
        updateData.contact_responsible2 = values.contact_responsible2;
      if (needsType && values.type) updateData.type = values.type;
      if (needsArea && values.area) updateData.area = values.area;
      if (needsMeasurementUnit && values.measurement_unit)
        updateData.measurement_unit = values.measurement_unit;
      if (needsTransaction && values.transaction)
        updateData.transaction = values.transaction;
      if (needsSaleValue && values.sale_value)
        updateData.sale_value = values.sale_value;
      if (needsCondominiumName && values.condominium_name)
        updateData.condominium_name = values.condominium_name;
      if (needsRentalValue && values.rental_value)
        updateData.rental_value = values.rental_value;
      if (needsNeighborhood && values.neighborhood)
        updateData.neighborhood = values.neighborhood;
      if (needsCity && values.city) updateData.city = values.city;
      if (needsStreet && values.street) updateData.street = values.street;

      if (Object.keys(updateData).length === 0) {
        message.info("Nenhuma alteração foi feita");
        return;
      }

      await propertyManagementService.update(managementData.id, updateData);

      message.success("Informações atualizadas com sucesso!");

      // Recarregar dados
      await loadPropertyManagementData();
    } catch (error) {
      console.error("Erro ao atualizar informações:", error);
      message.error("Erro ao atualizar informações");
    } finally {
      setLoading(false);
    }
  };

  if (propertyLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!propertyData || !managementData) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Text type="danger">Propriedade não encontrada</Text>
      </div>
    );
  }

  const hasFieldsToUpdate =
    needsReference ||
    needsResponsible2 ||
    needsContactResponsible2 ||
    needsType ||
    needsArea ||
    needsMeasurementUnit ||
    needsTransaction ||
    needsSaleValue ||
    needsCondominiumName ||
    needsRentalValue ||
    needsNeighborhood ||
    needsCity ||
    needsStreet;

  return (
    <div
      className="bg-white p-4 max-w-screen-xl mx-auto min-h-screen"
    >
      <Title level={2}>
        <EditOutlined /> Atualizar Informações da Propriedade
      </Title>

      {/* Informações da Propriedade */}
      <Card
        title="Informações da Propriedade"
        style={{ marginBottom: "24px" }}
        extra={<Text code>#{propertyData.reference}</Text>}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text strong>Título:</Text> {propertyData.title}
              </div>
              <div>
                <Text strong>Endereço:</Text> {propertyData.address}
              </div>
              <div>
                <Text strong>Tipo:</Text> {propertyData.type}
              </div>
              <div>
                <Text strong>Transação:</Text> {propertyData.transaction}
              </div>
              <div>
                <Text strong>Status:</Text> {propertyData.status}
              </div>
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text strong>Preço Venda:</Text>{" "}
                <Text style={{ color: "#52c41a", fontSize: "16px" }}>
                  R$ {propertyData.sale_price?.toLocaleString("pt-BR")}
                </Text>
              </div>
              <div>
                <Text strong>Preço Aluguel:</Text>{" "}
                <Text style={{ color: "#1890ff", fontSize: "16px" }}>
                  R$ {propertyData.rental_price?.toLocaleString("pt-BR")}
                </Text>
              </div>
              <div>
                <Text strong>Quartos:</Text> {propertyData.bedrooms}
              </div>
              <div>
                <Text strong>Banheiros:</Text> {propertyData.bathrooms}
              </div>
              <div>
                <Text strong>Área:</Text> {propertyData.area}m²
              </div>
            </Space>
          </Col>
        </Row>
        <div style={{ marginTop: "16px" }}>
          <Text strong>Responsável:</Text> {propertyData.responsible1} -{" "}
          {propertyData.contact_responsible1}
        </div>
      </Card>

      {hasFieldsToUpdate ? (
        <Card title="Atualize as Informações se Necessário">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={[16, 16]}>
              {needsReference && (
                <Col span={12}>
                  <Form.Item
                    name="reference"
                    label="Referência"
                    rules={[
                      { required: true, message: "Informe a referência" },
                    ]}
                  >
                    <Input placeholder="Referência da propriedade" />
                  </Form.Item>
                </Col>
              )}

              {needsType && (
                <Col span={12}>
                  <Form.Item
                    name="type"
                    label="Tipo"
                    rules={[{ required: true, message: "Selecione o tipo" }]}
                  >
                    <Select placeholder="Tipo da propriedade">
                      <Option value="Casa">Casa</Option>
                      <Option value="Apartamento">Apartamento</Option>
                      <Option value="Terreno">Terreno</Option>
                      <Option value="Comercial">Comercial</Option>
                      <Option value="Rural">Rural</Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}

              {needsTransaction && (
                <Col span={12}>
                  <Form.Item
                    name="transaction"
                    label="Transação"
                    rules={[
                      { required: true, message: "Selecione a transação" },
                    ]}
                  >
                    <Select placeholder="Tipo de transação">
                      <Option value="Venda">Venda</Option>
                      <Option value="Aluguel">Aluguel</Option>
                      <Option value="Venda/Aluguel">Venda/Aluguel</Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}

              {needsArea && (
                <Col span={8}>
                  <Form.Item
                    name="area"
                    label="Área"
                    rules={[{ required: true, message: "Informe a área" }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="Área"
                      min={0}
                    />
                  </Form.Item>
                </Col>
              )}

              {needsMeasurementUnit && (
                <Col span={4}>
                  <Form.Item
                    name="measurement_unit"
                    label="Unidade"
                    rules={[{ required: true, message: "Selecione a unidade" }]}
                  >
                    <Select placeholder="Unidade">
                      <Option value="m²">m²</Option>
                      <Option value="hectare">hectare</Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}
            </Row>

            <Row gutter={[16, 16]}>
              {needsSaleValue && (
                <Col span={12}>
                  <Form.Item
                    name="sale_value"
                    label="Valor de Venda"
                    rules={[
                      { required: true, message: "Informe o valor de venda" },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value!.replace(/R\$\s?|(,*)/g, "")}
                      placeholder="Valor de venda"
                    />
                  </Form.Item>
                </Col>
              )}

              {needsRentalValue && (
                <Col span={12}>
                  <Form.Item
                    name="rental_value"
                    label="Valor de Aluguel"
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value!.replace(/R\$\s?|(,*)/g, "")}
                      placeholder="Valor de aluguel"
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>

            <Row gutter={[16, 16]}>
              {needsResponsible2 && (
                <Col span={12}>
                  <Form.Item
                    name="responsible2"
                    label="Responsável 2"
                    rules={[
                      { required: true, message: "Informe o responsável 2" },
                    ]}
                  >
                    <Input placeholder="Nome do segundo responsável" />
                  </Form.Item>
                </Col>
              )}

              {needsContactResponsible2 && (
                <Col span={12}>
                  <Form.Item
                    name="contact_responsible2"
                    label="Contato Responsável 2"
                    rules={[
                      {
                        required: true,
                        message: "Informe o contato do responsável 2",
                      },
                    ]}
                  >
                    <Input placeholder="Telefone do segundo responsável" />
                  </Form.Item>
                </Col>
              )}
            </Row>

            <Row gutter={[16, 16]}>
              {needsCondominiumName && (
                <Col span={8}>
                  <Form.Item name="condominium_name" label="Nome do Condomínio">
                    <Input placeholder="Nome do condomínio" />
                  </Form.Item>
                </Col>
              )}

              {needsNeighborhood && (
                <Col span={8}>
                  <Form.Item
                    name="neighborhood"
                    label="Bairro"
                    rules={[{ required: true, message: "Informe o bairro" }]}
                  >
                    <Input placeholder="Bairro" />
                  </Form.Item>
                </Col>
              )}

              {needsCity && (
                <Col span={8}>
                  <Form.Item
                    name="city"
                    label="Cidade"
                    rules={[{ required: true, message: "Informe a cidade" }]}
                  >
                    <Input placeholder="Cidade" />
                  </Form.Item>
                </Col>
              )}
            </Row>

            {needsStreet && (
              <Form.Item
                name="street"
                label="Rua"
                rules={[{ required: true, message: "Informe a rua" }]}
              >
                <Input placeholder="Nome da rua" />
              </Form.Item>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{ width: "100%" }}
              >
                Atualizar Informações
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <Card>
          <div style={{ textAlign: "center", padding: "50px" }}>
            <CheckCircleOutlined
              style={{
                fontSize: "48px",
                color: "#52c41a",
                marginBottom: "16px",
              }}
            />
            <Title level={3}>Todas as informações estão completas!</Title>
            <Text>Não há campos pendentes para esta propriedade.</Text>
          </div>
        </Card>
      )}
    </div>
  );
});

export default Questionario;

// Removido getServerSideProps para tornar a página pública
