"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

export function ToastAlert({ isVisible, message, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="w-full overflow-hidden"
        >
          <div className="bg-indigo-600 dark:bg-indigo-900 px-4 py-3 lg:py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between ">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
                  <CheckCircle2 size={20} />
                </div>
                <div className="text-white text-sm md:text-base">
                  <span className="opacity-80 font-medium">{message}</span>
                </div>
              </div>
              <div className="flex">
                <p className="lg:flex hidden items-center gap-2 text-xs font-black text-indigo-100 hover:text-white transition-colors group">
                  KLIK UNTUK KEMBALI!
                </p>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-black/10 rounded-full transition-colors text-indigo-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Subtle Bottom Border/Shadow */}
          <div className="h-[1px] bg-black/5 dark:bg-white/5 shadow-sm" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
