"use server";

import { revalidatePath } from "next/cache";
import { teacherSchema, TeacherInput } from "../schemas/teacher.schema";
import {
  createTeacher,
  deleteTeacher,
  updateTeacher,
} from "@/lib/services/teacher.services";

export async function saveTeacherAction(formData: TeacherInput) {
  try {
    // 1. Validasi Schema (Zod)
    const parsed = teacherSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        message: "Format data tidak valid. Silakan cek kembali.",
      };
    }

    if (parsed.data._id) {
      // 2. Update existing teacher
      await updateTeacher(parsed.data._id, parsed.data);
    } else {
      // 3. Create new teacher
      await createTeacher(parsed.data);
    }

    revalidatePath("/dashboard/teachers");
    return { success: true, message: "Data guru berhasil disimpan ✨" };
  } catch (error: any) {
    // 4. Mapping Error dari Service Pro ke UI
    console.error("Action Error:", error.message);

    if (error.message === "USERNAME_ALREADY_EXISTS") {
      return {
        success: false,
        message: "Username sudah digunakan. Pilih username lain.",
      };
    }

    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return {
        success: false,
        message: "Email sudah terdaftar. Gunakan email lain.",
      };
    }

    if (error.message === "TEACHER_NOT_FOUND") {
      return {
        success: false,
        message: "Data guru tidak ditemukan di server.",
      };
    }

    // Default error
    return {
      success: false,
      message: "Gagal menyimpan data karena gangguan teknis.",
    };
  }
}

export async function deleteTeacherAction(id: string) {
  try {
    if (!id) return { success: false, message: `ID tidak valid${id}` };

    await deleteTeacher(id);

    revalidatePath("/dashboard/teachers");
    return { success: true, message: "Data guru berhasil dihapus" };
  } catch (error) {
    return { success: false, message: "Gagal menghapus data" };
  }
}

// "use server";

// import { revalidatePath } from "next/cache";
// import { teacherSchema, TeacherInput } from "../schemas/teacher.schema";
// import {
//   createTeacher,
//   deleteTeacher,
//   updateTeacher,
// } from "@/lib/services/teacher.services";

// export async function saveTeacherAction(formData: TeacherInput) {
//   try {
//     const parsed = teacherSchema.safeParse(formData);
//     if (!parsed.success) return { success: false, message: "Cek inputan anda" };

//     if (parsed.data._id) {
//       await updateTeacher(parsed.data._id, parsed.data);
//     } else {
//       await createTeacher(parsed.data);
//     }

//     revalidatePath("/dashboard/teachers");
//     return { success: true, message: "Data berhasil disimpan" };
//   } catch (error) {
//     return { success: false, message: "Terjadi kesalahan sistem" };
//   }
// }

// export async function deleteTeacherAction(_id: string) {
//   await deleteTeacher(_id);
//   revalidatePath("/dashboard/teachers");
// }
