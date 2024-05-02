import React, { FormEvent, useEffect, useState } from "react";
import Layout from "@/components/layout";
import { GetServerSideProps } from "next";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Loading from "react-loading";
import { parseCookies } from "nookies";
import { numberMask, plateMask } from "@/utils/masks";

interface DriverFormProps {
    id: number | string;
}

export default function DriverForm({ id }: DriverFormProps) {
    const [plate, setPlate] = useState<string>("");
    const [renavan, setRenavan] = useState<string>("");
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const cookies = parseCookies();

    // ? load user data if its exist
    useEffect(() => {
        async function loadDriver() {
            setLoading(true);
            try {
                const response = await api.get(`trucks/${id}`, {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
                setPlate(response.data.plate);
                setRenavan(response.data.renavan);
                setLoading(false);
            } catch (err: any) {
                toast.error("falha ao carregar motorista");
                setLoading(false);
                router.back();
            }
        }
        if (id !== "new") {
            loadDriver();
        }
    }, []);

    async function handleFormSubmmit(e: FormEvent) {
        e.preventDefault();
        if (id === "new") {
            handleRegisterTruck();
        } else {
            handleUpdateTruck();
        }
    }

    async function handleRegisterTruck() {
        setLoading(true);
        try {
            await api.post(
                "/trucks",
                {
                    renavan,
                    plate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            toast.success("✅ Caminhão registrado com sucesso");
            setLoading(false);
            router.back();
        } catch (e) {
            console.log("erro->", e);
            toast.error("Falha ao registrar caminhão");
            setLoading(false);
        }
    }

    async function handleUpdateTruck() {
        setLoading(true);
        try {
            await api.put(
                `trucks/${id}`,
                {
                    renavan,
                    plate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            toast.success("✅ Caminhão atualizado com sucesso");
            setLoading(false);
            router.back();
        } catch (e) {
            console.log("erro->", e);
            toast.error("Falha ao atualizar caminhão");
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
                                ? "Registrar Caminhão"
                                : "Atualizar Caminhão"}
                        </div>
                        <div className="line-left w-full sm:w-64 flex-wrap gap-2">
                            <label>Placa</label>
                            <input
                                value={plate}
                                className="w-full h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                                placeholder="AAA-0000"
                                maxLength={8}
                                minLength={8}
                                required
                                onChange={(e: any) =>
                                    setPlate(
                                        plateMask(
                                            String(e.target.value).toUpperCase()
                                        )
                                    )
                                }
                            />
                        </div>
                        <div className="line-left w-full sm:w-64 flex-wrap gap-2">
                            <label>Renavan</label>
                            <input
                                value={renavan}
                                className="w-full h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                                placeholder="00000000000000"
                                onChange={(e: any) =>
                                    setRenavan(numberMask(e.target.value))
                                }
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
