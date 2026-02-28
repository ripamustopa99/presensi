import { Edit3, Shield } from "lucide-react";

interface EditableFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  registration?: any;
  error?: string;
  isLocked?: boolean;
}

export function EditableField({
  label,
  value,
  icon,
  isEditing,
  onEdit,
  registration,
  error,
  isLocked,
}: EditableFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div
        className={`relative flex items-center group ${error ? "animate-shake" : ""}`}
      >
        <div className="absolute left-4 text-slate-400 group-focus-within:text-teal-500 transition-colors">
          {icon}
        </div>

        {isEditing && !isLocked ? (
          <input
            {...registration}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
            autoFocus
          />
        ) : (
          <div className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span className="truncate">{value}</span>
            {!isLocked && (
              <button
                type="button"
                onClick={onEdit}
                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-teal-500 transition-all"
              >
                <Edit3 size={14} />
              </button>
            )}
            {isLocked && <Shield size={14} className="text-slate-300" />}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">
          {error}
        </p>
      )}
    </div>
  );
}
