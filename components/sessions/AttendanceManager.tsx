// "use client";
// import React, { useState, useMemo } from "react"; // Tambahkan useMemo
// import { Plus, ChevronLeft, Save, Filter, Calendar } from "lucide-react"; // Ikon tambahan
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";
// import AbsenGrid from "./SeessionGrid";
// import AbsenForm from "./SessionForm";
// import { SantriRow } from "@/components/sessions/SessionRow";
// import { FilterSelect } from "@/components/ui/Input"; // Asumsi path komponen SelectInput kamu
// import {
//   deleteSessionAction,
//   updateAbsenDataAction,
// } from "@/lib/actions/session.actions";

// export default function AttendanceManager({
//   initialSessions,
//   classes,
//   students,
//   user,
// }: any) {
//   const [view, setView] = useState<"grid" | "sheet">("grid");
//   const [currentSession, setCurrentSession] = useState<any>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);

//   // 1. STATE UNTUK FILTER
//   const [filterKelas, setFilterKelas] = useState("Semua");
//   const [filterTanggal, setFilterTanggal] = useState("");

//   const router = useRouter();

//   // 2. LOGIKA FILTER & SORTING (Paling baru muncul paling atas)
//   const filteredSessions = useMemo(() => {
//     return initialSessions
//       .filter((s: any) => {
//         const isAuthor = s.authorId === user?._id;
//         const matchKelas = filterKelas === "Semua" || s.classId === filterKelas;
//         const matchTanggal = !filterTanggal || s.date === filterTanggal;
//         return isAuthor && matchKelas && matchTanggal;
//       })
//       .sort((a: any, b: any) => {
//         // Sort descending berdasarkan createdat atau ID (Date.now)
//         // return Number(b._id) - Number(a._id);
//         const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//         const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//         return dateB - dateA;
//       });
//   }, [initialSessions, user?._id, filterKelas, filterTanggal]);

//   const handleDelete = async (_id: string) => {
//     if (confirm("Hapus sesi ini?")) {
//       await deleteSessionAction(_id);
//       router.refresh();
//     }
//   };

//   const handleFinalSave = async () => {
//     if (!currentSession) return;
//     const result = await updateAbsenDataAction(
//       currentSession._id,
//       currentSession.attendance_data,
//     );
//     if (result.success) {
//       setView("grid");
//       router.refresh();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-slate-200">
//       <div className="max-w-6xl mx-auto">
//         {view === "grid" ? (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             {/* HEADER & FILTER SECTION */}
//             <div className="flex flex-col gap-8 mb-12">
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
//                 <div>
//                   {/* <h1 className="text-2xl font-black uppercase italic tracking-tighter text-indigo-500">
//                     Sesi Presensi
//                   </h1> */}
//                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">
//                     User: <span className="text-slate-300">{user?.name}</span>
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setIsEditMode(false);
//                     setShowForm(true);
//                   }}
//                   className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
//                 >
//                   <Plus size={18} /> BUAT SESI BARU
//                 </button>
//               </div>

//               {/* Filter Bar Section */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-900/50 border border-white/5 rounded-xl mb-8">
//                 <FilterSelect
//                   label="Filter Kelas"
//                   value={filterKelas}
//                   onChange={(val) => setFilterKelas(val)}
//                   placeholder="SEMUA KELAS"
//                   // Ambil hanya nama kelas, pastikan classes tidak null
//                   options={classes?.map((c: any) => c.class_name) || []}
//                 />

//                 <div>
//                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
//                     Filter Tanggal
//                   </label>
//                   <input
//                     type="date"
//                     value={filterTanggal}
//                     onChange={(e) => setFilterTanggal(e.target.value)}
//                     className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl px-6 py-3 text-xs font-bold text-white outline-none focus:ring-4 ring-white/5 transition-all"
//                   />
//                 </div>

//                 <div className="flex items-end pb-1">
//                   <button
//                     onClick={() => {
//                       setFilterKelas("Semua");
//                       setFilterTanggal("");
//                     }}
//                     className="w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-rose-400 transition-colors"
//                   >
//                     Reset Filter
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <AbsenGrid
//               sessions={filteredSessions} // Gunakan hasil filter & sort
//               onStart={(s) => {
//                 setCurrentSession(s);
//                 setView("sheet");
//               }}
//               onEdit={(s) => {
//                 setCurrentSession(s);
//                 setIsEditMode(true);
//                 setShowForm(true);
//               }}
//               onDelete={handleDelete}
//             />
//           </motion.div>
//         ) : (
//           /* ... (Bagian sheet tetap sama seperti sebelumnya) ... */
//           <motion.div
//             initial={{ x: 20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//           >
//             {/* ... rest of the code for sheet view ... */}
//             <div className="flex justify-between items-center mb-8">
//               <button
//                 onClick={() => setView("grid")}
//                 className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors"
//               >
//                 <ChevronLeft size={18} /> Kembali
//               </button>
//               <div className="text-right">
//                 <h2 className="text-xl font-black uppercase">
//                   Kelas {currentSession?.classId}
//                 </h2>
//                 <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">
//                   {currentSession?.date}
//                 </p>
//               </div>
//             </div>

