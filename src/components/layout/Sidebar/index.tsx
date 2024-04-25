import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiLogoutBoxLine } from "react-icons/ri";
import { ActiveLink } from "../../utils/ActiveLink";
import logo from "public/logo/full_logo_green.png";
import dash from "public/assets/dashboard.svg";
import teal_dash from "public/assets/dashboard_teal.svg";
import calendar from "public/assets/calendar.svg";
import teal_calendar from "public/assets/calendar_teal.svg";
import client from "public/assets/client.svg";
import teal_client from "public/assets/client_teal.svg";
import landing from "public/assets/landing.svg";
import teal_landing from "public/assets/landing_teal.svg";
import partners from "public/assets/partners.svg";
import teal_partners from "public/assets/partners_teal.svg";
import skills from "public/assets/skills.svg";
import teal_skills from "public/assets/skills_teal.svg";
import users from "public/assets/users.svg";
import teal_users from "public/assets/users_teal.svg";

type Options = {
    name: string;
    href: string;
};

interface MenuItemProps {
    id: number;
    name: string;
    href: string;
    icon?: any;
    selectedIcon?: any;
    subLinks?: any[];
    inside?: string[];
}

// construir um hook para lidar com os módulos
// e rotas constantes
const navigation: MenuItemProps[] = [
    {
        id: 1,
        name: "DashBoard",
        href: "/system/dashboard",
        icon: dash,
        selectedIcon: teal_dash,
    },
    {
        id: 2,
        name: "Landing Page",
        href: "/system/landing",
        icon: landing,
        selectedIcon: teal_landing,
    },
    {
        id: 3,
        name: "Agenda",
        href: "/system/calendar",
        icon: calendar,
        selectedIcon: teal_calendar,
    },
    {
        id: 4,
        name: "Parceiros",
        href: "/system/partnership",
        icon: partners,
        selectedIcon: teal_partners,
    },
    {
        id: 5,
        name: "Usuários",
        href: "/system/users",
        icon: users,
        selectedIcon: teal_users,
    },
    {
        id: 6,
        name: "Especialidades",
        href: "/system/specialities",
        icon: skills,
        selectedIcon: teal_skills,
    },
    {
        id: 7,
        name: "Pacientes",
        href: "/system/clients",
        icon: client,
        selectedIcon: teal_client,
    },
];

interface BarProps {
    open: boolean;
    setOpen: Function;
}

const Sidebar = ({ open, setOpen }: BarProps) => {
    const router = useRouter();
    const [actualLink, setActualLink] = useState(router.pathname);

    useEffect(() => {
        setActualLink(router.pathname);
    }, [router.asPath]);

    function handleLogout() {
        router.push("/system");
    }

    return (
        <>
            <div className="z-10 w-80 hidden lg:block bg-white h-full relative flex-col overflow-y-auto pb-6">
                <div className="mt-4  flex flex-col">
                    <nav className="flex-1 flex flex-col gap-2 px-2 mb-24">
                        <div className="line-center">
                            <Image src={logo} width={150} height={130} />
                        </div>
                        <div className="line-left gap-4 mb-8 mt-4">
                            <div className="p-1 bg-teal-300 rounded-full">
                                <div className="bg-gray-300 w-24 h-24 rounded-full" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold">
                                    nome do usuário
                                </div>
                                <div className="text-sm font-light">
                                    cargo do usuário
                                </div>
                            </div>
                        </div>
                        {navigation.map((item) => (
                            <div>
                                <ActiveLink
                                    key={item.id}
                                    href={item.href}
                                    className={`flex flex-row items-center  border-l-2  hover:border-teal-300  gap-3 py-2  pl-8 mx-2 with-transition
                                    ${
                                        actualLink === item.href
                                            ? "border-teal-300 text-teal-300"
                                            : "border-white text-gray-800"
                                    }`}
                                    activeClassName=""
                                >
                                    <a>
                                        {actualLink === item.href ? (
                                            <Image
                                                src={item.selectedIcon}
                                                height={25}
                                                width={25}
                                            />
                                        ) : (
                                            <Image
                                                src={item.icon}
                                                height={25}
                                                width={25}
                                            />
                                        )}

                                        {item.name}
                                    </a>
                                </ActiveLink>
                                {/*item.subLinks &&
                                    item.subLinks.map((subItem) => (
                                        <ActiveLink
                                            key={subItem.name}
                                            href={subItem.href}
                                            className="flex flex-row items-center my-2 py-3 text-gray-50 pl-8 rounded-md transition-colors cursor-pointer hover:opacity-50 mx-2"
                                            activeClassName="text-orange-500"
                                        >
                                            <div className={`text-orange-500`}>
                                                <Image
                                                    src={
                                                        subItem.href ===
                                                        actualLink
                                                            ? subItem.selIcon
                                                            : subItem.icon
                                                    }
                                                    width="20"
                                                    height="20"
                                                />
                                                <p
                                                    className={`ml-4 ${
                                                        subItem.href ===
                                                        actualLink
                                                            ? "text-orange-500"
                                                            : "text-white"
                                                    } `}
                                                >
                                                    {subItem.name}
                                                </p>
                                            </div>
                                        </ActiveLink>
                                                ))*/}
                            </div>
                        ))}
                    </nav>

                    <div className=" line-center">
                        <div
                            onClick={() => handleLogout()}
                            className="line-center w-full  hover:text-teal-300  gap-3 py-3  pl-8 mx-2 cursor-pointer with-transition"
                        >
                            <div className="flex w-full items-center">
                                <RiLogoutBoxLine
                                    className="mr-3 h-4 w-4 flex-shrink-0 "
                                    aria-hidden="true"
                                />
                                Sair
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={`z-40 lg:hidden pt-14 bg-white h-full fixed flex-col overflow-y-auto pb-24 with-transition 
				${open ? "w-full" : "w-0"}`}
            >
                <div className="mt-4 mb-16 flex justify-betw flex-col">
                    <nav className=" flex flex-col gap-4 px-2">
                        {navigation.map((item) => (
                            <div>
                                <ActiveLink
                                    key={item.id}
                                    href={item.href}
                                    className={`line-left pl-16 border border-teal-300 py-3 text-gray-800 rounded-md with-transition hover:bg-teal-300 mx-2
								${item.href === actualLink ? "bg-teal-300 text-teal-300" : ""}`}
                                    activeClassName=""
                                >
                                    <a>{item.name}</a>
                                </ActiveLink>
                            </div>
                        ))}
                    </nav>
                </div>
                <div className=" line-center">
                    <div
                        onClick={() => handleLogout()}
                        className="group bottom-0 flex cursor-pointer items-center justify-center rounded-md border border-teal-300
							py-3 w-11/12  text-sm font-normal tracking-wide text-primary-600 transition-colors hover:bg-teal-300 hover:text-gray-50"
                    >
                        <div className="flex items-center">
                            <RiLogoutBoxLine
                                className="mr-3 h-4 w-4 flex-shrink-0 "
                                aria-hidden="true"
                            />
                            Sair
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export { Sidebar };
