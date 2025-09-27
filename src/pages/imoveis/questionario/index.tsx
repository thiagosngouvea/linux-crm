import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  message,
  Tooltip,
  Tag,
  Input,
  Modal,
  Form,
  Select,
  Spin,
  Popconfirm,
  Divider,
  Progress,
} from "antd";
import {
  PlusOutlined,
  LinkOutlined,
  CopyOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  SyncOutlined,
  CloudSyncOutlined,
} from "@ant-design/icons";
import { propertyManagementService } from "../../../services/propertyManagement.service";
import { propertiesService } from "../../../services/linux-properties.service";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface PropertyManagement {
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
  form_responded: boolean;
  created_at: string;
  updated_at: string;
  property: {
    id: string;
    reference: string;
    type: string;
    transaction: string;
    city: string;
    district: string;
    sale_price: string;
    rental_price: string;
    responsible1: string;
    contact_responsible1: string;
    subtitle?: string;
  };
}

interface Property {
  id: string;
  reference: string;
  type: string;
  transaction: string;
  city: string;
  district: string;
  subtitle?: string;
  sale_price: string;
  rental_price: string;
}

const QuestionarioGerenciamento = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [bulkSyncLoading, setBulkSyncLoading] = useState(false);
  const [data, setData] = useState<PropertyManagement[]>([]);
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [propertySearch, setPropertySearch] = useState("");
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });

  console.log('data', data);

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize, searchText]);

  const loadData = async () => {
    try {
      setTableLoading(true);
      const response = await propertyManagementService.getAll(
        pagination.current,
        pagination.pageSize,
        searchText ? "reference" : "",
        searchText,
        "ilike"
      );

      console.log('response', response);
      if (response.data) {
        setData(response.data.propertyManagement || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      message.error("Erro ao carregar questionários");
    } finally {
      setTableLoading(false);
    }
  };

  const loadAvailableProperties = async (search = "") => {
    try {
      setPropertiesLoading(true);
      const response = await propertiesService.getAll(
        1,
        50,
        search ? "reference" : "",
        search,
        "ilike"
      );

      if (response.data && response.data.properties) {
        // Filtrar propriedades que já não têm questionário
        const existingPropertyIds = data.map(item => item.property_id);
        const filtered = response.data.properties.result.filter(
          (prop: Property) => !existingPropertyIds.includes(prop.id)
        );
        setAvailableProperties(filtered);
      }
    } catch (error) {
      console.error("Erro ao carregar propriedades:", error);
      message.error("Erro ao carregar propriedades disponíveis");
    } finally {
      setPropertiesLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const copyToClipboard = async (id: string, reference: string) => {
    try {
      const url = `${window.location.origin}/tecimob/questionario/${id}`;
      await navigator.clipboard.writeText(url);
      message.success(`Link copiado para a propriedade ${reference}!`);
    } catch (error) {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement("textarea");
      textArea.value = `${window.location.origin}/tecimob/questionario/${id}`;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        message.success(`Link copiado para a propriedade ${reference}!`);
      } catch (fallbackError) {
        message.error("Erro ao copiar link");
      }
      document.body.removeChild(textArea);
    }
  };

  const syncPropertyData = async (managementRecord: PropertyManagement) => {
    try {
      setSyncLoading(true);
      
      // Preparar dados para atualização da propriedade
      const updateData: any = {};
      
      // Mapear campos do questionário para a propriedade
      if (managementRecord.responsible2) {
        updateData.responsible2 = managementRecord.responsible2;
      }
      if (managementRecord.contact_responsible2) {
        updateData.contact_responsible2 = managementRecord.contact_responsible2;
      }
      if (managementRecord.type) {
        updateData.type = managementRecord.type;
      }
      if (managementRecord.area) {
        updateData.area = managementRecord.area;
      }
      if (managementRecord.measurement_unit) {
        updateData.measurement_unit = managementRecord.measurement_unit;
      }
      if (managementRecord.transaction) {
        updateData.transaction = managementRecord.transaction;
      }
      if (managementRecord.sale_value) {
        updateData.sale_price = managementRecord.sale_value;
      }
      if (managementRecord.condominium_name) {
        updateData.condominium_name = managementRecord.condominium_name;
      }
      if (managementRecord.rental_value) {
        updateData.rental_price = managementRecord.rental_value;
      }
      if (managementRecord.neighborhood) {
        updateData.district = managementRecord.neighborhood;
      }
      if (managementRecord.city) {
        updateData.city = managementRecord.city;
      }
      if (managementRecord.street) {
        updateData.street = managementRecord.street;
      }

      if (Object.keys(updateData).length === 0) {
        message.info("Nenhum dado para sincronizar");
        return;
      }

      await propertiesService.update(managementRecord.property_id, updateData);
      message.success(`Propriedade ${managementRecord.property.reference} atualizada com sucesso!`);
      
      // Recarregar dados para refletir mudanças
      loadData();
    } catch (error) {
      console.error("Erro ao sincronizar propriedade:", error);
      message.error(`Erro ao sincronizar propriedade ${managementRecord.property.reference}`);
    } finally {
      setSyncLoading(false);
    }
  };

  const syncAllRespondedProperties = async () => {
    try {
      setBulkSyncLoading(true);
      
      // Filtrar apenas questionários respondidos
      const respondedQuestionarios = data.filter(item => item.form_responded);
      
      if (respondedQuestionarios.length === 0) {
        message.info("Nenhum questionário respondido para sincronizar");
        return;
      }

      setSyncProgress({ current: 0, total: respondedQuestionarios.length });
      
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < respondedQuestionarios.length; i++) {
        const managementRecord = respondedQuestionarios[i];
        
        try {
          // Preparar dados para atualização da propriedade
          const updateData: any = {};
          
          // Mapear campos do questionário para a propriedade
          if (managementRecord.responsible2) {
            updateData.responsible2 = managementRecord.responsible2;
          }
          if (managementRecord.contact_responsible2) {
            updateData.contact_responsible2 = managementRecord.contact_responsible2;
          }
          if (managementRecord.type) {
            updateData.type = managementRecord.type;
          }
          if (managementRecord.area) {
            updateData.area = managementRecord.area;
          }
          if (managementRecord.measurement_unit) {
            updateData.measurement_unit = managementRecord.measurement_unit;
          }
          if (managementRecord.transaction) {
            updateData.transaction = managementRecord.transaction;
          }
          if (managementRecord.sale_value) {
            updateData.sale_price = managementRecord.sale_value;
          }
          if (managementRecord.condominium_name) {
            updateData.condominium_name = managementRecord.condominium_name;
          }
          if (managementRecord.rental_value) {
            updateData.rental_price = managementRecord.rental_value;
          }
          if (managementRecord.neighborhood) {
            updateData.district = managementRecord.neighborhood;
          }
          if (managementRecord.city) {
            updateData.city = managementRecord.city;
          }
          if (managementRecord.street) {
            updateData.street = managementRecord.street;
          }

          if (Object.keys(updateData).length > 0) {
            await propertiesService.update(managementRecord.property_id, updateData);
            successCount++;
          }
        } catch (error) {
          console.error(`Erro ao sincronizar ${managementRecord.property.reference}:`, error);
          errorCount++;
        }
        
        setSyncProgress({ current: i + 1, total: respondedQuestionarios.length });
        
        // Pequeno delay para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (successCount > 0) {
        message.success(`${successCount} propriedades sincronizadas com sucesso!`);
      }
      if (errorCount > 0) {
        message.warning(`${errorCount} propriedades falharam na sincronização`);
      }
      
      // Recarregar dados
      loadData();
    } catch (error) {
      console.error("Erro na sincronização em lote:", error);
      message.error("Erro na sincronização em lote");
    } finally {
      setBulkSyncLoading(false);
      setSyncProgress({ current: 0, total: 0 });
    }
  };

  const handleCreateQuestionario = async (values: any) => {
    try {
      setLoading(true);
      await propertyManagementService.create({
        property_id: values.property_id,
        form_responded: false,
      });
      
      message.success("Questionário criado com sucesso!");
      setModalVisible(false);
      form.resetFields();
      loadData();
    } catch (error) {
      console.error("Erro ao criar questionário:", error);
      message.error("Erro ao criar questionário");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await propertyManagementService.remove(id);
      message.success("Questionário removido com sucesso!");
      loadData();
    } catch (error) {
      console.error("Erro ao remover questionário:", error);
      message.error("Erro ao remover questionário");
    }
  };

  const openModal = () => {
    setModalVisible(true);
    loadAvailableProperties();
  };

  const handlePropertySearch = (value: string) => {
    setPropertySearch(value);
    loadAvailableProperties(value);
  };

  const respondedCount = data.filter(item => item.form_responded).length;

  const columns = [
    {
      title: "Referência",
      dataIndex: ["property", "reference"],
      key: "reference",
      width: 120,
      render: (text: string) => (
        <Text code strong style={{ fontSize: "12px" }}>{text}</Text>
      ),
    },
    {
      title: "Propriedade",
      key: "property_info",
      width: 280,
      render: (record: PropertyManagement) => (
        <div>
          <div>
            <Text strong style={{ fontSize: "13px" }}>
              {record.property.subtitle || `${record.property.type} - ${record.property.district}`}
            </Text>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: "11px" }}>
              {record.property.district}, {record.property.city}
            </Text>
          </div>
          <div>
            <Tag color="blue" style={{ fontSize: "10px", marginTop: "4px" }}>
              {record.property.transaction}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Preços",
      key: "prices",
      width: 150,
      render: (record: PropertyManagement) => (
        <div>
          {record.property.sale_price && parseFloat(record.property.sale_price) > 0 && (
            <div>
              <Text style={{ color: "#52c41a", fontSize: "11px" }}>
                Venda: R$ {parseFloat(record.property.sale_price).toLocaleString("pt-BR")}
              </Text>
            </div>
          )}
          {record.property.rental_price && parseFloat(record.property.rental_price) > 0 && (
            <div>
              <Text style={{ color: "#1890ff", fontSize: "11px" }}>
                Aluguel: R$ {parseFloat(record.property.rental_price).toLocaleString("pt-BR")}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Responsável",
      key: "responsible",
      width: 180,
      render: (record: PropertyManagement) => (
        <div>
          <div>
            <Text style={{ fontSize: "11px" }}>{record.property.responsible1}</Text>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: "10px" }}>
              {record.property.contact_responsible1}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "form_responded",
      key: "status",
      width: 120,
      align: "center" as const,
      render: (responded: boolean) => (
        <Tag
          icon={responded ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          color={responded ? "success" : "warning"}
          style={{ fontSize: "11px" }}
        >
          {responded ? "Respondido" : "Pendente"}
        </Tag>
      ),
    },
    {
      title: "Criado em",
      dataIndex: "created_at",
      key: "created_at",
      width: 100,
      render: (date: string) => (
        <Text style={{ fontSize: "11px" }}>
          {new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit"
          })}
        </Text>
      ),
    },
    {
      title: "Ações",
      key: "actions",
      width: 180,
      align: "center" as const,
      render: (record: PropertyManagement) => (
        <Space size="small">
          <Tooltip title="Copiar Link">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(record.id, record.property.reference)}
            />
          </Tooltip>
          <Tooltip title="Abrir Questionário">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => router.push(`/tecimob/questionario/${record.id}`)}
            />
          </Tooltip>
          {record.form_responded && (
            <Tooltip title="Sincronizar com Propriedade">
              <Button
                type="text"
                size="small"
                icon={<SyncOutlined />}
                loading={syncLoading}
                onClick={() => syncPropertyData(record)}
                style={{ color: "#1890ff" }}
              />
            </Tooltip>
          )}
          <Tooltip title="Remover">
            <Popconfirm
              title="Tem certeza que deseja remover este questionário?"
              onConfirm={() => handleDelete(record.id)}
              okText="Sim"
              cancelText="Não"
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div
      className="bg-white min-h-screen"
      style={{ 
        padding: "16px", 
        maxWidth: "1400px", 
        margin: "0 auto" 
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ marginBottom: "8px", fontSize: "24px" }}>
          Gerenciamento de Questionários
        </Title>
        <Text type="secondary">
          Gerencie os questionários de propriedades e compartilhe links com clientes
        </Text>
      </div>

      <Card>
        <div style={{ 
          marginBottom: "16px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          flexWrap: "wrap", 
          gap: "12px" 
        }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Search
              placeholder="Buscar por referência..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 250 }}
              enterButton={<SearchOutlined />}
              size="middle"
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={loadData}
              title="Atualizar"
            />
          </div>
          
          <Space>
            {respondedCount > 0 && (
              <Popconfirm
                title={`Sincronizar ${respondedCount} questionários respondidos?`}
                description="Isso atualizará todas as propriedades com os dados dos questionários respondidos."
                onConfirm={syncAllRespondedProperties}
                okText="Sim, Sincronizar"
                cancelText="Cancelar"
              >
                <Button
                  type="default"
                  icon={<CloudSyncOutlined />}
                  loading={bulkSyncLoading}
                  disabled={respondedCount === 0}
                >
                  Sincronizar Todos ({respondedCount})
                </Button>
              </Popconfirm>
            )}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openModal}
              size="middle"
            >
              Novo Questionário
            </Button>
          </Space>
        </div>

        {bulkSyncLoading && syncProgress.total > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <Text>Sincronizando propriedades...</Text>
            <Progress 
              percent={Math.round((syncProgress.current / syncProgress.total) * 100)}
              status="active"
              format={() => `${syncProgress.current}/${syncProgress.total}`}
            />
          </div>
        )}

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={tableLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} questionários`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10,
              }));
            },
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Card>

      <Modal
        title="Criar Novo Questionário"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setPropertySearch("");
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateQuestionario}
        >
          <Form.Item
            name="property_id"
            label="Selecionar Propriedade"
            rules={[{ required: true, message: "Selecione uma propriedade" }]}
          >
            <Select
              placeholder="Busque e selecione uma propriedade"
              showSearch
              loading={propertiesLoading}
              onSearch={handlePropertySearch}
              filterOption={false}
              notFoundContent={propertiesLoading ? <Spin size="small" /> : "Nenhuma propriedade encontrada"}
              style={{ width: "100%" }}
            >
              {availableProperties.map((property: Property) => (
                <Option key={property.id} value={property.id}>
                  <div>
                    <Text strong>{property.reference}</Text> - {property.type}
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {property.district}, {property.city} - {property.transaction}
                    </Text>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider />

          <div style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
                setPropertySearch("");
              }}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Criar Questionário
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default QuestionarioGerenciamento;
