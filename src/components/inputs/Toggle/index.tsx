import React from "react";

interface ToggleProps {
    status: boolean;
    setStatus: Function;
}

export default function Toggle({ status, setStatus }: ToggleProps) {
    return (
        <div
            onClick={() => setStatus(!status)}
            className={`w-10 h-6 rounded-full line-right with-transition cursor-pointer ${
                status ? "bg-teal-300 " : "bg-red-500"
            }`}
        >
            <div
                className={`with-transition bg-white w-5 h-5 rounded-full ${
                    status ? "-translate-x-[2px]" : "-translate-x-[1.1em]"
                }`}
            />
        </div>
    );
}
