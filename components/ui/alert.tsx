"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight, Zap } from "lucide-react";

interface WelcomeBannerProps {
  userName: string;
  role: string;
}

export default function WelcomeBanner({ userName, role }: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

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
          {/* Container Banner */}
          <div className="bg-indigo-600 dark:bg-indigo-900 px-4 py-3 lg:py-2">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              {/* Left Side: Info */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
                  <Zap size={18} fill="currentColor" />
                </div>
                <div className="text-white text-sm md:text-base">
                  <span className="opacity-80 font-medium">
                    Selamat datang kembali,
                  </span>
                  <span className="font-black tracking-tight">{userName}</span>
                  <span className="hidden md:inline mx-2 opacity-30">|</span>
                  <span className="hidden md:inline px-2 py-0.5 bg-white/10 rounded-md text-[10px] font-black uppercase tracking-wider">
                    Akses {role}
                  </span>
                </div>
              </div>

              {/* Right Side: Action & Close */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <button className="flex items-center gap-2 text-xs font-black text-indigo-100 hover:text-white transition-colors group">
                  LIHAT LAPORAN HARI INI
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <button
                  onClick={() => setIsVisible(false)}
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
