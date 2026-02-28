import { z } from "zod";

export const classSchema = z.object({
  _id: z.string().optional(),
  class_name: z
    .string()
    .min(1, "Nama kelas harus diisi")
    .regex(/^[0-9]{1,2}-[A-Z]$/, {
      message: "Format kelas harus berupa Angka-Huruf (contoh: 10-A, 11-B)",
    }),
  wali: z.string().min(3, "Nama wali kelas minimal 3 huruf"),
});

export type ClassInput = z.infer<typeof classSchema>;
