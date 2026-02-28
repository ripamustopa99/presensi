import { z } from "zod";

// 1. Skema untuk Input Login
export const loginSchema = z.object({
  username_email: z.string().min(4, "Username/Email minimal 4 karakter"),
  password: z.string().min(4, "Password minimal 4 karakter"),
  role: z.enum(["admin", "guru"]),
  remember: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

// 2. Skema untuk Data User (Payload JWT / Session)
// Password TIDAK dimasukkan di sini demi keamanan
export const UserSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Nama tidak boleh kosong"),
  role: z.enum(["admin", "guru"]),
});

export type UserData = z.infer<typeof UserSchema>;

// 3. Skema Lengkap untuk Database (Agar handleLoginAction tidak merah)
// Kita gunakan .extend() agar tidak tulis ulang _id, name, dan role
export const UserDbSchema = UserSchema.extend({
  password: z.string(),
});

export type UserDb = z.infer<typeof UserDbSchema>;

// import { z } from "zod";

// export const loginSchema = z.object({
//   username_email: z.string().min(4, "Username/Email minimal 4 karakter"),
//   password: z.string().min(4, "Password minimal 4 karakter"),
//   role: z.enum(["admin", "guru"]),
//   remember: z.boolean().optional(), // Tambahkan ini
// });

// export type LoginInput = z.infer<typeof loginSchema>;

// // Definisikan bentuk data user yang valid
// export const UserSchema = z.object({
//   _id: z.string(),
//   name: z.string().min(1, "Nama tidak boleh kosong"),
//   role: z.enum(["admin", "guru"]), // Membatasi role yang diizinkan
// });

// // Otomatis buat Type dari Skema (Sangat berguna untuk useState)
// export type UserData = z.infer<typeof UserSchema>;
