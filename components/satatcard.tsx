// export function StatCard({ label, count, color, icon }: any) {
//   const colors: any = {
//     indigo: "bg-indigo-600 text-indigo-600 shadow-indigo-100",
//     emerald: "bg-emerald-600 text-emerald-600 shadow-emerald-100",
//     amber: "bg-amber-600 text-amber-600 shadow-amber-100",
//     rose: "bg-rose-600 text-rose-600 shadow-rose-100",
//   };
//   return (
//     <div className="bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-[2rem] border dark:border-slate-800 shadow-sm flex items-center gap-4 group transition-all hover:scale-[1.02]">
//       {/* <div
//         className={`w-12 h-12 lg:w-14 lg:h-14 ${colors[color]} bg-opacity-10 dark:bg-opacity-20 rounded-2xl flex items-center justify-center shrink-0`}
//       > */}
//       {/* {React.cloneElement(icon, { size: 22 })} */}
//       {/* </div> */}
//       <div className="min-w-0">
//         <p className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-widest">
//           {label}
//         </p>
//         <p className="text-xl lg:text-2xl font-black truncate">{count}</p>
//       </div>
//     </div>
//   );
// }
"use client";

import React from "react";
import { UserCheck, Users, School, LayoutDashboard } from "lucide-react";

// Parameter untuk satu kartu
interface StatCardProps {
  label: string;
  count: string | number;
  color: "indigo" | "emerald" | "amber" | "rose";
  icon?: React.ReactNode;
}

export default function StatCard({ label, count, color, icon }: StatCardProps) {
  // Mapping warna agar Tailwind tidak bingung saat render dinamis
  const colorMap = {
    indigo:
      "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
    amber:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800",
    rose: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800",
  };

  return (
    <div
      className={`p-5 rounded-[2rem] border bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md ${colorMap[color].split(" ").slice(-2).join(" ")}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-2xl ${colorMap[color].split(" ").slice(0, 3).join(" ")}`}
        >
          {icon || <LayoutDashboard size={20} />}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {label}
          </p>
          <h3 className="text-2xl font-black dark:text-white">{count}</h3>
        </div>
      </div>
    </div>
  );
}
