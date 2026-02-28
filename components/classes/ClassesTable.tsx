// import React, { useState } from "react";
// import { MoreVertical, Edit3, Trash2 } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// interface Teacher {
//   _id: string;
//   name: string;
// }

// interface ClassData {
//   _id: string;
//   class_name: string;
//   wali: string;
// }

// interface ClassesTableProps {
//   teachers: Teacher[];
//   classes: ClassData[];
//   onEdit: (classData: ClassData) => void;
//   onDelete: (id: string) => void;
// }

// export default function ClassesTable({
//   teachers,
//   classes,
//   onEdit,
//   onDelete,
// }: ClassesTableProps) {
//   const [activeMenu, setActiveMenu] = useState<string | null>(null);

//   return (
//     /* TIPS AGAR BISA SCROLL:
//        Kita hilangkan 'overflow-hidden' dan biarkan 'overflow-x-auto'.
//        Agar menu tidak terpotong di baris terakhir, kita gunakan
//        kontainer yang membungkus dropdown dengan sedikit margin.
//     */
//     <div className="w-full overflow-x-auto overflow-y-visible">
//       <table className="w-full text-left border-collapse min-w-[600px]">
//         <thead>
//           <tr className="border-b border-white/5 bg-white/[0.02]">
//             <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
//               Nama Kelas
//             </th>
//             <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
//               Wali Kelas
//             </th>
//             <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">
//               Opsi
//             </th>
//           </tr>
//         </thead>
//         <tbody className="divide-y dark:divide-slate-800">
//           <AnimatePresence mode="popLayout">
//             {classes && classes.length > 0 ? (
//               classes.map((c: ClassData) => (
//                 <tr
//                   key={c._id}
//                   className="group hover:bg-white/[0.01] transition-colors"
//                 >
//                   <td className="px-8 py-6">
//                     <div className="flex items-center gap-4">
//                       <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 font-black">
//                         {c.class_name ? c.class_name.charAt(0) : "?"}
//                       </div>
//                       <span className="font-bold text-slate-200 uppercase tracking-tight">
//                         Kelas {c.class_name}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-8 py-6 text-slate-400 text-sm">
//                     {teachers.find((t) => t._id === c.wali)?.name ||
//                       "Guru Tidak Ditemukan"}
//                   </td>
//                   <td className="px-8 py-6 text-right relative overflow-visible">
//                     <button
//                       onClick={() =>
//                         setActiveMenu(activeMenu === c._id ? null : c._id)
//                       }
//                       className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"
//                     >
//                       <MoreVertical size={20} />
//                     </button>

//                     <AnimatePresence>
//                       {activeMenu === c._id && (
//                         <>
//                           <div
//                             className="fixed inset-0 z-10"
//                             onClick={() => setActiveMenu(null)}
//                           />
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.9, y: -10 }}
//                             animate={{ opacity: 1, scale: 1, y: 0 }}
//                             exit={{ opacity: 0, scale: 0.9, y: -10 }}
//                             /* PENTING: Gunakan 'absolute' tapi pastikan
//                                sel tabel (td) memiliki 'overflow-visible'.
//                             */
//                             className="absolute right-8 top-16 w-48 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-2xl z-[100] p-2"
//                           >
//                             <p className="text-[9px] flex justify-start font-black text-slate-400 uppercase tracking-widest px-3 py-2 border-b dark:border-slate-800 mb-1">
//                               Opsi Kelola
//                             </p>

//                             <button
//                               onClick={() => {
//                                 onEdit(c);
//                                 setActiveMenu(null);
//                               }}
//                               className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
//                             >
//                               <Edit3 size={16} className="text-blue-500" /> Edit
//                               Data
//                             </button>
//                             <button
//                               onClick={() => {
//                                 onDelete(c._id);
//                                 setActiveMenu(null);
//                               }}
//                               className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-left"
//                             >
//                               <Trash2 size={16} /> Hapus Data
//                             </button>
//                           </motion.div>
//                         </>
//                       )}
//                     </AnimatePresence>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={3} className="px-8 py-20 text-center">
//                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
//                     Belum ada data kelas terdaftar
//                   </p>
//                 </td>
//               </tr>
//             )}
//           </AnimatePresence>
//         </tbody>
//       </table>
//       {/* Trik "Invisible Spacer":
//           Menambahkan div kosong di bawah tabel yang tingginya sama dengan menu dropdown.
//           Ini akan membuat area scroll meluas secara otomatis saat data ada,
//           sehingga menu baris terakhir tidak terpotong.
//       */}
//       <div className="h-32" />
//     </div>
//   );
// }
"use client";
import React, { useState } from "react";
import { MoreVertical, Edit3, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Teacher {
  _id: string;
  name: string;
}

interface ClassData {
  _id: string;
  class_name: string;
  wali: string;
}

interface ClassesTableProps {
  teachers: Teacher[];
  data: ClassData[]; // Kita ubah nama prop 'classes' menjadi 'data' agar konsisten dengan TeacherTable
  onEdit: (classData: ClassData) => void;
  onDelete: (item: ClassData) => void; // Kita ubah agar menerima objek utuh
}

export default function ClassesTable({
  teachers,
  data,
  onEdit,
  onDelete,
}: ClassesTableProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div className="w-full overflow-x-auto overflow-y-visible">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Nama Kelas
            </th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Wali Kelas
            </th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">
              Opsi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-slate-800">
          <AnimatePresence mode="popLayout">
            {data && data.length > 0 ? (
              data.map((c: ClassData) => (
                <tr
                  key={c._id}
                  className="group hover:bg-white/[0.01] transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 font-black">
                        {c.class_name ? c.class_name.charAt(0) : "?"}
                      </div>
                      <span className="font-bold text-slate-200 uppercase tracking-tight">
                        Kelas {c.class_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-400 text-sm">
                    {teachers.find((t) => t._id === c.wali)?.name ||
                      "Guru Tidak Ditemukan"}
                  </td>
                  <td className="px-8 py-6 text-right relative overflow-visible">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === c._id ? null : c._id)
                      }
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"
                    >
                      <MoreVertical size={20} />
                    </button>

                    <AnimatePresence>
                      {activeMenu === c._id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveMenu(null)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="absolute right-8 top-16 w-48 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-2xl z-[100] p-2"
                          >
                            <p className="text-[9px] flex justify-start font-black text-slate-400 uppercase tracking-widest px-3 py-2 border-b dark:border-slate-800 mb-1">
                              Opsi Kelola
                            </p>

                            <button
                              onClick={() => {
                                onEdit(c);
                                setActiveMenu(null);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                            >
                              <Edit3 size={16} className="text-blue-500" /> Edit
                              Data
                            </button>
                            <button
                              onClick={() => {
                                // MENGIRIM OBJEK UTUH KE PARENT
                                onDelete(c);
                                setActiveMenu(null);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-left"
                            >
                              <Trash2 size={16} /> Hapus Data
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-8 py-20 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                    Belum ada data kelas terdaftar
                  </p>
                </td>
              </tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
      {/* Spacer agar dropdown di baris terakhir tidak terpotong */}
      <div className="h-44" />
    </div>
  );
}
