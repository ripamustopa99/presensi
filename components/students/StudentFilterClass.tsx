"use client";

interface FilterKelasProps {
  kelasList: any[];
  selectedKelas: string; // Ini sekarang akan berisi "Semua" atau "ID_KELAS"
  setSelectedKelas: (kelas: string) => void;
}

export default function ClassesFilter({
  kelasList,
  selectedKelas,
  setSelectedKelas,
}: FilterKelasProps) {
  // Kita tetap butuh opsi "Semua"
  const allOption = { _id: "Semua", class_name: "Semua" };
  const filterOptions = [allOption, ...kelasList];

  return (
    <div className="p-4 lg:p-6 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
      {filterOptions.map((k) => {
        // --- LOGIKA IDENTIFIKASI ---
        // Jika k._id ada (data dari DB), gunakan itu. Jika tidak, gunakan "Semua"
        const identifier = k._id || "Semua";
        const isActive = selectedKelas === identifier;

        return (
          <button
            key={identifier}
            onClick={() => setSelectedKelas(identifier)} // Kirim ID ke state
            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all 
              ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-105"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
          >
            {/* Tampilan Label */}
            {k.class_name === "Semua" ? "Semua" : `Kelas ${k.class_name}`}
          </button>
        );
      })}
    </div>
  );
}
