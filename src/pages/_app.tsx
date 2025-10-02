import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { useEffect } from "react";

import { useAuthStore } from "@/context/auth";
import { useRouter } from "next/router";


import ptBR from "antd/lib/locale/pt_BR";
import { ConfigProvider } from "antd";

import LayoutSidebar from '@/layout';
import theme from '@/utils/themeConfig';
import "react-quill/dist/quill.snow.css";


export default function App({ Component, pageProps }: AppProps) {

  const route = useRouter();
  const { recoveryAuth, logout, user } = useAuthStore();

  // Páginas que não requerem autenticação
  const publicPaths = ['/auth/login'];
  
  // Função para verificar se a rota atual é pública
  const isPublicPath = (pathname: string) => {
    return publicPaths.includes(pathname) || pathname.startsWith('/imoveis/questionario/');
  };

  useEffect(() => {
    // Não verificar autenticação em páginas públicas
    if (isPublicPath(route.pathname)) {
      return;
    }

    async function recoveryAuthLogin() {
        await recoveryAuth().then((res: any) => {
            if(!!res.success){
                // route.push("/");
                console.log("res", res);
            } else {
                logout();
                route.push("/auth/login");
            }
        });
    }
    recoveryAuthLogin();
}, [user, route.pathname]);


 return (
    <ConfigProvider locale={ptBR} theme={theme}>
      <LayoutSidebar>
        {<Component {...pageProps} />}
      </LayoutSidebar>
    </ConfigProvider>
  );
}
