// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { Edit, Trash2, MoreVertical, User, ShieldAlert } from "lucide-react";
// import { useState, useRef, useEffect } from "react";

// interface DataTableProps {
//   activeTab: string;
//   data: any[];
//   onEdit?: (item: any) => void;
//   onDelete?: (id: number) => void;
// }

// export default function DataTable({
//   activeTab,
//   data,
//   onEdit,
//   onDelete,
// }: DataTableProps) {
//   // State untuk menyimpan ID baris yang menu-nya sedang terbuka
//   const [openMenuId, setOpenMenuId] = useState<number | null>(null);
//   const menuRef = useRef<HTMLDivElement>(null);

//   // Menutup menu jika klik di luar area menu
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setOpenMenuId(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="overflow-x-auto min-h-[400px]">
//       {/* Tambah min-h agar menu tidak terpotong */}
//       <table className="w-full text-left">
//         <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs font-bold uppercase tracking-widest">
//           <tr>
//             <th className="px-8 py-5">Informasi</th>
//             <th className="px-8 py-5">Detail</th>
//             <th className="px-8 py-5 text-center">Status</th>
//             <th className="px-8 py-5 text-right">Aksi</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y dark:divide-slate-800">
//           <AnimatePresence mode="popLayout">
//             {data.map((item) => (
//               <motion.tr
//                 key={item.id}
//                 layout
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
//               >
//                 <td className="px-8 py-6">
//                   <p className="font-bold text-slate-800 dark:text-slate-200">
//                     {item.nama || "Belum diisi..."}
//                   </p>
//                   <p className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">
//                     ID-{item.id}
//                   </p>
//                 </td>

//                 <td className="px-8 py-6">
//                   <p className="text-sm font-semibold text-slate-500">
//                     {activeTab === "guru"
//                       ? item.username
//                       : `Santri Kelas ${item.kelas}`}
//                   </p>
//                 </td>

//                 <td className="px-8 py-6">
//                   <div className="flex justify-center">
//                     <span
//                       className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase
//                       ${
//                         activeTab === "guru"
//                           ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600"
//                           : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"
//                       }`}
//                     >
//                       {activeTab === "guru" ? item.role : item.status}
//                     </span>
//                   </div>
//                 </td>

//                 {/* KOLOM AKSI DENGAN TITIK TIGA */}
//                 <td className="px-8 py-6 text-right relative">
//                   <div className="flex justify-end">
//                     <button
//                       onClick={() =>
//                         setOpenMenuId(openMenuId === item.id ? null : item.id)
//                       }
//                       className={`p-2 rounded-xl transition-all ${openMenuId === item.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
//                     >
//                       <MoreVertical size={20} />
//                     </button>

//                     {/* POPOVER MENU */}
//                     <AnimatePresence>
//                       {openMenuId === item.id && (
//                         <div ref={menuRef}>
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.9, y: -10 }}
//                             animate={{ opacity: 1, scale: 1, y: 0 }}
//                             exit={{ opacity: 0, scale: 0.9, y: -10 }}
//                             className="absolute right-8 top-16 w-48 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-2xl z-[100] p-2 overflow-hidden"
//                           >
//                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 py-2 border-b dark:border-slate-800 mb-1">
//                               Opsi Kelola
//                             </p>

//                             <button
//                               onClick={() => {
//                                 onEdit?.(item);
//                                 setOpenMenuId(null);
//                               }}
//                               className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
//                             >
//                               <Edit size={16} className="text-blue-500" />
//                               Edit Data
//                             </button>

//                             <button
//                               onClick={() => {
//                                 onDelete?.(item.id);
//                                 setOpenMenuId(null);
//                               }}
//                               className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-left"
//                             >
//                               <Trash2 size={16} />
//                               Hapus Data
//                             </button>
//                           </motion.div>
//                         </div>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 </td>
//               </motion.tr>
//             ))}
//           </AnimatePresence>
//         </tbody>
//       </table>
//       {data.length === 0 && (
//         <div className="p-20 text-center text-slate-400 font-bold italic">
//           Data tidak ditemukan...
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { AnimatePresence } from "framer-motion";
import { SantriRow } from "../sessions/row";

interface StudentTableProps {
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (id: number) => void;
}

export default function StudentTable({
  data,
  onEdit,
  onDelete,
}: StudentTableProps) {
  return (
    <div className="w-full bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/[0.02] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
          <tr>
            <th className="px-8 py-6">Nama Santri</th>
            <th className="px-8 py-6">Ruang Kelas</th>
            <th className="px-8 py-6 text-center">Status</th>
            <th className="px-8 py-6 text-right">Opsi</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout">
            {data.map((item) => (
              <SantriRow
                key={item.id}
                item={item}
                activeTab="santri" // Fix label untuk santri
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
