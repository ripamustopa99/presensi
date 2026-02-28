"use server";

import { revalidatePath } from "next/cache";
import { ProfileService } from "../services/profile.services";
import { ProfileSchema } from "../schemas/profile.schema";

/**
 * ACTION: MENGAMBIL DATA PROFIL
 * Digunakan untuk fetching data awal di form profil
 */
export async function getUserDataAction(userId: string) {
  if (!userId) return { success: false, message: "ID User diperlukan" };

  try {
    const user = await ProfileService.getUserById(userId);

    if (!user) {
      return {
        success: false,
        message: "Pengguna tidak ditemukan di database",
      };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("🔥 Action Error [getUserDataAction]:", error);
    return { success: false, message: "Gagal mengambil data dari server" };
  }
}

/**
 * ACTION: UPDATE PROFIL
 * Terintegrasi dengan Service Pro untuk menangani duplikat Email/Username
 */
export async function updateProfileAction(userId: string, rawData: any) {
  try {
    // 1. Validasi Input dengan Zod
    const validated = ProfileSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: "Validasi gagal: Silakan periksa format inputan Anda.",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    // 2. Kirim data ke Service Pro
    // Service akan melakukan pengecekan duplikat Email & Username di Firestore
    await ProfileService.updateUser(userId, validated.data);

    // 3. Revalidasi Layout
    // "layout" memastikan Header, Sidebar, dan Avatar di semua halaman terupdate otomatis
    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Profil Anda berhasil diperbarui! ✨",
    };
  } catch (error: any) {
    console.error("🔥 Action Error [updateProfileAction]:", error.message);

    // 4. Mapping Error Spesifik dari Service Pro ke UI Bahasa Indonesia
    if (error.message === "EMAIL_ALREADY_IN_USE") {
      return {
        success: false,
        message: "Email tersebut sudah digunakan oleh pengguna lain.",
      };
    }

    if (error.message === "USERNAME_ALREADY_IN_USE") {
      return {
        success: false,
        message: "Username tersebut tidak tersedia. Silakan pilih yang lain.",
      };
    }

    if (error.message === "USER_NOT_FOUND") {
      return {
        success: false,
        message: "Gagal: Akun Anda tidak ditemukan di sistem.",
      };
    }

    // Default error jika terjadi kendala jaringan/database
    return {
      success: false,
      message: "Terjadi kesalahan sistem saat menyimpan perubahan.",
    };
  }
}

// "use server";

// import { revalidatePath } from "next/cache";
// import { ProfileService } from "../services/profile.services";
// import { ProfileSchema } from "../schemas/profile.schema";

// // 1. Ambil data awal - Menggunakan _id
// export async function getUserDataAction(userId: string) {
//   try {
//     const user = await ProfileService.getUserById(userId);
//     if (!user) return { success: false, message: "User tidak ditemukan" };

//     return { success: true, data: user };
//   } catch (error) {
//     return { success: false, message: "Terjadi kesalahan pada server" };
//   }
// }

// // 2. Update data - userId di sini adalah _id
// export async function updateProfileAction(userId: string, rawData: any) {
//   try {
//     // Validasi input via Zod
//     // Pastikan di Zod Schema kamu menggunakan field 'name' jika ingin sinkron dengan DB
//     const validated = ProfileSchema.safeParse(rawData);

//     if (!validated.success) {
//       return {
//         success: false,
//         errors: validated.error.flatten().fieldErrors,
//       };
//     }

//     // Kirim userId (_id) dan data yang sudah tervalidasi ke Service
//     await ProfileService.updateUser(userId, validated.data);

//     // Revalidasi agar UI client mendapatkan data terbaru
//     revalidatePath("/");

//     return { success: true, message: "Profil berhasil diperbarui!" };
//   } catch (error) {
//     console.error("Update Error:", error);
//     return { success: false, message: "Gagal menyimpan perubahan ke database" };
//   }
// }
