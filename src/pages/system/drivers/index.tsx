import Layout from "@/components/layout";
import Table from "@/components/table";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import api from "@/services/api";
import { parseCookies } from "nookies";
import { IoTrashBin, IoPencil, IoReader } from "react-icons/io5";
import Loading from "react-loading";

interface Driver {
    id: number;
    name: string;
    cpf?: string;
}

export default function Drivers() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const cookies = parseCookies();

    async function handleNewDriver() {
        router.push("drivers/form/new");
    }

    async function handleEditDriver(driverId: number) {
        router.push(`drivers/form/${driverId}`);
    }

    async function handleDriverHistory(driverId: number) {
        router.push(`drivers/history/${driverId}`);
    }

    async function handleDeleteDriver(driverId: number, name: string) {
        const shure = confirm(`Deseja mesmo deletar o motorista ${name}`);
        if (shure) {
            setLoading(true);
            try {
                await api.delete(`drivers/${driverId}`, {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
                toast.success("🚨Motorista deletado com sucesso");
                loadDrivers();
            } catch (e: any) {
                console.log("error->", e);
                toast.error("Falha ao deletar motorista");
            }
        }
    }

    async function loadDrivers() {
        setLoading(true);
        try {
            const response = await api.get("drivers", {
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                },
            });
            setDrivers(response.data.drivers);
            setLoading(false);
        } catch (e: any) {
            toast.error("Falha ao acarregar os Motoristas");
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDrivers();
    }, []);

    return (
        <Layout title="Motoristas">
            <div className="w-full">
                <div className="line-right my-8 px-4 sm:px-16">
                    <div
                        className="button px-4 h-10 text-lg rounded-lg sm:rounded-xl text-mainLight-500 border border-mainLight-500 bg-mainDark-400"
                        onClick={() => handleNewDriver()}
                    >
                        Adicionar Motorista
                    </div>
                </div>
                <div className="line-center px-4 sm:px-16 mt-8 w-full">
                    {loading && (
                        <div className="line-center text-mainLight-500">
                            <Loading type="spin" />
                        </div>
                    )}
                    {!loading &&
                        (drivers.length > 0 ? (
                            <Table columns={["Nome", "CPF", "Ações"]}>
                                {drivers.map((item: Driver, idx: number) => (
                                    <tr
                                        key={item.id}
                                        className={`
                                        h-12 ${
                                            idx % 2 === 0
                                                ? "bg-mainDark-400"
                                                : ""
                                        }
                                    `}
                                    >
                                        <td className="text-center">
                                            {item.name}
                                        </td>
                                        <td className="text-center">
                                            {item.cpf || "Sem Registro"}
                                        </td>
                                        <td className="line-center gap-2 h-12 ">
                                            <div
                                                className="text-red-600 button with-transition"
                                                onClick={() =>
                                                    handleDeleteDriver(
                                                        item.id,
                                                        item.name
                                                    )
                                                }
                                            >
                                                <IoTrashBin size={20} />
                                            </div>
                                            <div
                                                className="text-mainLight-500 button with-transition"
                                                onClick={() =>
                                                    handleDriverHistory(item.id)
                                                }
                                            >
                                                <IoReader size={20} />
                                            </div>
                                            <div
                                                className="text-mainLight-500 button with-transition"
                                                onClick={() =>
                                                    handleEditDriver(item.id)
                                                }
                                            >
                                                <IoPencil size={20} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </Table>
                        ) : (
                            <div className="text-mainLight-100/50 text-3xl">
                                Sem Registros
                            </div>
                        ))}
                </div>
            </div>
        </Layout>
    );
}
