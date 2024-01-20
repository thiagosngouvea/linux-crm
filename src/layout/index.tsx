import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  //icone de logout
    LogoutOutlined,
} from '@ant-design/icons';
import { BsFillHouseDoorFill, BsListUl, BsFillHouseAddFill } from 'react-icons/bs';
import { BiSolidDashboard } from 'react-icons/bi';
import type { MenuProps } from 'antd';
import { useAuthStore } from '@/context/auth';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useRouter } from 'next/router';
import Logo from '@/assets/logo.png';
import Image from 'next/image';
import useWindowSize from '@/hooks/useWindowSize';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

interface LayoutSidebarProps {
    children: React.ReactNode;
}

const excludePaths:any = ['/auth/login'];

export default function LayoutSidebar({children}: LayoutSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const windowSize = useWindowSize();

  const route = useRouter();

  const { SubMenu } = Menu;
  
  const { logout } = useAuthStore();

  const isMobile = windowSize.width ? windowSize.width <= 768 : false;

  return !route.pathname.includes(excludePaths) ? (
    !isMobile ? (
    <Layout style={{ minHeight: '100vh' }}>
          <Sider theme='light' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{ position: 'sticky', maxHeight: '100vh'}}>
            <div className="demo-logo-vertical py-2 pb-4">
                <Image
                    src={Logo}
                    alt="Logo"
                    width={200}
                    height={100}
                />
            </div>
            <Menu defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<BiSolidDashboard />} onClick={() => route.push('/')}>
                    Inicio
                </Menu.Item>
                <SubMenu key="sub1" icon={<BsFillHouseDoorFill />} title="Imóveis">
                    <Menu.Item key="sub2" icon={<BsListUl />} onClick={() => route.push('/imoveis')}>
                        Listagem
                    </Menu.Item>
                    <Menu.Item key="sub3" icon={<BsFillHouseAddFill />} onClick={() => route.push('/imoveis/cadastro')}>
                        Cadastro
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key="10" icon={<LogoutOutlined />} onClick={logout}>
                    Sair
                </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ margin: '0 16px' }}>
              <div style={{ padding: 24, minHeight: 360 }}>
                {children}
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Linux Imóveis ©2023 Created by TG Software</Footer>
          </Layout>
        </Layout>
    ) : (
      //faça o layout para mobile usando navbar em vez do componente de sidebar
      <Layout style={{ minHeight: '100vh' }}>
        <Header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
        //precisa ser light para que o logo fique visível
        >
          {/* <div className="logo">
            <Image
              src={Logo}
              alt="Logo"
              width={100}
              height={50}
            />
          </div> */}
          <Menu theme="light" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="1" icon={<BiSolidDashboard />} onClick={() => route.push('/')}>
              Inicio
            </Menu.Item>
            <SubMenu key="sub1" icon={<BsFillHouseDoorFill />} title="Imóveis">
              <Menu.Item key="sub2" icon={<BsListUl />} onClick={() => route.push('/imoveis')}>
                Listagem
              </Menu.Item>
              <Menu.Item key="sub3" icon={<BsFillHouseAddFill />} onClick={() => route.push('/imoveis/cadastro')}>
                Cadastro
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="10" icon={<LogoutOutlined />} onClick={logout}>
              Sair
            </Menu.Item>
          </Menu>
        </Header>
        <Content >
          <div style={{ padding: 16, minHeight: 360 }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Linux Imóveis ©2023 Created by TG Software</Footer>
      </Layout>
    )
    
  ) : (
    <>{children}</>
  )
};
