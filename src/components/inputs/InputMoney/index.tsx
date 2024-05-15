import { currencyMask, money } from "@/utils/masks";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";

type InputMoneyProps = {
    onChange: (value: number) => void;
    value: number;
    className?: string;
    required?: boolean;
};

export const InputMoney = ({
    value,
    onChange,
    className,
    required,
}: InputMoneyProps) => {
    const [display, setDisplay] = useState<string>();

    useEffect(() => {
        setDisplay(money.format(`${value}`));
    }, []);

    function handleEdit(newValue: string) {
        setDisplay(currencyMask(newValue));
        onChange(
            Number(
                currencyMask(newValue)
                    .replace("R$", "")
                    .replaceAll(".", "")
                    .replace(",", ".")
            )
        );
    }

    return (
        <input
            className={className}
            inputMode="numeric"
            value={display}
            onChange={(e) => handleEdit(e.target.value)}
        />
    );
};
