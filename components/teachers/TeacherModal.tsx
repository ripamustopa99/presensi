"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form"; // Tambah SubmitHandler
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/ui/Input";
import { Save, Loader } from "lucide-react";
import { teacherSchema, TeacherInput } from "@/lib/schemas/teacher.schema";
import { saveTeacherAction } from "@/lib/actions/teacher.actions";

interface TeacherModalProps {
  isOpen: boolean;
  onClose: (success?: boolean, message?: string) => void;
  editingGuru: any;
}

export function TeacherModal({
  isOpen,
  onClose,
  editingGuru,
}: TeacherModalProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeacherInput>({
    // Tambahkan 'as any' jika TS masih komplain soal ketidakcocokan versi tipe role
    resolver: zodResolver(teacherSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      role: "guru",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingGuru) {
        reset({
          _id: editingGuru._id,
          name: editingGuru.name || "",
          email: editingGuru.email || "",
          username: editingGuru.username || "",
          password: "",
          role: editingGuru.role || "guru", // Gunakan role dari data jika ada
        });
      } else {
        reset({
          name: "",
          email: "",
          username: "",
          password: "",
          role: "guru",
        });
      }
    }
  }, [editingGuru, isOpen, reset]);

  // Gunakan SubmitHandler agar tipe 'data' otomatis sinkron
  const onSubmit: SubmitHandler<TeacherInput> = async (data) => {
    try {
      setError(null);
      const result = await saveTeacherAction(data);

      if (result.success) {
        const successMessage = editingGuru
          ? `Data guru ${data.name} berhasil diperbarui`
          : `Guru ${data.name} berhasil ditambahkan ke sistem`;

        onClose(true, successMessage);
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
      onClose={() => onClose()}
      title={editingGuru ? "Update Akun Pengajar" : "Akun Guru Baru"}
    >
      {/* Bungkus handleSubmit dengan onSubmit yang sudah bertipe SubmitHandler */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        {error && (
          <div className="p-3 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl text-center">
            {error}
          </div>
        )}

        <Input
          label="Nama Lengkap"
          placeholder="Nama Lengkap Guru"
          register={register("name")}
          error={errors.name?.message}
        />

        <Input
          label="Email"
          type="email"
          placeholder="guru@instansi.com"
          register={register("email")}
          error={errors.email?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Username"
            placeholder="guru123"
            register={register("username")}
            error={errors.username?.message}
          />

          <div className="space-y-1">
            <Input
              label={editingGuru ? "Password Baru" : "Password"}
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all active:scale-95 font-black text-[11px] uppercase tracking-widest mt-6 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          <span>{isSubmitting ? "MENYIMPAN..." : "SIMPAN DATA GURU"}</span>
        </button>
      </form>
    </Modal>
  );
}
