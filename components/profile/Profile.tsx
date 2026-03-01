"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Loader2,
} from "lucide-react";

import {
  ProfileSchema,
  type ProfileFormValues,
} from "@/lib/schemas/profile.schema";
import {
  updateProfileAction,
  getUserDataAction,
} from "@/lib/actions/profile.actions";
import Alert from "../ui/Alert";
import { EditableField } from "./EditableField";

interface UserData {
  _id: string;
  email: string;
  username: string;
  role: string;
  name: string;
  avatar?: string | null;
}

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string;
}

export default function ProfileSidebar({
  isOpen,
  onClose,
  currentUser,
}: ProfileSidebarProps) {
  const [formData, setFormData] = useState<UserData | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
  });

  const watchedName = watch("name");

  const showAlert = useCallback(
    (message: string, type: "success" | "error") => {
      setAlertConfig({ show: true, message, type });
      if (type === "success")
        setTimeout(() => setAlertConfig((p) => ({ ...p, show: false })), 3000);
    },
    [],
  );

  // Fetch Data Securely
  useEffect(() => {
    if (isOpen && currentUser) {
      const loadProfile = async () => {
        setIsFetching(true);
        try {
          const res = await getUserDataAction(currentUser);
          if (res?.success && res.data) {
            const data = res.data as UserData;
            setFormData(data);
            setAvatar(data.avatar || null);
            reset({
              name: data.name,
              email: data.email,
              username: data.username,
            });
          }
        } catch (err) {
          showAlert("Gagal sinkronisasi data", "error");
        } finally {
          setIsFetching(false);
        }
      };
      loadProfile();
    }
  }, [isOpen, currentUser, reset, showAlert]);

  const onFormSubmit = async (values: ProfileFormValues) => {
    if (!formData?._id) return;

    try {
      // Keamanan: Hanya kirim avatar jika ada perubahan (opsional)
      const result = await updateProfileAction(formData._id, {
        ...values,
        avatar: avatar,
      });

      if (result.success) {
        showAlert("Profil berhasil diperbarui", "success");
        setEditingId(null);
        // Update local state agar sinkron
        setFormData((prev) => (prev ? { ...prev, ...values, avatar } : null));
      } else {
        showAlert(result.message || "Gagal memperbarui profil", "error");
      }
    } catch (error) {
      showAlert("Gangguan pada server", "error");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Security: Validasi Tipe File & Ukuran
    if (!file.type.startsWith("image/"))
      return showAlert("Hanya file gambar!", "error");
    if (file.size > 1024 * 1024)
      return showAlert("Maksimal ukuran 1MB", "error");

    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {alertConfig.show && (
          <Alert
            message={alertConfig.message}
            type={alertConfig.type}
            onClose={() => setAlertConfig((p) => ({ ...p, show: false }))}
          />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-[100] overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute inset-y-0 right-0 w-full max-w-[400px] bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 z-10 bg-white dark:bg-slate-900">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                Profil {formData?.role || "User"}
              </h2>
              <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 tracking-widest uppercase">
                Personal Settings
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex-1 overflow-y-auto p-8 no-scrollbar"
          >
            {isFetching ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-teal-500" size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Sinkronisasi...
                </span>
              </div>
            ) : (
              formData && (
                <>
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
                          (watchedName || formData.name).charAt(0).toUpperCase()
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
                      {watchedName || formData.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ID: #{formData._id.slice(-6)}
                    </span>
                  </div>

                  <div className="space-y-5">
                    <EditableField
                      label="Nama Lengkap"
                      value={watchedName || formData.name}
                      icon={<User size={18} />}
                      isEditing={editingId === "name"}
                      onEdit={() => setEditingId("name")}
                      registration={register("name")}
                      error={errors.name?.message}
                    />
                    <EditableField
                      label="Email Address"
                      value={formData.email}
                      icon={<Mail size={18} />}
                      isEditing={editingId === "email"}
                      onEdit={() => setEditingId("email")}
                      registration={register("email")}
                      error={errors.email?.message}
                    />
                    <EditableField
                      label="Username"
                      value={formData.username}
                      icon={<Hash size={18} />}
                      isEditing={editingId === "username"}
                      onEdit={() => setEditingId("username")}
                      registration={register("username")}
                      error={errors.username?.message}
                    />
                    <EditableField
                      label="Role Access"
                      value={formData.role.toUpperCase()}
                      icon={<Shield size={18} />}
                      isEditing={false}
                      onEdit={() => {}}
                      isLocked
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-10 py-4 bg-slate-900 dark:bg-teal-600 hover:opacity-90 disabled:bg-slate-300 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
                  >
                    {isSubmitting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <Save size={18} />
                        <span className="tracking-widest text-xs">
                          SIMPAN PERUBAHAN
                        </span>
                        <ChevronRight size={16} className="opacity-50" />
                      </>
                    )}
                  </button>
                </>
              )
            )}
          </form>
        </motion.div>
      </div>
    </>
  );
}
