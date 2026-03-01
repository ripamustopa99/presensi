"use client";
import React, { useEffect } from "react";
import { Modal } from "../ui/Modal";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { classSchema, ClassInput } from "@/lib/schemas/class.schema";
import { saveClassAction } from "@/lib/actions/class.actions";
import Input, { SelectInput } from "@/components/ui/Input";
import { Loader2, Save } from "lucide-react";

// Perbaikan Interface agar lebih spesifik
interface Teacher {
  _id: string;
  name: string;
}

interface ClassesFormProps {
  teachers: Teacher[];
  isOpen: boolean;
  onClose: (success?: boolean, message?: string) => void; // Support untuk Alert
  formData: any;
  isEditMode: boolean;
  onSaveSuccess: () => void;
}

export default function ClassesForm({
  teachers,
  isOpen,
  onClose,
  formData,
  isEditMode,
  onSaveSuccess,
}: ClassesFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClassInput>({
    resolver: zodResolver(classSchema) as any, // 'as any' untuk menghindari mismatch enum Zod vs Hook Form
    defaultValues: {
      class_name: "",
      wali: "",
    },
  });

  // Transformasi data guru untuk SelectInput
  const teacherOptions = (teachers || []).map((item) => ({
    label: item.name,
    value: item._id,
  }));

  // Sinkronisasi data saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && formData) {
        reset({
          _id: formData._id,
          class_name: formData.class_name, // Sesuaikan dengan key 'class_name' di schema
          wali: formData.wali,
        });
      } else {
        reset({
          class_name: "",
          wali: "",
          _id: undefined,
        });
      }
    }
  }, [isOpen, isEditMode, formData, reset]);

  const onSubmit: SubmitHandler<ClassInput> = async (data) => {
    try {
      const result = await saveClassAction(data);
      if (result.success) {
        const msg = isEditMode
          ? `Kelas ${data.class_name} berhasil diperbarui`
          : `Kelas ${data.class_name} berhasil ditambahkan`;

        onSaveSuccess(); // Refresh data di parent
        onClose(true, msg); // Tutup modal sambil kirim sinyal Alert Berhasil
        reset();
      } else {
        // Jika gagal, kita tidak menutup modal, tapi menampilkan pesan error (opsional: bisa pake alert lokal)
        alert(result.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Terjadi kesalahan pada sistem");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose()}
      title={isEditMode ? "Update Kelas" : "Tambah Kelas"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <Input
          label="Nama Kelas"
          placeholder="Misal: 10 IPA 1 atau XII-TKJ"
          register={register("class_name")}
          error={errors.class_name?.message}
        />

        <SelectInput
          label="Wali Kelas"
          register={register("wali")}
          error={errors.wali?.message}
          options={teacherOptions}
        />

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => onClose()}
            className="flex-1 py-4 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-red-500 transition-colors"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <Save size={16} />
                {isEditMode ? "Perbarui" : "Simpan"}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
