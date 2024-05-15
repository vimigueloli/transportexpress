import React, { FormEvent, useEffect, useState } from "react";
import Layout from "@/components/layout";
import { GetServerSideProps } from "next";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { cpfMask } from "@/utils/masks";
import Loading from "react-loading";
import { parseCookies } from "nookies";

interface DriverFormProps {
    id: number | string;
}

export default function DriverForm({ id }: DriverFormProps) {
    const [cpf, setCpf] = useState<string>("");
    const [name, setName] = useState<string>("");
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const cookies = parseCookies();

    // ? load user data if its exist
    useEffect(() => {
        async function loadDriver() {
            setLoading(true);
            try {
                const response = await api.get(`drivers/${id}`, {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
                // setCpf(response.data.cpf);
                setName(response.data.name);
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
            handleRegisterDriver();
        } else {
            handleUpdateDriver();
        }
    }

    async function handleRegisterDriver() {
        setLoading(true);
        try {
            await api.post(
                "/drivers",
                {
                    name,
                    // cpf,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            toast.success("✅ Motorista registrado com sucesso");
            setLoading(false);
            router.back();
        } catch (e) {
            console.log("erro->", e);
            toast.error("Falha ao registrar motorista");
            setLoading(false);
        }
    }

    async function handleUpdateDriver() {
        setLoading(true);
        try {
            await api.put(
                `drivers/${id}`,
                {
                    name,
                    // cpf,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            toast.success("✅ Motorista atualizado com sucesso");
            setLoading(false);
            router.back();
        } catch (e) {
            console.log("erro->", e);
            toast.error("Falha ao atualizar motorista");
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
                                ? "Registrar Motorista"
                                : "Atualizar Motorista"}
                        </div>
                        <div className="line-left w-full sm:w-64 flex-wrap gap-2">
                            <label>Nome</label>
                            <input
                                value={name}
                                className="w-full h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                                placeholder="nome"
                                onChange={(e: any) => setName(e.target.value)}
                                required
                            />
                        </div>
                        {/*
                            <div className="line-left w-full sm:w-64 flex-wrap gap-2">
                                <label>CPF</label>
                                <input
                                    value={cpf}
                                    className="w-full h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                                    placeholder="000.000.000-00"
                                    maxLength={14}
                                    // minLength={14}
                                    onChange={(e: any) =>
                                        setCpf(cpfMask(e.target.value))
                                    }
                                />
                            </div>
                            */}
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
