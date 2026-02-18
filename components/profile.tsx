"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Camera,
  X,
  Save,
  ChevronRight,
  Hash,
  Edit3,
} from "lucide-react";

// 1. Definisikan Interface Data (Supaya tidak ada error merah)
interface UserData {
  id: number;
  email: string;
  username: string;
  role: string;
  nama: string;
}

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: "admin" | "guru";
}

export default function ProfileSidebar({
  isOpen,
  onClose,
  currentUserRole,
}: ProfileSidebarProps) {
  const [guruList, setGuruList] = useState<any[]>([]);
  const userData = guruList.find((u) => u.role === currentUserRole);
  const [formData, setFormData] = useState<UserData | undefined>(userData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const loadDataFromFile = async () => {
    try {
      // setIsLoading(true);
      const response = await fetch("/api/attendance");
      const data = await response.json();
      setGuruList(data.users || []);
    } catch (error) {
      console.error("Gagal memuat data dari file:", error);
      // setAlert({ msg: "Gagal terhubung ke database file", type: "error" });
    } finally {
      // setIsLoading(false);
    }
  };
  useEffect(() => {
    loadDataFromFile();
    setFormData(userData);
  }, [userData]);

  const handleUpdate = (key: keyof UserData, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!formData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100]"
          />

          {/* SIDEBAR PANEL */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-[400px] bg-white dark:bg-slate-900 z-[101] flex flex-col shadow-2xl border-l dark:border-slate-800"
          >
            {/* HEADER */}
            <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">
                  Profil {formData.role.toUpperCase()}
                </h2>
                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                  Update Data Personal
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              {/* AVATAR DENGAN ICON CAMERA */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-[2rem] bg-indigo-600 border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center text-white text-4xl font-black">
                    {avatar ? (
                      <img
                        src={avatar}
                        className="w-full h-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      formData.nama.charAt(0)
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-teal-600 text-white p-2.5 rounded-2xl cursor-pointer hover:bg-teal-700 transition-colors shadow-lg border-4 border-white dark:border-slate-900">
                    <Camera size={16} />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                </div>
                <h3 className="mt-6 text-lg font-black dark:text-white">
                  {formData.nama}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                  ID Pengguna: #{formData.id}
                </p>
              </div>

              {/* LIST FIELDS */}
              <div className="space-y-5">
                <EditableField
                  label="Nama Lengkap"
                  value={formData.nama}
                  icon={<User size={18} />}
                  isEditing={editingId === "nama"}
                  onEdit={() => setEditingId("nama")}
                  onChange={(val) => handleUpdate("nama", val)}
                  onBlur={() => setEditingId(null)}
                />
                <EditableField
                  label="Alamat Email"
                  value={formData.email}
                  icon={<Mail size={18} />}
                  isEditing={editingId === "email"}
                  onEdit={() => setEditingId("email")}
                  onChange={(val) => handleUpdate("email", val)}
                  onBlur={() => setEditingId(null)}
                />
                <EditableField
                  label="Username"
                  value={formData.username}
                  icon={<Hash size={18} />}
                  isEditing={editingId === "username"}
                  onEdit={() => setEditingId("username")}
                  onChange={(val) => handleUpdate("username", val)}
                  onBlur={() => setEditingId(null)}
                />
                <EditableField
                  label="Hak Akses"
                  value={formData.role.toUpperCase()}
                  icon={<Shield size={18} />}
                  isLocked
                />
              </div>

              <button
                onClick={onClose}
                className="w-full mt-10 py-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl shadow-xl shadow-teal-100 dark:shadow-none flex items-center justify-center gap-2 group transition-all active:scale-95"
              >
                <Save size={20} />
                SIMPAN PERUBAHAN
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// 3. Komponen Field dengan Type Safety
interface EditableFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  isEditing?: boolean;
  onEdit?: () => void;
  onChange?: (val: string) => void;
  onBlur?: () => void;
  isLocked?: boolean;
}

function EditableField({
  label,
  value,
  icon,
  isEditing,
  onEdit,
  onChange,
  onBlur,
  isLocked,
}: EditableFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div
        onClick={() => !isLocked && onEdit?.()}
        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all cursor-text
          ${
            isLocked
              ? "bg-slate-50 dark:bg-slate-800/40 border-transparent opacity-60"
              : isEditing
                ? "bg-white dark:bg-slate-900 border-teal-500 ring-4 ring-teal-500/5 shadow-inner"
                : "bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          }`}
      >
        <div className={`${isEditing ? "text-teal-600" : "text-slate-400"}`}>
          {icon}
        </div>

        {isEditing ? (
          <input
            autoFocus
            className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-slate-800 dark:text-slate-200"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange?.(e.target.value)
            }
            onBlur={onBlur}
            onKeyDown={(e) => e.key === "Enter" && onBlur?.()}
          />
        ) : (
          <div className="flex-1 font-bold text-sm text-slate-700 dark:text-slate-300 truncate">
            {value}
          </div>
        )}

        {!isLocked && !isEditing && (
          <Edit3 size={14} className="text-slate-300" />
        )}
        {isLocked && (
          <div className="text-[8px] font-black text-slate-300 tracking-tighter">
            LOCKED
          </div>
        )}
      </div>
    </div>
  );
}
