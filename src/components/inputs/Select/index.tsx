import React, { useState, useEffect, useRef } from "react";
import { BsChevronDown, BsCheck } from "react-icons/bs";

interface SelectProps {
    items: any[];
    changeSel: Function;
    selected: any;
    className?: string;
    required?: boolean;
}

export default function Select({
    items,
    selected,
    changeSel,
    className,
    required,
}: SelectProps) {
    const [open, setOpen] = useState(false);

    function handleChange(response: any) {
        changeSel(response);
        setOpen(!open);
    }

    const ref = useRef();

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
        <div className="w-full">
            <input
                autoComplete="off"
                id="combobox"
                type="text"
                readOnly
                value={selected ? selected.name : ""}
                onFocus={() => setOpen(true)}
                role="combobox"
                aria-controls="options"
                aria-autocomplete="none"
                aria-expanded="false"
                className={className}
                required={required}
            />
            <BsChevronDown
                width={40}
                height={40}
                onClick={() => setOpen(!open)}
                className="text-gray-800 z-10 cursor-pointer absolute translate-y-[0.2rem] inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
            />
            <ul
                //@ts-ignore
                ref={ref}
                className={`${
                    open ? "block" : "hidden"
                } with-transition absolute z-10 mt-2 max-h-60 w-64 overflow-auto rounded-md border border-mainLight-500 bg-mainDark-400 backdrop-blur py-1 text-base ring-2 ring-gray-700/20 ring-opacity-5 focus:outline-none sm:text-sm" id="options" role="listbox`}
            >
                {items.map((response) => {
                    return (
                        <li
                            key={response.id}
                            onClick={() => handleChange(response)}
                            id="option-0"
                            role="option"
                            tabIndex={-1}
                            className=" cursor-pointer bg-mainDark-400 text-sm relative select-none py-2 pl-3 with-transition hover:bg-mainDark-600 hover:text-mainLight-500 text-mainLight-100 "
                        >
                            <span className="block truncate">
                                {response.name}
                            </span>
                            {selected ? (
                                selected.name === response.name ? (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-6 text-mainLight-500">
                                        <BsCheck width={20} height={20} />
                                    </span>
                                ) : (
                                    <></>
                                )
                            ) : (
                                <></>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
