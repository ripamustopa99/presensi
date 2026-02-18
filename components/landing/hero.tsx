import Image from "next/image"; // Menggunakan Next.js Image Component
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronRight,
  BookOpen,
  User,
  MapPin,
  LogIn,
  Phone,
  Mail,
  Award,
  BookText,
  GraduationCap,
  Mountain,
  Star,
} from "lucide-react";
export default function Jumbotron() {
  const [activeSection, setActiveSection] = useState("hero");

  // Fungsi untuk scroll yang akan dikirim ke Navbar
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20"
    >
      {/* Dekorasi Background - Blob/Lingkaran Halus */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-60 z-0" />
      <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] bg-teal-50 rounded-full blur-3xl opacity-60 z-0" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* KIRI: TEKS & CALL TO ACTION */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black tracking-widest uppercase mb-6">
            <Star size={14} className="fill-emerald-700" />
            Pusat Pendidikan Qur'ani Terbaik
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
            Membangun Masa Depan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Berbasis Adab & Ilmu
            </span>
          </h1>

          <p className="text-md text-slate-600 leading-relaxed mb-10 max-w-lg">
            Selamat datang di{" "}
            <span className="font-bold text-slate-800">
              Al-Musthofa Nangorak
            </span>
            . Tempat di mana tradisi pesantren bertemu dengan inovasi pendidikan
            modern untuk mencetak santri unggul.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollToSection("contact")}
              className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-2xl shadow-emerald-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
            >
              Daftar Sekarang <ChevronRight size={20} />
            </button>

            <button className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-700 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3">
              Virtual Tour <BookOpen size={20} className="text-emerald-600" />
            </button>
          </div>

          {/* Mini Stats di bawah Hero */}
          <div className="mt-12 pt-12 border-t border-slate-100 flex gap-10">
            <div>
              <p className="text-3xl font-black text-slate-900">500+</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Santri Aktif
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">30+</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Asatidzah
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">100%</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Sanad Resmi
              </p>
            </div>
          </div>
        </motion.div>

        {/* KANAN: IMAGE COMPOSITION */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Frame Gambar Utama */}
          <div className="relative z-10 w-full aspect-[6/7] rounded-[4rem] overflow-hidden border-[12px] border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rotate-2 hover:rotate-0 transition-transform duration-700">
            <img
              src="/images/hero-santri.jpg" // Ganti dengan foto santri sedang mengaji/belajar
              className="w-full h-full object-cover"
              alt="Santri Al-Musthofa"
            />
          </div>

          {/* Floating Card 1: Hafidz Quran */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -left-10 z-20 bg-white p-5 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                Program
              </p>
              <p className="text-sm font-black text-slate-800">Tahfidz Sanad</p>
            </div>
          </motion.div>

          {/* Floating Card 2: Location */}
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute -bottom-6 -right-6 z-20 bg-white p-5 rounded-3xl shadow-xl border border-slate-50 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">
                Nangorak, Sumedang
              </p>
              <p className="text-[10px] font-bold text-slate-400">
                Udara Sejuk & Asri
              </p>
            </div>
          </motion.div>

          {/* Ornamen Belakang Gambar */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-2 border-emerald-100 rounded-[5rem] rotate-12" />
        </motion.div>
      </div>
    </section>
  );
}
