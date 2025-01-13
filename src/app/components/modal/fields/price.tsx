import { NumericFormat } from 'react-number-format';

interface PriceFieldProps {
    friendlyName?: string;
    name: string;
    placeholder?: string;
    disabled?: boolean;
    value: number;
    setValue: (value: number) => void;
    optional?: boolean;
}

const InputClassName = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

const PriceField = ({ friendlyName, name, disabled, value, setValue, placeholder, optional }: PriceFieldProps) => {
    return (
        <div className="mb-4">
            {friendlyName && (
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={friendlyName}>
                    {friendlyName} {!optional && <span className="text-red-500">*</span>}
                </label>
            )}

            <NumericFormat
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale={true} 
                allowNegative={false}
                id={name}
                name={name}
                disabled={disabled}
                value={value}
                onValueChange={(values) => setValue(values.floatValue || 0)}  // Garante que estamos passando um número
                placeholder={placeholder}
                className={InputClassName}
            />
        </div>
    );
};

export default PriceField;
