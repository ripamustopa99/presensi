import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "kunci-rahasia-pesantren-123",
);

/**
 * PRO: Encrypt dengan expiration dinamis
 * Agar bisa mendukung fitur "Remember Me" (30 hari) atau sesi standar (1 hari)
 */
export async function encrypt(payload: any, expireTime: string = "24h") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expireTime) // Diubah jadi dinamis
    .sign(SECRET_KEY);
}

export async function decrypt(token: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    // Pro: Bisa membedakan error (expired vs invalid) jika diperlukan di log
    return null;
  }
}
