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
import { Refuelling } from "../listItem/refuellingItem";

interface RefuellingFormProps {
    setOpen: Function;
    refuelling?: Refuelling;
    selectedDriver?: Driver;
}

export default function RefuellingForm({
    setOpen,
    refuelling,
    selectedDriver,
}: RefuellingFormProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [driver, setDriver] = useState<Driver>();
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [truck, setTruck] = useState<Truck>();
    const [price, setPrice] = useState<string>("");
    const [loading, setloading] = useState<boolean>(true);
    const [liters, setLiters] = useState<string>("");
    const cookies = parseCookies();
    const route = useRouter();

    async function handleSendForm(e: FormEvent) {
        e.preventDefault();
        const actualLiters = Number(liters.replace("L ", "").replace(",", "."));
        const actualCost = Number(
            price.replace("R$ ", "").replaceAll(".", "").replace(",", ".")
        );

        if (isNaN(actualLiters)) {
            toast.error("Digite um valor válido em litros");
            return;
        }
        if (isNaN(actualCost)) {
            toast.error("Digite um valor válido em custo");
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

        if (!refuelling) {
            handleRegister(actualCost, actualLiters);
        } else {
            handleEdit(actualCost, actualLiters);
        }
    }

    async function handleRegister(actualCost: number, actualLiters: number) {
        try {
            await api.post(
                `/refuellings`,
                {
                    liters: actualLiters,
                    cost: actualCost,
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

    async function handleEdit(actualCost: number, actualLiters: number) {
        try {
            await api.put(
                `/refuellings/${refuelling?.id}`,
                {
                    liters: actualLiters,
                    cost: actualCost,
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
            route.reload();
        } catch (e: any) {
            console.log("erro ->", e.response.data.message);
            toast.error("Falha ao registrar Abastecimento");
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
            refuelling !== undefined
        ) {
            setLiters(
                littersMask(String(Number(refuelling.liters).toFixed(3)))
            );
            setPrice(currencyMask(String(Number(refuelling.cost).toFixed())));
            setDate(refuelling.date);
            setDriver(refuelling.driver);
            setTruck(
                trucks.find((item: any) => item.id === refuelling.truck.id)
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
                    id="refuellingForm"
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
                        <label>Litros</label>
                        <input
                            value={liters}
                            required
                            onChange={(e) =>
                                setLiters(littersMask(e.target.value))
                            }
                            className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
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
                    <div className="w-full sm:w-full line-center">
                        <button
                            form="refuellingForm"
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
