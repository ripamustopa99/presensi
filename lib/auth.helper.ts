"use server";
import { cookies } from "next/headers";
import { decrypt } from "./auth-jwt";
import { UserSchema, UserData } from "./schemas/auth.schema";

export async function getAuthData(): Promise<UserData | null> {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;

  const payload = await decrypt(session);

  // Validasi data mentah dari JWT menggunakan Zod
  const result = UserSchema.safeParse(payload);

  if (!result.success) {
    console.error("Data session tidak valid:", result.error);
    return null;
  }
  return result.data; // Data sudah ter-verify dan bertipe UserData
}
