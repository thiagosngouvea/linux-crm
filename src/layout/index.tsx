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

  const route = useRouter();

  const { SubMenu } = Menu;
  
  const { logout } = useAuthStore();
  return !route.pathname.includes(excludePaths) ? (
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
                Dashboard
            </Menu.Item>
            <SubMenu key="sub1" icon={<BsFillHouseDoorFill />} title="Imóveis">
                <Menu.Item key="sub2" icon={<BsListUl />} onClick={() => route.push('/imoveis')}>
                    Listagem
                </Menu.Item>
                <Menu.Item key="sub3" icon={<BsFillHouseAddFill />} onClick={() => route.push('/imoveis/cadastro')}>
                    Cadastro
                </Menu.Item>
            </SubMenu>
            {/* <SubMenu key="sub4" icon={<BsFillHouseDoorFill />} title="Scraping">
                <Menu.Item key="sub5" icon={<BsListUl />} onClick={() => route.push('/scraping/amancio')}>
                    Amancio
                </Menu.Item>
            </SubMenu> */}
            <Menu.Item key="10" icon={<LogoutOutlined />} onClick={logout}>
                Sair
            </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <Content style={{ margin: '0 16px' }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          <div style={{ padding: 24, minHeight: 360 }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Linux Imóveis ©2023 Created by TG Software</Footer>
      </Layout>
    </Layout>
  ) : (
    <>{children}</>
  )
};
