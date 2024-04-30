import React from "react";

interface TableProps {
  columns: string[];
  children: React.ReactNode;
}

export default function Table({ columns, children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="border min-w-[450px] border-mainBlue rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-mainBlue">
              {columns.map((item, index) => (
                <th
                  key={index}
                  className=" bg-mainPink text-white text-sm font-bold px-4 py-2"
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
