"use client";

import React from "react";
import { Search } from "lucide-react";

// Definisikan interface agar tidak merah
interface SearchBarProps {
  activeTab: string; // Untuk placeholder dinamis
  setSearchTerm: (val: string) => void; // Fungsi untuk update state pencarian
}

export default function SearchBar({
  activeTab,
  setSearchTerm,
}: SearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between w-full md:max-w-md">
      <div className="relative flex-1 w-full">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          // Placeholder akan berubah otomatis: "Cari data guru..." atau "Cari data santri..."
          placeholder={`Cari data ${activeTab}...`}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm outline-none focus:ring-2 ring-indigo-500 transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
