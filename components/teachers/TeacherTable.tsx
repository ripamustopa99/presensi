"use client";
import { AnimatePresence } from "framer-motion";

interface TeacherTableProps {
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (_id: string) => void;
}

export default function TeachersTable({
  data,
  onEdit,
  onDelete,
}: TeacherTableProps) {
  return (
    // <div className="w-full bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border dark:border-slate-800 overflow-hidden"
    >
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/[0.02] text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-6">Nama Pengajar</th>
              <th className="px-8 py-6">Email</th>
              <th className="px-8 py-6 text-center">Hak Akses</th>
              <th className="px-8 py-6 text-right">Opsi</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {/* {data.map((item) => (
                <TeacherRow
                  key={item._id}
                  guru={item}
                  activeTab="guru" // Fix label untuk guru
                  onEdit={onEdit}
                  onDelete={item._id} // Pastikan ini mengirim _id
                />
              ))} */}
              {data.map((item) => (
                <TeacherRow
                  key={item._id}
                  guru={item}
                  onEdit={onEdit}
                  // PERBAIKAN: Kirimkan fungsi onDelete yang menerima id
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-bold italic">
            Data tidak ditemukan...
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ("use client");
import { motion } from "framer-motion";
import { Edit, Trash2, MoreVertical, ShieldCheck, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function TeacherRow({ guru, onEdit, onDelete }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <motion.tr
      layout
      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
    >
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <User size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-tight">
              {guru.name}
            </h4>
            <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">
              User: {guru.username}
            </p>
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          {/* <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <User size={18} />
          </div> */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 tracking-tight">
              {guru.email}
            </h4>
            {/* <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">
              Email: {guru.email}
            </p> */}
          </div>
        </div>
      </td>

      <td className="px-8 py-6 text-center">
        <div className="flex justify-center">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest">
            <ShieldCheck size={12} /> {guru.role}
          </span>
        </div>
      </td>

      <td className="px-8 py-6 text-right relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-xl transition-all ${isOpen ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-800"}`}
        >
          <MoreVertical size={18} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute right-8 top-16 w-48 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-2xl z-[100] p-2"
            >
              <p className="text-[9px] flex justify-start font-black text-slate-400 uppercase tracking-widest px-3 py-2 border-b dark:border-slate-800 mb-1">
                Opsi Kelola
              </p>

              {/* Tombol Edit & Delete */}
              <button
                onClick={() => {
                  onEdit(guru);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
              >
                <Edit size={16} className="text-blue-500" /> Edit Data
              </button>
              <button
                onClick={() => {
                  // Ini akan memanggil onDelete yang ada di TeacherLayout (induknya)
                  if (onDelete) onDelete(guru._id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-left"
              >
                <Trash2 size={16} /> Hapus Data
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    </motion.tr>
  );
}
