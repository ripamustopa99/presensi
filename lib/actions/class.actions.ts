"use server";

import { revalidatePath } from "next/cache";
import { classSchema, ClassInput } from "../schemas/class.schema";
import {
  createClass,
  deleteClass,
  updateClass,
} from "@/lib/services/class.services";

/**
 * ACTION: SAVE CLASS
 * Lebih efisien karena pengecekan duplikat dilakukan di sisi Service (Database)
 */
export async function saveClassAction(formData: ClassInput) {
  try {
    // 1. Validasi Schema
    const parsed = classSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Validasi gagal: Periksa kembali inputan Anda.",
        errors: parsed.error.flatten(),
      };
    }

    const { _id } = parsed.data;

    // 2. Eksekusi Simpan/Update
    // Biarkan Service Pro yang melakukan pengecekan duplikat di Firebase
    if (_id) {
      await updateClass(_id, parsed.data);
    } else {
      await createClass(parsed.data);
    }

    // 3. Revalidasi dan Response Sukses
    revalidatePath("/dashboard/classes");
    return { success: true, message: "Data kelas berhasil disimpan ✅" };
  } catch (error: any) {
    console.error("🔥 Action Error [saveClassAction]:", error.message);

    // 4. Tangkap Error Spesifik dari Service Pro
    if (error.message === "CLASS_NAME_ALREADY_EXISTS") {
      return {
        success: false,
        message: `Gagal: Nama kelas "${formData.class_name}" sudah terdaftar di sistem.`,
        // message: `Gagal: Nama kelas "${formData.name}" sudah terdaftar di sistem.`
      };
    }

    if (error.message === "CLASS_NOT_FOUND") {
      return { success: false, message: "Gagal: Data kelas tidak ditemukan." };
    }

    return {
      success: false,
      message: "Gagal menyimpan data ke database. Silakan coba lagi.",
    };
  }
}

/**
 * ACTION: DELETE CLASS
 */
export async function deleteClassAction(_id: string) {
  try {
    if (!_id) return { success: false, message: "ID Kelas tidak valid." };

    await deleteClass(_id);

    revalidatePath("/dashboard/classes");
    return { success: true, message: "Kelas berhasil dihapus 🗑️" };
  } catch (error: any) {
    console.error("🔥 Action Error [deleteClassAction]:", error.message);
    return { success: false, message: "Gagal menghapus data kelas." };
  }
}
