"use client";
import React, { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/modal";
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
import { CustomAlert } from "@/components/sessions/alert";
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
    <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* <div className="min-h-screen bg-slate-950 py-10 text-slate-200"> */}
      <AnimatePresence>
        {alert && (
          <CustomAlert
            message={alert.msg}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </AnimatePresence>

      <div className=" mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            {/* <h1 className="text-2xl font-black uppercase tracking-tighter">
              Database Kelas
            </h1> */}
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
              Data Ruang Kelas & Wali Kelas
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-500 px-8 py-5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20"
          >
            <Plus size={18} /> Tambah Kelas Baru
          </button>
        </div>

        {/* TABLE CONTAINER */}
      </div>

      {/* MODAL FORM */}
    </div>
  );
}
