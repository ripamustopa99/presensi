"use client";
import { useState, useEffect } from "react";

import Image from "next/image"; // Menggunakan Next.js Image Component
import {
  SectionTitle,
  FacilityCard,
  ProgramCard,
  TestimonialCard,
} from "@/components/landing/components/components";

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import {
  Menu,
  X,
  ChevronRight,
  BookOpen,
  User,
  MapPin,
  Phone,
  Mail,
  Award,
  BookText,
  GraduationCap,
  Mountain,
  Star,
} from "lucide-react";
import SmartNavbar from "@/components/landing/navbar";
import Jumbotron from "@/components/landing/hero";
import Footer from "@/components/landing/footer";
export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(true);
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
  const [activeSection, setActiveSection] = useState("hero");

  // Fungsi untuk scroll yang akan dikirim ke Navbar
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  // Optional: Add scroll listener for active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero",
        "about",
        "program",
        "facilities",
        "testimonials",
        "contact",
      ];
      let currentActive = "hero";
      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section && window.scrollY >= section.offsetTop - 150) {
          // Adjust offset as needed
          currentActive = sectionId;
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <SmartNavbar
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />
      {/* --- JUMBOTRON RE-DESIGNED --- */}
      <Jumbotron />
      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <SectionTitle icon={<BookText />} title="Tentang Pesantren Kami" />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="mt-12 grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="text-left space-y-6">
              <p className="text-lg leading-relaxed text-slate-700">
                Pesantren Al Musthofa Nangorak didirikan dengan visi untuk
                menjadi pusat pendidikan Islam yang unggul, menghasilkan
                santri-santri yang tidak hanya hafal Al-Qur'an dan memahami
                sunnah, tetapi juga memiliki kepekaan sosial dan mampu bersaing
                di era modern.
              </p>
              <p className="text-lg leading-relaxed text-slate-700">
                Kami berkomitmen menciptakan lingkungan belajar yang kondusif,
                didukung oleh tenaga pengajar profesional dan kurikulum terpadu
                yang memadukan ilmu agama dan umum.
              </p>
              <button
                onClick={() => scrollToSection("program")}
                className="mt-6 px-6 py-3 bg-emerald-100 text-emerald-700 font-semibold rounded-full hover:bg-emerald-200 transition-colors"
              >
                Lihat Visi & Misi{" "}
                <ChevronRight className="inline-block ml-1" size={16} />
              </button>
            </div>
            <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/images/pesantren-about.jpg" // Ganti dengan path gambar tentang pesantren Anda
                alt="Tentang Pesantren"
                layout="fill"
                objectFit="cover"
                className="hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </section>
      {/* --- PROGRAM SECTION --- */}
      <section
        id="program"
        className="py-20 px-6 bg-gradient-to-b from-gray-50 to-gray-100"
      >
        <div className="max-w-6xl mx-auto text-center">
          <SectionTitle
            icon={<GraduationCap />}
            title="Program Pendidikan Unggulan"
          />
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <ProgramCard
              title="Tahfidz Al-Qur'an"
              description="Fokus utama kami adalah mencetak hafizh dan hafizhah dengan sanad yang muttasil."
              icon={<BookOpen />}
            />
            <ProgramCard
              title="Dirasah Kitab Kuning"
              description="Mengkaji kitab-kitab klasik ilmu agama Islam dari berbagai mazhab."
              icon={<BookText />}
            />
            <ProgramCard
              title="Pendidikan Formal"
              description="Jenjang pendidikan setara SMP dan SMA dengan kurikulum Kemenag dan Kemendikbud."
              icon={<Award />}
            />
          </div>
        </div>
      </section>

      {/* --- FACILITIES SECTION --- */}
      <section id="facilities" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <SectionTitle icon={<Mountain />} title="Fasilitas Modern & Nyaman" />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FacilityCard
              title="Asrama Putra/Putri"
              description="Bangunan modern dengan kapasitas besar, kamar nyaman."
              icon="🕌"
            />
            <FacilityCard
              title="Masjid Jami'"
              description="Masjid luas, nyaman untuk ibadah dan kajian."
              icon="🕋"
            />
            <FacilityCard
              title="Perpustakaan Digital"
              description="Koleksi buku lengkap, akses e-book dan jurnal Islam."
              icon="📚"
            />
            <FacilityCard
              title="Klinik Kesehatan"
              description="Pelayanan kesehatan dasar untuk santri dan pengajar."
              icon="🏥"
            />
            <FacilityCard
              title="Lapangan Olahraga"
              description="Futsal, Basket, Voli untuk kegiatan jasmani."
              icon="⚽"
            />
            <FacilityCard
              title="Ruang Multimedia"
              description="Laboratorium komputer dan bahasa lengkap."
              icon="🖥️"
            />
          </div>
        </div>
      </section>
      {/* --- TESTIMONIALS SECTION --- */}
      <section
        id="testimonials"
        className="py-20 px-6 bg-gradient-to-b from-gray-100 to-gray-50"
      >
        <div className="max-w-6xl mx-auto text-center">
          <SectionTitle icon={<Star />} title="Kata Mereka Tentang Kami" />
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="Alhamdulillah, anak saya semakin sholeh dan mandiri setelah di Al Musthofa. Metode tahfidznya luar biasa."
              author="Ibu Fatimah"
              role="Wali Santri"
              avatar="/images/avatar-1.jpg" // Ganti dengan path avatar
            />
            <TestimonialCard
              quote="Lingkungan pesantren yang kondusif membuat saya betah belajar. Para ustadz dan ustadzah sangat membimbing."
              author="Ahmad Dzaki"
              role="Alumni 2023"
              avatar="/images/avatar-2.jpg" // Ganti dengan path avatar
            />
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-20 px-6 bg-emerald-800 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <SectionTitle icon={<Mail />} title="Hubungi Kami" isDark />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="mt-12 grid md:grid-cols-2 gap-12 items-start text-left"
          >
            {/* Contact Info */}
            <div className="space-y-6">
              <p className="text-lg leading-relaxed opacity-90">
                Tertarik bergabung atau memiliki pertanyaan lebih lanjut? Jangan
                ragu hubungi kami. Tim kami siap membantu Anda.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin
                    size={24}
                    className="flex-shrink-0 text-emerald-400 mt-1"
                  />
                  <div>
                    <h4 className="font-bold text-lg">Alamat Kami</h4>
                    <p className="opacity-90">
                      Jln. Raya Nangorak No. 123, Desa Cibeureum, Kec.
                      Sukamantri, Kab. Sumedang, Jawa Barat 45392
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone size={24} className="flex-shrink-0 text-emerald-400" />
                  <div>
                    <h4 className="font-bold text-lg">Telepon</h4>
                    <p className="opacity-90">+62 812-3456-7890</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail size={24} className="flex-shrink-0 text-emerald-400" />
                  <div>
                    <h4 className="font-bold text-lg">Email</h4>
                    <p className="opacity-90">info@almusthofa-nangorak.id</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form className="bg-white/10 p-8 rounded-3xl shadow-xl space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white/80 mb-2"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/80 mb-2"
                >
                  Email Anda
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-white/80 mb-2"
                >
                  Pesan Anda
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors active:scale-95"
              >
                Kirim Pesan
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />
    </>
  );
}
// "use client";

