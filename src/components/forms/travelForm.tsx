import React, { FormEvent, useEffect, useState } from "react";
import Toggle from "../inputs/Toggle";
import DatePicker from "../inputs/DatePicker";
import { Path } from "@/pages/system/paths";
import api from "@/services/api";
import { parseCookies } from "nookies";
import Select from "../inputs/Select";
import toast from "react-hot-toast";
import Loading from "react-loading";
import { InputMoney } from "../inputs/InputMoney";
import { Driver } from "@/pages/system/drivers";
import { Truck } from "@/pages/system/trucks";
import { money } from "@/utils/masks";
import { Travel } from "../listItem/travelItem";
import { useRouter } from "next/router";

interface travelFormProps {
    setOpen: Function;
    travel?: Travel;
}

export default function TravelForm({ setOpen, travel }: travelFormProps) {
    const [urban, setUrban] = useState<boolean>(false);
    const [numero, setNumero] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());
    const [paths, setPaths] = useState<Path[]>([]);
    const [path, setPath] = useState<Path>();
    const [toll, setToll] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [client, setClient] = useState<string>("");
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [driver, setDriver] = useState<Driver>();
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [truck, setTruck] = useState<Truck>();
    const [prize, setPrize] = useState<number>(0);
    const [commission, setCommission] = useState<number>(0);
    const cookies = parseCookies();
    const router = useRouter();

    // ? load form lists
    useEffect(() => {
        async function getDrivers() {
            const response = await api.get("/drivers", {
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                },
            });
            setDrivers(response.data.drivers);
        }
        async function getTrucks() {
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
        }
        async function getPaths() {
            setLoading(true);
            try {
                const response = await api.get("/paths", {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
                console.log(
                    response.data.paths.map((item: Path) => ({
                        ...item,
                        name: `${item.origin}/${item.destination}`,
                    }))
                );
                setPaths(
                    response.data.paths.map((item: any) => ({
                        ...item,
                        name: `${item.origin}/${item.destination}`,
                    }))
                );
                setLoading(false);
            } catch (e) {
                toast.error("Falha ao carregar trechos");
                console.log("e->", e);
                setLoading(false);
            }
        }

        getPaths();
        getTrucks();
        getDrivers();
    }, []);

    // ? update suggested prize
    useEffect(() => {
        if (urban) {
            setPrize(0);
        } else {
            if (path) {
                setPrize(path.suggested_price);
            }
        }
    }, [path, urban]);

    // ? handle travel submition
    function handleSendForm(e: FormEvent) {
        e.preventDefault();
        if (!urban && !path) {
            toast.error("Você deve selecionar um trecho");
            return;
        }
        if (!driver) {
            toast.error("Você deve selecionar um motorista");
            return;
        }
        if (!truck) {
            toast.error("Você deve selecionar um caminhão");
            return;
        }
        if (prize === 0) {
            toast.error("O valor arrecadado não pode ser 0");
            return;
        }
        if (commission === 0) {
            toast.error("O valor de comissão não pode ser 0");
            return;
        }

        if (travel) {
            editTravel();
        } else {
            registerTravel();
        }
    }

    async function registerTravel() {
        setLoading(true);
        try {
            await api.post(
                "/travels",
                {
                    urban: urban,
                    number: numero,
                    date: new Date(date),
                    prize: Number(prize),
                    commission: commission,
                    client: urban ? client : path?.name,
                    toll_prize: urban ? undefined : Number(toll),
                    driver_id: driver?.id,
                    truck_plate: truck?.plate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            setLoading(false);
            toast.success("✅ Viagem registrada com sucesso!");
            setOpen(false);
            router.reload();
        } catch (e: any) {
            toast.error("falha ao registrar viagem");
            console.log("erro->", e.response.data.message);
            setLoading(false);
        }
    }

    async function editTravel() {
        setLoading(true);
        try {
            await api.put(
                `/travels/${travel?.id}`,
                {
                    urban: urban,
                    number: numero,
                    date: new Date(date),
                    prize: Number(prize),
                    commission: commission,
                    client: urban ? client : path?.name,
                    toll_prize: urban ? undefined : Number(toll),
                    driver_id: driver?.id,
                    truck_plate: truck?.plate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                }
            );
            setLoading(false);
            toast.success("✅ Viagem editada com sucesso!");
            setOpen(false);
            router.reload();
        } catch (e: any) {
            toast.error("falha ao editar viagem");
            console.log("erro->", e.response.data.message);
            setLoading(false);
        }
    }

    // ? load travel data if its already registered
    useEffect(() => {
        if (
            trucks.length > 0 &&
            drivers.length > 0 &&
            paths.length > 0 &&
            travel
        ) {
            if (travel.urban) {
                setUrban(true);
                setClient(travel.client);
            } else {
                setUrban(false);
                const actualPath = paths.find(
                    (item: Path) => item.name === travel.client
                );
                setPath(actualPath);
                setToll(travel.toll_prize || 0);
            }
            setDate(travel.date);
            setCommission(travel.commission);
            setPrize(travel.prize);
            setNumero(travel.number);
            const actualTruck = trucks.find(
                (item: Truck) => item.id === travel.truck.id
            );
            setTruck(actualTruck);
            const actualDriver = drivers.find(
                (item: Driver) => item.id === travel.driver.id
            );
            setDriver(actualDriver);
        }
    }, [loading, paths, trucks, drivers]);

    return (
        <>
            {loading && (
                <div className="line-center w-full">
                    <Loading type="spin" />
                </div>
            )}
            {!loading && (
                <form
                    id="travelForm"
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

                    <div className="line-center items-end h-12 gap-2">
                        <Toggle status={urban} setStatus={setUrban} />
                        {urban ? "Urbano" : "Viagem"}
                    </div>
                    <div className="w-full sm:w-64">
                        <label>
                            {urban ? "Número da Red" : "Número do Vale Frete"}
                        </label>
                        <input
                            value={numero}
                            className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                            placeholder="0000"
                            onChange={(e: any) => setNumero(e.target.value)}
                            required
                        />
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
                    {urban && (
                        <div>
                            <label>Cliente</label>
                            <input
                                value={client}
                                className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                                placeholder="Cliente urbano"
                                onChange={(e: any) => setClient(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    {!urban && (
                        <div className="w-full sm:w-64">
                            <label>Trecho</label>
                            <Select
                                required
                                items={paths}
                                selected={path}
                                changeSel={setPath}
                                className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                            />
                        </div>
                    )}
                    {!urban && (
                        <div className="w-full sm:w-64">
                            <label>Vale Pedágio</label>
                            <InputMoney
                                value={toll}
                                className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                                onChange={setToll}
                                required
                            />
                        </div>
                    )}
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
                    <div className="w-full sm:w-64">
                        <div>Valor arrecadado:</div>
                        <InputMoney
                            required
                            value={prize}
                            className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                            onChange={setPrize}
                        />
                    </div>
                    <div className="w-full sm:w-64">
                        <label>Comissão</label>
                        <InputMoney
                            required
                            value={commission}
                            className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                            onChange={setCommission}
                        />
                    </div>
                    <div className="w-full sm:w-full line-center">
                        <button
                            form="travelForm"
                            className="button w-full bg-mainDark-600 with-transition text-mainLight-500 border-mainLight-500 border rounded-md sm:rounded-lg h-12 px-4"
                        >
                            {travel ? "EDITAR" : "REGISTRAR"}
                        </button>
                    </div>
                </form>
            )}
        </>
    );
}
