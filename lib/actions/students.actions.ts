// "use server";

// import { StudentInput, studentSchema } from "../schemas/student.schema";
// import { createStudent, deleteStudent } from "@/lib/services/students.services";
// import { revalidatePath } from "next/cache";

// export async function addStudent(formData: StudentInput) {
//   const data = {
//     name: formData.name,
//     NIS: formData.NIS,
//     class: formData.class,
//   };
//   console.log("Received data in action:", data);

//   const parsed = studentSchema.safeParse(data);
//   if (!parsed.success) {
//     return { error: parsed.error.flatten() };
//   }

//   await createStudent(parsed.data);

//   revalidatePath("/dashboard/students");
//   return { success: true, message: "Santri berhasil ditambahkan" };
// }

// export async function deleteStudentAction(id: string) {
//   await deleteStudent(id);
//   revalidatePath("/dashboard/students");
// }
"use server";

import { StudentInput, studentSchema } from "../schemas/student.schema";
import {
  createStudent,
  deleteStudent,
  updateStudent, // Pastikan fungsi ini ada di services
} from "@/lib/services/students.services";
import { revalidatePath } from "next/cache";

// 1. TAMBAH SANTRI
export async function addStudent(formData: StudentInput) {
  try {
    const parsed = studentSchema.safeParse(formData);

    if (!parsed.success) {
      return {
        success: true,
        message: "Validasi gagal",
        errors: parsed.error.flatten(),
      };
    }

    await createStudent(parsed.data);

    revalidatePath("/dashboard/students");
    return { success: true, message: "Santri berhasil ditambahkan" };
  } catch (error) {
    console.error("Add Student Error:", error);
    return { success: false, message: "Gagal menambahkan data ke database" };
  }
}

// 2. UPDATE SANTRI (Fungsi Baru)
export async function updateStudentAction(id: string, formData: StudentInput) {
  try {
    const parsed = studentSchema.safeParse(formData);

    if (!parsed.success) {
      return {
        success: false,
        message: "Validasi gagal",
        errors: parsed.error.flatten(),
      };
    }

    // Pastikan fungsi updateStudent di services menerima (id, data)
    await updateStudent(id, parsed.data);

    revalidatePath("/dashboard/students");
    return { success: true, message: "Data santri berhasil diperbarui" };
  } catch (error) {
    console.error("Update Student Error:", error);
    return { success: false, message: "Gagal memperbarui data" };
  }
}

// 3. HAPUS SANTRI
export async function deleteStudentAction(id: string) {
  try {
    await deleteStudent(id);
    revalidatePath("/dashboard/students");
    return { success: true, message: "Santri berhasil dihapus" };
  } catch (error) {
    console.error("Delete Student Error:", error);
    return { success: false, message: "Gagal menghapus data" };
  }
}