// import { useState } from "react";
// import { database } from "@/lib/api";
// import { ref, push, set, get, update, remove } from "firebase/database";

// interface User {
//   id: string;
//   nama: string;
//   email: string;
//   createdAt: number;
// }

// export default function Home() {
//   const [users, setUsers] = useState<User[]>([]);

//   // 🔹 CREATE
//   const createUser = async () => {
//     const usersRef = ref(database, "users");
//     const newUserRef = push(usersRef);

//     await set(newUserRef, {
//       nama: "Budi",
//       email: `budi${Date.now()}@email.com`,
//       createdAt: Date.now(),
//     });

//     alert("User ditambahkan!");
//     readUsers();
//   };

//   // 🔹 READ
//   const readUsers = async () => {
//     const snapshot = await get(ref(database, "users"));
//     if (snapshot.exists()) {
//       const data = snapshot.val();
//       const usersArray = Object.keys(data).map((key) => ({
//         id: key,
//         ...data[key],
//       }));
//       setUsers(usersArray);
//     } else {
//       setUsers([]);
//     }
//   };

//   // 🔹 UPDATE
//   const updateUser = async (id: string) => {
//     const userRef = ref(database, `users/${id}`);
//     await update(userRef, { nama: "Budi Updated" });
//     alert("User diupdate!");
//     readUsers();
//   };

//   // 🔹 DELETE
//   const deleteUser = async (id: string) => {
//     const userRef = ref(database, `users/${id}`);
//     await remove(userRef);
//     alert("User dihapus!");
//     readUsers();
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h1>Firebase CRUD Demo</h1>
//       <button onClick={createUser}>➕ Tambah User</button>
//       <button onClick={readUsers} style={{ marginLeft: "1rem" }}>
//         🔄 Refresh Users
//       </button>

//       <ul>
//         {users.map((user) => (
//           <li key={user.id} style={{ marginTop: "1rem" }}>
//             <b>{user.nama}</b> ({user.email}){" "}
//             <button onClick={() => updateUser(user.id)}>✏️ Update</button>{" "}
//             <button onClick={() => deleteUser(user.id)}>🗑️ Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
