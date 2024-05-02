import React, { FormEvent, useEffect, useState } from "react";
import Layout from "@/components/layout";
import { GetServerSideProps } from "next";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Loading from "react-loading";
import { parseCookies } from "nookies";
import { numberMask } from "@/utils/masks";
import { InputMoney } from "@/components/inputs/InputMoney";

interface PathFormProps {
    id: number | string;
}

export default function PathForm({ id }: PathFormProps) {
    const [destination, setDestination] = useState<string>("");
    const [prize, setPrize] = useState<number>(0.0);
    const [origin, setOrigin] = useState<string>("");
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const cookies = parseCookies();

    // ? load path data if its exist
    useEffect(() => {
        async function loadPath() {
            setLoading(true);
            try {
                const response = await api.get(`paths/${id}`, {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
                setOrigin(response.data.origin);
                setDestination(response.data.destination);
                setPrize(response.data.suggested_price);
                setLoading(false);
            } catch (err: any) {
                toast.error("falha ao carregar motorista");
                setLoading(false);
                router.back();
            }
        }
        if (id !== "new") {
            loadPath();
        }
    }, []);

    async function handleFormSubmmit(e: FormEvent) {
        e.preventDefault();
        if (id === "new") {
            handleRegisterPath();
        } else {
            handleUpdatePath();
        }
    }

    async function handleRegisterPath() {
        setLoading(true);
        try {
            await api.post(
                "/paths",
                {
                    origin,
                    destination,
                    suggested_price: prize,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            toast.success("✅ Trecho registrado com sucesso");
            setLoading(false);
            router.back();
        } catch (e) {
            console.log("erro->", e);
            toast.error("Falha ao registrar trecho");
            setLoading(false);
        }
    }

    async function handleUpdatePath() {
        setLoading(true);
        try {
            await api.put(
                `paths/${id}`,
                {
                    origin,
                    destination,
                    suggested_price: prize,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            toast.success("✅ Trecho atualizado com sucesso");
            setLoading(false);
            router.back();
        } catch (e) {
            console.log("erro->", e);
            toast.error("Falha ao atualizar trecho");
            setLoading(false);
        }
    }

    return (
        <Layout>
            <div className="line-center sm:p-8 p-2 h-full w-full">
                {loading && (
                    <div className="line-center text-mainLight-500 w-full h-full">
                        <Loading type="spin" />
                    </div>
                )}
                {!loading && (
                    <form
                        id="driverForm"
                        onSubmit={(e: any) => handleFormSubmmit(e)}
                        className="w-full bg-mainDark-400 rounded-xl p-4 sm:p-16 line-left flex-wrap gap-8"
                    >
                        <div className="line-center sm:line-left w-full text-mainLight-100 font-semibold text-3xl">
                            {id === "new"
                                ? "Registrar Trecho"
                                : "Atualizar Trecho"}
                        </div>
                        <div className="line-left w-full sm:w-64 flex-wrap gap-2">
                            <label>Origem</label>
                            <input
                                value={origin}
                                className="w-full h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                                placeholder="Origem"
                                required
                                minLength={3}
                                onChange={(e: any) =>
                                    setOrigin(String(e.target.value))
                                }
                            />
                        </div>
                        <div className="line-left w-full sm:w-64 flex-wrap gap-2">
                            <label>Destino</label>
                            <input
                                value={destination}
                                className="w-full h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                                placeholder="Destino"
                                required
                                minLength={3}
                                onChange={(e: any) =>
                                    setDestination(e.target.value)
                                }
                            />
                        </div>
                        <div className="line-left w-full sm:w-64 flex-wrap gap-2">
                            <label>Comissão</label>
                            <InputMoney
                                value={prize}
                                className="w-full h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                                //placeholder="00000000000000"
                                onChange={setPrize}
                            />
                        </div>
                        <div className="line-right w-full">
                            <button
                                form="driverForm"
                                className="with-transition button h-10 w-32 rounded-lg bg-mainDark-600 border-mainLight-500 text-mainLight-500 border "
                            >
                                {id === "new" ? "REGISTRAR" : "AUALIZAR"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const output = ctx.query;
    return {
        props: { id: output.id },
    };
};
