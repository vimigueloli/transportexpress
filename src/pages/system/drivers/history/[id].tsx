import React, { FormEvent, useEffect, useState } from "react";
import Layout from "@/components/layout";
import { GetServerSideProps } from "next";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { cpfMask } from "@/utils/masks";
import Loading from "react-loading";
import { parseCookies } from "nookies";
import moment from "moment";
import {
    IoChevronBackCircleSharp,
    IoChevronForwardCircleSharp,
} from "react-icons/io5";
import TravelForm from "@/components/forms/travelForm";
import TravelItem, { Travel } from "@/components/listItem/travelItem";

interface DriverFormProps {
    id: number | string;
}

export default function HistoryForm({ id }: DriverFormProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [name, setName] = useState<string>("");
    const [month, setMonth] = useState<string>(moment().format("MM"));
    const [year, setYear] = useState<string>(moment().format("YYYY"));
    const [travels, setTravels] = useState<Travel[]>([]);
    const [showTravelForm, setShowTravelForm] = useState<boolean>(false);
    const cookies = parseCookies();
    const router = useRouter();

    // ? load travels
    useEffect(() => {
        async function loadDriversTravels() {
            setLoading(true);
            try {
                const response = await api.get(`/drivers-travels/${id}`, {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                    params: {
                        month: month,
                        year: year,
                    },
                });
                setTravels(response.data.travels);
                setLoading(false);
            } catch (err: any) {
                toast.error("falha ao carregar motorista");
                setLoading(false);
                // router.back();
            }
        }

        loadDriversTravels();
    }, [year, month]);

    async function handleNewTravel() {
        setShowTravelForm(true);
    }

    function handleChangeMonth(moveType: boolean) {
        const actual = moment(new Date(`${year}-${month}-02`));
        console.log(`de ${actual.format("MM/YYYY")}`);
        if (moveType) {
            setMonth(actual.add(1, "M").format("MM"));
            setYear(actual.add(1, "M").format("YYYY"));
            console.log(`mudou para ${month}/${year}`);
        } else {
            setMonth(actual.subtract(1, "M").format("MM"));
            setYear(actual.subtract(1, "M").format("YYYY"));
            console.log(`mudou para ${month}/${year}`);
        }
    }

    return (
        <Layout title={name}>
            <div className="line-center flex-wrap items-start sm:p-8 p-2 h-full w-full">
                {loading && (
                    <div className="line-center text-mainLight-500 w-full h-full">
                        <Loading type="spin" />
                    </div>
                )}
                {!loading && (
                    <>
                        <div className="line-center gap-16">
                            <div
                                className="line-center button text-mainLight-500 with-transition"
                                onClick={() => handleChangeMonth(false)}
                            >
                                <IoChevronBackCircleSharp size={25} />
                            </div>
                            <div className="line-center">{`${month}/${year}`}</div>
                            <div
                                className="line-center button text-mainLight-500 with-transition"
                                onClick={() => handleChangeMonth(true)}
                            >
                                <IoChevronForwardCircleSharp size={25} />
                            </div>
                        </div>
                        <div className="w-full line-center p-2 gap-4 flex-wrap">
                            {travels.map((item: Travel) => (
                                <div key={item.id}>
                                    <TravelItem travel={item} />
                                </div>
                            ))}
                        </div>
                        <div className="line-center w-full mt-2 pb-8">
                            {showTravelForm && (
                                <TravelForm setOpen={setShowTravelForm} />
                            )}
                        </div>
                        {!showTravelForm && (
                            <div className="line-center w-full py-4">
                                <div
                                    className="button px-4 h-10 text-lg rounded-lg sm:rounded-xl text-mainLight-500 border border-mainLight-500 bg-mainDark-400"
                                    onClick={() => handleNewTravel()}
                                >
                                    Adicionar Viagem
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const output = ctx.query;
    return {
        props: { id: output.id },
    };
};
