"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Import Potongan Komponen
import { AuthVisualSide } from "@/components/auth/AuthVisualSide";
import { FormLogin } from "@/components/auth/FormLogin";

export default function AuthPage() {
  const router = useRouter();

  // --- STATES ---
  const [view, setView] = useState<"login" | "forgot">("login");
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"admin" | "guru">("admin");
  // const [error, setError] = useState("");

  // --- HANDLERS ---
  const toggleRole = () => {
    setIsLogin(!isLogin);
    setTimeout(
      () => setRole((prev) => (prev === "guru" ? "admin" : "guru")),
      300,
    );
    // setError("");
  };

  // --- THEME CONFIG ---
  const accentColor = role === "guru" ? "text-teal-400" : "text-indigo-400";
  const accentBg = role === "guru" ? "bg-teal-500" : "bg-indigo-500";
  const gradientSide =
    role === "guru"
      ? "from-teal-600 via-slate-900 to-slate-950"
      : "from-indigo-600 via-slate-900 to-slate-950";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 font-sans selection:bg-indigo-500/30">
      {/* 0. TOMBOL KEMBALI */}
      <motion.button
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/5 text-slate-400 hover:text-white transition-all group"
      >
        <div className="p-1 rounded-lg bg-slate-800 group-hover:bg-indigo-500 transition-colors">
          <ArrowLeft size={16} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          Beranda
        </span>
      </motion.button>

      {/* 1. BACKGROUND GLOW */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none transition-colors duration-1000 ${accentBg}`}
      />

      {/* 2. MAIN CONTAINER */}
      <div className="relative w-full max-w-4xl h-[650px] md:h-[620px] overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row">
        {/* 3. FORM SIDE */}
        <motion.div
          animate={{
            x:
              typeof window !== "undefined" && window.innerWidth < 768
                ? 0
                : !isLogin
                  ? "-100%"
                  : "0%",
          }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 md:left-1/2 w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 bg-slate-900 z-30"
        >
          {/* MOBILE ROLE SWITCHER */}
          {view === "login" && (
            <div className="md:hidden flex w-full p-1 bg-slate-800/80 rounded-2xl border border-slate-700/50 mb-8">
              {["guru", "admin"].map((r) => (
                <button
                  key={r}
                  onClick={() => r !== role && toggleRole()}
                  className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${role === r ? accentBg + " text-white shadow-lg" : "text-slate-500"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
          <FormLogin
            view={view}
            setView={setView}
            accentColor={accentColor}
            accentBg={accentBg}
            role={role}
          />
        </motion.div>

        {/* 4. VISUAL SIDE */}
        <AuthVisualSide
          isLogin={isLogin}
          role={role}
          gradientSide={gradientSide}
          accentColor={accentColor}
          accentBg={accentBg}
          toggleRole={toggleRole}
        />
      </div>
    </div>
  );
}
