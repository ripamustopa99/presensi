"use server";

import { redirect } from "next/navigation";

import { cookies } from "next/headers";
import { encrypt } from "../auth-jwt";
import { findUserByAccount } from "../services/auth.service";
import {
  loginSchema,
  LoginInput,
  UserData,
  UserDb,
} from "../schemas/auth.schema"; // Import interface UserData

export async function handleLoginAction(data: LoginInput) {
  try {
    // 1. Validasi Schema
    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, message: "Format input tidak valid" };
    }

    const { username_email, password, role, remember } = validation.data;

    // 2. Cari User & Type Casting agar tidak merah
    // Kita asumsikan findUserByAccount mengembalikan data sesuai interface UserData atau null
    const user = (await findUserByAccount(username_email)) as UserDb | null;

    // 3. Cek Keberadaan User & Password (Timing Safe-ish)
    // Digabung agar hacker tidak tahu mana yang salah: username atau password
    if (!user || user.password !== password || user.role !== role) {
      return {
        success: false,
        message: "Akun tidak ditemukan, role tidak sesuai, atau password salah",
      };
    }

    // 4. Login Sukses - Siapkan Durasi Sesi
    // Samakan dengan logika di auth-jwt.ts
    const expireTime = remember ? "30d" : "24h";
    const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    // 5. Buat Sesi Payload
    const sessionPayload: UserData = {
      _id: user._id,
      name: user.name,
      role: user.role,
    };

    // Pastikan fungsi encrypt menerima parameter expireTime seperti yang kita bahas sebelumnya
    const session = await encrypt(sessionPayload, expireTime);

    // 6. Simpan ke Cookie
    const cookieStore = await cookies();
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAge,
      path: "/",
    });

    return { success: true, role: user.role }; // Kembalikan role untuk redirect di client
  } catch (error) {
    console.error("🔥 Auth Error:", error);
    return { success: false, message: "Terjadi kesalahan sistem saat login" };
  }
}

export async function LogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  // Pro Tip: Gunakan redirect hanya di akhir logic
  redirect("/sign");
}
