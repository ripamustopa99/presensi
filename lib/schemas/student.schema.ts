// import { z } from "zod";

// export const studentSchema = z.object({
//   _id: z.string().min(1, "ID wajib diisi"),

//   name: z
//     .string()
//     .min(3, "Nama minimal 3 huruf")
//     .max(100, "Nama terlalu panjang"),

//   NIS: z.string().regex(/^\d+$/, "NIS harus angka"),

//   class: z.string().min(2, "Kelas wajib diisi"),
// });
// export type StudentInput = z.infer<typeof studentSchema>;
// lib/schemas/student.schema.ts
import { z } from "zod";

export const studentSchema = z.object({
  // Gunakan .optional() agar bisa submit data baru tanpa ID
  _id: z.string().optional(),

  name: z
    .string()
    .min(3, "Nama minimal 3 huruf")
    .max(100, "Nama terlalu panjang"),

  // NIS tetap string tapi divalidasi harus angka
  nis: z.string().min(1, "NIS wajib diisi").regex(/^\d+$/, "NIS harus angka"),

  class: z.string().min(1, "Kelas wajib diisi"),
});

export type StudentInput = z.infer<typeof studentSchema>;
