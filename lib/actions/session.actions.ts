"use server";

import { revalidatePath } from "next/cache";
import {
  saveSession,
  deleteSession,
  updateAbsenData,
} from "@/lib/services/session.services";

/**
 * ACTION: SIMPAN/BUAT SESI
 * Menangani logika pembuatan sesi baru dengan proteksi sesi ganda
 */
export async function saveSessionAction(data: any) {
  try {
    const result = await saveSession(data);

    revalidatePath("/dashboard/attendance");
    return {
      success: true,
      message: "Sesi berhasil dimulai ✨",
      _id: result._id,
    };
  } catch (error: any) {
    console.error("🔥 Action Error [saveSessionAction]:", error.message);

    // Proteksi: Jika guru mencoba buka absen yang sudah ada
    if (error.message === "ACTIVE_SESSION_EXISTS") {
      return {
        success: false,
        message:
          "Gagal: Masih ada sesi absensi yang aktif untuk kelas ini. Selesaikan sesi tersebut terlebih dahulu.",
      };
    }

    return { success: false, message: "Terjadi gangguan saat menyimpan sesi." };
  }
}

/**
 * ACTION: UPDATE DATA ABSEN
 * Digunakan saat guru mengklik "Simpan Absensi" atau "Selesaikan"
 */
export async function updateAbsenDataAction(_id: string, data: any) {
  try {
    if (!_id) return { success: false, message: "ID Sesi tidak valid." };

    await updateAbsenData(_id, data);

    revalidatePath("/dashboard/attendance");
    // Kita revalidate path spesifik detail jika ada
    revalidatePath(`/dashboard/attendance/${_id}`);

    return {
      success: true,
      message: "Data absensi berhasil disimpan dan sesi ditutup ✅",
    };
  } catch (error: any) {
    console.error("🔥 Action Error [updateAbsenDataAction]:", error.message);

    if (error.message === "SESSION_ID_REQUIRED") {
      return { success: false, message: "ID Sesi wajib disertakan." };
    }

    return {
      success: false,
      message: "Gagal memperbarui data absen ke server.",
    };
  }
}

/**
 * ACTION: HAPUS SESI
 */
export async function deleteSessionAction(_id: string) {
  try {
    if (!_id) return { success: false, message: "ID Sesi tidak ditemukan." };

    await deleteSession(_id);

    revalidatePath("/dashboard/attendance");
    return { success: true, message: "Sesi absensi berhasil dihapus 🗑️" };
  } catch (error: any) {
    console.error("🔥 Action Error [deleteSessionAction]:", error.message);
    return { success: false, message: "Gagal menghapus sesi." };
  }
}
