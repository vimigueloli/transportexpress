import React, { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
    children: ReactNode;
    title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
    return (
        <div className="relative w-screen text-mainLight-100 h-screen bg-mainDark-600">
            <Header title={title} />
            <div className="w-screen h-full pt-12 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
