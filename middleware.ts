// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("session_token")?.value;
//   const role = request.cookies.get("user_role")?.value;

//   const { pathname } = request.nextUrl;

//   // 1. Biarkan file statis dan public Assets lewat (PENTING)
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname.startsWith("/static") ||
//     pathname.includes(".") // file seperti favicon.ico, logo.png
//   ) {
//     return NextResponse.next();
//   }

//   const isAuthPage = pathname === "/sign";

//   // 2. LOGIKA REDIRECT JIKA SUDAH LOGIN
//   if (isAuthPage && token) {
//     const target = role === "admin" ? "/admin" : "/dashboard";
//     return NextResponse.redirect(new URL(target, request.url));
//   }

//   // 3. PROTEKSI FOLDER /ADMIN
//   if (pathname.startsWith("/admin")) {
//     if (!token) return NextResponse.redirect(new URL("/sign", request.url));
//     if (role !== "admin")
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   // 4. PROTEKSI FOLDER /DASHBOARD (GURU)
//   if (pathname.startsWith("/dashboard")) {
//     if (!token) return NextResponse.redirect(new URL("/sign", request.url));
//     if (role !== "guru")
//       return NextResponse.redirect(new URL("/admin", request.url));
//   }

//   // 5. HALAMAN LAIN (Termasuk 404)
//   // Biarkan Next.js yang menentukan apakah ini 404 atau bukan di sisi Page
//   return NextResponse.next();
// }

// export const config = {
//   // Pastikan matcher mencakup semua halaman agar 404 ter-cover
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Kunci ini harus sama dengan yang di lib/auth-jwt.ts
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "kunci-rahasia-pesantren-123",
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ambil token dari cookie
  const session = request.cookies.get("session")?.value;

  // 2. Tentukan rute yang harus dilindungi (Private Routes)
  const isDashboard = pathname.startsWith("/dashboard");
  // const isAdminPage = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/sign";

  // LOGIKA PROTEKSI:

  // A. Jika mau masuk dashboard tapi tidak ada session
  if (isDashboard && !session) {
    return NextResponse.redirect(new URL("/sign", request.url));
  }

  if (session) {
    try {
      // B. Verifikasi Token
      const { payload } = await jwtVerify(session, SECRET_KEY);

      // C. Proteksi Role (Contoh: Hanya admin yang boleh masuk /admin)
      // if (isAdminPage && payload.role !== "admin") {
      //   return NextResponse.redirect(new URL("/dashboard", request.url));
      // }

      // D. Jika sudah login, jangan boleh balik ke halaman login
      if (isLoginPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (err) {
      // Jika token expired atau dimanipulasi, hapus cookie dan lempar ke login
      const response = NextResponse.redirect(new URL("/sign", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  return NextResponse.next();
}

// 3. Tentukan rute mana saja yang akan diproses middleware ini
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/sign"],
};
