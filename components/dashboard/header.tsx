"use client";

import { useState, useEffect } from "react";
import { Menu, Sun, Moon, User } from "lucide-react";
import ProfileSidebar from "../profile";

interface HeaderProps {
  activeTab: string;
  setIsSidebarOpen: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function DashboardHeader({
  activeTab,
  setIsSidebarOpen,
  darkMode,
  setDarkMode,
}: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<{ nama: string; role: string } | null>(null);

  // Ambil data user dari session agar dinamis
  useEffect(() => {
    const session = sessionStorage.getItem("userSession");
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const getTitle = () => {
    switch (activeTab) {
      case "guru":
        return "MANAGEMENT GURU";
      case "santri":
        return "DATABASE SANTRI";
      case "absensi":
        return "E - PRESENSI";
      default:
        return "DASHBOARD UTAMA";
    }
  };

  // Jika data user belum load, tampilkan loading/null
  if (!user) return null;

  return (
    <>
      <header className="p-4 lg:p-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 lg:static border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* SISI KIRI: JUDUL & MENU MOBILE */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-xl lg:text-2xl font-black italic tracking-tighter text-slate-800 dark:text-white">
              {getTitle()}
            </h1>
          </div>

          {/* SISI KANAN: LOGIN LOGIC */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Tombol Dark Mode (Berlaku untuk semua) */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-indigo-600 dark:text-yellow-400 transition-all active:scale-90"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* --- PEMISAH KONDISIONAL --- */}
            {user.role === "admin" ? (
              /* TAMPILAN JIKA ADMIN */
              <div
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-3 pl-4 border-l dark:border-slate-800 cursor-pointer group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-400">Welcome</p>
                  <p className="text-sm font-black dark:text-white group-hover:text-indigo-600 transition-colors">
                    {user.nama}
                  </p>
                </div>
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg group-hover:scale-105 transition-transform">
                  AD
                </div>
              </div>
            ) : (
              /* TAMPILAN JIKA GURU */
              <div
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-3 pl-4 border-l dark:border-slate-800 cursor-pointer group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-400">
                    {user.nama}
                  </p>
                  <p className="text-[10px] text-teal-600 font-black uppercase tracking-tighter">
                    Wali Kelas 10-A
                  </p>
                </div>
                <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100 dark:border-teal-800 group-hover:bg-teal-600 group-hover:text-white transition-all">
                  <User size={20} />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SIDEBAR PROFIL */}
      <ProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUserRole={user.role as "admin" | "guru"}
      />
    </>
  );
}
