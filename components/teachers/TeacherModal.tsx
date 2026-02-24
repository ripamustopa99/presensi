"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/ui/Input";
import { Save, X, Loader, Mail, User, Lock, Briefcase } from "lucide-react";
import { teacherSchema, TeacherInput } from "@/lib/schemas/teacher.schema";
import { saveTeacherAction } from "@/lib/actions/teacher.actions";
export function TeacherModal({ isOpen, onClose, editingGuru }: any) {
  const [error, setError] = useState<string | null>(null);

  // 1. Pastikan generic type TeacherInput masuk ke useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeacherInput>({
    resolver: zodResolver(teacherSchema),
    // 2. WAJIB: definisikan defaultValues agar TS tahu bentuk datanya
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      role: "guru",
    },
  });

  // 3. Gunakan tipe TeacherInput pada parameter data
  const onSubmit = async (data: TeacherInput) => {
    try {
      setError(null);

      // Pastikan data yang dikirim sesuai kontrak Server Action
      const result = await saveTeacherAction(data);

      if (result.success) {
        onClose();
        reset();
      } else {
        setError(result.message || "Gagal menyimpan data");
      }
    } catch (err) {
      setError("Terjadi kesalahan pada server");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingGuru ? "Update Akun Pengajar" : "Akun Guru Baru"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        {/* Error Message */}
        {error && (
          <div className="p-3 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Nama Lengkap */}
        <Input
          label="Nama Lengkap"
          placeholder="Nama Lengkap Guru"
          register={register("name")}
          error={errors.name?.message}
        />

        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="guru@instansi.com"
          register={register("email")}
          error={errors.email?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Username */}
          <Input
            label="Username"
            placeholder="guru123"
            register={register("username")}
            error={errors.username?.message}
          />

          {/* Password */}
          <div className="space-y-1">
            <Input
              label={editingGuru ? "Password Baru (Opsional)" : "Password"}
              type="password"
              placeholder="••••••"
              register={register("password")}
              error={errors.password?.message}
            />
            {editingGuru && (
              <p className="text-[10px] text-slate-400 italic">
                *Kosongkan jika tidak ingin mengubah password
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 font-black text-[11px] uppercase tracking-widest mt-6 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          <span>{isSubmitting ? "MENYIMPAN..." : "SIMPAN DATA GURU"}</span>
        </button>
      </form>

      {/* Close Button (Desktop) */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-indigo-600 transition-colors hidden sm:block"
      >
        <X size={20} />
      </button>
    </Modal>
  );
}
