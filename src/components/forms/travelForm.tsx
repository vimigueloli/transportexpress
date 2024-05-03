import React, { useState } from "react";
import Toggle from "../inputs/Toggle";
import DatePicker from "../inputs/DatePicker";

export default function TravelForm() {
    const [urban, setUrban] = useState<boolean>(false);
    const [numero, setNumero] = useState<string>("");
    const [date, setDate] = useState<Date>(new Date());

    function handleDateChange(date: any) {
        console.log(date);
        setDate(new Date(date.formated));
    }

    return (
        <form className="line-left sm:line-center items-end bg-mainDark-400 rounded-xl gap-8 flex-wrap sm:p-8 p-4">
            <div className="line-center gap-2">
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
            {urban && <div>client</div>}
            {!urban && <div>trecho</div>}
            {!urban && <div>vale frete</div>}
            <div>motorista</div>
            <div>caminhão</div>
            <div>comissão</div>
        </form>
    );
}
