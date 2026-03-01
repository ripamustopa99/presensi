"use server";

import { StudentInput, studentSchema } from "../schemas/student.schema";
import {
  createStudent,
  deleteStudent,
  updateStudent,
} from "@/lib/services/students.services";
import { revalidatePath } from "next/cache";

/**
 * ACTION: TAMBAH SANTRI
 * Menangani pengecekan NIS duplikat dari Service
 */
export async function addStudent(formData: StudentInput) {
  try {
    // 1. Validasi Zod (Client-side logic di Server)
    const parsed = studentSchema.safeParse(formData);

    if (!parsed.success) {
      return {
        success: false,
        message: "Data yang dimasukkan tidak valid",
        errors: parsed.error.flatten(),
      };
    }

    // 2. Panggil Service
    await createStudent(parsed.data);

    revalidatePath("/dashboard/students");
    return { success: true, message: "Santri berhasil ditambahkan ✨" };
  } catch (error: any) {
    console.error("🔥 Action Error [addStudent]:", error.message);

    // 3. Tangkap Error Spesifik NIS Duplikat
    if (error.message === "NIS_ALREADY_EXISTS") {
      return {
        success: false,
        message: "Gagal: Nomor Induk (NIS) sudah terdaftar untuk santri lain.",
      };
    }

    return {
      success: false,
      message: "Terjadi kesalahan pada sistem database",
    };
  }
}

/**
 * ACTION: UPDATE SANTRI
 */
export async function updateStudentAction(_id: string, formData: StudentInput) {
  try {
    if (!_id) return { success: false, message: "ID Santri wajib disertakan" };

    const parsed = studentSchema.safeParse(formData);

    if (!parsed.success) {
      return {
        success: false,
        message: "Update gagal: Data tidak sesuai format",
        errors: parsed.error.flatten(),
      };
    }

    await updateStudent(_id, parsed.data);

    revalidatePath("/dashboard/students");
    return { success: true, message: "Data santri berhasil diperbarui ✅" };
  } catch (error: any) {
    console.error("🔥 Action Error [updateStudentAction]:", error.message);

    if (error.message === "STUDENT_NOT_FOUND") {
      return { success: false, message: "Gagal: Data santri tidak ditemukan." };
    }

    return { success: false, message: "Gagal memperbarui data ke server" };
  }
}

/**
 * ACTION: HAPUS SANTRI
 */
export async function deleteStudentAction(_id: string) {
  try {
    if (!_id) return { success: false, message: "ID tidak ditemukan" };

    await deleteStudent(_id);

    revalidatePath("/dashboard/students");
    return { success: true, message: "Santri berhasil dihapus dari sistem" };
  } catch (error: any) {
    console.error("🔥 Action Error [deleteStudentAction]:", error.message);
    return { success: false, message: "Gagal menghapus data" };
  }
}
