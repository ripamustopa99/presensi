"use client";

import { useState, useEffect, useMemo } from "react";
import { Menu, User } from "lucide-react";
import { usePathname } from "next/navigation"; // Hook untuk deteksi URL
import ProfileSidebar from "../profile/Profile";
import { UserData } from "@/lib/schemas/auth.schema";
// import { db } from "@/lib/firebase-admin";
// import { doc, onSnapshot } from "firebase/firestore";

interface HeaderProps {
  user: UserData | null;
  setIsSidebarOpen: (val: boolean) => void;
}

const Header = ({ user, setIsSidebarOpen }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dbUser, setDbUser] = useState<any>(null); // State untuk data dari database
  const pathname = usePathname();

  // 1. LOGIKA JUDUL OTOMATIS BERDASARKAN URL (Fix Refresh)
  const title = useMemo(() => {
    const segments = pathname.split("/");
    const lastSegment = segments[segments.length - 1];

    switch (lastSegment) {
      case "teachers":
        return "DATA GURU";
      case "students":
        return "DATA SANTRI";
      case "sessions":
        return "E - PRESENSI";
      case "classes":
        return "DATA KELAS";
      case "dashboard":
        return "DASHBOARD";
      default:
        return "DASHBOARD";
    }
  }, [pathname]);

  // 2. REAL-TIME FETCH DATA DARI DATABASE (Firestore)
  // useEffect(() => {
  //   if (!user?._id) return;

  //   // Tentukan koleksi berdasarkan role (asumsi koleksi: teachers atau admins)
  //   const collectionName = user.role === "admin" ? "admins" : "teachers";

  //   // Gunakan onSnapshot agar data terupdate otomatis jika diubah di database
  //   const unsub = onSnapshot(doc(db, collectionName, user._id), (doc) => {
  //     if (doc.exists()) {
  //       setDbUser(doc.data());
  //     }
  //   });

  //   return () => unsub(); // Clean up listener saat component unmount
  // }, [user?._id, user?.role]);

  if (!user) return null;

  return (
    <>
      <header className="py-4 px-4 lg:px-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 lg:static border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-lg lg:text-xl font-black tracking-tighter text-slate-800 dark:text-white uppercase">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-3 pl-4 border-l dark:border-slate-800 cursor-pointer group"
            >
              <div className="text-right hidden sm:block">
                {/* Mengambil Nama dari Database (Fallback ke user props jika db belum load) */}
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {dbUser?.name || user.name}
                </p>
                {/* Mengambil Wali Kelas dari Database */}
                <p className="text-[10px] text-teal-600 font-black uppercase tracking-tighter">
                  {user?.role === "admin"
                    ? "Sistem Administrator"
                    : // : `Wali Kelas ${dbUser?.className || "---"}`}
                      "Sebagai Guru"}
                  {/* {dbUser?.role === "admin"
                    ? "Sistem Administrator"
                    : // : `Wali Kelas ${dbUser?.className || "---"}`}
                      "Sebagai Guru"} */}
                </p>
              </div>
              <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100 dark:border-teal-800 group-hover:bg-teal-600 group-hover:text-white transition-all overflow-hidden">
                {dbUser?.imageUrl ? (
                  <img
                    src={dbUser.imageUrl}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={20} />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <ProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={user?._id}
      />
    </>
  );
};

export default Header;
