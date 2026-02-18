"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import { ChevronLeft, Save, Plus, LayoutGrid, Loader2 } from "lucide-react";
import AbsenSessionCard from "./grid";
import { motion, AnimatePresence } from "framer-motion";
import { SantriRow } from "./row";
import { CustomAlert } from "./alert";

const DATA_SANTRI = [
  { id: "S1", nama: "Ahmad Mujahidin", kelas: "7A", NIS: "2024001" },
  { id: "S2", nama: "Zaid Al-Khair", kelas: "7A", NIS: "2024002" },
  { id: "S3", nama: "Umar Bin Khattab", kelas: "8B", NIS: "2024003" },
];

export default function AttendanceManager() {
  const [view, setView] = useState<"grid" | "sheet">("grid");
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const [setup, setSetup] = useState({
    kelas: "",
    tanggal: new Date().toISOString().split("T")[0],
  });

  // --- 1. FETCH DATA DARI API (FILE .JSON) ---
  const loadDataFromFile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/attendance");
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Gagal memuat data dari file:", error);
      setAlert({ msg: "Gagal terhubung ke database file", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDataFromFile();
  }, []);

  // --- 2. FUNGSI SAVE KE API ---
  const syncDatabase = async (newList: any[]) => {
    try {
      // Ambil data session agar tidak hilang saat update users
      const res = await fetch("/api/attendance");
      const currentDb = await res.json();

      await fetch("/api/attendance", {
        // Gunakan endpoint utama kamu
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentDb, // Jaga agar data "sessions" tetap ada
          sessions: newList, // Update list users-nya saja
        }),
      });
    } catch (error) {
      console.error("Gagal sinkronisasi ke database:", error);
      // triggerToast("Gagal menyimpan ke server!");
    }
  };
  // const saveToDatabaseFile = async (updatedSessions: any[]) => {
  //   try {
  //     await fetch("/api/attendance", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ sessions: updatedSessions }),
  //     });
  //   } catch (error) {
  //     console.error("Gagal menulis ke file:", error);
  //     setAlert({ msg: "Gagal menyimpan ke file .json", type: "error" });
  //   }
  // };

  // --- 3. LOGIKA CRUD SESI ---
  const handleSaveSession = async () => {
    if (!setup.kelas) return setAlert({ msg: "Pilih Kelas!", type: "error" });

    let updated;
    if (isEditMode) {
      updated = sessions.map((s) =>
        s.id === currentSession.id
          ? { ...s, kelas: setup.kelas, tanggal: setup.tanggal }
          : s,
      );
      setAlert({ msg: "Sesi Berhasil Diperbarui!", type: "success" });
    } else {
      const newSession = {
        id: Date.now(),
        ...setup,
        status: "pending",
        data_absen: {},
      };
      updated = [newSession, ...sessions];
      setAlert({ msg: "Sesi Berhasil Dibuat!", type: "success" });
    }

    setSessions(updated);
    await syncDatabase(updated); // Langsung tulis ke file
    closeModal();
  };

  const openEditModal = (session: any) => {
    setCurrentSession(session);
    setSetup({ kelas: session.kelas, tanggal: session.tanggal });
    setIsEditMode(true);
    setShowForm(true);
  };

  const deleteSession = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus sesi ini?")) {
      const updated = sessions.filter((s) => s.id !== id);
      setSessions(updated);
      await syncDatabase(updated); // Update file .json
      setAlert({ msg: "Sesi telah dihapus dari database.", type: "success" });
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setIsEditMode(false);
    setSetup({ kelas: "", tanggal: new Date().toISOString().split("T")[0] });
  };

  // --- 4. LOGIKA ABSENSI ---
  const handleStartAbsen = (session: any) => {
    setCurrentSession(session);
    setView("sheet");
  };

  const updateStatus = (santriId: string, status: string) => {
    setCurrentSession((prev: any) => ({
      ...prev,
      data_absen: {
        ...prev.data_absen,
        [santriId]: { ...prev.data_absen[santriId], status },
      },
    }));
  };

  const updateNote = (santriId: string, note: string) => {
    setCurrentSession((prev: any) => ({
      ...prev,
      data_absen: {
        ...prev.data_absen,
        [santriId]: { ...prev.data_absen[santriId], note },
      },
    }));
  };

  const handleFinalSave = async () => {
    const santriKelas = DATA_SANTRI.filter(
      (s) => s.kelas === currentSession.kelas,
    );
    const isAllFilled = santriKelas.every(
      (s) => currentSession.data_absen[s.id]?.status,
    );

    if (!isAllFilled) {
      setAlert({ msg: "Gagal! Ada santri yang belum diabsen.", type: "error" });
      return;
    }

    const updatedSessions = sessions.map((s) =>
      s.id === currentSession.id ? { ...currentSession, status: "selesai" } : s,
    );

    setSessions(updatedSessions);
    await syncDatabase(updatedSessions); // Update file .json
    setView("grid");
    setAlert({ msg: "Data Absensi Berhasil Disimpan!", type: "success" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">
          Memuat Database File...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 text-slate-200">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-end mb-12">
              <div>
                <h1 className="text-xl font-black uppercase tracking-tighter">
                  Riwayat Absensi
                </h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">
                  Pengajar: Ustadz Asep
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 hover:bg-indigo-500 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all"
              >
                <Plus size={20} /> BUAT SESI
              </button>
            </div>

            {sessions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((s) => (
                  <AbsenSessionCard
                    key={s.id}
                    session={s}
                    onStart={handleStartAbsen}
                    onEdit={openEditModal}
                    onDelete={deleteSession}
                  />
                ))}
              </div>
            ) : (
              <div className="h-[400px] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-slate-600">
                <LayoutGrid size={48} className="mb-4 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Belum ada sesi absensi
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => setView("grid")}
                className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors"
              >
                <ChevronLeft size={18} /> Kembali
              </button>
              <div className="text-right">
                <h2 className="text-2xl font-black uppercase">
                  Kelas {currentSession.kelas}
                </h2>
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                  {currentSession.tanggal}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden shadow-2xl">
              <div className="divide-y divide-white/5">
                {DATA_SANTRI.filter(
                  (s) => s.kelas === currentSession.kelas,
                ).map((s) => (
                  <SantriRow
                    key={s.id}
                    santri={s}
                    currentStatus={currentSession.data_absen[s.id]?.status}
                    currentNote={currentSession.data_absen[s.id]?.note || ""}
                    onStatusChange={updateStatus}
                    onNoteChange={updateNote}
                  />
                ))}
              </div>
              <div className="p-8 bg-white/[0.02]">
                <button
                  onClick={handleFinalSave}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all"
                >
                  <Save size={18} /> Simpan Seluruh Absensi
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Modal
        isOpen={showForm}
        onClose={closeModal}
        title={isEditMode ? "Edit Sesi Absen" : "Atur Sesi Absen"}
      >
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
              Pilih Kelas
            </label>
            <select
              value={setup.kelas}
              onChange={(e) => setSetup({ ...setup, kelas: e.target.value })}
              className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 font-bold text-white outline-none focus:ring-2 ring-indigo-500"
            >
              <option value="">-- PILIH --</option>
              <option value="7A">7A</option>
              <option value="8B">8B</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
              Tanggal
            </label>
            <input
              type="date"
              value={setup.tanggal}
              onChange={(e) => setSetup({ ...setup, tanggal: e.target.value })}
              className="w-full bg-slate-800 border border-white/5 rounded-2xl p-4 font-bold text-white outline-none focus:ring-2 ring-indigo-500"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              onClick={closeModal}
              className="flex-1 py-4 text-slate-500 font-black"
            >
              Batal
            </button>
            <button
              onClick={handleSaveSession}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-600/20"
            >
              {isEditMode ? "Simpan Perubahan" : "Buat Sesi"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
