"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import StatCard from "@/components/satatcard";
import SearchBar from "@/components/dashboard/searchBar";
import DataTable from "@/components/dashboard/datatable";
import FilterKelas from "@/components/dashboard/classfilter";
import { GuruModal } from "@/components/dashboard/guru";
import { DeleteConfirmModal } from "@/components/ui/deletemodal";
import { ToastAlert } from "@/components/ui/toastalert";
import { Plus, Loader2 } from "lucide-react"; // Tambahkan Loader untuk transisi
import WelcomeAlert from "../../components/alert";
import { AdminSidebarContent } from "@/components/dashboard/sidebar";
import DashboardHeader from "@/components/dashboard/header";
import Loading from "@/components/ui/loading";

export default function AdminDashboard() {
  const router = useRouter();

  // --- AUTH STATES ---
  const [userData, setUserData] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false); // State untuk mengunci tampilan sebelum verifikasi

  // --- UI STATES ---
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("Semua");

  // // CRUD States

  const [guruList, setGuruList] = useState<any[]>([]);
  const [santriList, setSantriList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuru, setEditingGuru] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  // // --- 1. FETCH DATA DARI API (FILE .JSON) ---
  const loadDataFromFile = async () => {
    try {
      // setIsLoading(true);
      const response = await fetch("/api/attendance");
      const data = await response.json();
      setGuruList(data.users || []);
      setSantriList(data.data_santri || []);
    } catch (error) {
      console.error("Gagal memuat data dari file:", error);
      // setAlert({ msg: "Gagal terhubung ke database file", type: "error" });
    } finally {
      // setIsLoading(false);
    }
  };

  // // ==========================================
  // // 1. SISTEM PROTEKSI (ROUTE GUARD)
  // // ==========================================
  useEffect(() => {
    loadDataFromFile();
    const session = sessionStorage.getItem("userSession");

    // Jika tidak ada session sama sekali
    if (!session) {
      router.replace("/"); // Lempar ke halaman login awal
      return;
    }

    const user = JSON.parse(session);

    // Jika ada session tapi rolenya bukan Admin
    if (user.role !== "admin") {
      router.replace("/dasboard"); // Lempar ke dashboard guru (sesuai path kamu)
      return;
    }

    // Jika lolos semua pengecekan
    setUserData(user);
    setIsAuthorized(true);
  }, [router]);

  // // ==========================================
  // // 2. LOGIC HANDLERS
  // // ==========================================
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 1. Fungsi Sinkronisasi ke Server (Satu pintu untuk semua perubahan)
  const syncDatabase = async (newList: any[]) => {
    try {
      // Ambil data session agar tidak hilang saat update users
      const res = await fetch("/api/attendance");
      const currentDb = await res.json();

      await fetch("/api/attendance", {
        // Gunakan endpoint utama kamu
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentDb, // Jaga agar data "sessions" tetap ada
          users: newList, // Update list users-nya saja
        }),
      });
    } catch (error) {
      console.error("Gagal sinkronisasi ke database:", error);
      triggerToast("Gagal menyimpan ke server!");
    }
  };

  // 2. Handler Simpan (Tambah & Edit)
  const handleSaveGuru = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      nama: formData.get("nama") as string,
    };

    let newList;

    if (editingGuru) {
      // LOGIKA EDIT
      newList = guruList.map((g) =>
        g.id === editingGuru.id ? { ...g, ...payload } : g,
      );
      triggerToast(`Data ${payload.nama} diperbarui!`);
    } else {
      // LOGIKA TAMBAH
      const newGuru = {
        id: Date.now(),
        role: "guru",
        ...payload,
      };
      newList = [newGuru, ...guruList];
      triggerToast(`Guru ${payload.nama} ditambahkan!`);
    }

    // Update UI & Server secara paralel
    setGuruList(newList);
    await syncDatabase(newList);
    setIsModalOpen(false);
    setEditingGuru(null);
  };

  // 3. Handler Hapus
  const confirmDelete = async () => {
    if (selectedItem) {
      const newList = guruList.filter((g) => g.id !== selectedItem.id);

      setGuruList(newList);
      await syncDatabase(newList);

      setIsDeleteOpen(false);
      triggerToast(`Data ${selectedItem.nama} dihapus!`);
      setSelectedItem(null);
    }
  };
  // --- FILTERING ---
  const filteredSantri = santriList.filter(
    (s) =>
      (selectedKelas === "Semua" || s.kelas === selectedKelas) &&
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredGuru = guruList.filter(
    (g) =>
      g.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Jika belum terverifikasi, jangan render dashboard sama sekali
  if (!isAuthorized) {
    <Loading />;
  }

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {/* Sidebar Logic (Desktop & Mobile) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-[70] p-6 flex flex-col shadow-2xl"
              >
                <AdminSidebarContent
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  close={() => setIsSidebarOpen(false)}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <aside className="w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
          <AdminSidebarContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full flex flex-col">
          <DashboardHeader
            activeTab={activeTab}
            setIsSidebarOpen={setIsSidebarOpen}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          <ToastAlert
            isVisible={showToast}
            message={toastMsg}
            onClose={() => setShowToast(false)}
          />

          {userData && (
            <WelcomeAlert userName={userData.nama} role={userData.role} />
          )}

          <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <SearchBar activeTab={activeTab} setSearchTerm={setSearchTerm} />
              {activeTab === "guru" && (
                <button
                  onClick={() => {
                    setEditingGuru(null);
                    setIsModalOpen(true);
                  }}
                  className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  <Plus size={20} /> Tambah Guru
                </button>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <StatCard label="Guru" count={guruList.length} color="indigo" />
              <StatCard
                label="Santri"
                count={santriList.length}
                color="emerald"
              />
              <StatCard label="Kelas" count="12" color="amber" />
              <StatCard label="Absensi" count="95%" color="rose" />
            </div>

            {/* Table Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border dark:border-slate-800 overflow-hidden"
            >
              {activeTab === "santri" && (
                <FilterKelas
                  selectedKelas={selectedKelas}
                  setSelectedKelas={setSelectedKelas}
                />
              )}

              <DataTable
                activeTab={activeTab}
                data={activeTab === "guru" ? filteredGuru : filteredSantri}
                onEdit={(item) => {
                  setEditingGuru(item);
                  setIsModalOpen(true);
                }}
                onDelete={(id) => {
                  const item =
                    activeTab === "guru"
                      ? guruList.find((g) => g.id === id)
                      : santriList.find((s) => s.id === id);
                  setSelectedItem(item);
                  setIsDeleteOpen(true);
                }}
              />
            </motion.div>
          </div>
        </main>

        {/* Modals */}
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          itemName={selectedItem?.nama || "ini"}
        />
        <GuruModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingGuru={editingGuru}
          onSave={handleSaveGuru}
        />
      </div>
    </div>
  );
}
