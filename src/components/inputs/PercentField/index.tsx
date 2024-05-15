import { percentMask } from "@/utils/masks";
import React, { useEffect, useState } from "react";

interface PercentFieldProps {
    className?: string;
    required?: boolean;
    value: number;
    setValue: Function;
}

export default function PercentField({
    className,
    required,
    value,
    setValue,
}: PercentFieldProps) {
    const [display, setDisplay] = useState<string>("");

    useEffect(() => {
        setDisplay(percentMask(`${value}`));
    }, []);

    function handleEdit(newValue: string) {
        setDisplay(percentMask(newValue));
        setValue(Number(percentMask(newValue).replace("% ", "")));
    }

    return (
        <input
            className={className}
            inputMode="numeric"
            value={display}
            onChange={(e) => handleEdit(e.target.value)}
            maxLength={5}
        />
    );
}
