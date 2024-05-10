import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import Loading from "react-loading";
import DatePicker from "../inputs/DatePicker";
import { Driver } from "@/pages/system/drivers";
import { Truck } from "@/pages/system/trucks";
import api from "@/services/api";
import toast from "react-hot-toast";
import Select from "../inputs/Select";
import { currencyMask, littersMask } from "@/utils/masks";
import { Maintenance } from "../listItem/maintenanceItem";

interface MaintenanceFormProps {
    setOpen: Function;
    maintenance?: Maintenance;
    selectedDriver?: Driver;
}

export default function MaintenanceForm({
    setOpen,
    maintenance,
    selectedDriver,
}: MaintenanceFormProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [driver, setDriver] = useState<Driver>();
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [truck, setTruck] = useState<Truck>();
    const [price, setPrice] = useState<string>("");
    const [commission, setCommission] = useState<string>("");
    const [loading, setloading] = useState<boolean>(true);
    const [obs, setObs] = useState<string>("");
    const cookies = parseCookies();
    const route = useRouter();

    async function handleSendForm(e: FormEvent) {
        e.preventDefault();
        // const actualLiters = Number(liters.replace("L ", "").replace(",", "."));
        const actualCost = Number(
            price.replace("R$ ", "").replaceAll(".", "").replace(",", ".")
        );
        const actualCommission = Number(
            commission.replace("R$ ", "").replaceAll(".", "").replace(",", ".")
        );

        if (isNaN(actualCost)) {
            toast.error("Digite um valor válido em custo");
            return;
        }
        if (isNaN(actualCommission)) {
            toast.error("Digite um valor válido em comissão");
            return;
        }
        if (!driver) {
            toast.error("Selecione um motorista");
            return;
        }
        if (!truck) {
            toast.error("selecione um Caminhão");
            return;
        }

        if (!maintenance) {
            handleRegister(actualCost, actualCommission);
        } else {
            handleEdit(actualCost, actualCommission);
        }
    }

    async function handleRegister(
        actualCost: number,
        actualCommission: number
    ) {
        try {
            await api.post(
                `/maintenances`,
                {
                    cost: actualCost,
                    commission: actualCommission,
                    obs: obs,
                    date: date,
                    driver_id: driver?.id,
                    truck_id: truck?.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            toast.success("Abastecimento registrado com sucesso");
            setOpen(false);
            //route.reload();
        } catch (e: any) {
            toast.error("Falha ao registrar Abastecimento");
        }
    }

    async function handleEdit(actualCost: number, actualCommission: number) {
        try {
            await api.put(
                `/maintenances/${maintenance?.id}`,
                {
                    cost: actualCost,
                    commission: actualCommission,
                    obs: obs,
                    date: date,
                    driver_id: driver?.id,
                    truck_id: truck?.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            toast.success("Manutenção registrada com sucesso");
            setOpen(false);
            route.reload();
        } catch (e: any) {
            console.log("erro ->", e.response.data.message);
            toast.error("Falha ao registrar manutenção");
        }
    }

    // ? load lists
    useEffect(() => {
        async function getDrivers() {
            setloading(true);
            try {
                const response = await api.get("/drivers", {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
                setDrivers(response.data.drivers);
            } catch (e) {
                setloading(false);
                toast.error("falha ao carregar motoristas");
            }
        }
        async function getTrucks() {
            try {
                const response = await api.get("/trucks", {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
                setTrucks(
                    response.data.trucks.map((item: Truck) => ({
                        ...item,
                        name: item.plate,
                    }))
                );
                setloading(false);
            } catch (e: any) {
                setloading(false);
                toast.error("falha ao carregar os caminhões");
            }
        }

        getDrivers();
        getTrucks();
    }, []);

    // ? load refuelling data if its exists
    useEffect(() => {
        if (
            trucks.length > 0 &&
            drivers.length > 0 &&
            maintenance !== undefined
        ) {
            setPrice(currencyMask(String(Number(maintenance.cost).toFixed(2))));
            setCommission(
                currencyMask(String(Number(maintenance.commission).toFixed(2)))
            );
            setObs(maintenance.obs);
            setDate(maintenance.date);
            setDriver(maintenance.driver);
            setTruck(
                trucks.find((item: any) => item.id === maintenance.truck.id)
            );
        }
        if (selectedDriver) {
            setDriver(selectedDriver);
        }
    }, [trucks, drivers]);

    return (
        <>
            {loading && (
                <div className="line-center w-full">
                    <Loading type="spin" />
                </div>
            )}
            {!loading && (
                <form
                    id="maintenanceForm"
                    onSubmit={(e) => handleSendForm(e)}
                    className="line-left relative sm:line-between bg-mainDark-400 rounded-xl gap-8 flex-wrap sm:p-8 p-4"
                >
                    <div className="registrar line-right w-full">
                        <div>
                            <div
                                onClick={() => setOpen(false)}
                                className="line-center button with-transition w-8 h-8 rounded-full bg-mainDark-600 text-lg border-mainLight-500 border text-mainLight-500"
                            >
                                X
                            </div>
                        </div>
                    </div>

                    <div className="w-full sm:w-64">
                        <label>Data</label>
                        <DatePicker
                            value={date}
                            required
                            onChange={setDate}
                            className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                        />
                    </div>
                    <div className="w-full sm:w-64">
                        <label>Caminhão</label>
                        <Select
                            items={trucks}
                            selected={truck}
                            changeSel={setTruck}
                            required
                            className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                        />
                    </div>
                    <div className="w-full h-36">
                        <label>Detalhamento</label>
                        <input
                            value={obs}
                            required
                            minLength={6}
                            onChange={(e) => setObs(e.target.value)}
                            className="w-full mt-2 h-32 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                        />
                    </div>
                    <div className="w-full sm:w-64">
                        <label>Custo</label>
                        <input
                            value={price}
                            required
                            onChange={(e) =>
                                setPrice(currencyMask(e.target.value))
                            }
                            className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                        />
                    </div>
                    <div className="w-full sm:w-64">
                        <label>Comissão</label>
                        <input
                            value={commission}
                            required
                            onChange={(e) =>
                                setCommission(currencyMask(e.target.value))
                            }
                            className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                        />
                    </div>
                    {!selectedDriver && (
                        <div className="w-full sm:w-64">
                            <label>Motorista</label>
                            <Select
                                items={drivers}
                                selected={driver}
                                changeSel={setDriver}
                                required
                                className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                            />
                        </div>
                    )}

                    <div className="w-full sm:w-full line-center">
                        <button
                            form="maintenanceForm"
                            className="button w-full bg-mainDark-600 with-transition text-mainLight-500 border-mainLight-500 border rounded-md sm:rounded-lg h-12 px-4"
                        >
                            REGISTRAR
                        </button>
                    </div>
                </form>
            )}
        </>
    );
}
