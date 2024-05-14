import React, { useState } from "react";
import { littersMask, money } from "@/utils/masks";
import RefuellingForm from "../forms/refuellingForm";
import { IoTrashBin, IoPencil, IoReader } from "react-icons/io5";
import moment from "moment";
import toast from "react-hot-toast";
import api from "@/services/api";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import MaintenanceForm from "../forms/maintenanceForm";

export interface Maintenance {
    id: number;
    date: Date;
    obs: string;
    commission: number;
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

interface MaintenanceItemProps {
    maintenance: Maintenance;
}

export default function MaintenanceItem({ maintenance }: MaintenanceItemProps) {
    const [edit, setEdit] = useState<boolean>(false);
    const cookies = parseCookies();
    const router = useRouter();

    async function handleDelete() {
        const shure = await confirm("deseja mesmo deletar essa manutenção?");
        if (shure) {
            try {
                await api.delete(`maintenances/${maintenance.id}`, {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
                toast.success("manutenção deletada com sucesso!");
                router.reload();
            } catch (e: any) {
                toast.error("falha ao deletar manutenção");
            }
        }
    }

    return edit ? (
        <div className="w-full  line-center">
            <MaintenanceForm setOpen={setEdit} maintenance={maintenance} />
        </div>
    ) : (
        <div className="line-between w-full sm:w-auto items-end sm:gap-y-2 gap-8 flex-wrap p-4 bg-mainDark-400 rounded-lg">
            <div className="w-full line-center text-mainLight-500 font-semibold text-xl">
                Manutenção
            </div>
            <div className="text-mainLight-100 font-semibold text-lg">
                {moment(maintenance.date).format("DD/MM/YYYY")}
            </div>
            <div className="text-mainLight-100 font-semibold text-lg">
                {maintenance.truck.plate}
            </div>
            <div className="text-mainLight-100 font-semibold text-lg">
                {maintenance.obs}
            </div>

            <div className="text-mainLight-100 font-semibold text-lg">
                <div className="text-mainLight-500 text-sm">Valor Gasto:</div>
                <div>{money.format(maintenance.cost)}</div>
            </div>
            <div className="text-mainLight-100 font-semibold text-lg">
                <div className="text-mainLight-500 text-sm">Comissão:</div>
                <div>{money.format(maintenance.commission)}</div>
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
