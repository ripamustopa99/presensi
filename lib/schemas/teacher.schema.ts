import { z } from "zod";

// export const teacherSchema = z.object({
//   //   _id: z.string().optional(),
//   //   name: z.string().min(3, "Nama minimal 3 huruf"),
//   //   email: z.string().email("Email tidak valid"),
//   //   username: z.string().min(3, "Username minimal 3 huruf"),
//   //   password: z
//   //     .string()
//   //     .min(4, "Password minimal 4 karakter")
//   //     .optional()
//   //     .or(z.literal("")),
//   //   role: z.enum(["admin", "guru"]).default("guru"),
// });
export const teacherSchema = z.object({
  _id: z.string().optional(), // Pastikan ada .optional()
  name: z.string().min(3, "Nama minimal 3 huruf"),
  email: z.string().email("Email tidak valid"),
  username: z.string().min(3, "Username minimal 3 huruf"),
  // Password dibuat opsional agar tidak error saat edit (saat password dikosongkan)
  password: z.string().optional().or(z.literal("")),
  role: z.enum(["admin", "guru"]).default("guru"),
});

export type TeacherInput = z.infer<typeof teacherSchema>;
