"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import { ChevronLeft, Save, Plus, LayoutGrid, Loader2 } from "lucide-react";
import AbsenSessionCard from "@/components/sessions/grid";
import { motion, AnimatePresence } from "framer-motion";
import { SantriRow } from "@/components/sessions/row";
import { CustomAlert } from "@/components/sessions/alert";
import { useAuth } from "../AuthContext";
// Interface untuk kejelasan tipe data
interface Session {
  _id: string;
  author_id: string;
  authorName: string;
  kelas: string;
  tanggal: string;
  status: "pending" | "selesai";
  data_absen: Record<string, { status: string; note?: string }>;
}

export default function AttendanceManager() {
  // 1. STATE MANAGEMENT
  const [view, setView] = useState<"grid" | "sheet">("grid");
  const [allSessions, setAllSessions] = useState<Session[]>([]); // Simpan semua sesi dari DB
  const [listSantri, setListSantri] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const user = useAuth();
  // SIMULASI USER LOGIN (Idenya didapat dari context/auth)
  //   const [currentUser, setCurrentUser] = useState<{
  //     name: string;
  //     role: string;
  //     _id: string;
  //   } | null>(user);
  //   const [currentUser, setCurrentUser] = useState<{
  //     name: string;
  //     role: string;
  //     _id: string;
  //   } | null>({
  //     name: "ripa",
  //     role: "guru",
  //     _id: "asdf098",
  //   });

  const [setup, setSetup] = useState({
    kelas: "",
    tanggal: new Date().toISOString().split("T")[0],
  });

  // 2. FETCH DATA DARI API
  //   const loadData = useCallback(async () => {
  //     try {
  //       setIsLoading(true);
  //       const response = await fetch("/api/attendance");
  //       const data = await response.json();

  //       setAllSessions(data.sessions || []);
  //       setListSantri(data.data_santri || []);
  //     } catch (error) {
  //       setAlert({ msg: "Gagal memuat database", type: "error" });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }, []);

  // useEffect(() => {
  //   loadData();
  //   const session = sessionStorage.getItem("userSession");
  //   if (session) {
  //     setCurrentUser(JSON.parse(session));
  //   }
  // }, [loadData]);

  // 3. LOGIKA FILTER (Sesi yang tampil hanya milik user yang login)
  const mySessions = allSessions.filter((s) => s.author_id === user._id);

  // 4. SYNC KE DATABASE (POST ke JSON)
  const syncWithServer = async (updatedAllSessions: Session[]) => {
    try {
      const res = await fetch("/api/attendance");
      const currentDb = await res.json();

      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentDb,
          sessions: updatedAllSessions, // Kirim seluruh list (milik semua guru)
        }),
      });
    } catch (error) {
      setAlert({ msg: "Gagal sinkronisasi server", type: "error" });
    }
  };

  // 5. HANDLER UNTUK SESI
  //   const handleSaveSession = async () => {
  //     if (!setup.kelas) return setAlert({ msg: "Pilih Kelas!", type: "error" });

  //     let newAllSessions: Session[];

  //     if (isEditMode && currentSession) {
  //       newAllSessions = allSessions.map((s) =>
  //         s.id === currentSession.id
  //           ? { ...s, kelas: setup.kelas, tanggal: setup.tanggal }
  //           : s,
  //       );
  //       setAlert({ msg: "Sesi diperbarui!", type: "success" });
  //     } else {
  //       const newSession: Session = {
  //         id: Date.now(),
  //         authorId: currentUser.id,
  //         authorName: currentUser.nama,
  //         kelas: setup.kelas,
  //         tanggal: setup.tanggal,
  //         status: "pending",
  //         data_absen: {},
  //       };
  //       newAllSessions = [newSession, ...allSessions];
  //       setAlert({ msg: "Sesi berhasil dibuat!", type: "success" });
  //     }

  //     setAllSessions(newAllSessions);
  //     await syncWithServer(newAllSessions);
  //     closeModal();
  //   };

  const deleteSession = async (_id: string) => {
    if (!confirm("Hapus sesi ini secara permanen?")) return;

    const updated = allSessions.filter((s) => s._id !== _id);
    setAllSessions(updated);
    await syncWithServer(updated);
    setAlert({ msg: "Sesi dihapus", type: "success" });
  };

  // 6. LOGIKA SHEET ABSENSI
  const handleStartAbsen = (session: Session) => {
    setCurrentSession(session);
    setView("sheet");
  };

  const updateStatus = (santriId: string, status: string) => {
    if (!currentSession) return;
    setCurrentSession({
      ...currentSession,
      data_absen: {
        ...currentSession.data_absen,
        [santriId]: { ...currentSession.data_absen[santriId], status },
      },
    });
  };

  const updateNote = (santriId: string, note: string) => {
    if (!currentSession) return;
    setCurrentSession({
      ...currentSession,
      data_absen: {
        ...currentSession.data_absen,
        [santriId]: { ...currentSession.data_absen[santriId], note },
      },
    });
  };

  const handleFinalSave = async () => {
    if (!currentSession) return;

    const santriKelas = listSantri.filter(
      (s) => s.kelas === currentSession.kelas,
    );
    const isAllFilled = santriKelas.every(
      (s) => currentSession.data_absen[s.id]?.status,
    );

    if (!isAllFilled) {
      return setAlert({ msg: "Lengkapi semua data absen!", type: "error" });
    }

    const updatedAllSessions = allSessions.map((s) =>
      s._id === currentSession._id
        ? { ...currentSession, status: "selesai" as const }
        : s,
    );

    setAllSessions(updatedAllSessions);
    await syncWithServer(updatedAllSessions);
    setView("grid");
    setAlert({ msg: "Absensi berhasil disimpan!", type: "success" });
  };

  const closeModal = () => {
    setShowForm(false);
    setIsEditMode(false);
    setSetup({ kelas: "", tanggal: new Date().toISOString().split("T")[0] });
  };

  //   if (isLoading) {
  //     return (
  //       <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
  //         <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
  //         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
  //           Sinkronisasi Database...
  //         </p>
  //       </div>
  //     );
  //   }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-slate-200 font-sans">
      <AnimatePresence>
        {alert && (
          <CustomAlert
            message={alert.msg}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {view === "grid" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* HEADER GRID */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter italic">
                  Riwayat Absensi
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    {/* Login: <span className="text-slate-300">{user.name}</span> */}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="group bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
              >
                <Plus
                  size={18}
                  className="group-hover:rotate-90 transition-transform"
                />{" "}
                BUAT SESI BARU
              </button>
            </div>

            {/* LIST SESI */}
            {mySessions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySessions.map((s) => (
                  <AbsenSessionCard
                    key={s._id}
                    session={s}
                    onStart={() => handleStartAbsen(s)}
                    onEdit={(sess: any) => {
                      setCurrentSession(sess);
                      setSetup({ kelas: sess.kelas, tanggal: sess.tanggal });
                      setIsEditMode(true);
                      setShowForm(true);
                    }}
                    onDelete={() => deleteSession(s._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="h-[400px] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-slate-600">
                <LayoutGrid size={48} className="mb-4 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Belum ada sesi untuk akun ini
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            {/* HEADER SHEET */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => setView("grid")}
                className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors"
              >
                <ChevronLeft size={18} /> Kembali
              </button>
              <div className="text-right">
                <h2 className="text-2xl font-black uppercase italic">
                  Kelas {currentSession?.kelas}
                </h2>
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                  {currentSession?.tanggal}
                </p>
              </div>
            </div>

            {/* TABLE ABSENSI */}
            <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <div className="divide-y divide-white/5">
                {listSantri
                  .filter((s) => s.kelas === currentSession?.kelas)
                  .map((s) => (
                    <SantriRow
                      key={s.id}
                      santri={s}
                      currentStatus={currentSession?.data_absen[s.id]?.status}
                      currentNote={currentSession?.data_absen[s.id]?.note || ""}
                      onStatusChange={updateStatus}
                      onNoteChange={updateNote}
                    />
                  ))}
              </div>
              <div className="p-8 bg-white/[0.02]">
                <button
                  onClick={handleFinalSave}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                  <Save size={18} /> Simpan Seluruh Absensi
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* MODAL FORM */}
      <Modal
        isOpen={showForm}
        onClose={closeModal}
        title={isEditMode ? "Ubah Detail Sesi" : "Buat Sesi Absen"}
      >
        <div className="space-y-6 p-2">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
              Pilih Kelas
            </label>
            <select
              value={setup.kelas}
              onChange={(e) => setSetup({ ...setup, kelas: e.target.value })}
              className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 font-bold text-white outline-none focus:ring-2 ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="">-- PILIH KELAS --</option>
              <option value="11-A">11-A</option>
              <option value="11-B">11-B</option>
              <option value="10-A">10-A</option>
              <option value="10-B">10-B</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
              Tanggal Pelaksanaan
            </label>
            <input
              type="date"
              value={setup.tanggal}
              onChange={(e) => setSetup({ ...setup, tanggal: e.target.value })}
              className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 font-bold text-white outline-none focus:ring-2 ring-indigo-500 transition-all"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              onClick={closeModal}
              className="flex-1 py-4 text-slate-500 font-black text-xs uppercase"
            >
              Batal
            </button>
            <button
              //   onClick={handleSaveSession}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg shadow-indigo-600/20 transition-all"
            >
              {isEditMode ? "Simpan Perubahan" : "Konfirmasi Sesi"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
