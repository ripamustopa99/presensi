"use client";
import React, { useState } from "react";
import { Calendar, Edit3, Trash2, Save, X, Users, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AbsenSessionCardProps {
  session: any;
  classes: any[];
  students: any[]; // Tambahkan prop students
  onStart: (session: any) => void;
  onUpdateInline: (
    sessionId: string,
    newData: { classId: string; date: string },
  ) => Promise<void>;
  onDelete: (session: any) => void;
}

export default function AbsenSessionCard({
  classes,
  students,
  session,
  onUpdateInline,
  onStart,
  onDelete,
}: AbsenSessionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    classId: session.classId,
    date: session.date,
  });

  const sessionId = session._id || session.id;
  const isCompleted = session.status === "selesai";

  // --- LOGIKA PENCARIAN NAMA KELAS & JUMLAH SANTRI ---
  const targetClass = classes?.find(
    (c: any) => (c._id || c.id) === session.classId,
  );
  const displayClassName =
    targetClass?.name || targetClass?.class_name || "Kelas Tidak Ditemukan";

  // Hitung santri yang terdaftar di kelas ini
  const totalSantri =
    students?.filter((s: any) => (s.classId || s.class) === session.classId)
      .length || 0;

  // --- LOGIKA STATISTIK ---
  const stats = { hadir: 0, sakit: 0, izin: 0, alfa: 0 };
  const attendanceRecords = session.attendance_data || {};
  const recordsArray = Object.values(attendanceRecords) as any[];

  recordsArray.forEach((rec) => {
    const status = rec.status?.toLowerCase();
    if (status === "hadir") stats.hadir++;
    else if (status === "sakit") stats.sakit++;
    else if (status === "izin") stats.izin++;
    else if (status === "alfa") stats.alfa++;
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Di dalam AbsenSessionCard.tsx

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      // Cari nama kelas baru untuk dikirim ke server (agar di DB terupdate juga)
      const selectedClass = classes?.find(
        (c: any) => (c._id || c.id) === editData.classId,
      );
      const newClassName =
        selectedClass?.name || selectedClass?.class_name || "";

      // Kita panggil action yang sama, tapi isinya field dasar sesi
      await onUpdateInline(sessionId, {
        classId: editData.classId,
        date: editData.date,
        // Kita tidak mengirim attendance_data di sini karena hanya edit header
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Gagal update inline:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      layout
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-all group relative overflow-hidden shadow-xl"
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
            isCompleted
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}
          />
          {isCompleted ? "Selesai" : "Berlangsung"}
        </div>

        <div className="flex gap-1">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all disabled:opacity-50"
              >
                {isUpdating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                <Save size={16} />
              </button>
            </>
          ) : (
            <>
              {/* <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <Edit3 size={16} />
              </button> */}
              <button
                onClick={() => onDelete(session)}
                className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-6 relative z-10">
        {isEditing ? (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
            <select
              value={editData.classId}
              onChange={(e) =>
                setEditData({ ...editData, classId: e.target.value })
              }
              className="w-full bg-slate-800 border border-indigo-500/50 rounded-lg px-2 py-1 text-sm font-bold text-white outline-none"
            >
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name || c.class_name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={editData.date}
              onChange={(e) =>
                setEditData({ ...editData, date: e.target.value })
              }
              className="w-full bg-slate-800 border border-indigo-500/50 rounded-lg px-2 py-1 text-sm font-bold text-white outline-none"
            />
          </div>
        ) : (
          <>
            <h3 className="font-black text-2xl text-white uppercase tracking-tighter leading-tight mb-1">
              {displayClassName}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar size={12} className="text-indigo-500" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  {session.date}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 border-l border-slate-800 pl-4">
                <Users size={12} className="text-indigo-500" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  {totalSantri} Santri
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 mb-8 relative z-10">
        <StatBox label="Hadir" value={stats.hadir} color="text-emerald-500" />
        <StatBox label="Sakit" value={stats.sakit} color="text-blue-400" />
        <StatBox label="Izin" value={stats.izin} color="text-amber-400" />
        <StatBox label="Alfa" value={stats.alfa} color="text-rose-500" />
      </div>

      <button
        onClick={() => onStart(session)}
        disabled={isEditing}
        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 relative z-10 ${
          isEditing
            ? "opacity-20 cursor-not-allowed"
            : isCompleted
              ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
              : "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95"
        }`}
      >
        {isCompleted ? "Lihat Detail" : "Lakukan Absensi"}
      </button>
    </motion.div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-slate-800/40 border border-white/5 p-2 rounded-xl text-center">
      <p className={`text-[9px] font-bold ${color} uppercase mb-1`}>{label}</p>
      <p className="text-sm font-black text-white">{value}</p>
    </div>
  );
}
