import { z } from "zod";

export const sessionSchema = z.object({
  _id: z.string().optional(),
  authorId: z.string().min(1, "ID pembuat wajib ada"),
  authorName: z.string().min(1, "Nama pembuat wajib ada"),
  classId: z.string().min(1, "Pilih kelas"),
  className: z.string().optional(),
  date: z.string().min(1, "Pilih tanggal"),
  status: z.enum(["pending", "selesai"]).default("pending"),

  // KUNCINYA DI SINI: Gunakan attendance_data agar sama dengan database
  attendance_data: z
    .record(
      z.string(),
      z.object({
        name: z.string(),
        status: z.enum(["hadir", "sakit", "izin", "alfa"]),
        note: z.string().optional().nullable(),
      }),
    )
    .default({}),

  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});

export type SessionInput = z.infer<typeof sessionSchema>;
