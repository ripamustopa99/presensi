import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "kunci-rahasia-pesantren-123",
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("session")?.value;

  const isLoginPage = pathname === "/sign";
  const isDashboardPage = pathname.startsWith("/dashboard");

  // 1. Redirect jika tidak ada session saat akses dashboard
  if (isDashboardPage && !session) {
    return NextResponse.redirect(new URL("/sign", request.url));
  }

  if (session) {
    try {
      const { payload } = await jwtVerify(session, SECRET_KEY);
      const role = payload.role; // Ambil role dari JWT

      // 2. Cegah akses ke login jika sudah punya session
      if (isLoginPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // 3. PROTEKSI ROLE (RBAC - Role Based Access Control)

      // A. Path yang HANYA boleh diakses ADMIN
      const adminOnlyPaths = ["/dashboard/teachers", "/dashboard/classes"];
      const isAdminPath = adminOnlyPaths.some((path) =>
        pathname.startsWith(path),
      );

      if (isAdminPath && role !== "admin") {
        // Jika guru mencoba akses menu admin, tendang ke dashboard utama
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // B. Path yang HANYA boleh diakses GURU
      const guruOnlyPaths = ["/dashboard/sessions"];
      const isGuruPath = guruOnlyPaths.some((path) =>
        pathname.startsWith(path),
      );

      if (isGuruPath && role !== "guru") {
        // Jika admin mencoba akses menu khusus guru (misal: sesi absensi guru lain)
        // Opsional: Admin biasanya boleh lihat, tapi kalau mau dilarang:
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (err) {
      // Jika token expired atau rusak
      const response = NextResponse.redirect(new URL("/sign", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign"],
};
// middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// // Kunci ini harus sama dengan yang di lib/auth-jwt.ts
// const SECRET_KEY = new TextEncoder().encode(
//   process.env.JWT_SECRET || "kunci-rahasia-pesantren-123",
// );

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // 1. Ambil token dari cookie
//   const session = request.cookies.get("session")?.value;

//   // 2. Tentukan rute yang harus dilindungi (Private Routes)
//   const isDashboard = pathname.startsWith("/dashboard");
//   // const isAdminPage = pathname.startsWith("/admin");
//   const isLoginPage = pathname === "/sign";

//   // LOGIKA PROTEKSI:

//   // A. Jika mau masuk dashboard tapi tidak ada session
//   if (isDashboard && !session) {
//     return NextResponse.redirect(new URL("/sign", request.url));
//   }

//   if (session) {
//     try {
//       // B. Verifikasi Token
//       const { payload } = await jwtVerify(session, SECRET_KEY);

//       // C. Proteksi Role (Contoh: Hanya admin yang boleh masuk /admin)
//       // if (isAdminPage && payload.role !== "admin") {
//       //   return NextResponse.redirect(new URL("/dashboard", request.url));
//       // }

//       // D. Jika sudah login, jangan boleh balik ke halaman login
//       if (isLoginPage) {
//         return NextResponse.redirect(new URL("/dashboard", request.url));
//       }
//     } catch (err) {
//       // Jika token expired atau dimanipulasi, hapus cookie dan lempar ke login
//       const response = NextResponse.redirect(new URL("/sign", request.url));
//       response.cookies.delete("session");
//       return response;
//     }
//   }

//   return NextResponse.next();
// }

// // 3. Tentukan rute mana saja yang akan diproses middleware ini
// export const config = {
//   matcher: ["/dashboard/:path*", "/admin/:path*", "/sign"],
// };
