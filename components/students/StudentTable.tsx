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
import { Modal } from "@/components/ui/modal";

interface TableProps {
  data: any[];
  classes: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
}

export const Table = ({ data, classes, onEdit, onDelete }: TableProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Helper untuk mendapatkan informasi dari data kelas (Nama atau Wali Kelas)
  const getClassInfo = (
    classId: string,
    field: "class_name" | "wali_kelas" = "class_name",
  ) => {
    const found = classes?.find((c: any) => c._id === classId);
    if (!found) return field === "class_name" ? "Tanpa Kelas" : "-";
    return found[field] || "-";
  };

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
      <table className="w-full text-left">
        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <tr>
            <th className="px-8 py-5">Nama Lengkap</th>
            <th className="px-8 py-5">NIS</th>
            <th className="px-8 py-5 text-center hidden md:table-cell">
              Kelas
            </th>
            <th className="px-8 py-5 text-right">Aksi</th>
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
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
              >
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {item.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold group-hover:text-indigo-400 transition-colors">
                    ID-{item._id.slice(-6)}
                  </p>
                </td>

                <td className="px-8 py-6">
                  <p className="text-sm font-semibold text-slate-500">
                    {item.nis}
                  </p>
                </td>

                <td className="px-8 py-6 hidden md:table-cell">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 border border-emerald-100 dark:border-emerald-800">
                      {getClassInfo(item.class, "class_name")}
                    </span>
                  </div>
                </td>

                <td className="px-8 py-6 text-right relative">
                  <div className="flex justify-end">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === item._id ? null : item._id)
                      }
                      className={`p-2 rounded-xl transition-all ${
                        openMenuId === item._id
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <MoreVertical size={20} />
                    </button>

                    <AnimatePresence>
                      {openMenuId === item._id && (
                        <div
                          ref={menuRef}
                          className="absolute right-8 top-16 w-48 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-2xl z-[100] p-2"
                        >
                          <p className="text-[9px] flex justify-start font-black text-slate-400 uppercase tracking-widest px-3 py-2 border-b dark:border-slate-800 mb-1">
                            Opsi Kelola
                          </p>
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 rounded-xl transition-colors text-left"
                          >
                            <Eye size={16} /> Lihat Detail
                          </button>
                          <button
                            onClick={() => {
                              onEdit?.(item);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                          >
                            <Edit size={16} className="text-blue-500" /> Edit
                            Data
                          </button>
                          <button
                            onClick={() => {
                              onDelete?.(item);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-left"
                          >
                            <Trash2 size={16} /> Hapus Data
                          </button>
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

      {/* MODAL DETAIL */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Detail Data Santri"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              label="Nama Lengkap"
              value={selectedItem?.name}
              icon={<User size={14} />}
            />
            <DetailItem
              label="NIS"
              value={selectedItem?.nis}
              icon={<Hash size={14} />}
            />
            <DetailItem
              label="Kelas"
              value={getClassInfo(selectedItem?.class, "class_name")}
              icon={<School size={14} />}
            />
            {/* MENAMPILKAN WALI KELAS */}
            <DetailItem
              label="Wali Kelas"
              value={getClassInfo(selectedItem?.class, "wali_kelas")}
              icon={<ShieldCheck size={14} className="text-emerald-500" />}
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
                Log Sistem
              </p>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Santri ini terdaftar dengan ID unik{" "}
              <span className="text-indigo-500 font-bold">
                {selectedItem?._id}
              </span>
              .
            </p>
          </div>

          <button
            onClick={() => setSelectedItem(null)}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95 transition-all"
          >
            Tutup Detail
          </button>
        </div>
      </Modal>
    </div>
  );
};

function DetailItem({ label, value, icon }: any) {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border dark:border-slate-800/50">
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
