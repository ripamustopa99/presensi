// interface FormInputProps {
//   label: string;
//   name: string;
//   defaultValue?: string;
//   required?: boolean;
//   placeholder?: string;
// }
// // ("use client";

// import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

// type InputProps = InputHTMLAttributes<HTMLInputElement> & {
//   error?: string;
//   label?: string;
//   name?: string;
//   defaultValue?: string;
//   required?: boolean;
//   placeholder?: string;
// };

// export default function Input({
//   label,
//   name,
//   defaultValue,
//   required,
//   placeholder,
//   error,
// }: InputProps) {
//   return (
//     <div className="w-full">
//       <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
//         {label}
//       </label>
//       <input
//         name={name}
//         defaultValue={defaultValue}
//         required={required}
//         placeholder={placeholder}
//         className={`w-full text-white p-4
//         bg-slate-800/40 border
//         border-slate-700/50 rounded-2xl
//         outline-none focus:ring-4 ring-white/5
//         transition-all font-bold text-sm
//         placeholder:text-slate-600
//         placeholder:uppercase
//         placeholder:text-[10px]
//         ${error ? "border-red-500" : ""}`}
//       />

//       {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
//     </div>
//   );
// }

// export function FormInput({
//   label,
//   name,
//   defaultValue,
//   required,
//   placeholder,
// }: FormInputProps) {
//   return (
//     <div className="w-full">
//       <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
//         {label}
//       </label>
//       <input
//         name={name}
//         required={required}
//         defaultValue={defaultValue}
//         placeholder={placeholder}
//         className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 ring-indigo-500 font-bold transition-all text-slate-800 dark:text-slate-200"
//       />
//     </div>
//   );
// }

import { ChevronDown } from "lucide-react";

interface SelectInputProps {
  register?: UseFormRegisterReturn;
  error?: string;
  props?: any;
  label?: string;
  name?: string;
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
  register,
  error,
  ...props
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
          {...props}
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
import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  register?: any; // Ini tempat menampung register("nama")
}

const Input = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, register, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {label}
          </label>
        )}

        <input
          {...register} // 1. BONGKAR REGISTER DISINI
          {...props} // 2. SISANYA (type, placeholder, dll)
          // ref={ref}  // 3. REF BIASANYA SUDAH ADA DI DALAM REGISTER
          className={`
            w-full text-white px-6 py-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl outline-none 
            focus:ring-4 ring-white/5 transition-all font-bold text-sm 
            placeholder:text-slate-600 placeholder:uppercase placeholder:text-[10px]
            ${error ? "border-red-500/50 ring-red-500/10" : ""} 
            ${className}
          `}
        />

        {error && (
          <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider ml-2">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "FormInput";
export default Input;
