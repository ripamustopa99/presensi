import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  register?: any; // Ini tempat menampung register("nama")
}

export const Input = React.forwardRef<HTMLInputElement, FormInputProps>(
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

// // import React from "react";

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: string[] | { label: string; value: string }[];
  register?: any;
}

export const SelectInput = React.forwardRef<
  HTMLSelectElement,
  SelectInputProps
>(({ label, error, options, register, className, ...props }, ref) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          {...register}
          {...props}
          // ref={ref} // Opsional, register sudah membawa ref
          className={`
              w-full text-white px-6 py-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl outline-none
              focus:ring-4 ring-white/5 transition-all font-bold text-sm appearance-none
              cursor-pointer
              ${error ? "border-red-500/50 ring-red-500/10" : ""}
              ${className}
            `}
        >
          <option value="" className="bg-slate-900 text-slate-500">
            PILIH {label}
          </option>
          {options.map((option, index) => {
            const isString = typeof option === "string";
            const value = isString ? option : option.value;
            const text = isString ? option : option.label;
            return (
              <option
                key={index}
                value={value}
                className="bg-slate-900 text-white"
              >
                {text}
              </option>
            );
          })}
        </select>

        {/* Custom Arrow Icon (Agar lebih keren daripada arrow bawaan browser) */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {error && (
        <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider ml-2">
          {error}
        </p>
      )}
    </div>
  );
});

SelectInput.displayName = "SelectInput";

// export default SelectInput;

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[]; // Kita buat khusus string[] supaya simpel untuk filter
  placeholder?: string;
}

export const FilterSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder,
}: FilterSelectProps) => {
  return (
    <div className="w-full space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-white px-6 py-3 bg-slate-800/40 border border-slate-700/50 rounded-2xl outline-none
                     focus:ring-4 ring-white/5 transition-all font-bold text-xs appearance-none cursor-pointer"
        >
          {placeholder && (
            <option value="Semua" className="bg-slate-900 text-slate-500">
              {placeholder}
            </option>
          )}

          {/* Proteksi: Pastikan options adalah array dan filter nilai null/undefined */}
          {Array.isArray(options) &&
            options.filter(Boolean).map((opt, index) => (
              <option
                key={`${opt}-${index}`}
                value={opt}
                className="bg-slate-900 text-white"
              >
                {opt}
              </option>
            ))}
        </select>

        {/* Custom Arrow */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-3 h-3 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
