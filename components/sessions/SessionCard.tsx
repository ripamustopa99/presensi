// "use client";
// import React from "react";
// import { Calendar, Edit3, CheckCircle, Clock, Trash2 } from "lucide-react";
// import { motion } from "framer-motion";

// export default function AbsenSessionCard({
//   session,
//   onEdit,
//   onStart,
//   onDelete,
// }: any) {
//   const isCompleted = session.status === "selesai";
//   const displayClassName = session.className || `ID: ${session.classId}`;

//   // --- LOGIKA MENGHITUNG STATISTIK (FIXED) ---
//   // Kita gunakan attendance_data sesuai schema baru
//   const stats = {
//     hadir: 0,
//     sakit: 0,
//     izin: 0,
//     alfa: 0,
//     total: 0,
//   };

//   // Ambil data absensi (handle snake_case dari DB)
//   const attendanceRecords = session.attendance_data || {};
//   const recordsArray = Object.values(attendanceRecords) as any[];

//   stats.total = recordsArray.length;

//   recordsArray.forEach((rec) => {
//     // Gunakan toLowerCase untuk menghindari error penulisan status
//     const status = rec.status?.toLowerCase();
//     if (status === "hadir") stats.hadir++;
//     else if (status === "sakit") stats.sakit++;
//     else if (status === "izin") stats.izin++;
//     else if (status === "alfa") stats.alfa++;
//   });

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-all group relative overflow-hidden shadow-xl"
//     >
//       {/* Background Decor */}
//       <div
//         className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 ${
//           isCompleted ? "bg-emerald-500" : "bg-indigo-500"
//         }`}
//       />

//       {/* TOP SECTION: Status Badge & Actions */}
//       <div className="flex justify-between items-start mb-6 relative z-10">
//         <div
//           className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
//             isCompleted
//               ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
//               : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
//           }`}
//         >
//           <span
//             className={`w-1.5 h-1.5 rounded-full ${
//               isCompleted ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
//             }`}
//           />
//           {isCompleted ? "Selesai" : "Berlangsung"}
//         </div>

//         <div className="flex gap-1">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onEdit(session);
//             }}
//             className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
//           >
//             <Edit3 size={16} />
//           </button>
//           {/* <button
//             onClick={(e) => {
//               e.stopPropagation();
//               onDelete(session); // Pastikan onDelete menerima object session agar modal muncul
//             }}
//             className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
//           >
//             <Trash2 size={16} />
//           </button> */}

//           <button
//             onClick={(e) => {
//               e.stopPropagation(); // Mencegah klik tembus ke kartu
//               onDelete(session); // <--- PASTIKAN INI MENGIRIM 'session' (object lengkap)
//             }}
//             className="..."
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       </div>

//       {/* MIDDLE SECTION: Title & Date */}
//       <div className="mb-6 relative z-10">
//         <h3 className="font-black text-2xl text-white uppercase tracking-tighter leading-tight mb-1">
//           {displayClassName}
//         </h3>
//         <div className="flex items-center gap-2 text-slate-500">
//           <Calendar size={12} className="text-indigo-500" />
//           <span className="text-[10px] font-bold tracking-widest uppercase">
//             {session.date}
//           </span>
//         </div>
//       </div>

//       {/* STATISTICS SECTION: Summary Grid */}
//       <div className="grid grid-cols-4 gap-2 mb-8 relative z-10">
//         <div className="bg-slate-800/40 border border-white/5 p-2 rounded-xl text-center">
//           <p className="text-[9px] font-bold text-emerald-500 uppercase mb-1">
//             Hadir
//           </p>
//           <p className="text-sm font-black text-white">{stats.hadir}</p>
//         </div>
//         <div className="bg-slate-800/40 border border-white/5 p-2 rounded-xl text-center">
//           <p className="text-[9px] font-bold text-blue-400 uppercase mb-1">
//             Sakit
//           </p>
//           <p className="text-sm font-black text-white">{stats.sakit}</p>
//         </div>
//         <div className="bg-slate-800/40 border border-white/5 p-2 rounded-xl text-center">
//           <p className="text-[9px] font-bold text-amber-400 uppercase mb-1">
//             Izin
//           </p>
//           <p className="text-sm font-black text-white">{stats.izin}</p>
//         </div>
//         <div className="bg-slate-800/40 border border-white/5 p-2 rounded-xl text-center">
//           <p className="text-[9px] font-bold text-rose-500 uppercase mb-1">
//             Alfa
//           </p>
//           <p className="text-sm font-black text-white">{stats.alfa}</p>
//         </div>
//       </div>

