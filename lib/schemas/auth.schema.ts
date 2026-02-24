import { z } from "zod";

export const loginSchema = z.object({
  username_email: z.string().min(4, "Username/Email minimal 4 karakter"),
  password: z.string().min(4, "Password minimal 4 karakter"),
  role: z.enum(["admin", "guru"]),
  remember: z.boolean().optional(), // Tambahkan ini
});

export type LoginInput = z.infer<typeof loginSchema>;

// Definisikan bentuk data user yang valid
export const UserSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Nama tidak boleh kosong"),
  role: z.enum(["admin", "guru"]), // Membatasi role yang diizinkan
});

// Otomatis buat Type dari Skema (Sangat berguna untuk useState)
export type UserData = z.infer<typeof UserSchema>;
