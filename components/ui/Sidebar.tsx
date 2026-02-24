"use client";

import React, { useEffect, useState } from "react";
import {
  UserCheck,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  ListCheck,
} from "lucide-react";
import Link from "next/link";
import { LogoutModal } from "./logoutmodal";

export const Sidebar = ({ user, activeTab, setActiveTab, close }: any) => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // 2. Definisi Menu
  const menuAdmin = [
    { _id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
    { _id: "teachers", label: "DATA GURU", icon: UserCheck },
    { _id: "students", label: "DATA SANTRI", icon: GraduationCap },
    { _id: "classes", label: "DATA KELAS", icon: GraduationCap },
  ];

  const menuGuru = [
    { _id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
    { _id: "students", label: "DATA SANTRI", icon: GraduationCap },
    { _id: "sessions", label: "PRESENSI", icon: ListCheck },
  ];

  const MENU_ITEMS = user?.role === "guru" ? menuGuru : menuAdmin;

  // Jika role belum terdeteksi, jangan rendernya dulu untuk menghindari "flicker"

  return (
    <>
      {/* HEADER SIDEBAR */}
      <div className="flex items-center gap-3 mb-10">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors ${user?.role === "admin" ? "bg-indigo-600" : "bg-teal-600"}`}
        >
          <ShieldCheck size={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-lg tracking-tighter leading-none">
            {user.role === "guru" ? "SIM SANTRI" : "ADMIN PANEL"}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {user.role} Mode
          </span>
        </div>
      </div>

      {/* NAVIGATION DENGAN LOOPING */}
      <nav className="space-y-2 flex-1">
        {MENU_ITEMS.map((item) => (
          <Button
            key={item._id}
            _id={item._id}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item._id}
            onClick={() => {
              setActiveTab(item._id);
              close?.();
            }}
          />
        ))}

        {/* TOMBOL LOGOUT */}
        <button
          onClick={() => setIsLogoutOpen(true)}
          className="flex items-center gap-4 w-full p-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all font-black text-sm mt-4 group"
        >
          <div className="group-hover:rotate-12 transition-transform">
            <LogOut size={20} />
          </div>
          <span>KELUAR</span>
        </button>
      </nav>

      {/* FOOTER SIDEBAR */}
      <div className="pt-6 border-t dark:border-slate-800">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">
          Versi 1.0.4 • 2026
        </p>
      </div>

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
      />
    </>
  );
};
interface SidebarItemProps {
  _id: string;
  label: string;
  icon: React.ElementType; // Untuk komponen Lucide icon
  isActive: boolean;
  onClick: () => void;
}
export function Button({
  _id,
  label,
  icon: Icon,
  isActive,
  onClick,
}: SidebarItemProps) {
  return (
    <Link href={`/dashboard/${_id === "dashboard" ? "" : _id}`}>
      <button
        onClick={onClick}
        className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all 
        ${
          isActive
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
            : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
      >
        <Icon size={20} />
        <span className="font-black text-sm">{label}</span>
      </button>
    </Link>
  );
}
