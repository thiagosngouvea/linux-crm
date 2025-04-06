import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { userService } from "@/services/users.service";

const Contas = React.memo(function Contas() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<Array<{ id: number; nome: string; email: string; tipo: string; }>>([]);
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
            title: "Tipo de Conta",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Ações",
            key: "acoes",
            render: (_: any, record: any) => (
                <div className="space-x-2">
                    <Button type="link" className="text-blue-500 hover:text-blue-700">
                        Editar
                    </Button>
                    <Button type="link" className="text-red-500 hover:text-red-700">
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
    };

    const handleSubmit = async (values: any) => {
        try {
            // Replace with actual API call
            console.log("Submitted values:", values);
            message.success("Conta criada com sucesso!");
            setIsModalOpen(false);
            form.resetFields();
            fetchAccounts(); // Refresh the list
        } catch (error) {
            message.error("Erro ao criar conta");
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
                title="Cadastrar Nova Conta"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="pt-4"
                >
                    <Form.Item
                        name="nome"
                        label="Nome"
                        rules={[{ required: true, message: "Por favor, insira o nome" }]}
                    >
                        <Input placeholder="Nome completo" />
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
                    
                    <Form.Item
                        name="senha"
                        label="Senha"
                        rules={[{ required: true, message: "Por favor, defina uma senha" }]}
                    >
                        <Input.Password placeholder="******" />
                    </Form.Item>
                    
                    <Form.Item
                        name="tipo"
                        label="Tipo de Conta"
                        rules={[{ required: true, message: "Selecione o tipo de conta" }]}
                    >
                        <Input placeholder="Admin, Usuário, etc" />
                    </Form.Item>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600">
                            Cadastrar
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
});

export default Contas;