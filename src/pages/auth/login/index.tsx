import React, { useState, useEffect, useCallback, useContext } from "react";
import { notification } from "antd";
import Logo from "@/assets/logo.png";
import Image from "next/image";
import { sessionService } from "@/services/session.service";
import Cookies from "js-cookie";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthStore } from "@/context/auth";


const Login = React.memo(function Login() {

    const route = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const { setUser } = useAuthStore();

    const handleLogin = useCallback(async (e:any) => {
        e.preventDefault();
        try{
            const res = await sessionService.login(email, password);
            if (!!remember) {
                await Cookies.set(
                  "SS$L",
                  JSON.stringify({
                    email,
                    password,
                  })
                );
              } else {
                await Cookies.remove("SS$L");
              }
              await Cookies.set(
                "SS$S",
                JSON.stringify({
                  token: res.data.token,
                  ...res.data.user,
                  logged: true,
                  validate: moment(new Date()).add("30", "days"),
                }),
                { expires: 30 }
              );
              setUser({
                token: res.data.token,
                ...res.data.user
              });
              route.push("/");
        } catch (error: any) {
            console.log('error', error);
            notification.error({
                message: "Erro ao fazer login",
                description: error?.response?.data?.message,
            });
        }
    }, [email, password, remember]);


  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
        >
          <Image src={Logo} alt="Workflow" width={300} quality={100} />
        </a>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Entre na sua conta
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
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
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
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
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                      onChange={
                        (e) => setRemember(e.target.checked)
                      }
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500"
                    >
                      Salvar login
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline"
                >
                  Esqueceu sua senha?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Entrar
              </button>
              {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Não tem uma conta? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                  </p> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});


export default Login;