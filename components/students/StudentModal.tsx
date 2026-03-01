"use client";
import Modal from "../ui/Modal";
import { Input, SelectInput } from "@/components/ui/Input";
import { Loader, Save } from "lucide-react";
import { StudentInput, studentSchema } from "@/lib/schemas/student.schema";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  addStudent,
  updateStudentAction,
} from "@/lib/actions/students.actions";

interface StudentModalProps {
  classes: any[];
  isOpen: boolean;
  onClose: (success?: boolean, message?: string) => void;
  editingSantri: any;
}

export function StudentModal({
  classes,
  isOpen,
  onClose,
  editingSantri,
}: StudentModalProps) {
  const [error, setError] = useState<string | null>(null);

  // --- PERBAIKAN 1: Mapping Menggunakan ID ---
  const classOptions = (classes || []).map((item) => ({
    label: item.class_name, // Yang dilihat user (Teks)
    value: item._id, // Yang disimpan di DB (ID)
  }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentInput>({
    resolver: zodResolver(studentSchema) as any,
    defaultValues: {
      name: "",
      nis: "",
      class: "", // Ini akan menampung ID Kelas
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingSantri) {
        reset({
          _id: editingSantri._id || editingSantri.id,
          name: editingSantri.name || "",
          nis: editingSantri.nis || "",
          // --- PERBAIKAN 2: Pastikan mengambil field yang benar dari DB ---
          class: editingSantri.classId || editingSantri.class || "",
        });
      } else {
        reset({ name: "", nis: "", class: "" });
      }
      setError(null);
    }
  }, [editingSantri, isOpen, reset]);

  const onSubmit: SubmitHandler<StudentInput> = async (formData) => {
    setError(null);
    try {
      let result;
      const targetId = editingSantri?._id || editingSantri?.id;

      // --- PERBAIKAN 3: Payload yang konsisten ---
      const payload = {
        ...formData,
        classId: formData.class, // Kita duplikasi atau pastikan classId terisi ID
      };

      if (targetId) {
        result = await updateStudentAction(targetId, payload as any);
      } else {
        result = await addStudent(payload as any);
      }

      if (result.success) {
        const successMessage = targetId
          ? `Data ${formData.name} berhasil diperbarui`
          : `Santri ${formData.name} berhasil ditambahkan`;

        reset();
        onClose(true, successMessage);
      } else {
        setError(result.message || "Gagal menyimpan data");
      }
    } catch (err) {
      setError("Koneksi ke server bermasalah");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose()}
      title={editingSantri ? "Edit Data Santri" : "Tambah Santri Baru"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <Input
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap santri"
          register={register("name")}
          error={errors.name?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="NIS / NISN"
            placeholder="Contoh: 2506093"
            register={register("nis")}
            error={errors.nis?.message}
          />

          <SelectInput
            label="Pilih Kelas"
            register={register("class")}
            error={errors.class?.message}
            options={classOptions} // Sekarang isinya {label: "Nama", value: "ID"}
          />
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[11px] font-bold text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => onClose()}
            className="flex-1 py-4 text-slate-500 font-black text-[10px] tracking-widest hover:text-rose-500 transition-colors uppercase"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-500 active:scale-95 disabled:opacity-50 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <>
                <Save size={18} />{" "}
                {editingSantri ? "PERBARUI DATA" : "SIMPAN DATA"}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
