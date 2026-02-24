import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  ShieldCheck,
  ArrowLeft,
  Mail,
  Lock,
  CheckCircle2,
  ChevronRight,
  Send,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { InputGroup, ErrorMessage } from "../../components/auth/AuthComponents";
export const ForgotForm = ({ setView }: any) => {
  const [username_email, setUsername_Email] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //   const [view, setView] = useState<"login" | "forgot">("login");

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setView("login");
    }, 4000);
  };

  return (
    <motion.div
      key="forgot"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-sm"
    >
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-slate-800 border border-slate-700 text-orange-400">
          <Send size={30} />
        </div>
        <h2 className="text-2xl font-black uppercase text-white">
          Reset Password
        </h2>
      </div>
      {isSent ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem] text-center">
          <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
          <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">
            Email Terkirim!
          </p>
        </div>
      ) : (
        <form onSubmit={handleForgotSubmit} className="space-y-6">
          <InputGroup
            icon={<Mail />}
            type="email"
            placeholder="Masukkan Email"
            value={username_email}
            onChange={setUsername_Email}
            accentColor="text-orange-400"
          />
          <button
            disabled={isLoading}
            className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em]"
          >
            {isLoading ? "Mengirim..." : "Kirim Instruksi"}
          </button>
          <button
            type="button"
            onClick={() => setView("login")}
            className="w-full text-center text-slate-500 text-[10px] font-black uppercase"
          >
            Kembali Login
          </button>
        </form>
      )}
    </motion.div>
  );
};
