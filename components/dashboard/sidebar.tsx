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
import { LogoutModal } from "../ui/logoutmodal";
import { Button } from "../ui/button";

export function AdminSidebarContent({ activeTab, setActiveTab, close }: any) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // 1. Ambil role dari session saat komponen dimuat
  useEffect(() => {
    const session = sessionStorage.getItem("userSession");
    if (session) {
      const userData = JSON.parse(session);
      setUserRole(userData.role);
    }
  }, []);

  // 2. Definisi Menu
  const menuAdmin = [
    { id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
    { id: "guru", label: "DATA GURU", icon: UserCheck },
    { id: "santri", label: "DATA SANTRI", icon: GraduationCap },
  ];

  const menuGuru = [
    { id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
    { id: "santri", label: "DATA SANTRI", icon: GraduationCap },
    { id: "absensi", label: "PRESENSI", icon: ListCheck },
  ];

  // Tentukan menu mana yang ditampilkan
  const MENU_ITEMS = userRole === "guru" ? menuGuru : menuAdmin;

  // Jika role belum terdeteksi, jangan rendernya dulu untuk menghindari "flicker"
  if (!userRole) return null;

  return (
    <>
      {/* HEADER SIDEBAR */}
      <div className="flex items-center gap-3 mb-10">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors ${userRole === "admin" ? "bg-indigo-600" : "bg-teal-600"}`}
        >
          <ShieldCheck size={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-lg tracking-tighter leading-none">
            {userRole === "guru" ? "SIM SANTRI" : "ADMIN PANEL"}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {userRole} Mode
          </span>
        </div>
      </div>

      {/* NAVIGATION DENGAN LOOPING */}
      <nav className="space-y-2 flex-1">
        {MENU_ITEMS.map((item) => (
          <Button
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.id}
            onClick={() => {
              setActiveTab(item.id);
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
}
