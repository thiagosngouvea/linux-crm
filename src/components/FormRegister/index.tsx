import React, { useState, useCallback, useEffect } from "react";
import { Form, Col, Row, Select, Input, Tabs, notification, InputNumber } from "antd";
import { propertiesService } from "@/services/linux-properties.service";

interface FormRegisterProps {
  data: any;
  informations: any;
  isEditing?: boolean;
  setVisibleRegisterModal: (value: boolean) => void;
}

const FormRegister = React.memo(function FormRegister({
  data,
  informations,
  isEditing,
    setVisibleRegisterModal,
}: FormRegisterProps) {
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({
    reference: "",
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

  const getCondominiumNameInfos = useCallback(async (
    condominium_name: string
  ) => {
    if (formData.condominium_name && formData.condominium_name !== "") {
      try {
        const response = await propertiesService.getFieldsInformationsByCondominiumName(
          condominium_name
        );

        form.setFieldsValue({
          city: response.data.fields?.cities?.[0] || '',
          district: response.data.fields?.districts?.[0] || '',
          street: response.data.fields?.streets?.[0] || '',
          number: response.data.fields?.numbers?.[0] || '',
          state: response.data.fields?.states?.[0] || '',
          blocks_sections_towers_in_condominium: response.data.fields?.blocksSectionsTowers?.[0] || '',
          units_in_condominium: response.data.fields?.unitsInCondominium?.[0] || '',
          floors_in_condominium: response.data.fields?.floorsInCondominium?.[0] || '',
          units_per_floors_in_condominium: response.data.fields?.unitsPerFloorCondominium?.[0] || '',
        })

      } catch (error) {
        console.error("Erro ao buscar informações do condomínio:", error);
      }
    }
  }, [formData.condominium_name]);

  // Atualiza o estado sempre que algum campo muda
  const handleValuesChange = useCallback(
    (changedValues: any, allValues: any) => {
      setFormData(allValues);
      if (changedValues.condominium_name) {
        getCondominiumNameInfos(
          changedValues.condominium_name
        );
      }
    },
    []
  );

  const handleFinish = useCallback(async (values: any) => {
    if(isEditing){
        try {
            await propertiesService.update(data.id, values);
            setVisibleRegisterModal(false);
            notification.success({
                message: "Sucesso!",
                description: "Imóvel atualizado com sucesso!",
            });
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            notification.error({
                message: "Erro!",
                description: "Erro ao atualizar imóvel!",
            });
        }
        return;
    }

    try {
        await propertiesService.create(values);
        notification.success({
            message: "Sucesso!",
            description: "Imóvel cadastrado com sucesso!",
        });
        setVisibleRegisterModal(false);
    } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        notification.error({
            message: "Erro!",
            description: "Erro ao cadastrar imóvel!",
        });
    }
  }, [isEditing, data]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  useEffect(() => {
    if (formData.condominium_name && formData.condominium_name !== "") {
      
    }
  }, [informations]);

  return (
    <Form
      form={form}
      layout="vertical"
      name="form"
      onValuesChange={handleValuesChange}
      onFinish={handleFinish}
    >
      <Row gutter={16}>
        <Col span={4}>
          <Form.Item name="reference" label="Referência">
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="type" label="Tipo">
            <Select placeholder="Selecione" showSearch allowClear>
              {informations?.type?.map((item: any) => (
                <Select.Option key={`${item}-${Math.random()}`} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="transaction" label="Transação">
            <Select placeholder="Selecione" allowClear>
              <Select.Option value="Venda">Venda</Select.Option>
              <Select.Option value="Aluguel">Aluguel</Select.Option>
              <Select.Option value="Venda/Aluguel">Venda/Aluguel</Select.Option>
              <Select.Option value="Venda Repasse">Venda Repasse</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="status" label="Status">
            <Select placeholder="Selecione" allowClear>
              <Select.Option value="Disponível">Disponível</Select.Option>
              <Select.Option value="Excluído">Excluído</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="condominium_name" label="Nome do Condomínio">
            <Select placeholder="Selecione" showSearch allowClear>
              {informations?.condominium_name?.map((item: any) => (
                <Select.Option key={`${item}-${Math.random()}`} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Dados Gerais 1" key="1">
          <Row gutter={16}>
            <Col span={4}>
              <Form.Item name="subtype" label="Subtipo">
                <Select placeholder="Selecione" showSearch allowClear>
                  {informations?.subtype?.map((item: any) => (
                    <Select.Option
                      key={`${item}-${Math.random()}`}
                      value={item}
                    >
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="profile" label="Perfil">
                <Select placeholder="Selecione" showSearch allowClear>
                  {informations?.profile?.map((item: any) => (
                    <Select.Option
                      key={`${item}-${Math.random()}`}
                      value={item}
                    >
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="situation" label="Situação">
                <Select placeholder="Selecione" showSearch allowClear>
                  {informations?.situation?.map((item: any) => (
                    <Select.Option
                      key={`${item}-${Math.random()}`}
                      value={item}
                    >
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="exclusive" label="Exclusividade">
                <Select placeholder="Selecione" allowClear>
                  <Select.Option value={true}>Sim</Select.Option>
                  <Select.Option value={false}>Não</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="commission" label="Comissão">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={2}>
              <Form.Item name="state" label="Estado">
                <Select placeholder="Selecione" allowClear>
                  <Select.Option value="AC">AC</Select.Option>
                  <Select.Option value="AL">AL</Select.Option>
                  <Select.Option value="AP">AP</Select.Option>
                  <Select.Option value="AM">AM</Select.Option>
                  <Select.Option value="BA">BA</Select.Option>
                  <Select.Option value="CE">CE</Select.Option>
                  <Select.Option value="DF">DF</Select.Option>
                  <Select.Option value="ES">ES</Select.Option>
                  <Select.Option value="GO">GO</Select.Option>
                  <Select.Option value="MA">MA</Select.Option>
                  <Select.Option value="MT">MT</Select.Option>
                  <Select.Option value="MS">MS</Select.Option>
                  <Select.Option value="MG">MG</Select.Option>
                  <Select.Option value="PA">PA</Select.Option>
                  <Select.Option value="PB">PB</Select.Option>
                  <Select.Option value="PR">PR</Select.Option>
                  <Select.Option value="PE">PE</Select.Option>
                  <Select.Option value="PI">PI</Select.Option>
                  <Select.Option value="RJ">RJ</Select.Option>
                  <Select.Option value="RN">RN</Select.Option>
                  <Select.Option value="RS">RS</Select.Option>
                  <Select.Option value="RO">RO</Select.Option>
                  <Select.Option value="RR">RR</Select.Option>
                  <Select.Option value="SC">SC</Select.Option>
                  <Select.Option value="SP">SP</Select.Option>
                  <Select.Option value="SE">SE</Select.Option>
                  <Select.Option value="TO">TO</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="city" label="Cidade">
                <Select placeholder="Selecione" showSearch allowClear>
                  {informations?.cities?.map((item: any) => (
                    <Select.Option
                      key={`${item}-${Math.random()}`}
                      value={item}
                    >
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="district" label="Bairro">
                <Select placeholder="Selecione" showSearch allowClear>
                  {informations?.district?.map((item: any) => (
                    <Select.Option
                      key={`${item}-${Math.random()}`}
                      value={item}
                    >
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="street" label="Logradouro">
                <Select placeholder="Selecione" showSearch allowClear>
                  {informations?.street?.map((item: any) => (
                    <Select.Option
                      key={`${item}-${Math.random()}`}
                      value={item}
                    >
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="number" label="Número">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="complement" label="Complemento">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={2}>
              <Form.Item name="area" label="Área">
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="measurement_unit" label="Unid. Medida">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="block_section_tower" label="Bloco-Quadra-Torre">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="apartment_store_lot_room"
                label="Ap-Loja-Lote-Sala"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="floor" label="Nº do Andar">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={3}>
              <Form.Item name="bedrooms" label="Dormitórios">
                <Input />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="suites" label="Suítes">
                <Input />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="bathrooms" label="Banheiros">
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="balconies" label="Varandas">
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="garages" label="Garagens">
                <Input />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="covered_garages" label="Cobertura das Garagens">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="blocks_sections_towers_in_condominium"
                label="Blocos, Quadras ou Torres no Condomínio"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="units_in_condominium"
                label="Andares no Condomínio"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="units_per_floor_condominium"
                label="Unid. por Andar no Condomínio"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="units_in_condominium"
                label="Total no Condomínio"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="sale_price" label="Valor de Venda">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sale_conditions" label="Condições da Venda">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="accepts_assets"
                label="Aceita Bens na Negociação"
              >
                      <Select placeholder="Selecione" allowClear>
                  <Select.Option value={true}>Sim</Select.Option>
                  <Select.Option value={false}>Não</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="rental_price" label="Valor do Aluguel">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="rental_conditions" label="Condições do Aluguel">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="condominium_fee" label="Valor do Condomínio">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="included_in_condominium"
                label="O que está Incluso no Condomínio"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="other_fees" label="Valor das Taxas">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="fees_description" label="Descrição das Taxas">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={3}>
              <Form.Item name="deeded" label="Escriturado">
              <Select placeholder="Selecione" allowClear>
                  <Select.Option value={true}>Sim</Select.Option>
                  <Select.Option value={false}>Não</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="has_financing" label="Tem Financiamento">
              <Select placeholder="Selecione" allowClear>
                  <Select.Option value={true}>Sim</Select.Option>
                  <Select.Option value={false}>Não</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="financing_accepted" label="Aceita Financiamento">
              <Select placeholder="Selecione" allowClear>
                  <Select.Option value={true}>Sim</Select.Option>
                  <Select.Option value={false}>Não</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="occupation" label="Ocupação">
              <Select placeholder="Selecione" allowClear>
                  <Select.Option value="Desocupado">Desocupado</Select.Option>
                  <Select.Option value="Dono Morando">Dono Morando</Select.Option>
                  <Select.Option value="Inquilino Morando">Inquilino Morando</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="corner_property" label="Imóvel de Esquina">
              <Select placeholder="Selecione" allowClear>
                  <Select.Option value={true}>Sim</Select.Option>
                  <Select.Option value={false}>Não</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="solar_position" label="Posição Solar">
              <Select placeholder="Selecione" showSearch allowClear>
              {informations?.solarPosition?.map((item: any) => (
                <Select.Option key={`${item}-${Math.random()}`} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="proximity_to_sea" label="Prox. do Mar">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={3}>
              <Form.Item name="role" label="Função">
              <Select placeholder="Selecione" allowClear>
                  <Select.Option value="Construtora">Construtora</Select.Option>
                  <Select.Option value="Dono">Dono</Select.Option>
                  <Select.Option value="Imobiliária">Imobiliária</Select.Option>
                  <Select.Option value="Corretor">Corretor</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="responsible1" label="Responsável 1">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="contact_responsible1"
                label="Contato Responsável 1"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="key_responsible" label="Resp. pela Chave">
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="contact_key_responsible"
                label="Contato Resp. Chave"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="responsible2" label="Responsável 2">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="contact_responsible2"
                label="Contato Responsável 2"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="contact_link_responsible2"
                label="Link do Contato do Responsável 2"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Dados Gerais 2" key="2">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="construction_year" label="Ano de Construção">
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="delivery_forecast" label="Previsão de Entrega">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="builder" label="Construtora">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="capture_link" label="Link de Captação">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="site_link" label="Link do Site">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="olx_link" label="Link da OLX">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={18}>
              <Form.Item name="update_message" label="Mensagem de Atualização">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Dados Gerais 3" key="3">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="subtitle" label="Subtitulo">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="property_description"
                label="Descrição do Imóvel"
              >
                <Input.TextArea rows={12} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="condominium_description"
                label="Descrição do Condomínio"
              >
                <Input.TextArea rows={12} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item name="notes" label="Anotações">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
      <Form.Item>
        <button 
        type="submit"
        className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md w-full"
        >
            {isEditing ? "Atualizar" : "Cadastrar"}
        </button>
      </Form.Item>
    </Form>
  );
});

export { FormRegister };
