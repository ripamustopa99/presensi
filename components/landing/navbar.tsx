"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, X, BookOpen, LogIn } from "lucide-react";

export default function SmartNavbar({ activeSection, scrollToSection }: any) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollY } = useScroll();

  // Logika Muncul/Hilang saat Scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    // Jika scroll ke bawah dan sudah lewat 150px, sembunyikan
    if (latest > previous && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    // Jika scroll sudah menjauh dari paling atas, ubah style jadi Glassmorphism
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 20 }} // Memberi jarak 20px dari atas (floating)
          exit={{ y: -100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-[100] px-6"
        >
          <div
            className={`
            max-w-6xl mx-auto flex justify-between items-center px-6 py-3 rounded-[2rem] transition-all duration-300
            ${
              isScrolled
                ? "bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]"
                : "bg-transparent border border-transparent"
            }
          `}
          >
            {/* LOGO */}
            <div
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-transform">
                <BookOpen size={20} />
              </div>
              <span
                className={`font-serif text-xl font-black tracking-tight transition-colors ${isScrolled ? "text-slate-800" : "text-emerald-900"}`}
              >
                Al-Musthofa
              </span>
            </div>

            {/* DESKTOP NAV (Tengah) */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50">
              <NavButton
                id="hero"
                label="Beranda"
                active={activeSection === "hero"}
                onClick={scrollToSection}
              />
              <NavButton
                id="about"
                label="Tentang"
                active={activeSection === "about"}
                onClick={scrollToSection}
              />
              <NavButton
                id="program"
                label="Program"
                active={activeSection === "program"}
                onClick={scrollToSection}
              />
              <NavButton
                id="contact"
                label="Kontak"
                active={activeSection === "contact"}
                onClick={scrollToSection}
              />
            </div>

            {/* LOGIN BUTTON (Kanan) */}
            <div className="flex items-center gap-3">
              <Link href="/signin" prefetch={true}>
                <button
                  className={`
        hidden sm:flex cursor-pointer items-center gap-2 px-6 py-2.5 rounded-full font-black text-sm transition-all active:scale-95
        ${
          isScrolled
            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
            : "bg-white text-emerald-700 shadow-xl shadow-black/5"
        }
      `}
                >
                  <LogIn size={16} />
                  Masuk
                </button>
              </Link>
              {/* Mobile Toggle */}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 bg-slate-100 rounded-full"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-20 left-6 right-6 bg-white rounded-[2rem] p-6 shadow-2xl border border-slate-100 lg:hidden flex flex-col gap-4"
              >
                {["hero", "about", "program", "contact"].map((id) => (
                  <button
                    key={id}
                    onClick={() => {
                      scrollToSection(id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left font-bold text-slate-600 p-3 hover:bg-emerald-50 rounded-xl hover:text-emerald-600 capitalize"
                  >
                    {id}
                  </button>
                ))}
                <hr className="border-slate-100" />
                <Link href="/signin" prefetch={true}>
                  <button className="w-full py-4 bg-emerald-600 text-white font-black rounded-xl">
                    MASUK
                  </button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

// Sub-komponen tombol nav agar lebih rapi
function NavButton({ id, label, active, onClick }: any) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all
        ${active ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-emerald-600"}
      `}
    >
      {label}
    </button>
  );
}
