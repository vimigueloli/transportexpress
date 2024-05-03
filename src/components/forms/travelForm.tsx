import React, { useEffect, useState } from "react";
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

export default function TravelForm() {
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
    const [commission, setCommission] = useState<number>(0);
    const cookies = parseCookies();

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
        getTrucks();
        getDrivers();
    }, []);

    useEffect(() => {
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

        if (!urban) {
            getPaths();
        }
    }, [urban]);

    return (
        <>
            {loading && <Loading type="spin" />}
            {!loading && (
                <form className="line-left sm:line-center bg-mainDark-400 rounded-xl gap-8 flex-wrap sm:p-8 p-4">
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
                                items={paths}
                                selected={path}
                                changeSel={setPath}
                                className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                            />
                        </div>
                    )}
                    {!urban && (
                        <div className="w-full sm:w-64">
                            <label>Vale Frete</label>
                            <InputMoney
                                value={toll}
                                className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                                onChange={setToll}
                            />
                        </div>
                    )}
                    <div className="w-full sm:w-64">
                        <label>Motorista</label>
                        <Select
                            items={drivers}
                            selected={driver}
                            changeSel={setDriver}
                            className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                        />
                    </div>
                    <div className="w-full sm:w-64">
                        <label>Caminhão</label>
                        <Select
                            items={trucks}
                            selected={truck}
                            changeSel={setTruck}
                            className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                        />
                    </div>
                    <div className="w-full sm:w-64">
                        <label>Comissão</label>
                        <InputMoney
                            value={commission}
                            className="w-full mt-2 h-12 rounded-lg text-mainLight-100 outline-mainLight-500/50 px-2 bg-mainDark-600 "
                            onChange={setCommission}
                        />
                    </div>
                </form>
            )}
        </>
    );
}
