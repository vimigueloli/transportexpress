import React from "react";

interface TableProps {
    columns: string[];
    children: React.ReactNode;
}

export default function Table({ columns, children }: TableProps) {
    return (
        <div className="overflow-x-auto w-full">
            <div className="border min-w-[450px] border-mainLight-500 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-mainLight-500">
                            {columns.map((item, index) => (
                                <th
                                    key={index}
                                    className=" bg-mainPink text-mainLight-500 text-sm font-bold  px-4 py-2"
                                >
                                    {item}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-mainBlue">{children}</tbody>
                </table>
            </div>
        </div>
    );
}