//             <div className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden shadow-2xl">
//               <div className="divide-y divide-white/5">
//                 {students
//                   .filter((s: any) => s.class === currentSession?.classId)
//                   .map((s: any) => {
//                     // 1. Ambil data absensi santri ini secara aman
//                     const studentAttendance =
//                       currentSession?.attendance_data?.[s._id] || {};

//                     return (
//                       <SantriRow
//                         key={s._id}
//                         santri={s}
//                         currentStatus={studentAttendance.status} // Tidak akan error lagi
//                         currentNote={studentAttendance.note || ""}
//                         onStatusChange={(
//                           _id: string,
//                           status: string, // Tambahkan tipe data di sini
//                         ) =>
//                           setCurrentSession({
//                             ...currentSession,
//                             attendance_data: {
//                               ...(currentSession?.attendance_data || {}),
//                               [_id]: {
//                                 ...(currentSession?.attendance_data?.[_id] ||
//                                   {}),
//                                 status, // status di sini bisa bernilai "Hadir", "Izin", atau null
//                               },
//                             },
//                           })
//                         }
//                         onNoteChange={(
//                           _id: string,
//                           note: string, // Tambahkan tipe data di sini
//                         ) =>
//                           setCurrentSession({
//                             ...currentSession,
//                             attendance_data: {
//                               ...(currentSession?.attendance_data || {}),
//                               [_id]: {
//                                 ...(currentSession?.attendance_data?.[_id] ||
//                                   {}),
//                                 note,
//                               },
//                             },
//                           })
//                         }
//                       />
//                     );
//                   })}
//               </div>
//               <div className="p-8 bg-white/[0.02]">
//                 <button
//                   onClick={handleFinalSave}
//                   className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all"
//                 >
//                   <Save size={18} /> Simpan Seluruh Absensi
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>

