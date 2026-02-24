"use client";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

export function AuthVisualSide({
  isLogin,
  role,
  gradientSide,
  accentColor,
  accentBg,
  toggleRole,
}: any) {
  return (
    <motion.div
      initial={false}
      animate={{ x: isLogin ? "-100%" : "0%" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`absolute top-0 left-1/2 w-1/2 h-full z-20 hidden md:block overflow-hidden bg-gradient-to-br ${gradientSide} transition-all duration-1000`}
    >
      <div className="relative h-full flex flex-col items-center justify-center text-white p-12 text-center">
        <motion.div
          key={role}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-[0.3em]">
            <Sparkles size={14} className={accentColor} /> Official Platform
          </div>
          <h2 className="text-4xl font-black uppercase leading-tight">
            AL-MUSTOFA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30 font-light italic">
              Nangorak
            </span>
          </h2>
          <p className="text-xs font-medium opacity-50 max-w-xs mx-auto leading-relaxed uppercase tracking-widest">
            Sistem Manajemen Terpadu Pondok Pesantren
          </p>
          <div className="pt-10">
            <button
              onClick={toggleRole}
              className="group flex items-center gap-4 px-10 py-4 bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-2xl font-black text-[10px] hover:bg-white hover:text-slate-900 transition-all uppercase tracking-[0.2em] mx-auto shadow-2xl"
            >
              {role === "admin" && <ChevronLeft size={16} />}
              Masuk Sebagai {role === "guru" ? "Admin" : "Guru"}
              {role === "guru" && <ChevronRight size={16} />}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
