import Image from "next/image";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HiHome, HiArrowNarrowLeft } from "react-icons/hi";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";

const Header = () => {
    const router = useRouter();
    const [name, setName] = useState("");

    async function handleHome() {
        router.push("/system/home");
    }

    async function handleBack() {
        router.back();
    }

    async function handleLogout() {}

    return (
        <header className="fixed px-8 text-mainLight-100 flex items-center justify-between bg-mainDark-400 border-b border-mainLight-500 w-screen h-12">
            <div>
                {router.asPath.includes("home") ? (
                    <div
                        className="button text-mainLight-500 with-transition"
                        onClick={() => handleLogout()}
                    >
                        <HiArrowLeftOnRectangle size={25} />
                    </div>
                ) : (
                    <div
                        className="button text-mainLight-500 with-transition"
                        onClick={() => handleBack()}
                    >
                        <HiArrowNarrowLeft size={25} />
                    </div>
                )}
            </div>

            <div>logo</div>

            <div>
                <div
                    className="button text-mainLight-500 with-transition"
                    onClick={() => handleHome()}
                >
                    <HiHome size={25} />
                </div>
            </div>
        </header>
    );
};

export { Header };
