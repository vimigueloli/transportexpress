import React, { useState, useRef, useEffect } from "react";
import { BsChevronDown, BsCheck } from "react-icons/bs";

interface DropSelectProps {
    selected: any;
    items: any[];
    changeSel: Function;
    styles: string;
}

export default function DropSelect({
    selected,
    items,
    changeSel,
    styles,
    ...rest
}: DropSelectProps) {
    const [open, setOpen] = useState(false);

    function handleChange(response: { name: string; id: string }) {
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
        <div className="relative">
            <div {...rest} className={styles} onClick={() => setOpen(!open)}>
                <div>{selected.name}</div>
                <BsChevronDown />
            </div>
            <ul
                //@ts-ignore
                ref={ref}
                className={`${
                    open ? "block" : "hidden"
                } with-transition absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md border border-gray-700/20 bg-white backdrop-blur py-1 text-base ring-2 ring-gray-700/20 ring-opacity-5 focus:outline-none sm:text-sm" id="options" role="listbox`}
            >
                {items.map((response) => {
                    return (
                        <li
                            key={response.id}
                            onClick={() => handleChange(response)}
                            id="option-0"
                            role="option"
                            tabIndex={-1}
                            className=" cursor-pointer bg-white text-sm relative select-none py-2 pl-3 with-transition hover:bg-teal-300 hover:text-white text-gray-800 "
                        >
                            <span className="block truncate">
                                {response.name}
                            </span>
                            {selected ? (
                                selected.name === response.name ? (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-6 text-gray-800">
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
