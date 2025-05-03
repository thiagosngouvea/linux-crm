import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Select, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { userService } from "@/services/users.service";

const Contas = React.memo(function Contas() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [accounts, setAccounts] = useState<Array<{ id: number; nome: string; email: string; tipo: string; }>>([]);
    const [formData, setFormData] = useState<any>({});
    const [form] = Form.useForm();


    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            // Replace with actual API call
            const response  = await userService.getAll();
            setAccounts(response.data.users?.result);
        } catch (error) {
            message.error("Erro ao carregar contas");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Nome",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "E-mail",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Telefone",
            dataIndex: "phone",
            key: "phone",
            render: (phone: string) => {
                return phone ? phone : "Não informado";
            },
        },
        {
            title: "Tipo de Conta",
            dataIndex: "role",
            key: "role",
            render: (role: string) => {
                const roles = {
                    super_admin: "Super Admin",
                    admin: "Admin", 
                    broker: "Corretor",
                    guest: "Convidado"
                } as const;
                
                let color = "";
                switch(role) {
                    case "super_admin":
                        color = "red";
                        break;
                    case "admin":
                        color = "blue"; 
                        break;
                    case "broker":
                        color = "green";
                        break;
                    default:
                        color = "default";
                }

                return <Tag color={color}>{roles[role as keyof typeof roles] || "Convidado"}</Tag>;
            },
        },
        {
            title: "Ações",
            key: "acoes",
            render: (_: any, record: any) => (
                <div className="space-x-2">
                    <Button 
                        type="link" 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => {
                            setIsModalOpen(true);
                            setFormData(record);
                            setIsEdit(true);
                            if (record.permissions === null) {
                                record.permissions = [];
                            }
                            form.setFieldsValue(record);
                        }}
                    >
                        Editar
                    </Button>
                    <Button 
                        type="link" 
                        className="text-red-500 hover:text-red-700"
                        onClick={async () => {
                            try {
                                await userService.remove(record.id);
                                message.success("Conta excluída com sucesso!");
                                fetchAccounts();
                            } catch (error) {
                                message.error("Erro ao excluir conta");
                                console.error(error);
                            }
                        }}
                    >
                        Excluir
                    </Button>
                </div>
            ),
        },
    ];

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
        setIsEdit(false);
    };

    const handleSubmit = async (values: any) => {
        try {
            // Replace with actual API call
            await userService.create(values);
            message.success("Conta criada com sucesso!");
            setIsModalOpen(false);
            form.resetFields();
            fetchAccounts(); // Refresh the list
        } catch (error) {
            message.error("Erro ao criar conta");
            console.error(error);
        } finally {
            setIsEdit(false)
        }
    };

    const handleEdit = async (values: any) => {
        try {
            await userService.update(formData.id, values);
            message.success("Conta atualizada com sucesso!");
            handleCancel();
            fetchAccounts();
        } catch (error) {
            message.error("Erro ao atualizar conta");
            console.error(error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Contas</h1>
                <Button 
                    type="primary" 
                    onClick={handleOpenModal} 
                    icon={<PlusOutlined />}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Nova Conta
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <Table 
                    columns={columns} 
                    dataSource={accounts} 
                    rowKey="id" 
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    className="w-full"
                />
            </div>

            <Modal
                title={isEdit ? "Editar Conta" : "Cadastrar Nova Conta"}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={isEdit ? handleEdit : handleSubmit}
                    className="pt-4"
                >
                    <Form.Item
                        name="name"
                        label="Nome"
                        rules={[{ required: true, message: "Por favor, insira o nome" }]}
                    >
                        <Input placeholder="Nome" />
                    </Form.Item>
                    
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            { required: true, message: "Por favor, insira o e-mail" },
                            { type: "email", message: "E-mail inválido" }
                        ]}
                    >
                        <Input placeholder="email@exemplo.com" />
                    </Form.Item>
                    
                    {!isEdit && (
                    <Form.Item
                        name="password"
                        label="Senha"
                        rules={[{ required: isEdit ? false : true, message: "Por favor, defina uma senha" }]}
                    >
                            <Input.Password placeholder="******" />
                        </Form.Item>
                    )}
                    
                    <Form.Item
                        name="role"
                        label="Tipo de Conta"
                        rules={[{ required: true, message: "Selecione o tipo de conta" }]}
                    >
                        <Select placeholder="Selecione o tipo de conta">
                            <Select.Option value="super_admin">Super Admin</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="broker">Corretor</Select.Option>
                            <Select.Option value="guest">Convidado</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="active"
                        label="Status"
                        rules={[{ required: true, message: "Selecione o status" }]}
                    >
                        <Select placeholder="Selecione o status">
                            <Select.Option value={true}>Ativo</Select.Option>
                            <Select.Option value={false}>Não Ativo</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Telefone"
                        rules={[{ required: false, message: "Por favor, insira o telefone" }]}
                    >
                        <Input placeholder="(00) 00000-0000" />
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
                    >
                        {({ getFieldValue }) => 
                            getFieldValue('role') !== 'super_admin' && (
                                <Form.Item
                                    name="permissions"
                                    label="Permissões"
                                    rules={[{ required: false, message: "Por favor, selecione as permissões" }]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Selecione as permissões"
                                        allowClear
                                    >
                                        <Select.Option value="read">Visualizar</Select.Option>
                                        <Select.Option value="create">Criar</Select.Option>
                                        <Select.Option value="update">Editar</Select.Option>
                                        <Select.Option value="delete">Excluir</Select.Option>
                                    </Select>
                                </Form.Item>
                            )
                        }
                    </Form.Item>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600">
                            {isEdit ? "Atualizar" : "Cadastrar"}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
});

export default Contas;