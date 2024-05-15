import Layout from "@/components/layout";
import Table from "@/components/table";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import api from "@/services/api";
import { parseCookies } from "nookies";
import { IoTrashBin, IoPencil } from "react-icons/io5";
import Loading from "react-loading";
import { money } from "@/utils/masks";

export interface Path {
    id: number;
    origin: string;
    destination: string;
    suggested_price: number;
    name?: string;
}

export default function Paths() {
    const [paths, setPaths] = useState<Path[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const cookies = parseCookies();

    async function handleNewpath() {
        router.push("paths/form/new");
    }

    async function handleEditpath(pathId: number) {
        router.push(`paths/form/${pathId}`);
    }

    async function handleDeletePath(
        pathId: number,
        origin: string,
        destination: string
    ) {
        const shure = confirm(
            `Deseja mesmo deletar o trecho de ${origin} para ${destination}`
        );
        if (shure) {
            setLoading(true);
            try {
                await api.delete(`paths/${pathId}`, {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
                toast.success("🚨 Trecho deletado com sucesso");
                loadpaths();
            } catch (e: any) {
                console.log("error->", e);
                toast.error("Falha ao deletar caminhão");
            }
        }
    }

    async function loadpaths() {
        setLoading(true);
        try {
            const response = await api.get("paths", {
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                },
            });
            setPaths(response.data.paths);
            setLoading(false);
        } catch (e: any) {
            toast.error("Falha ao acarregar os Caminhões");
            setLoading(false);
        }
    }

    useEffect(() => {
        loadpaths();
    }, []);

    return (
        <Layout title="Trechos">
            <div className="w-full">
                <div className="line-right my-8 px-4 sm:px-16">
                    <div
                        className="button px-4 h-10 text-lg rounded-lg sm:rounded-xl text-mainLight-500 border border-mainLight-500 bg-mainDark-400"
                        onClick={() => handleNewpath()}
                    >
                        Adicionar Trecho
                    </div>
                </div>
                <div className="line-center px-4 flex-wrap sm:px-16 mt-8 w-full">
                    {loading && (
                        <div className="line-center text-mainLight-500">
                            <Loading type="spin" />
                        </div>
                    )}
                    {!loading &&
                        (paths.length > 0 ? (
                            <>
                                <Table
                                    columns={[
                                        "Origem",
                                        "Destino",
                                        "Comissão",
                                        "Ações",
                                    ]}
                                >
                                    {paths.map((item: Path, idx: number) => (
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
                                                {item.origin}
                                            </td>
                                            <td className="text-center">
                                                {item.destination ||
                                                    "Sem registro"}
                                            </td>
                                            <td className="text-center">
                                                {money.format(
                                                    item.suggested_price
                                                )}
                                            </td>
                                            <td className="line-center gap-2 h-12 ">
                                                <div
                                                    className={`${
                                                        idx % 2 === 0
                                                            ? "text-mainDark-400"
                                                            : " text-mainDark-600"
                                                    } bg-red-600 rounded-full h-10 w-10  button with-transition`}
                                                    onClick={() =>
                                                        handleDeletePath(
                                                            item.id,
                                                            item.origin,
                                                            item.destination
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
                                                        handleEditpath(item.id)
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
