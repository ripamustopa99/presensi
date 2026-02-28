"use server";
import { cookies } from "next/headers";
import { decrypt } from "./auth-jwt";
import { UserSchema, UserData } from "./schemas/auth.schema";

export async function getAuthData(): Promise<UserData | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) return null;

    const payload = await decrypt(session);

    // Pro: Jika decrypt gagal (token expired/invalid), payload akan null
    if (!payload) return null;

    // Validasi data mentah dari JWT menggunakan Zod
    const result = UserSchema.safeParse(payload);

    if (!result.success) {
      // Pro: Log error hanya di development agar tidak membebani log produksi
      if (process.env.NODE_ENV !== "production") {
        console.error("🔒 Session Integrity Error:", result.error.flatten());
      }
      return null;
    }

    return result.data;
  } catch (error) {
    // Pro: Menangani error tak terduga (misal: gagal akses cookie)
    console.error("🔥 Auth Data Fetch Error:", error);
    return null;
  }
}

// "use server";
// import { cookies } from "next/headers";
// import { decrypt } from "./auth-jwt";
// import { UserSchema, UserData } from "./schemas/auth.schema";

// export async function getAuthData(): Promise<UserData | null> {
//   const session = (await cookies()).get("session")?.value;
//   if (!session) return null;

//   const payload = await decrypt(session);

//   // Validasi data mentah dari JWT menggunakan Zod
//   const result = UserSchema.safeParse(payload);

//   if (!result.success) {
//     console.error("Data session tidak valid:", result.error);
//     return null;
//   }
//   return result.data; // Data sudah ter-verify dan bertipe UserData
// }
