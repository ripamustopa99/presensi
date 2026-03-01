"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react"; // Opsional, jika pakai Lucide

export default function RealTimeDate() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const formatDate = () => {
      const now = new Date();

      // Menggunakan Intl.DateTimeFormat untuk format Indonesia yang sempurna
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      const formatter = new Intl.DateTimeFormat("id-ID", options);
      setCurrentDate(formatter.format(now));
    };

    formatDate();

    // Opsional: Update setiap jam jika aplikasi jarang di-refresh
    const interval = setInterval(formatDate, 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-end items-center gap-2 mt-1">
      <Calendar size={16} className="text-teal-500" />
      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">
        {currentDate || "Memuat Tanggal..."}
      </span>
    </div>
  );
}
