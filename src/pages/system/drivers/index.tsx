import Layout from "@/components/layout";
import Table from "@/components/table";
import React from "react";
import { useRouter } from "next/router";

export default function Drivers() {
    const router = useRouter();

    async function handleNewDriver() {
        router.push("drivers/form/new");
    }

    return (
        <Layout>
            <div className="w-full">
                <div className="line-right my-8 px-4">
                    <div
                        className="button px-4 h-10 text-lg rounded-xl text-mainLight-500 border border-mainLight-500 bg-mainDark-400"
                        onClick={() => handleNewDriver()}
                    >
                        Adicionar Motorista
                    </div>
                </div>
                <div className="line-center mt-8 w-full">
                    <Table columns={["Nome", "CPF", "Ações"]}>
                        <tr>
                            <td>motorista</td>
                            <td>motorista</td>
                            <td>motorista</td>
                        </tr>
                    </Table>
                </div>
            </div>
        </Layout>
    );
}
