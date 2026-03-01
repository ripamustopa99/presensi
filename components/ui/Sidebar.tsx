"use client";

import React, { useState, useMemo } from "react";
import {
  UserCheck,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  Users,
  ListCheck,
  School,
} from "lucide-react";
import { UserData } from "@/lib/schemas/auth.schema";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook penting untuk deteksi URL
interface SidebarProps {
  user: UserData | null;
  close: any;
  setIsLogoutOpen: (val: boolean) => void;
}
export const Sidebar = ({ user, close, setIsLogoutOpen }: SidebarProps) => {
  const pathname = usePathname(); // Mendapatkan path saat ini, misal: /dashboard/students

  // 1. Logika Menentukan Tab Aktif dari URL
  const activeTab = useMemo(() => {
    // Jika path adalah tepat /dashboard, maka tabnya dashboard
    if (pathname === "/dashboard") return "dashboard";
    // Ambil kata terakhir dari URL (misal: /dashboard/students -> students)
    return pathname.split("/").pop() || "dashboard";
  }, [pathname]);

  // 2. Definisi Menu berdasarkan Role
  const menuAdmin = [
    { _id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
    { _id: "teachers", label: "DATA GURU", icon: GraduationCap },
    { _id: "students", label: "DATA SANTRI", icon: Users },
    { _id: "classes", label: "DATA KELAS", icon: School },
  ];

  const menuGuru = [
    { _id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
    { _id: "students", label: "DATA SANTRI", icon: Users },
    { _id: "sessions", label: "PRESENSI", icon: ListCheck },
  ];

  const MENU_ITEMS = user?.role === "guru" ? menuGuru : menuAdmin;

  return (
    <>
      {/* HEADER SIDEBAR */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors ${
            user?.role === "admin" ? "bg-indigo-600" : "bg-teal-600"
          }`}
        >
          <ShieldCheck size={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-lg tracking-tighter leading-none text-slate-200">
            {user?.role === "guru" ? "SIM SANTRI" : "ADMIN PANEL"}
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            {user?.role || "Teacher"} Mode
          </span>
        </div>
      </div>

      {/* NAVIGATION DENGAN LOOPING */}
      <nav className="space-y-2 flex-1">
        {MENU_ITEMS.map((item) => (
          <SidebarButton
            key={item._id}
            _id={item._id}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item._id}
            onClick={() => close?.()} // Tutup sidebar mobile jika ada fungsi close
          />
        ))}

        {/* TOMBOL LOGOUT */}
        <button
          onClick={() => setIsLogoutOpen(true)}
          className="flex items-center gap-4 w-full p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-black text-sm mt-4 group"
        >
          <div className="group-hover:rotate-12 transition-transform">
            <LogOut size={20} />
          </div>
          <span>KELUAR</span>
        </button>
      </nav>

      {/* FOOTER SIDEBAR */}
      <div className="pt-6 border-t border-slate-800">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 text-center">
          Versi 1.0.4 • 2026
        </p>
      </div>
    </>
  );
};

// --- KOMPONEN BUTTON TERPISAH ---

interface SidebarItemProps {
  _id: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}

function SidebarButton({
  _id,
  label,
  icon: Icon,
  isActive,
  onClick,
}: SidebarItemProps) {
  // Tentukan href berdasarkan _id
  const href = _id === "dashboard" ? "/dashboard" : `/dashboard/${_id}`;

  return (
    <Link href={href} onClick={onClick} className="block w-full">
      <div
        className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-200 cursor-pointer
        ${
          isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        }`}
      >
        <Icon size={20} className={isActive ? "animate-pulse" : ""} />
        <span className="font-black text-sm tracking-wide">{label}</span>
      </div>
    </Link>
  );
}
