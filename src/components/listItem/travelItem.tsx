import React, { useState } from "react";
import { money } from "@/utils/masks";
import TravelForm from "../forms/travelForm";
import { IoTrashBin, IoPencil, IoReader } from "react-icons/io5";
import moment from "moment";
import toast from "react-hot-toast";
import api from "@/services/api";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";

export interface Travel {
    id: number;
    number: string;
    date: Date;
    toll_prize?: number;
    prize: number;
    driver: {
        id: number;
        name: string;
    };
    truck: {
        plate: string;
        id: number;
    };
    client: string;
    commission: number;
    urban: boolean;
}

interface TravelItemProps {
    travel: Travel;
}

export default function TravelItem({ travel }: TravelItemProps) {
    const [edit, setEdit] = useState<boolean>(false);
    const cookies = parseCookies();
    const router = useRouter();

    async function handleDelete() {
        const shure = await confirm("deseja mesmo deletar essa viagem?");
        if (shure) {
            try {
                await api.delete(`travels/${travel.id}`, {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
                toast.success("Viagem deletada com sucesso!");
                router.reload();
            } catch (e: any) {
                toast.error("falha ao deletar viagem");
            }
        }
    }

    return edit ? (
        <div className="w-full  line-center">
            <TravelForm setOpen={setEdit} travel={travel} />
        </div>
    ) : (
        <div className="line-between w-full sm:w-auto items-end  gap-8 sm:gap-y-2 flex-wrap p-4 bg-mainDark-400 rounded-lg">
            <div className="w-full line-center text-mainLight-500 font-semibold text-xl">
                Viagem
            </div>
            <div className="text-mainLight-100 font-semibold text-lg">
                {moment(travel.date).format("DD/MM/YYYY")}
            </div>
            <div className="text-mainLight-100 font-semibold text-lg">
                <div className="text-mainLight-500 text-sm">
                    {travel.urban ? "Número da Red:" : "Número do Vale Frete"}
                </div>
                <div>{travel.number}</div>
            </div>
            <div className="text-mainLight-100 font-semibold text-lg">
                {travel.truck.plate}
            </div>
            <div className="text-mainLight-100 font-semibold text-lg">
                {travel.client}
            </div>

            <div className="text-mainLight-100 font-semibold text-lg">
                <div className="text-mainLight-500 text-sm">
                    valor arrecadado:
                </div>
                <div>{money.format(travel.prize)}</div>
            </div>
            <div className="text-mainLight-100 font-semibold text-lg">
                <div className="text-mainLight-500 text-sm">comissão:</div>
                <div>{money.format(travel.commission)}</div>
            </div>
            <div className="line-center gap-4">
                <div
                    className="line-center button with-transition text-mainLight-500"
                    onClick={() => setEdit(true)}
                >
                    <IoPencil size={20} />
                </div>
                <div
                    className="line-center button with-transition text-red-500"
                    onClick={() => handleDelete()}
                >
                    <IoTrashBin size={20} />
                </div>
            </div>
        </div>
    );
}
