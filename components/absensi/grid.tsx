"use client";
import React from "react";
import { Calendar, Edit3, CheckCircle, Clock, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AbsenSessionCard({
  session,
  onEdit,
  onStart,
  onDelete,
}: any) {
  const isCompleted = session.status === "selesai";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-7 hover:border-indigo-500/50 transition-all group relative overflow-hidden shadow-xl"
    >
      {/* Background Decor */}
      <div
        className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 ${isCompleted ? "bg-emerald-500" : "bg-indigo-500"}`}
      />

      {/* TOP SECTION: Icon & Actions */}
      <div className="flex justify-between items-start mb-8">
        <div
          className={`p-4 rounded-2xl ${isCompleted ? "bg-emerald-500/10 text-emerald-500" : "bg-indigo-500/10 text-indigo-500"}`}
        >
          {isCompleted ? <CheckCircle size={24} /> : <Clock size={24} />}
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit(session)}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            title="Edit Sesi"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={() => onDelete(session.id)}
            className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            title="Hapus Sesi"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* MIDDLE SECTION: Info */}
      <div className="space-y-2 mb-8">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
          Kelas {session.kelas}
        </h3>
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar size={14} className="text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {session.tanggal}
          </span>
        </div>
      </div>

      {/* BOTTOM SECTION: Main Action */}
      <button
        onClick={() => onStart(session)}
        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
          isCompleted
            ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
            : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95"
        }`}
      >
        {isCompleted ? "Lihat / Edit Absen" : "Lakukan Absensi"}
      </button>
    </motion.div>
  );
}

// "use client";

// import React from "react";
// import { Calendar, Users, Edit3, CheckCircle, Clock } from "lucide-react";
// import { motion } from "framer-motion";

// export default function AbsenSessionCard({ session, onEdit, onStart }: any) {
//   // Cek status apakah sudah selesai diabsen atau belum
//   const isCompleted = session.status === "selesai";

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 hover:border-indigo-500/50 transition-all group"
//     >
//       <div className="flex justify-between items-start mb-6">
//         <div
//           className={`p-3 rounded-2xl ${isCompleted ? "bg-emerald-500/10 text-emerald-500" : "bg-indigo-500/10 text-indigo-500"}`}
//         >
//           {isCompleted ? <CheckCircle size={24} /> : <Clock size={24} />}
//         </div>
//         <button
//           onClick={() => onEdit(session)}
//           className="p-2 text-slate-500 hover:text-white transition-colors"
//         >
//           <Edit3 size={18} />
//         </button>
//       </div>

//       <div className="space-y-1 mb-6">
//         <h3 className="text-xl font-black text-white uppercase tracking-tight">
//           Kelas {session.kelas}
//         </h3>
//         <div className="flex items-center gap-2 text-slate-500">
//           <Calendar size={14} />
//           <span className="text-[10px] font-bold uppercase tracking-widest">
//             {session.tanggal}
//           </span>
//         </div>
//       </div>

//       <button
//         onClick={() => onStart(session)}
//         className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
//           isCompleted
//             ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
//             : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95"
//         }`}
//       >
//         {isCompleted ? "Edit Absensi" : "Lakukan Absensi"}
//       </button>
//     </motion.div>
//   );
// }
