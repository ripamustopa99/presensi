interface FormInputProps {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}

export function FormInput({
  label,
  name,
  defaultValue,
  required,
  placeholder,
}: FormInputProps) {
  return (
    <div className="w-full">
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
        {label}
      </label>
      <input
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 ring-indigo-500 font-bold transition-all text-slate-800 dark:text-slate-200"
      />
    </div>
  );
}

import { ChevronDown } from "lucide-react";

interface SelectInputProps {
  label: string;
  name: string;
  options: string[]; // Opsinya cukup array string biasa
  defaultValue?: string;
  required?: boolean;
}

export function SelectInput({
  label,
  name,
  options,
  defaultValue,
  required,
}: SelectInputProps) {
  return (
    <div className="w-full space-y-2">
      {/* Label atas */}
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>

      <div className="relative group">
        {/* Dropdown Icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-600 transition-colors">
          <ChevronDown size={18} />
        </div>

        {/* Input Select */}
        <select
          name={name}
          required={required}
          defaultValue={defaultValue}
          className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 ring-indigo-500 font-bold text-sm text-slate-800 dark:text-slate-200 appearance-none transition-all cursor-pointer"
        >
          <option value="" disabled className="text-slate-400">
            Pilih {label}...
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="font-bold">
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
