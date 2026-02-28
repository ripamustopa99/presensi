// // import { z } from "zod";

// // export const sessionSchema = z.object({
// //   _id: z.string().optional(),
// //   author_id: z.string(),
// //   authorName: z.string(),
// //   class: z.string().min(1, "Pilih kelas"),
// //   date: z.string().min(1, "Pilih tanggal"),
// //   status: z.enum(["pending", "selesai"]).default("pending"),
// //   attendance_data: z
// //     .record(
// //       z.object({
// //         status: z.string(),
// //         note: z.string().optional(),
// //       }),
// //     )
// //     .default({}),
// // });

// // export type SessionInput = z.infer<typeof sessionSchema>;
// import { z } from "zod";

// export const sessionSchema = z.object({
//   _id: z.string().optional(),

//   // Gunakan camelCase agar sinkron dengan ProfileService kita
//   authorId: z.string().min(1, "ID pembuat wajib ada"),
//   authorName: z.string().min(1, "Nama pembuat wajib ada"),

//   // Ganti 'class' menjadi 'classId' agar sinkron dengan yang kita bahas tadi
//   // Dan tambahkan 'className' untuk cache data (agar tidak perlu fetch data kelas terus menerus)
//   classId: z.string().min(1, "Pilih kelas"),
//   className: z.string().optional(),

//   // Format tanggal ISO string atau YYYY-MM-DD
//   date: z.string().min(1, "Pilih tanggal"),

//   // Status sebaiknya sinkron dengan Service kita: "berlangsung" atau "selesai"
//   status: z.enum(["pending", "selesai"]).default("pending"),

//   // Attendance data lebih aman jika kita definisikan defaultnya
//   attendanceData: z
//     .record(
//       z.string(),
//       z.object({
//         name: z.string(), // Simpan nama siswa di sini untuk audit
//         status: z.enum(["hadir", "sakit", "izin", "alfa"]),
//         note: z.string().optional(),
//       }),
//     )
//     .default({}),

//   createdAt: z.string().optional(),
//   updatedAt: z.string().optional(),
// });

// export type SessionInput = z.infer<typeof sessionSchema>;
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
