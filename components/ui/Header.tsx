"use client";

import { useState, useEffect } from "react";
import { Menu, Sun, Moon, User } from "lucide-react";
import ProfileSidebar from "./profile";
import { UserData } from "@/lib/schemas/auth.schema";
interface HeaderProps {
  user: UserData | null;
  activeTab: string;
  setIsSidebarOpen: (val: boolean) => void;
  // darkMode: boolean;
  // setDarkMode: (val: boolean) => void;
}

const Header = ({
  user,
  activeTab,
  setIsSidebarOpen,
  // darkMode,
  // setDarkMode,
}: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const getTitle = () => {
    switch (activeTab) {
      case "teachers":
        return "DATA GURU";
      case "students":
        return "DATA SANTRI";
      case "sessions":
        return "E - PRESENSI";
      case "classes":
        return "DATA KELAS";
      default:
        return "DASHBOARD";
    }
  };
  if (!user) return null;

  return (
    <>
      <header className="py-4 px-4 lg:px-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 lg:static border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* SISI KIRI: JUDUL & MENU MOBILE */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-xl lg:text-2xl font-black  tracking-tighter text-slate-800 dark:text-white">
              {getTitle()}
            </h1>
          </div>

          {/* SISI KANAN: LOGIN LOGIC */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Tombol Dark Mode (Berlaku untuk semua) */}
            {/* <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-indigo-600 dark:text-yellow-400 transition-all active:scale-90"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button> */}

            {/* --- PEMISAH KONDISIONAL --- */}
            <div
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-3 pl-4 border-l dark:border-slate-800 cursor-pointer group"
            >
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-400">{user.name}</p>
                <p className="text-[10px] text-teal-600 font-black uppercase tracking-tighter">
                  Wali Kelas 10-A
                </p>
              </div>
              <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100 dark:border-teal-800 group-hover:bg-teal-600 group-hover:text-white transition-all">
                <User size={20} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SIDEBAR PROFIL */}
      <ProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={user?._id}
      />
    </>
  );
};
export default Header;
