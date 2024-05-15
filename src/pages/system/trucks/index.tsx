import Layout from "@/components/layout";
import Table from "@/components/table";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import api from "@/services/api";
import { parseCookies } from "nookies";
import { IoTrashBin, IoPencil } from "react-icons/io5";
import Loading from "react-loading";

export interface Truck {
    id: number;
    plate: string;
    renavan?: string;
    name?: string;
}

export default function Truckers() {
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const cookies = parseCookies();

    async function handleNewTruck() {
        router.push("trucks/form/new");
    }

    async function handleEditTruck(truckId: number) {
        router.push(`trucks/form/${truckId}`);
    }

    async function handleDeleteTruck(truckId: number, plate: string) {
        const shure = confirm(
            `Deseja mesmo deletar o caminhão de placa ${plate}`
        );
        if (shure) {
            setLoading(true);
            try {
                await api.delete(`trucks/${truckId}`, {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
                toast.success("🚨 Caminhão deletado com sucesso");
                loadtrucks();
            } catch (e: any) {
                console.log("error->", e);
                toast.error("Falha ao deletar caminhão");
            }
        }
    }

    async function loadtrucks() {
        setLoading(true);
        try {
            const response = await api.get("trucks", {
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                },
            });
            setTrucks(response.data.trucks);
            setLoading(false);
        } catch (e: any) {
            toast.error("Falha ao acarregar os Caminhões");
            setLoading(false);
        }
    }

    useEffect(() => {
        loadtrucks();
    }, []);

    return (
        <Layout title="Caminhões">
            <div className="w-full">
                <div className="line-right my-8 px-4 sm:px-16">
                    <div
                        className="button px-4 h-10 text-lg rounded-lg sm:rounded-xl text-mainLight-500 border border-mainLight-500 bg-mainDark-400"
                        onClick={() => handleNewTruck()}
                    >
                        Adicionar Caminhão
                    </div>
                </div>
                <div className="line-center px-4 flex-wrap sm:px-16 mt-8 w-full">
                    {loading && (
                        <div className="line-center text-mainLight-500">
                            <Loading type="spin" />
                        </div>
                    )}
                    {!loading &&
                        (trucks.length > 0 ? (
                            <>
                                <Table columns={["Placa", "Renavan", "Ações"]}>
                                    {trucks.map((item: Truck, idx: number) => (
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
                                                {item.plate}
                                            </td>
                                            <td className="text-center">
                                                {item.renavan || "Sem registro"}
                                            </td>
                                            <td className="line-center gap-2 h-12 ">
                                                <div
                                                    className={`${
                                                        idx % 2 === 0
                                                            ? "text-mainDark-400"
                                                            : " text-mainDark-600"
                                                    } bg-red-600 rounded-full h-10 w-10  button with-transition`}
                                                    onClick={() =>
                                                        handleDeleteTruck(
                                                            item.id,
                                                            item.plate
                                                        )
                                                    }
                                                >
                                                    <IoTrashBin size={20} />
                                                </div>
                                                <div
                                                    className={`${
                                                        idx % 2 === 0
                                                            ? "text-mainDark-400"
                                                            : " text-mainDark-600"
                                                    } bg-mainLight-500 rounded-full h-10 w-10  button with-transition`}
                                                    onClick={() =>
                                                        handleEditTruck(item.id)
                                                    }
                                                >
                                                    <IoPencil size={20} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </Table>
                                <div className="w-full h-12" />
                            </>
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
