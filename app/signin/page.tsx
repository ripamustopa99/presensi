"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  UserCog,
  GraduationCap,
  Lock,
  Mail,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();

  // --- STATES ---
  const [view, setView] = useState<"login" | "forgot">("login");
  const [isLogin, setIsLogin] = useState(true); // Untuk kontrol animasi slide di Desktop
  const [role, setRole] = useState<"admin" | "guru">("guru");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Form States
  const [sessions, setSessions] = useState<any[]>([]);
  const [username_email, setUsername_Email] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  // --- 1. FETCH DATA DARI API (FILE .JSON) ---
  const loadDataFromFile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/attendance");
      const data = await response.json();
      setSessions(data.users || []);
    } catch (error) {
      console.error("Gagal memuat data dari file:", error);
      // setAlert({ msg: "Gagal terhubung ke database file", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIK REMEMBER ME ---
  useEffect(() => {
    loadDataFromFile();
    const savedUser = localStorage.getItem("rememberedUser");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUsername_Email(parsed.account);
      setRemember(true);
    }
  }, []);

  // --- HANDLERS ---
  const toggleRole = () => {
    setIsLogin(!isLogin);
    setTimeout(() => {
      setRole((prev) => (prev === "guru" ? "admin" : "guru"));
    }, 300);
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const user = sessions.find(
      (u) =>
        (u.email === username_email || u.username === username_email) &&
        u.password === password &&
        u.role === role,
    );

    if (user) {
      sessionStorage.setItem("userSession", JSON.stringify(user));
      if (remember) {
        localStorage.setItem(
          "rememberedUser",
          JSON.stringify({ account: username_email }),
        );
      } else {
        localStorage.removeItem("rememberedUser");
      }
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    } else {
      setError(
        `Akses ditolak. Akun tidak ditemukan di data ${role.toUpperCase()}.`,
      );
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi kirim email
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setView("login");
    }, 4000);
  };

  // --- THEME CONFIG ---
  const accentColor = role === "guru" ? "text-teal-400" : "text-indigo-400";
  const accentBg = role === "guru" ? "bg-teal-500" : "bg-indigo-500";
  const glowClass =
    role === "guru"
      ? "shadow-[0_0_25px_rgba(20,184,166,0.3)]"
      : "shadow-[0_0_25px_rgba(99,102,241,0.3)]";
  const gradientSide =
    role === "guru"
      ? "from-teal-600 via-slate-900 to-slate-950"
      : "from-indigo-600 via-slate-900 to-slate-950";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 font-sans selection:bg-indigo-500/30">
      {/* 0. TOMBOL KEMBALI KE LANDING PAGE */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all group shadow-2xl"
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
      <div className="relative w-full max-w-4xl h-[650px] md:h-[620px] overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row">
        {/* 3. FORM SIDE */}
        <motion.div
          initial={false}
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
          {/* MOBILE ROLE SWITCHER (Only shown in Login View) */}
          {view === "login" && (
            <div className="md:hidden flex w-full p-1 bg-slate-800/80 rounded-2xl border border-slate-700/50 mb-8">
              {["guru", "admin"].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    if (role !== r) toggleRole();
                  }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${role === r ? (r === "guru" ? "bg-teal-500" : "bg-indigo-500") + " text-white shadow-lg" : "text-slate-500"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {view === "login" ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-sm"
              >
                <LoginHeader
                  color={accentColor}
                  icon={role === "guru" ? <GraduationCap /> : <ShieldCheck />}
                  title={role === "guru" ? "Portal Guru" : "Admin Control"}
                />

                <form onSubmit={handleLogin} className="space-y-4">
                  <InputGroup
                    icon={<Mail />}
                    type="text"
                    placeholder="Username / Email"
                    value={username_email}
                    onChange={setUsername_Email}
                    accentColor={accentColor}
                  />
                  <InputGroup
                    icon={<Lock />}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={setPassword}
                    accentColor={accentColor}
                  />

                  {error && <ErrorMessage message={error} />}

                  <div className="flex justify-between items-center px-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="peer hidden"
                      />
                      <div className="w-4 h-4 rounded border border-slate-700 bg-slate-800 peer-checked:bg-indigo-500 transition-all flex items-center justify-center">
                        <CheckCircle2
                          size={10}
                          className="text-white opacity-0 peer-checked:opacity-100"
                        />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300">
                        Ingat saya
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className={`text-[10px] font-black uppercase tracking-widest text-slate-500 hover:${accentColor} transition-colors`}
                    >
                      Lupa?
                    </button>
                  </div>

                  <button
                    disabled={isLoading}
                    className={`w-full py-4 ${accentBg} ${glowClass} text-white rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Autentikasi Sekarang <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="forgot-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-sm"
              >
                <div className="flex flex-col items-center mb-10 text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-slate-800 border border-slate-700 text-orange-400`}
                  >
                    <Send size={30} />
                  </div>
                  <h2 className="text-2xl font-black tracking-tighter uppercase text-white">
                    Reset Password
                  </h2>
                  <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-widest leading-relaxed px-4">
                    Kami akan mengirimkan instruksi pemulihan ke email Anda.
                  </p>
                </div>

                {isSent ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem] text-center">
                    <CheckCircle2
                      size={40}
                      className="text-emerald-500 mx-auto mb-3"
                    />
                    <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">
                      Email Terkirim!
                    </p>
                    <p className="text-slate-500 text-[9px] mt-2 font-medium">
                      Cek folder inbox atau spam Anda.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-6">
                    <InputGroup
                      icon={<Mail />}
                      type="email"
                      placeholder="Masukkan Email Terdaftar"
                      value={username_email}
                      onChange={setUsername_Email}
                      accentColor="text-orange-400"
                    />
                    <button
                      disabled={isLoading}
                      className={`w-full py-4 bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)] text-white rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2`}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Kirim Instruksi"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("login")}
                      className="w-full text-center text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                      Kembali Login
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 4. VISUAL SIDE (Desktop) */}
        <motion.div
          initial={false}
          animate={{ x: isLogin ? "-100%" : "0%" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className={`absolute top-0 left-1/2 w-1/2 h-full z-20 hidden md:block overflow-hidden bg-gradient-to-br ${gradientSide} transition-all duration-1000`}
        >
          <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
          <div className="relative h-full flex flex-col items-center justify-center text-white p-12 text-center">
            <motion.div
              key={role}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-black tracking-[0.3em] uppercase text-white/90">
                <Sparkles size={14} className={accentColor} /> Official Platform
              </div>
              <h2 className="text-4xl font-black leading-tight tracking-tighter uppercase">
                AL-MUSTOFA <br />{" "}
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
          <div
            className={`absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-[120px] opacity-20 ${accentBg}`}
          />
        </motion.div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function LoginHeader({ icon, title, color }: any) {
  return (
    <div className="flex flex-col items-center mb-10 text-center">
      <div
        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-5 bg-slate-800/50 border border-slate-700/50 shadow-2xl ${color}`}
      >
        {React.cloneElement(icon, { size: 30 })}
      </div>
      <h2 className="text-2xl font-black tracking-tighter uppercase text-white">
        {title}
      </h2>
      <div
        className={`h-1.5 w-10 rounded-full mt-3 ${color.replace("text", "bg")}`}
      />
    </div>
  );
}

function InputGroup({
  icon,
  type,
  placeholder,
  value,
  onChange,
  accentColor,
}: any) {
  return (
    <div className="relative group">
      <div
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:${accentColor} transition-colors`}
      >
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-white pl-12 pr-4 py-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl outline-none focus:ring-4 ring-white/5 transition-all font-bold text-sm placeholder:text-slate-600 placeholder:uppercase placeholder:text-[10px]"
      />
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-[10px] font-black uppercase tracking-tight"
    >
      <AlertCircle size={16} className="shrink-0" /> {message}
    </motion.div>
  );
}
