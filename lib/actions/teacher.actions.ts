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
    const parsed = teacherSchema.safeParse(formData);
    if (!parsed.success) return { success: false, message: "Cek inputan anda" };

    if (parsed.data._id) {
      await updateTeacher(parsed.data._id, parsed.data);
    } else {
      await createTeacher(parsed.data);
    }

    revalidatePath("/dashboard/teachers");
    return { success: true, message: "Data berhasil disimpan" };
  } catch (error) {
    return { success: false, message: "Terjadi kesalahan sistem" };
  }
}

export async function deleteTeacherAction(id: string) {
  await deleteTeacher(id);
  revalidatePath("/dashboard/teachers");
}
