import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import PassInput from "@/components/inputs/PasswordInput";
import toast from "react-hot-toast";
import Loading from "react-loading";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function handleLogin(e: Event) {
        e.preventDefault();
        setLoading(true);
        try {
            await setTimeout(() => {
                console.log("envia a requisição 🌐");
                toast.success("✅ Login efetuado com sucesso!");
                setLoading(false);
            }, 5000);
        } catch (err: any) {
            console.log("erro ->", err);
            toast.error("⚠️Falha ao executar o login");
            setLoading(false);
        }
    }

    return (
        <div className="line-center p-4 sm:p-0 w-screen h-screen bg-mainDark-600">
            {loading && <Loading type="spin" color="#00ADB5" />}
            {!loading && (
                <form
                    id="loginForm"
                    onSubmit={(e: any) => handleLogin(e)}
                    className="w-full p-4 gap-4 sm:w-96 h-96 text-mainLight-100 line-center sm:flex-row flex-col sm:line-left flex-wrap bg-mainDark-400 rounded-lg"
                >
                    <div className="line-center  w-full text-center text-2xl font-semibold">
                        TransportExpress
                    </div>
                    <div className="line-center text-center">
                        Sistema de gerenciamento para transportadoras.
                    </div>
                    <div className="line-left w-full flex-wrap gap-2">
                        <label>E-mail</label>
                        <input
                            value={email}
                            className="w-full h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                            placeholder="email@exemplo.com"
                            onChange={(e: any) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="line-left w-full flex-wrap gap-2">
                        <label>Senha</label>
                        <PassInput
                            value={password}
                            className="w-full h-12 rounded-lg text-mainLight-100 px-2 outline-mainLight-500/50 bg-mainDark-600 "
                            onChange={(e: any) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="line-center w-full">
                        <button
                            form="loginForm"
                            className="with-transition button h-10 w-32 rounded-lg bg-mainDark-600 border-mainLight-500 text-mainLight-500 border "
                        >
                            ENTRAR
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
