import React, { useEffect, useState } from 'react';
import { Table, Modal, message, notification } from 'antd';
import { tecimobService } from '@/services/tecimob.service';
import { propertiesService } from '@/services/linux-properties.service';
import { parse } from 'cookie';
import Cookies from 'js-cookie';


function Imoveis({ token }: { token: string }) {
  const [imoveis, setImoveis] = useState([]);
  const [imoveisLinux, setImoveisLinux] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLogin, setModalLogin] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [messageLogin, setMessageLogin] = useState('');

  const handleLogin = async (e: any) => {
    e.preventDefault();
    await tecimobService.login(email, password)
            .then((res) => {

                if(res.data.data.message === "Usuário não encontrado."){
                    setMessageLogin("Usuário não encontrado");
                } else if (res.data.data.message === "Senha inválida.") {
                    setMessageLogin("Senha inválida");
                } else if (res.data.data.access_token){
                    Cookies.set("token.tecimob", res.data.data.access_token);
                    setModalLogin(false);
                    window.location.reload();
                }
            })
  }

  const fetchImoveis = async () => {
    setLoading(true);
    try {
      const response = await tecimobService.getImoveis(token);
      const formattedData = response?.data?.data?.map((property: any) => ({
          reference: property.reference,
          status: property.status,
          calculated_price: property.calculated_price?.replace('R$', '').replace(/,00/g, '').replace(/,(\d+)/g, '.$1').replace('.', '')
        }));
      setImoveis(formattedData);  
    } catch (error: any) {
      message.error(`Erro ao buscar imóveis Tecimob: ${error?.response?.data?.status === 401 ? 'Token inválido' : 'Erro ao buscar imóveis'}`);
      if (error?.response?.data?.status === 401) {
        setModalLogin(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImoveis();
  }, []);

  const fetchImoveisLinux = async () => {
    setLoading(true);
    try {
      const references = imoveis.map((imovel: any) => imovel.reference);
      const response = await propertiesService.getInLinuxReference(references);

      const formattedData = response?.data?.properties?.map((property: any) => ({
        reference: property.reference,
        status: property.status,
        calculated_price: property.sale_price === "" ? (property.rental_price === "" ? null : property.rental_price) : property.sale_price
      }));
      
      setImoveisLinux(formattedData);
    } catch (error) {
      message.error('Erro ao buscar imóveis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imoveis.length > 0) {
      fetchImoveisLinux();
    }
  }, [imoveis]);

  //comparar os 2 arrays e ver se tem imóveis que não estão no linux
  const imoveisNaoLinux = imoveis.filter((imovel: any) => !imoveisLinux.some((imoveilinux: any) => imoveilinux.reference === imovel.reference));
  //juntar os 2 arrays em um só somente oq tem a referencia em comum e fundir os objetos
  const imoveisEmComum = imoveis
    .filter((imovel: any) => imoveisLinux.some((imoveilinux: any) => imoveilinux.reference === imovel.reference))
    .map((imovel: any) => {
      const imoveiLinux: any = imoveisLinux.find((il: any) => il.reference === imovel.reference);
      return {
        ...imovel,
        status_linux: imoveiLinux?.status,
        calculated_price_linux: imoveiLinux?.calculated_price
      };
    });


  //agora eu quero um array com os imoveis que tem o status diferente entre status e status_linux ou o calculated_price diferente entre calculated_price e calculated_price_linux
  const imoveisStatusDiferente = imoveisEmComum.filter((imovel: any) => imovel.status !== imovel.status_linux || imovel.calculated_price !== imovel.calculated_price_linux);

  const columns = [
    {
        title: 'Referência',
        dataIndex: 'reference',
        key: 'reference',
    },
    {
        title: 'Preço',
        dataIndex: 'calculated_price',
        key: 'calculated_price',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
  ]
  
  return (
    <div>
        <Modal
            open={modalLogin}
            onCancel={() => setModalLogin(false)}
            footer={null}
            title="O seu token está expirado, por favor, entre com o seu email e senha"
        >
            <div className="p-6 space-y-4 md:space-y-6">
                {messageLogin && <p className="text-red-500">{messageLogin}</p>}
                <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="name@company.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                            Senha
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </Modal>
            
        <div className="flex items-center gap-2 mb-4">
            <h1 className='text-2xl font-bold text-orange-500'>Imóveis Tecimob</h1>
            <span className="px-3 py-1 text-sm font-semibold bg-orange-100 text-orange-700 rounded-full">
                {imoveis.length}
            </span>
        </div>
        <Table 
            dataSource={imoveis} 
            loading={loading} 
            columns={columns}
        />
        <div className="flex items-center gap-2 mb-4">
            <h1 className='text-2xl font-bold text-orange-500'>Imóveis na Base Linux</h1>
            <span className="px-3 py-1 text-sm font-semibold bg-orange-100 text-orange-700 rounded-full">
                {imoveisLinux.length}
            </span>
        </div>
        <Table 
            dataSource={imoveisLinux} 
            loading={loading} 
            columns={columns}
        />
        <div className="flex items-center gap-2 mb-4">
            <h1 className='text-2xl font-bold text-orange-500'>Imóveis que não estão na Base Linux</h1>
            <span className="px-3 py-1 text-sm font-semibold bg-orange-100 text-orange-700 rounded-full">
                {imoveisNaoLinux.length}
            </span>
        </div>
        <Table 
            dataSource={imoveisNaoLinux} 
            loading={loading} 
            columns={columns}
        />

        <div className="flex items-center gap-2 mb-4">
            <h1 className='text-2xl font-bold text-orange-500'>Imóveis com diferença de status ou preço</h1>
            <span className="px-3 py-1 text-sm font-semibold bg-orange-100 text-orange-700 rounded-full">
                {imoveisStatusDiferente.length}
            </span>
        </div>
        <Table 
            dataSource={imoveisStatusDiferente} 
            loading={loading} 
            columns={[
                {
                    title: 'Referência',
                    dataIndex: 'reference',
                    key: 'reference',
                },
                {
                    title: 'Preço',
                    dataIndex: 'calculated_price',
                    key: 'calculated_price',
                    render: (text: any, record: any) => {
                        const isDifferent = text !== record.calculated_price_linux;
                        return (
                            <span style={{ color: isDifferent ? 'red' : 'inherit' }}>
                                {text ? text : 'Não informado'}
                            </span>
                        );
                    }
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    render: (text: any, record: any) => {
                        const isDifferent = text !== record.status_linux;
                        return (
                            <span style={{ color: isDifferent ? 'red' : 'inherit' }}>
                                {text ? text : 'Não informado'}
                            </span>
                        );
                    }
                },
                {
                    title: 'Preço Linux',
                    dataIndex: 'calculated_price_linux',
                    key: 'calculated_price_linux',
                    render: (text: any, record: any) => {
                        const isDifferent = text !== record.calculated_price;
                        return (
                            <span style={{ color: isDifferent ? 'red' : 'inherit' }}>
                                {text ? text : 'Não informado'}
                            </span>
                        );
                    }
                },
                {
                    title: 'Status Linux',
                    dataIndex: 'status_linux',
                    key: 'status_linux',
                    render: (text: any, record: any) => {
                        const isDifferent = text !== record.status;
                        return (
                            <span style={{ color: isDifferent ? 'red' : 'inherit' }}>
                                {text ? text : 'Não informado'}
                            </span>
                        );
                    }
                }
            ]}
        />
    </div>
  );
}

export default Imoveis;

export const getServerSideProps = async (ctx: any) => {
  const cookies = parse(ctx.req.headers.cookie || '');
  const token = cookies['token.tecimob'];

  if (!token) {
    return { props: {} };
  }

  return {
    props: { token },
  };
};
