"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Loader2,
} from "lucide-react";

// 1. Interfaces
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
  currentUser: string; // Menggunakan ID sebagai identifier unik untuk load data user
}

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

export default function ProfileSidebar({
  isOpen,
  onClose,
  currentUser,
}: ProfileSidebarProps) {
  // State Management
  const [formData, setFormData] = useState<UserData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Load Data (Hanya saat sidebar dibuka pertama kali)
  const loadProfile = useCallback(async () => {
    try {
      // const response = await fetch("/api/attendance");
      // const data = await response.json();
      // // Cari user spesifik berdasarkan role
      // const user = data.users?.find((u: UserData) => u.id === currentUser);
      // if (user) {
      //   setFormData(user);
      // }
    } catch (err) {
      console.error("Gagal memuat profil:", err);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    } else {
      // Reset state saat ditutup agar bersih
      setEditingId(null);
    }
  }, [isOpen, loadProfile]);

  // 3. Logic Handlers
  const handleUpdate = (key: keyof UserData, value: string) => {
    if (formData) {
      setFormData({ ...formData, [key]: value });
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    // Validasi Sederhana
    if (!formData.nama.trim() || !formData.email.includes("@")) {
      alert("Mohon lengkapi data dengan benar.");
      return;
    }

    setIsLoading(true);
    try {
      // Ambil DB terbaru agar tidak menimpa data 'sessions' orang lain
      const res = await fetch("/api/attendance");
      const currentDb = await res.json();

      const updatedUsers = currentDb.users.map((u: UserData) =>
        u.id === formData.id ? { ...u, ...formData } : u,
      );

      const saveRes = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentDb,
          users: updatedUsers,
        }),
      });

      if (saveRes.ok) {
        alert("Profil berhasil diperbarui!");
        onClose();
      }
    } catch (err) {
      console.error("Gagal menyimpan:", err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <AnimatePresence mode="wait">
      {/* Menggunakan Key unik pada setiap elemen motion untuk menghindari error "same key" */}
      <React.Fragment key="profile-sidebar-root">
        {/* BACKDROP */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100]"
        />

        {/* PANEL */}
        <motion.div
          key="panel"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 right-0 w-full max-w-[400px] bg-white dark:bg-slate-900 z-[101] flex flex-col shadow-2xl border-l dark:border-slate-800"
        >
          {/* HEADER */}
          <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tight">
                Profil {formData.role}
              </h2>
              <p className="text-[10px] font-bold text-teal-600 tracking-widest uppercase">
                Pengaturan Akun
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
            {/* AVATAR SECTION */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-500 border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center text-white text-3xl font-black transition-transform group-hover:scale-105">
                  {avatar ? (
                    <img
                      src={avatar}
                      className="w-full h-full object-cover"
                      alt="Avatar"
                    />
                  ) : (
                    formData.nama.charAt(0).toUpperCase()
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-teal-500 text-white p-2 rounded-xl cursor-pointer hover:bg-teal-600 shadow-lg border-4 border-white dark:border-slate-900 transition-all">
                  <Camera size={14} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>
              <h3 className="mt-4 font-bold text-slate-800 dark:text-white">
                {formData.nama}
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                ID: #{formData.id}
              </span>
            </div>

            {/* FORM FIELDS */}
            <div className="space-y-4">
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
                label="Email"
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

            {/* ACTION BUTTON */}
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full mt-10 py-4 bg-slate-900 dark:bg-teal-600 hover:opacity-90 disabled:bg-slate-300 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Save size={20} />
              )}
              {isLoading ? "PROSES..." : "SIMPAN PERUBAHAN"}
              {!isLoading && <ChevronRight size={18} />}
            </button>
          </div>
        </motion.div>
      </React.Fragment>
    </AnimatePresence>
  );
}

// Sub-komponen tetap di dalam file yang sama agar mudah dikelola
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
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter ml-1">
        {label}
      </span>
      <div
        onClick={() => !isLocked && onEdit?.()}
        className={`flex items-center gap-4 px-4 py-3 rounded-2xl border transition-all cursor-text
          ${
            isLocked
              ? "bg-slate-50 dark:bg-slate-800/40 border-transparent opacity-60"
              : isEditing
                ? "bg-white dark:bg-slate-900 border-teal-500 ring-4 ring-teal-500/5 shadow-sm"
                : "bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          }`}
      >
        <div className={isEditing ? "text-teal-500" : "text-slate-400"}>
          {icon}
        </div>
        {isEditing ? (
          <input
            autoFocus
            className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-slate-800 dark:text-slate-100"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
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
      </div>
    </div>
  );
}
