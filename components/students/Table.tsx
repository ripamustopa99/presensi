"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  User,
  Hash,
  School,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Modal } from "@/components/ui/modal"; // Sesuaikan path import modal kamu

// Mock Data

export const Table = ({ data, onEdit, onDelete }: any) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="overflow-x-auto min-h-[400px]">
      {/* Tambah min-h agar menu tidak terpotong */}
      <table className="w-full text-left">
        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <tr>
            <th className="px-8 py-5">Nama Lengkap</th>
            <th className="px-8 py-5">NIS</th>
            <th className="px-8 py-5 text-center hidden md:block">Kelas</th>
            <th className="px-8 py-5 text-right">Detail</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-slate-800">
          <AnimatePresence mode="popLayout">
            {data.map((item: any) => (
              <motion.tr
                key={item._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {item.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">
                    ID-{item._id}
                  </p>
                </td>

                <td className="px-8 py-6  ">
                  <p className="text-sm font-semibold text-slate-500">
                    {item.NIS}
                  </p>
                </td>

                <td className="px-8 py-6 hidden md:block">
                  <div className="flex justify-center">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase 
                      ${
                        // ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600"
                        "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600"
                      }`}
                    >
                      {item.class}
                    </span>
                  </div>
                </td>

                {/* KOLOM AKSI DENGAN TITIK TIGA */}
                <td className="px-8 py-6 text-right relative">
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === item.id ? null : item._id)
                      }
                      className={`p-2 rounded-xl transition-all ${openMenuId === item._id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                    >
                      <MoreVertical size={20} />
                    </button>

                    {/* POPOVER MENU */}
                    <AnimatePresence>
                      {openMenuId === item._id && (
                        <div ref={menuRef}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="absolute right-8 top-16 w-48 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-2xl z-[100] p-2"
                          >
                            <p className="text-[9px] flex justify-start font-black text-slate-400 uppercase tracking-widest px-3 py-2 border-b dark:border-slate-800 mb-1">
                              Opsi Kelola
                            </p>

                            {/* MENU LIHAT DETAIL */}
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setOpenMenuId(null);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 rounded-xl transition-colors text-left"
                            >
                              <Eye size={16} /> Lihat Detail
                            </button>

                            {/* Tombol Edit & Delete */}
                            <button
                              onClick={() => onEdit?.(item)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                            >
                              <Edit size={16} className="text-blue-500" /> Edit
                              Data
                            </button>
                            <button
                              onClick={() => onDelete?.(item._id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-left"
                            >
                              <Trash2 size={16} /> Hapus Data
                            </button>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="p-20 text-center text-slate-400 font-bold italic">
          Data tidak ditemukan...
        </div>
      )}
      {/* </div> */}

      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Detail Data Santri"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              label="Nama Lengkap"
              value={selectedItem?.nama}
              icon={<User size={14} />}
            />
            <DetailItem
              label="NIS / ID"
              value={selectedItem?.id}
              icon={<Hash size={14} />}
            />
            <DetailItem
              label="Kelas"
              value={selectedItem?.kelas}
              icon={<School size={14} />}
            />
            <DetailItem
              label="Asrama"
              value={selectedItem?.asrama}
              icon={<ShieldCheck size={14} />}
            />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={14} className="text-indigo-500" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Log Aktivitas
              </p>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Terdaftar pada sistem sejak{" "}
              <span className="text-slate-700 dark:text-slate-200 font-bold">
                {selectedItem?.tglMasuk}
              </span>
            </p>
          </div>

          <button
            onClick={() => setSelectedItem(null)}
            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
          >
            Selesai & Tutup
          </button>
        </div>
      </Modal>
    </div>
  );
};

// Komponen Helper untuk tampilan di dalam Modal
function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="p-4 bg-black dark:bg-slate-800/30 rounded-2xl border dark:border-slate-800/50">
      <div className="flex items-center gap-2 text-indigo-500 mb-1">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </span>
      </div>
      <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate">
        {value || "-"}
      </p>
    </div>
  );
}
