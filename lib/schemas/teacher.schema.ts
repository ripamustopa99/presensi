import { z } from "zod";

export const teacherSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().optional(),
  role: z.enum(["guru", "admin"]), // Hapus .default() di sini jika ingin lebih ketat di TS
});

export type TeacherInput = z.infer<typeof teacherSchema>;
