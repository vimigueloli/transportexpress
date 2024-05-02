import CurrencyInput from "react-currency-input-field";

type InputMoneyProps = {
    onChange: (value: number) => void;
    value: number;
    className?: string;
};

export const InputMoney = ({ value, onChange, className }: InputMoneyProps) => {
    return (
        <CurrencyInput
            className={
                className ||
                "w-2/3 border border-gray-300 focus:ring-transparent placeholder-gray-400 appearance-none px-2 py-1"
            }
            defaultValue={value}
            onValueChange={(value, name, values) =>
                onChange(values?.float || 0)
            }
            decimalsLimit={2}
            prefix="R$ "
            fixedDecimalLength={2}
            allowNegativeValue={false}
        />
    );
};
