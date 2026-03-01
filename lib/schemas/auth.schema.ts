import { z } from "zod";

export const loginSchema = z.object({
  username_email: z.string().min(4, "Username/Email minimal 4 karakter"),
  password: z.string().min(4, "Password minimal 4 karakter"),
  // Tambahkan .catch atau pastikan enum sesuai
  role: z.enum(["admin", "guru"]),
  remember: z.boolean().default(false).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const UserSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Nama tidak boleh kosong"),
  role: z.enum(["admin", "guru"]),
});

export type UserData = z.infer<typeof UserSchema>;

export const UserDbSchema = UserSchema.extend({
  password: z.string(),
});

export type UserDb = z.infer<typeof UserDbSchema>;