//       <AbsenForm
//         isOpen={showForm}
//         onClose={() => setShowForm(false)}
//         formData={currentSession}
//         isEditMode={isEditMode}
//         classes={classes}
//         user={user}
//       />
//     </div>
//   );
// }
"use client";
import React, { useState, useMemo } from "react";
import { Plus, ChevronLeft, Save, Calendar, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import AbsenGrid from "./SeessionGrid";
import AbsenForm from "./SessionForm";
import { SantriRow } from "@/components/sessions/SessionRow";
import { Alert } from "@/components/ui/Alert";
import { DeleteConfirmModal } from "@/components/ui/deletemodal";
import {
  deleteSessionAction,
  updateAbsenDataAction,
} from "@/lib/actions/session.actions";

export default function AttendanceManager({
  initialSessions,
  classes,
  students,
  user,
}: any) {
  const router = useRouter();
  const [view, setView] = useState<"grid" | "sheet">("grid");
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Filter States
  const [filterKelas, setFilterKelas] = useState("Semua");
  const [filterTanggal, setFilterTanggal] = useState("");

  // UI States (Modal & Alert)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<any>(null);
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const showAlert = (message: string, type: "success" | "error") => {
    setAlertConfig({ show: true, message, type });
  };

  // --- LOGIKA FILTER & SORTING ---
  const filteredSessions = useMemo(() => {
    return (initialSessions || [])
      .filter((s: any) => {
        const isAuthor = s.authorId === user?._id;
        const matchKelas = filterKelas === "Semua" || s.classId === filterKelas;
        const matchTanggal = !filterTanggal || s.date === filterTanggal;
        return isAuthor && matchKelas && matchTanggal;
      })
      .sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [initialSessions, user?._id, filterKelas, filterTanggal]);

  // Cari Nama Kelas yang enak dibaca
  const currentClassInfo = useMemo(() => {
    if (!currentSession) return null;
    return classes?.find((c: any) => c._id === currentSession.classId);
  }, [classes, currentSession]);

  // --- HANDLERS ---
  const handleFinalSave = async () => {
    if (!currentSession) return;
    try {
      // Gunakan attendance_data sesuai key database
      const dataToSave = currentSession.attendance_data || {};
      const result = await updateAbsenDataAction(
        currentSession._id,
        dataToSave,
      );

      if (result.success) {
        showAlert("Data absensi berhasil disimpan permanen", "success");
        router.refresh();
        setTimeout(() => {
          setView("grid");
          setCurrentSession(null);
        }, 1000);
      } else {
        showAlert(result.message || "Gagal menyimpan", "error");
      }
    } catch (error) {
      showAlert("Terjadi kesalahan koneksi", "error");
    }
  };

  const confirmDelete = async () => {
    alert(sessionToDelete._id);
    if (!sessionToDelete) return;
    try {
      const result = await deleteSessionAction(sessionToDelete._id);
      if (result.success) {
        showAlert("Sesi berhasil dihapus", "success");
        router.refresh();
      } else {
        showAlert(result.message || "Gagal menghapus", "error");
      }
    } catch (error) {
      showAlert("Kesalahan sistem", "error");
    } finally {
      setIsDeleteOpen(false);
      setSessionToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-slate-200">
      {/* GLOBAL ALERT */}
      <AnimatePresence>
        {alertConfig.show && (
          <Alert
            message={alertConfig.message}
            type={alertConfig.type}
            onClose={() => setAlertConfig((p) => ({ ...p, show: false }))}
          />
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {view === "grid" ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-end mb-12">
              <div>
                {/* <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                  Manajemen Absensi
                </h1> */}
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                  Pengajar: <span className="text-slate-300">{user?.name}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setShowForm(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                <Plus size={18} /> BUAT SESI
              </button>
            </div>

            {/* Filter Bar */}
            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-900/50 border border-white/5 rounded-2xl mb-8">
              {/* Filter Kelas */}
              <div className="flex flex-col gap-2">
                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl px-6 py-3 text-xs font-bold text-white outline-none focus:ring-2 ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="Semua" className="bg-slate-900 text-white">
                    SEMUA KELAS
                  </option>
                  {classes?.map((c: any) => (
                    <option
                      key={c._id}
                      value={c._id}
                      className="bg-slate-900 text-white"
                    >
                      {c.name || c.class_name || c.className}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Tanggal */}
              <div className="flex flex-col gap-2">
                <input
                  type="date"
                  value={filterTanggal}
                  onChange={(e) => setFilterTanggal(e.target.value)}
                  className="w-full bg-slate-800/40 border border-slate-700/50 rounded-xl px-6 py-3 text-xs font-bold text-white outline-none focus:ring-2 ring-indigo-500/50 transition-all"
                />
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setFilterKelas("Semua");
                  setFilterTanggal("");
                }}
                className="py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-400 transition-colors flex items-center justify-center gap-2"
              >
                Reset Filter
              </button>
            </div>

            <AbsenGrid
              sessions={filteredSessions}
              onStart={(s: any) => {
                setCurrentSession(JSON.parse(JSON.stringify(s)));
                setView("sheet");
              }}
              onEdit={(s: any) => {
                setCurrentSession(s);
                setIsEditMode(true);
                setShowForm(true);
              }}
              onDelete={(s: any) => {
                setSessionToDelete(s);
                setIsDeleteOpen(true);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <button
                onClick={() => setView("grid")}
                className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all"
              >
                <ChevronLeft size={18} /> Kembali
              </button>

              <div className="text-left md:text-right">
                <h2 className="text-xl font-black uppercase text-white leading-tight">
                  {currentClassInfo?.name ||
                    currentSession?.className ||
                    "Kelas Tidak Diketahui"}
                </h2>
                <div className="flex gap-4 mt-2 md:justify-end">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Calendar size={12} className="text-indigo-500" />{" "}
                    {currentSession?.date}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <div className="divide-y divide-white/5 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {students
                  .filter(
                    (s: any) =>
                      s.classId === currentSession?.classId ||
                      s.class === currentSession?.classId,
                  )
                  .map((s: any) => {
                    const allData = currentSession?.attendance_data || {};
                    const studentData = allData[s._id] || {};
                    return (
                      <SantriRow
                        key={s._id}
                        santri={s}
                        currentStatus={studentData.status}
                        currentNote={studentData.note || ""}
                        onStatusChange={(_id: string, status: string) => {
                          const updated = { ...allData };
                          updated[_id] = {
                            ...updated[_id],
                            name: s.name,
                            status,
                          };
                          setCurrentSession({
                            ...currentSession,
                            attendance_data: updated,
                          });
                        }}
                        onNoteChange={(_id: string, note: string) => {
                          const updated = { ...allData };
                          updated[_id] = {
                            ...updated[_id],
                            name: s.name,
                            note,
                          };
                          setCurrentSession({
                            ...currentSession,
                            attendance_data: updated,
                          });
                        }}
                      />
                    );
                  })}
              </div>
              <div className="p-8 bg-slate-900/80 backdrop-blur-md border-t border-white/5">
                <button
                  onClick={handleFinalSave}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Save size={18} /> Simpan Seluruh Absensi
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <AbsenForm
        isOpen={showForm}
        onClose={(success?: boolean, msg?: string) => {
          setShowForm(false);
          if (success) {
            showAlert(msg || "Berhasil", "success");
            router.refresh();
          }
        }}
        formData={currentSession}
        isEditMode={isEditMode}
        classes={classes}
        user={user}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={
          sessionToDelete
            ? `Sesi ${sessionToDelete.className || "Kelas"}`
            : "Sesi ini"
        }
      />
    </div>
  );
}
