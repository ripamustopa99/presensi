"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 blur-3xl bg-indigo-500/20 rounded-full" />
          <AlertTriangle
            size={80}
            className="text-indigo-500 relative mx-auto"
          />
        </div>

        <h1 className="text-6xl font-black text-white tracking-tighter">404</h1>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-200 uppercase tracking-widest">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto uppercase font-medium leading-relaxed">
            Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-950 transition-all shadow-2xl"
        >
          <Home size={14} /> Kembali ke Beranda
        </Link>
      </motion.div>
    </div>
  );
}
