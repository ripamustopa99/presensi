"use server";
import { redirect } from "next/navigation";
import { encrypt } from "@/lib/auth-jwt";
import { loginSchema, LoginInput } from "@/lib/schemas/auth.schema";
import { cookies } from "next/headers";
import { findUserByAccount } from "@/lib/services/auth.service";
export async function handleLoginAction(data: LoginInput) {
  const validation = loginSchema.safeParse(data);
  if (!validation.success) return { success: false, message: "Format salah" };
  const { username_email, password, role, remember } = validation.data;

  const user = await findUserByAccount(username_email);
  if (user.role !== role) {
    return { success: false, message: "Role tidak sesuai dengan akun ini" };
  }

  if (user && user.password === password && user.role === role) {
    const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
    const session = await encrypt({
      _id: user._id,
      name: user.name,
      role: user.role,
    });

    // 2. Simpan ke Cookie dengan proteksi maksimal
    const cookieStore = await cookies();
    cookieStore.set("session", session, {
      httpOnly: true, // WAJIB: JS tidak bisa baca, aman dari XSS
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAge,
      path: "/",
    });

    return { success: true };
  }

  return {
    success: false,
    message: "Akun tidak ditemukan atau password salah",
  };
}

export async function LogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/sign");
}
// // HTTPS: Saat nanti kamu deploy (misal ke Vercel), pastikan cookie diset ke secure: true. Di kode kita tadi sudah saya pasang otomatis (process.env.NODE_ENV === "production").

// // Database: Kamu tinggal mengganti bagian "Simulasi" di actions.ts dengan query database asli (seperti Prisma, Drizzle, atau Supabase).
// actions/auth.ts
// ("use server");
// import { cookies } from "next/headers";

// export async function loginAction(userData: {
//   id: string;
//   nama: string;
//   role: string;
// }) {
//   // 1. Bungkus data ke JWT
//   const session = await encrypt(userData);

//   // 2. Simpan ke Cookie dengan proteksi maksimal
//   const cookieStore = await cookies();
//   cookieStore.set("session", session, {
//     httpOnly: true, // WAJIB: JS tidak bisa baca, aman dari XSS
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//   });

//   // Redirect ke dashboard
// }