//       {/* BOTTOM SECTION: Main Action */}
//       <button
//         onClick={() => onStart(session)}
//         className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 relative z-10 ${
//           isCompleted
//             ? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
//             : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95"
//         }`}
//       >
//         {isCompleted ? "Lihat Detail" : "Lakukan Absensi"}
//       </button>
//     </motion.div>
//   );
// }
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
  // 1. Pastikan ID aman (antisipasi perbedaan penamaan _id atau id dari DB)
  const sessionId = session._id || session.id;
  const isCompleted = session.status === "selesai";

  // Ambil nama kelas dari cache atau ID kelas
  const displayClassName = session.className || `Kelas ID: ${session.classId}`;

  // 2. Hitung Statistik Absensi
  const stats = {
    hadir: 0,
    sakit: 0,
    izin: 0,
    alfa: 0,
  };

  const attendanceRecords = session.attendance_data || {};
  const recordsArray = Object.values(attendanceRecords) as any[];

  recordsArray.forEach((rec) => {
    const status = rec.status?.toLowerCase();
    if (status === "hadir") stats.hadir++;
    else if (status === "sakit") stats.sakit++;
    else if (status === "izin") stats.izin++;
    else if (status === "alfa") stats.alfa++;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-all group relative overflow-hidden shadow-xl"
    >
      {/* Dekorasi Background Bulatan Blur */}
      <div
        className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-10 ${
          isCompleted ? "bg-emerald-500" : "bg-indigo-500"
        }`}
      />

      {/* SECTION ATAS: Badge Status & Tombol Aksi */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
            isCompleted
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isCompleted ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
            }`}
          />
          {isCompleted ? "Selesai" : "Berlangsung"}
        </div>

        <div className="flex gap-1">
          {/* Tombol Edit */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(session);
            }}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            title="Edit Sesi"
          >
            <Edit3 size={16} />
          </button>

          {/* Tombol Hapus - Mengirim FULL OBJECT agar ID tidak undefined */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Mengirim session lengkap, namun pastikan property _id ada
              onDelete({ ...session, _id: sessionId });
            }}
            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
            title="Hapus Sesi"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* SECTION TENGAH: Judul Kelas & Tanggal */}
      <div className="mb-6 relative z-10">
        <h3 className="font-black text-2xl text-white uppercase tracking-tighter leading-tight mb-1">
          {displayClassName}
        </h3>
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar size={12} className="text-indigo-500" />
          <span className="text-[10px] font-bold tracking-widest uppercase">
            {session.date}
          </span>
        </div>
      </div>

      {/* SECTION STATISTIK: Grid Ringkasan */}
      <div className="grid grid-cols-4 gap-2 mb-8 relative z-10">
        <div className="bg-slate-800/40 border border-white/5 p-2 rounded-xl text-center">
          <p className="text-[9px] font-bold text-emerald-500 uppercase mb-1">
            Hadir
          </p>
          <p className="text-sm font-black text-white">{stats.hadir}</p>
        </div>
        <div className="bg-slate-800/40 border border-white/5 p-2 rounded-xl text-center">
          <p className="text-[9px] font-bold text-blue-400 uppercase mb-1">
            Sakit
          </p>
          <p className="text-sm font-black text-white">{stats.sakit}</p>
        </div>
        <div className="bg-slate-800/40 border border-white/5 p-2 rounded-xl text-center">
          <p className="text-[9px] font-bold text-amber-400 uppercase mb-1">
            Izin
          </p>
          <p className="text-sm font-black text-white">{stats.izin}</p>
        </div>
        <div className="bg-slate-800/40 border border-white/5 p-2 rounded-xl text-center">
          <p className="text-[9px] font-bold text-rose-500 uppercase mb-1">
            Alfa
          </p>
          <p className="text-sm font-black text-white">{stats.alfa}</p>
        </div>
      </div>

      {/* SECTION BAWAH: Tombol Utama */}
      <button
        onClick={() => onStart(session)}
        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 relative z-10 ${
          isCompleted
            ? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95"
        }`}
      >
        {isCompleted ? "Lihat Detail" : "Lakukan Absensi"}
      </button>
    </motion.div>
  );
}
