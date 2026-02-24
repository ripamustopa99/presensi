"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface AlertProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number; // Durasi dalam milidetik
}

export function CustomAlert({
  message,
  type,
  onClose,
  duration = 3000,
}: AlertProps) {
  // Auto close setelah durasi habis
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className={`fixed top-6 right-6 z-[999] w-80 overflow-hidden rounded-xl border backdrop-blur-md shadow-2xl ${
        type === "success"
          ? "bg-slate-900/90 border-emerald-500/50 text-emerald-400"
          : "bg-slate-900/90 border-red-500/50 text-red-400"
      }`}
    >
      <div className="p-4 flex items-start gap-4">
        <div
          className={`mt-0.5 p-1.5 rounded-lg ${
            type === "success" ? "bg-emerald-500/10" : "bg-red-500/10"
          }`}
        >
          {type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
        </div>

        <div className="flex-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-50">
            {type === "success" ? "Berhasil" : "Terjadi Kesalahan"}
          </h4>
          <p className="text-[11px] font-bold leading-relaxed text-slate-200">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="hover:bg-white/10 p-1 rounded-md transition-colors"
        >
          <X size={14} className="text-slate-500" />
        </button>
      </div>

      {/* PROGRESS BAR LOADING */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/5">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className={`h-full ${
            type === "success" ? "bg-emerald-500" : "bg-red-500"
          }`}
        />
      </div>
    </motion.div>
  );
}
