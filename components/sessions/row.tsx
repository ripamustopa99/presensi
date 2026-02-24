"use client";

import { motion, AnimatePresence } from "framer-motion";
export function SantriRow({
  santri,
  currentStatus,
  currentNote,
  onStatusChange,
  onNoteChange,
}: any) {
  const options = [
    { id: "Hadir", label: "H", color: "bg-emerald-500" },
    { id: "Izin", label: "I", color: "bg-amber-500" },
    { id: "Sakit", label: "S", color: "bg-blue-500" },
    { id: "Alpa", label: "A", color: "bg-rose-500" },
  ];

  return (
    <div className="p-5 hover:bg-white/[0.02] transition-colors border-b border-white/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-slate-500 text-[10px]">
            {/* {santri.nama.substring(0, 2).toUpperCase()} */}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-tight">
              {santri.nama}
            </h4>
            <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">
              NIS: {santri.NIS}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onStatusChange(santri.id, opt.id)}
              className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all duration-300 ${
                currentStatus === opt.id
                  ? `${opt.color} text-white shadow-lg shadow-${opt.id}/20 scale-110`
                  : "bg-slate-800 text-slate-500 hover:bg-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {(currentStatus === "Izin" || currentStatus === "Sakit") && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <input
              type="text"
              placeholder={`Alasan ${currentStatus.toLowerCase()}...`}
              value={currentNote}
              onChange={(e) => onNoteChange(santri.id, e.target.value)}
              className="w-full mt-4 bg-slate-950 border border-white/5 rounded-xl px-4 py-3  text-indigo-400 outline-none focus:border-indigo-500/50 transition-all"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
