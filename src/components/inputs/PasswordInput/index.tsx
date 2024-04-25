import React, { useState } from "react";
import { FiEyeOff, FiEye } from "react-icons/fi";

export default function PassInput({ ...rest }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full line-right relative">
            {!open ? (
                <FiEyeOff
                    className="absolute mr-4 cursor-pointer text-white"
                    height={25}
                    onClick={() => setOpen(!open)}
                />
            ) : (
                <FiEye
                    className="absolute mr-4 cursor-pointer text-white"
                    height={25}
                    onClick={() => setOpen(!open)}
                />
            )}
            <input {...rest} type={open ? "text" : "password"} />
        </div>
    );
}
