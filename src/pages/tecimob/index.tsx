import React, { useState } from "react";
import Logo from "@/assets/tecimob.png";
import Image from "next/image";
import { tecimobService } from "@/services/tecimob.service";
import Cookies from "js-cookie";
import { notification } from "antd";

const Tecimob = React.memo(function Tecimob() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        await tecimobService.login(email, password)
            .then((res) => {
                setLoginSuccess(true);
                Cookies.set("token.tecimob", res.data.data.access_token);

                if(res.data.data.message === "Usuário não encontrado"){
                    notification.error({
                        message: "Erro ao efetuar login",
                        description: "Usuário não encontrado",
                    });
                } else if (res.data.data.message === "Senha inválida.") {
                    notification.error({
                        message: "Erro ao efetuar login",
                        description: "Senha inválida",
                    });
                }
            })
            .catch((err) => {
                setLoginSuccess(false);

            });
    }

    return (
        <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
          >
            <Image src={Logo} alt="Workflow" quality={100} />
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
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Entrar
                </button>
                {loginSuccess && (
                  <p className="text-sm text-green-500">
                    Login efetuado com sucesso!
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    );
});

export default Tecimob;
