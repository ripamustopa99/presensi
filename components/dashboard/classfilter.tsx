"use client";

import React from "react";
import { useEffect, useState } from "react";
interface FilterKelasProps {
  selectedKelas: string;
  setSelectedKelas: (kelas: string) => void;
}

export default function FilterKelas({
  selectedKelas,
  setSelectedKelas,
}: FilterKelasProps) {
  const [kelasList, setKelasList] = useState<any[]>([]);
  const loadDataFromFile = async () => {
    try {
      // setIsLoading(true);
      const response = await fetch("/api/attendance");
      const data = await response.json();
      setKelasList(data.data_kelas || []);
    } catch (error) {
      console.error("Gagal memuat data dari file:", error);
      // setAlert({ msg: "Gagal terhubung ke database file", type: "error" });
    } finally {
      // setIsLoading(false);
    }
  };

  // ==========================================
  // 1. PROTEKSI RUTE (ROUTE GUARD)
  // ==========================================
  useEffect(() => {
    loadDataFromFile();
  });

  return (
    <div className="p-4 lg:p-6 border-b dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
      {kelasList.map((k) => (
        <button
          key={k}
          onClick={() => setSelectedKelas(k)}
          className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all 
            ${
              selectedKelas === k
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400"
            }`}
        >
          Kelas {k}
        </button>
      ))}
    </div>
  );
}
