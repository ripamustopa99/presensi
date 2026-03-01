"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";

import { zodResolver } from "@hookform/resolvers/zod";
import { sessionSchema, SessionInput } from "@/lib/schemas/session.schema";
import { saveSessionAction } from "@/lib/actions/session.actions";
import { Loader2, Calendar, LayoutGrid, Save } from "lucide-react";

interface AbsenFormProps {
  isOpen: boolean;
  onClose: (success?: boolean, message?: string) => void;
  formData: any;
  isEditMode: boolean;
  classes: { _id: string; class_name: string }[];
  user: {
    _id: string;
    name: string;
  };
}

export default function AbsenForm({
  isOpen,
  onClose,
  formData,
  isEditMode,
  classes,
  user,
}: AbsenFormProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SessionInput>({
    resolver: zodResolver(sessionSchema) as any,
    defaultValues: {
      authorId: user?._id || "",
      authorName: user?.name || "",
      classId: "",
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      attendance_data: {},
    },
  });

  // Effect untuk sinkronisasi data saat modal dibuka
  useEffect(() => {
    if (!isOpen) return;

    setError(null);

    if (isEditMode && formData) {
      // PERBAIKAN: Pastikan key attendance_data terisi dengan benar sesuai schema
      reset({
        ...formData,
        // Cari classId yang benar jika strukturnya berbeda di DB
        classId: formData.classId || formData.class_id || "",
        // Sinkronisasi data absensi (snake_case vs camelCase)
        attendance_data:
          formData.attendance_data || formData.attendanceData || {},
        status: formData.status || "pending",
      });
    } else {
      // Reset ke nilai default untuk pembuatan sesi baru
      reset({
        authorId: user?._id || "",
        authorName: user?.name || "",
        classId: "",
        date: new Date().toISOString().split("T")[0],
        status: "pending",
        attendance_data: {},
      });
    }
  }, [isOpen, isEditMode, formData, reset, user]);

  const onSubmit: SubmitHandler<SessionInput> = async (data) => {
    setError(null);
    try {
      const selectedClass = classes?.find((c) => c._id === data.classId);

      // Kirim data ke server action
      const result = await saveSessionAction({
        ...data,
        // Tambahkan ID jika sedang dalam mode edit agar server tahu ini update, bukan create baru
        _id: isEditMode ? formData?._id : undefined,
        className: selectedClass?.class_name || formData?.className || "",
      } as any);

      if (result.success) {
        onClose(
          true,
          `Sesi ${selectedClass?.class_name || ""} berhasil ${isEditMode ? "diperbarui" : "disimpan"}`,
        );
      } else {
        setError(result.message || "Gagal menyimpan sesi");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi atau validasi data");
      console.error("Submit Error:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose()}
      title={isEditMode ? "Ubah Detail Sesi" : "Buat Sesi Absen"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        {/* INPUT KELAS */}
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 flex items-center gap-2">
            <LayoutGrid size={12} /> Pilih Kelas
          </label>
          <select
            {...register("classId")}
            className={`w-full bg-slate-800/50 border ${
              errors.classId ? "border-rose-500" : "border-white/5"
            } rounded-2xl p-4 font-bold text-white outline-none focus:ring-2 ring-indigo-500 transition-all cursor-pointer appearance-none`}
          >
            <option value="">-- PILIH KELAS --</option>
            {classes?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.class_name}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p className="text-rose-500 text-[10px] font-bold mt-2 ml-2 italic">
              {errors.classId.message}
            </p>
          )}
        </div>

        {/* INPUT TANGGAL */}
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 flex items-center gap-2">
            <Calendar size={12} /> Tanggal Absensi
          </label>
          <input
            type="date"
            {...register("date")}
            className={`w-full bg-slate-800/50 border ${
              errors.date ? "border-rose-500" : "border-white/5"
            } rounded-2xl p-4 font-bold text-white outline-none focus:ring-2 ring-indigo-500 transition-all`}
          />
          {errors.date && (
            <p className="text-rose-500 text-[10px] font-bold mt-2 ml-2 italic">
              {errors.date.message}
            </p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-[11px] font-bold text-center">
            {error}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => onClose()}
            className="flex-1 py-4 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex justify-center items-center gap-2 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <Save size={18} />
                {isEditMode ? "Simpan Perubahan" : "Konfirmasi Sesi"}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
