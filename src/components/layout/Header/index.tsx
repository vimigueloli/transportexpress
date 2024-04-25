import Image from "next/image";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface HeaderProps {
    open: boolean;
    setOpen: Function;
}

const Header = ({ open, setOpen }: HeaderProps) => {
    const router = useRouter();
    const [name, setName] = useState("");

    return (
        <header className="fixed flex items-center justify-between bg-white  lpx-12 border-b-2 border-teal-300 w-screen z-50 h-16 lg:hidden">
            {open ? (
                <XIcon
                    onClick={() => setOpen(false)}
                    width={30}
                    height={30}
                    className="block lg:hidden ml-4 cursor-pointer text-teal-300"
                />
            ) : (
                <MenuIcon
                    onClick={() => setOpen(true)}
                    width={30}
                    height={30}
                    className="block lg:hidden ml-4 cursor-pointer text-teal-300"
                />
            )}

            <div className="hidden lg:ml-4 lg:block">
                <Image src="/assets/logo.svg" width="142" height="48" />
            </div>

            <div className="lg:hidden sm:block translate-x-10 hidden">
                <Image src="/assets/logo.svg" width="100" height="32" />
            </div>
        </header>
    );
};

export { Header };
