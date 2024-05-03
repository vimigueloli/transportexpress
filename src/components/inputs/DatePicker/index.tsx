import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { pt } from "date-fns/locale";
import "react-day-picker/dist/style.css";

interface DatePickerProps {
    value: Date;
    onChange: Function;
    className?: string;
    required?: boolean;
}

export default function DatePicker({
    value,
    onChange,
    required,
    className,
}: DatePickerProps) {
    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef();

    function handleDateSelect(e: any) {
        onChange(e);
        setOpen(false);
    }

    // * fecha o select quando o usuário clicar fora dele
    useEffect(() => {
        const checkIfClickedOutside = (e: any) => {
            // If the menu is open and the clicked target is not within the menu,
            // then close the menu
            //@ts-ignore
            if (open && ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", checkIfClickedOutside);

        return () => {
            // Cleanup the event listener
            document.removeEventListener("mousedown", checkIfClickedOutside);
        };
    }, [open]);

    return (
        <div className="relative">
            <input
                onClick={() => setOpen(!open)}
                value={format(value, "P", {
                    locale: pt,
                })}
                required={required}
                readOnly
                className={className}
            />
            {open && (
                <div
                    //@ts-ignore
                    ref={ref}
                    className="absolute text-mainLight-500 mt-2 bg-mainDark-400 rounded-lg border-mainLight-500 border z-50"
                >
                    <DayPicker
                        mode="single"
                        selected={value}
                        //@ts-ignore
                        onSelect={handleDateSelect}
                        locale={pt}
                    />
                </div>
            )}
        </div>
    );
}
