interface SidebarItemProps {
  id: string;
  label: string;
  icon: React.ElementType; // Untuk komponen Lucide icon
  isActive: boolean;
  onClick: () => void;
}
export function Button({
  id,
  label,
  icon: Icon,
  isActive,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all 
        ${
          isActive
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
            : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
    >
      <Icon size={20} />
      <span className="font-black text-sm">{label}</span>
    </button>
  );
}
