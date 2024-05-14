import React, { useState } from "react";
import { littersMask, money } from "@/utils/masks";
import RefuellingForm from "../forms/refuellingForm";
import { IoTrashBin, IoPencil, IoReader } from "react-icons/io5";
import moment from "moment";
import toast from "react-hot-toast";
import api from "@/services/api";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";

export interface Refuelling {
    id: number;
    date: Date;
    liters: number;
    driver: {
        id: number;
        name: string;
    };
    truck: {
        plate: string;
        id: number;
    };
    cost: number;
}

interface RefuellingItemProps {
    refuelling: Refuelling;
}

export default function RefuellingItem({ refuelling }: RefuellingItemProps) {
    const [edit, setEdit] = useState<boolean>(false);
    const cookies = parseCookies();
    const router = useRouter();

    async function handleDelete() {
        const shure = await confirm("deseja mesmo deletar esse abastecimento?");
        if (shure) {
            try {
                await api.delete(`refuellings/${refuelling.id}`, {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
                toast.success("Abastecimento deletado com sucesso!");
                router.reload();
            } catch (e: any) {
                toast.error("falha ao deletar abastecimento");
            }
        }
    }

    return edit ? (
        <div className="w-full  line-center">
            <RefuellingForm setOpen={setEdit} refuelling={refuelling} />
        </div>
    ) : (
        <div className="line-between w-full sm:w-auto items-end sm:gap-y-2 gap-8 flex-wrap p-4 bg-mainDark-400 rounded-lg">
            <div className="w-full line-center text-mainLight-500 font-semibold text-xl">
                Abastecimento
            </div>
            <div className="text-mainLight-100 font-semibold text-lg">
                {moment(refuelling.date).format("DD/MM/YYYY")}
            </div>
            <div className="text-mainLight-100 font-semibold text-lg">
                {refuelling.truck.plate}
            </div>

            <div className="text-mainLight-100 font-semibold text-lg">
                <div className="text-mainLight-500 text-sm">
                    Litros Abastecidos:
                </div>
                <div>{littersMask(String(refuelling.liters))}</div>
            </div>
            <div className="text-mainLight-100 font-semibold text-lg">
                <div className="text-mainLight-500 text-sm">
                    Valor Abastecido:
                </div>
                <div>{money.format(refuelling.cost)}</div>
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
