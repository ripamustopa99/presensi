import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  count: string | number;
  color: "emerald" | "amber" | "rose" | "indigo";
  icon: LucideIcon;
  trend?: string;
}

const colorMap = {
  emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  rose: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
};

export default function StatCard({
  label,
  count,
  color,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-slate-900/50 border border-white/5 p-5 rounded-[1.5rem] flex items-center gap-4 hover:border-white/10 transition-all group">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorMap[color]} group-hover:scale-110 transition-transform`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-black text-white">{count}</h3>
          {trend && (
            <span className="text-[9px] font-bold text-emerald-500">
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
