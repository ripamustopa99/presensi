"use client";
import React, { useState, useEffect, useRef } from "react";
import { Modal } from "./ui/modal";
import {
  Plus,
  MoreVertical,
  Edit3,
  Trash2,
  Loader2,
  GraduationCap,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomAlert } from "./sessions/alert";
export default function ClassManager() {
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [alert, setAlert] = useState<any>(null);

  const [formData, setFormData] = useState({
    nama: "",
    wali: "",
  });
  const loadDataFromFile = async () => {
    try {
      // setIsLoading(true);
      const response = await fetch("/api/attendance");
      const data = await response.json();
      setClasses(data.classes || []);
    } catch (error) {
      console.error("Gagal memuat data dari file:", error);
      // setAlert({ msg: "Gagal terhubung ke database file", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  // --- Ambil Data ---
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
          classes: newList, // Update list users-nya saja
        }),
      });
    } catch (error) {
      console.error("Gagal sinkronisasi ke database:", error);
      //   triggerToast("Gagal menyimpan ke server!");
    }
  };
  //   const fetchClasses = async () => {
  //     try {
  //       setIsLoading(true);
  //       const res = await fetch("/api/classes");
  //       const data = await res.json();
  //       setClasses(data.classes || []);
  //     } catch (e) {
  //       setAlert({ msg: "Gagal memuat data", type: "error" });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  useEffect(() => {
    loadDataFromFile();
  }, []);

  // --- Simpan Data ---
  const handleSave = async () => {
    if (!formData.nama || !formData.wali)
      return setAlert({ msg: "Lengkapi data!", type: "error" });

    let updated;
    if (isEditMode && currentId) {
      updated = classes.map((c) =>
        c.id === currentId ? { ...c, ...formData } : c,
      );
    } else {
      updated = [{ id: Date.now(), ...formData }, ...classes];
    }

    try {
      await syncDatabase(updated);
      setAlert({ msg: "Data berhasil disimpan!", type: "success" });
      closeModal();
    } catch (e) {
      setAlert({ msg: "Gagal menyimpan", type: "error" });
    }
  };

  // --- Hapus Data ---
  const handleDelete = async (id: number) => {
    if (confirm("Hapus kelas ini?")) {
      const updated = classes.filter((c) => c.id !== id);
      try {
        await fetch("/api/classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classes: updated }),
        });
        setClasses(updated);
        setAlert({ msg: "Kelas dihapus", type: "success" });
      } catch (e) {
        setAlert({ msg: "Gagal menghapus", type: "error" });
      }
    }
    setActiveMenu(null);
  };

  const openEdit = (cls: any) => {
    setCurrentId(cls.id);
    setFormData({ nama: cls.nama, wali: cls.wali });
    setIsEditMode(true);
    setShowForm(true);
    setActiveMenu(null);
  };

  const closeModal = () => {
    setShowForm(false);
    setIsEditMode(false);
    setFormData({ nama: "", wali: "" });
    setCurrentId(null);
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          Memuat Data...
        </p>
      </div>
    );

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

      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              Database Kelas
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">
              Pengelolaan Data Ruang Kelas & Wali Kelas
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-500 px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20"
          >
            <Plus size={18} /> Tambah Kelas Baru
          </button>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
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
            <tbody className="divide-y divide-white/5">
              {classes.length > 0 ? (
                classes.map((c) => (
                  <tr
                    key={c.id}
                    className="group hover:bg-white/[0.01] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 font-black">
                          {c.nama.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-200 uppercase tracking-tight text-lg">
                          Kelas {c.nama}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-slate-400 font-medium italic">
                      {c.wali}
                    </td>
                    <td className="px-8 py-6 text-right relative">
                      <button
                        onClick={() =>
                          setActiveMenu(activeMenu === c.id ? null : c.id)
                        }
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"
                      >
                        <MoreVertical size={20} />
                      </button>

                      {/* DROPDOWN MENU */}
                      <AnimatePresence>
                        {activeMenu === c.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setActiveMenu(null)}
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: -10 }}
                              className="absolute right-8 top-16 w-40 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden"
                            >
                              <button
                                onClick={() => openEdit(c)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                              >
                                <Edit3 size={14} /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(c.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-600 hover:text-white transition-colors border-t border-white/5"
                              >
                                <Trash2 size={14} /> Hapus
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
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM */}
      <Modal
        isOpen={showForm}
        onClose={closeModal}
        title={isEditMode ? "Update Kelas" : "Tambah Kelas"}
      >
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
              Nama Kelas
            </label>
            <input
              type="text"
              placeholder="Misal: 7A"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-5 font-bold text-white outline-none focus:ring-2 ring-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
              Nama Wali Kelas
            </label>
            <input
              type="text"
              placeholder="Nama Pengajar"
              value={formData.wali}
              onChange={(e) =>
                setFormData({ ...formData, wali: e.target.value })
              }
              className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-5 font-bold text-white outline-none focus:ring-2 ring-indigo-500 transition-all"
            />
          </div>
          <div className="flex gap-4 pt-6">
            <button
              onClick={closeModal}
              className="flex-1 py-5 text-slate-500 font-black uppercase text-[10px] tracking-widest"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
            >
              Simpan Data
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
