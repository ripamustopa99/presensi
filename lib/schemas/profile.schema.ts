import { z } from "zod";

export const ProfileSchema = z.object({
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(50, "Nama terlalu panjang")
    .trim(),
  email: z.string().email("Email tidak valid").toLowerCase().trim(),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username hanya boleh huruf, angka, dan underscore",
    )
    .trim(),
  avatar: z.string().optional().nullable(),
});

export type ProfileFormValues = z.infer<typeof ProfileSchema>;
