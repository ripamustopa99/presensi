"use client";

import React from "react";
import { useEffect, useState } from "react";
interface FilterKelasProps {
  selectedKelas: string;
  setSelectedKelas: (kelas: string) => void;
}

export default function ClassesFilter({
  selectedKelas,
  setSelectedKelas,
}: FilterKelasProps) {
  const [kelasList, setKelasList] = useState<any[]>([
    "Semua",
    "11-A",
    "11-B",
    "11-C",
    "10-A",
  ]);

  return (
    <div className="p-4 lg:p-6 border-b dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
      {kelasList.map((k) => (
        <button
          key={k}
          onClick={() => setSelectedKelas(k)}
          className={`px-5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all 
            ${
              selectedKelas === k
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400"
            }`}
        >
          {k === "Semua" ? "Semua" : "Kelas" + k}
        </button>
      ))}
    </div>
  );
}
