"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Mail,
  Lock,
  CheckCircle2,
  ChevronRight,
  Send,
} from "lucide-react";

export const LoginHeader = ({ icon, title, color }: any) => (
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

export const InputGroup = ({
  icon,
  type,
  placeholder,
  value,
  onChange,
  accentColor,
}: any) => (
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
      onChange={onChange}
      placeholder={placeholder}
      className="w-full text-white pl-12 pr-4 py-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl outline-none focus:ring-4 ring-white/5 transition-all font-bold text-sm placeholder:text-slate-600 placeholder:uppercase placeholder:text-[10px]"
    />
  </div>
);

export const ErrorMessage = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-[10px] font-black uppercase tracking-tight"
  >
    <AlertCircle size={16} className="shrink-0" /> {message}
  </motion.div>
);
