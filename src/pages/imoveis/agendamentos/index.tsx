import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  TimePicker,
  message,
  notification,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { schedulesService } from "@/services/schedules.service";
import { propertiesService } from "@/services/linux-properties.service";
import dayjs from "dayjs";

export default function Agendamentos() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [properties, setProperties] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [form] = Form.useForm();

  const getAllSchedules = async () => {
    try {
      const response = await schedulesService.getAll();
      setSchedules(response.data.schedules.result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllSchedules();
  }, []);

  const handleSubmit = async (values: any) => {

    const data = {
      date: values.date.format("YYYY-MM-DD HH:mm"),
      property_id: values.property_id,
      client_name: values.client_name,
      client_phone: values.client_phone,
      client_email: values.client_email,
      status: values.status,
      description: values.description,
    }

    try {
      await schedulesService.create(data);
      setIsModalVisible(false);
      form.resetFields();
      notification.success({
        message: "Agendamento criado com sucesso",
      });
    } catch (error) {
      notification.error({
        message: "Erro ao criar agendamento",
      });
    } finally {
      getAllSchedules();
    }
  };

  const getAllProperties = async () => {
    const response = await propertiesService.getAll(
      1,
      100000,
    );
    setProperties(response.data.properties.result);
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await schedulesService.remove(id);
      notification.success({
        message: "Agendamento removido com sucesso",
      });
      getAllSchedules();
    } catch (error) {
      notification.error({
        message: "Erro ao remover agendamento",
      });
    }
  };

  const handleEdit = async (values: any) => {
    if (!editingId) return;
    try {
      const data = {
        date: values.date.format("YYYY-MM-DD HH:mm"),
        property_id: values.property_id,
        client_name: values.client_name,
        client_phone: values.client_phone,
        client_email: values.client_email,
        status: values.status,
        description: values.description,
      }
      await schedulesService.update(editingId, data);
      notification.success({
        message: "Agendamento editado com sucesso",
      });
      setIsModalVisible(false);
      setIsEditing(false);
      setEditingId(null);
      form.resetFields();
      getAllSchedules();
    } catch (error) {
      notification.error({
        message: "Erro ao editar agendamento",
      });
    }
  };

  const schedulesForToday = schedules.filter((schedule: any) => {
    return dayjs(schedule.date).isSame(dayjs(), 'day');
  });

  //quantidade de agendamentos de hoje
  const schedulesForTodayCount = schedulesForToday.length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-orange-500">Agendamentos</h1>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
          onClick={() => setIsModalVisible(true)}
        >
          Novo Agendamento
        </button>
      </div>
      <div className="mb-6">
        <p className="text-sm text-gray-500">{schedulesForTodayCount} {schedulesForTodayCount === 1 ? "agendamento" : "agendamentos"} hoje</p>
      </div>
      

      <Table
        columns={[
          {
            title: "Status",
            key: "status",
            dataIndex: "status",
            width: 130,
            fixed: "left",
            filters: [
              {
                text: "Confirmado",
                value: "confirmed",
              },
              {
                text: "Pendente",
                value: "pending",
              },
              {
                text: "Cancelado",
                value: "canceled",
              },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status: string) => (
              <Tag
                color={
                  status === "confirmed"
                    ? "green"
                    : status === "pending"
                    ? "orange"
                    : "red"
                }
              >
                {status === "confirmed"
                  ? "Confirmado"
                  : status === "pending"
                  ? "Pendente"
                  : "Cancelado"}
              </Tag>
            ),
          },
          {
            title: "Data",
            dataIndex: "date",
            key: "date",
            width: 120,
            sorter: (a: any, b: any) => dayjs(a.date).diff(dayjs(b.date)),
            render: (date: string) =>
              new Date(date).toLocaleDateString("pt-BR"),
          },
          {
            title: "Horário",
            dataIndex: "date",
            key: "date",
            width: 120,
            render: (date: string) =>
              new Date(date).toLocaleTimeString("pt-BR"),
          },
          {
            title: "Cliente",
            dataIndex: "client_name",
            key: "client_name",
            width: 150,
            ellipsis: true,
          },
          {
            title: "Ref. Imóvel",
            dataIndex: ["property", "reference"],
            key: "id",
            width: 150,
            ellipsis: true,
          },
          {
            title: "Telefone",
            dataIndex: "client_phone",
            key: "client_phone",
            width: 150,
            ellipsis: true,
          },
          {
            title: "Email",
            dataIndex: "client_email",
            key: "client_email",
            width: 300,
          },
          {
            title: "Descrição",
            dataIndex: "description",
            key: "description",
            width: 300,
            ellipsis: true,
          },
          {
            title: "Ações",
            key: "acoes",
            fixed: "right",
            width: 120,
            render: (_: any, record: any) => (
              <Space size="middle">
                <Button 
                type="default" 
                icon={<EditOutlined />} 
                onClick={() => {
                  setIsEditing(true);
                  setEditingId(record.id);
                  setIsModalVisible(true);
                  form.setFieldsValue({
                    date: dayjs(record.date),
                    property_id: record.property_id,
                    client_name: record.client_name,
                    client_phone: record.client_phone,
                    client_email: record.client_email,
                    status: record.status,
                    description: record.description,
                  })
                }} />
                <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
              </Space>
            ),
          },
        ]}
        dataSource={schedules}
        scroll={{ x: 500 }}
        pagination={{
          pageSize: 10,
          total: schedules.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total}`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        sortDirections={['ascend', 'descend']}
        expandable={{
          expandedRowClassName: () => 'bg-white text-black hover:text-black',
          rowExpandable: () => true,
          expandedRowRender: (record) => (
            <div className="p-4">
              <p><strong>Cidade:</strong> {record.property.city || "Não informado"}</p>
              <p><strong>Bairro:</strong> {record.property.district || "Não informado"}</p>
              <p><strong>Rua:</strong> {record.property.street || "Não informado"}</p>
              <p><strong>Número:</strong> {record.property.number || "Não informado"}</p>
              <p><strong>Complemento:</strong> {record.property.complement || "Não informado"}</p>
              <p><strong>Ref. Imóvel:</strong> {record.property.reference || "Não informado"}</p>
              <p><strong>Tipo:</strong> {record.property.type || "Não informado"}</p>
              <p><strong>Título:</strong> {record.property.subtitle || "Não informado"}</p>
              <p className="my-4"><strong>Link no Site:</strong> <a href={record.property.site_link} target="_blank" rel="noopener noreferrer">{record.property.site_link || "Não informado"}</a></p>
              {record.property.condominium_name && (
                <div className="my-4">
                  <p><strong>Condomínio:</strong> {record.property.condominium_name}</p>
                  <p><strong>Descrição do Condominío:</strong> {record.property.condominium_description}</p>
                </div>
              )}
              {record.property.apartment_store_lot_room && (
                <>
                  <p><strong>Apartamento / Loja / Lote / Sala:</strong> {record.property.apartment_store_lot_room}</p>
                </>
              )}
              {record.property.block_section_tower && (
                <>
                  <p><strong>Bloco / Seção / Torre:</strong> {record.property.block_section_tower}</p>
                </>
              )}
              {record.property.blocks_sections_towers_in_condominium && (
                <>
                  <p><strong>Blocos / Seções / Torres no Condomínio:</strong> {record.property.blocks_sections_towers_in_condominium}</p>
                </>
              )}
              {record.property.responsible1 && (
                <div className="my-4">
                  <p><strong>Responsável 1:</strong> {record.property.responsible1}</p>
                  <p><strong>Telefone do Responsável 1:</strong> {record.property.contact_responsible1}</p>
                  <p><strong>Link do Whatsapp do Responsável 1:</strong> <a href={record.property.contact_link_responsible2} target="_blank" rel="noopener noreferrer">{record.property.contact_link_responsible2}</a></p>
                </div>
              )}
              {record.property.responsible2 && (
                <>
                  <p><strong>Responsável 2:</strong> {record.property.responsible2}</p>
                  <p><strong>Telefone do Responsável 2:</strong> {record.property.contact_responsible2}</p>
                  <p><strong>Link do Whatsapp do Responsável 2:</strong> <a href={record.property.contact_link_responsible2} target="_blank" rel="noopener noreferrer">{record.property.contact_link_responsible2}</a></p>
                </>
              )}
            </div>
          ),
          expandedRowKeys: expandedRowKeys,
          onExpand: (expanded, record) => {
            setExpandedRowKeys(expanded ? [record.id] : []);
          }
        }}
        rowKey={(record) => record.id}
      />

      <Modal
        title={isEditing ? "Editar Agendamento" : "Novo Agendamento"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setIsEditing(false)
          setEditingId(null)
          form.resetFields()
        }}
        footer={false}
      >
        <Form 
          form={form} 
          layout="vertical"
          onFinish={isEditing ? handleEdit : handleSubmit}
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

          <Form.Item
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
          </Form.Item>

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
              setIsModalVisible(false);
              setIsEditing(false);
              setEditingId(null);
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
    </div>
  );
}
