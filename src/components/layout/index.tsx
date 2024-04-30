import React, { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="relative w-screen text-mainLight-100 h-screen bg-mainDark-600">
            <Header />
            <div className="w-screen h-full pt-12">{children}</div>
        </div>
    );
}
