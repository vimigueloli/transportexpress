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
            name: "caminhões",
        },
        {
            icon: <RiUser3Fill size={50} />,
            path: "drivers",
            name: "motoristas",
        },
        {
            icon: <RiTreasureMapFill size={50} />,
            path: "paths",
            name: "trechos",
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
                            className="w-32 h-32 bg-mainDark-400 button rounded-xl with-transition line-center text-mainLight-500"
                        >
                            {item.icon}
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}