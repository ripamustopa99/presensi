"use client";
import { LogOut, X, AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Modal } from "./modal";
interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter();
  // Di dalam fungsi handleLogout kamu
  const handleLogout = () => {
    sessionStorage.removeItem("userSession");
    localStorage.removeItem("userSession"); // jika pakai localstorage
    router.replace("/signin");
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mau Istirahat?">
      <div className="text-center pb-4">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogOut size={32} strokeWidth={2.5} />
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Sesi Anda akan diakhiri. Jangan lupa pastikan semua data absensi sudah
          tersimpan sebelum keluar.
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-rose-500 text-white font-black text-sm shadow-lg shadow-rose-200 dark:shadow-none hover:bg-rose-600 transition-all active:scale-95"
        >
          <Trash2 size={18} />
          Ya, Logout Sekarang
        </button>
        <button
          onClick={onClose}
          className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-sm hover:bg-slate-200 transition-all"
        >
          Nanti Saja
        </button>
        <div className="mt-6 mx-auto flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
          <AlertTriangle size={12} className="text-amber-500" />
          Sesi Terenkripsi
        </div>
      </div>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors hidden sm:block"
      >
        <X size={20} />
      </button>
    </Modal>
  );
}
