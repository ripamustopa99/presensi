"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/schemas/auth.schema";
import { handleLoginAction } from "@/lib/actions/auth.actions";
import { LoginHeader, ErrorMessage } from "./AuthComponents";
import { ForgotForm } from "./ForgotForm";
import {
  GraduationCap,
  ShieldCheck,
  Mail,
  Lock,
  CheckCircle2,
  ChevronRight,
  Loader,
} from "lucide-react";

interface FormLoginProps {
  accentColor: string;
  accentBg: string;
  setView: (view: string) => void;
  view: string;
  role: "admin" | "guru"; // Batasi tipe role di sini
}

export const FormLogin = ({
  accentColor,
  accentBg,
  setView,
  view,
  role,
}: FormLoginProps) => {
  // Gunakan interface tadi
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    // Pastikan defaultValues sesuai dengan LoginInput
    values: {
      role: role,
      remember: false,
      username_email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    try {
      // Data sudah mengandung role yang benar dari defaultValues/Zod
      const result = await handleLoginAction(data);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.message || "Terjadi kesalahan saat login");
      }
    } catch (err) {
      setError("Gagal terhubung ke server");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {view === "login" ? (
        <motion.div
          key="login"
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative group">
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:${accentColor} transition-colors`}
              >
                {React.cloneElement(<Mail size={18} />)}
              </div>
              <input
                required
                {...register("username_email")}
                type="text"
                placeholder={"Username atau Email"}
                className="w-full text-white pl-12 pr-4 py-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl outline-none focus:ring-4 ring-white/5 transition-all font-bold text-sm placeholder:text-slate-600 placeholder:uppercase placeholder:text-[10px]"
              />
            </div>
            {errors.username_email && (
              <p className="text-red-500 text-xs px-1">
                {errors.username_email.message}
              </p>
            )}
            <div className="relative group">
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:${accentColor} transition-colors`}
              >
                {React.cloneElement(<Lock size={18} />)}
              </div>
              <input
                required
                {...register("password")}
                type="password"
                placeholder={"Password"}
                className="w-full text-white pl-12 pr-4 py-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl outline-none focus:ring-4 ring-white/5 transition-all font-bold text-sm placeholder:text-slate-600 placeholder:uppercase placeholder:text-[10px]"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs px-1">
                {errors.password.message}
              </p>
            )}
            {error && <ErrorMessage message={error} />}
            <div className="flex justify-between items-center px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("remember")}
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
                className={`text-[10px] font-black uppercase text-slate-500 hover:${accentColor}`}
              >
                Lupa?
              </button>
            </div>
            <button
              disabled={isSubmitting}
              className={`w-full py-4 ${accentBg} text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <>
                  Autentikasi Sekarang <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      ) : (
        <ForgotForm setView={setView} />
      )}
    </AnimatePresence>
  );
};
