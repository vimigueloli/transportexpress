import React, { FormEvent, useEffect, useState } from "react";
import Layout from "@/components/layout";
import { GetServerSideProps } from "next";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { cpfMask } from "@/utils/masks";
import Loading from "react-loading";
import { parseCookies } from "nookies";

interface DriverFormProps {
    id: number | string;
}

export default function HistoryForm({ id }: DriverFormProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [name, setName] = useState<string>("");
    const cookies = parseCookies();
    const router = useRouter();

    // ? load user data if its exist
    useEffect(() => {
        async function loadDriver() {
            setLoading(true);
            try {
                const response = await api.get(`drivers/${id}`, {
                    headers: {
                        Authorization: `Bearer ${cookies.token}`,
                    },
                });
                setName(response.data.name);
                setLoading(false);
            } catch (err: any) {
                toast.error("falha ao carregar motorista");
                setLoading(false);
                router.back();
            }
        }
        if (id !== "new") {
            loadDriver();
        }
    }, []);

    return (
        <Layout title={name}>
            <div className="line-center sm:p-8 p-2 h-full w-full">
                {loading && (
                    <div className="line-center text-mainLight-500 w-full h-full">
                        <Loading type="spin" />
                    </div>
                )}
                {!loading && <div className="line-center"></div>}
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
