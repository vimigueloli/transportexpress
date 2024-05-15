import Layout from "@/components/layout";
import React, { ReactNode } from "react";
import { RiTruckFill, RiUser3Fill, RiTreasureMapFill } from "react-icons/ri";
import { useRouter } from "next/router";

interface MenuOptionProps {
    icon: ReactNode;
    path: string;
    name: string;
}

export default function Home() {
    const router = useRouter();
    const menuOptions: MenuOptionProps[] = [
        {
            icon: <RiTruckFill size={50} />,
            path: "trucks",
            name: "Caminhões",
        },
        {
            icon: <RiUser3Fill size={50} />,
            path: "drivers",
            name: "Motoristas",
        },
        {
            icon: <RiTreasureMapFill size={50} />,
            path: "paths",
            name: "Trechos",
        },
    ];

    return (
        <Layout>
            <div className="w-full h-full px-4 sm:px-0 line-center">
                <div className="w-full sm:w-1/2   line-center gap-8 flex-wrap">
                    {menuOptions.map((item: MenuOptionProps) => (
                        <div
                            key={item.name}
                            title={item.name}
                            onClick={() => router.push(item.path)}
                            className="w-32 h-32 bg-mainDark-400 gap-0 items-center flex-wrap button rounded-xl with-transition line-center text-mainLight-500"
                        >
                            <div>
                                <div className="w-full line-center">
                                    {item.icon}
                                </div>
                                <div className="line-center w-full mt-2">
                                    {item.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
