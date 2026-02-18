"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import untuk navigasi
import { motion, AnimatePresence } from "framer-motion";
import StatCard from "@/components/satatcard";
import SearchBar from "@/components/dashboard/searchBar";
import DataTable from "@/components/dashboard/datatable";
import FilterKelas from "@/components/dashboard/classfilter";
import { DeleteConfirmModal } from "@/components/ui/deletemodal";
import { ToastAlert } from "@/components/ui/toastalert";
import { Plus, Loader2 } from "lucide-react"; // Loader untuk loading state
import WelcomeAlert from "../../components/alert";
import { AdminSidebarContent } from "@/components/dashboard/sidebar";
import DashboardHeader from "@/components/dashboard/header";
import AbsenManager from "@/components/absensi/absensi";
// --- DATA DUMMY ---
import { SantriModal } from "@/components/santri";
import Loading from "@/components/ui/loading";

export default function AdminDashboard() {
  const router = useRouter();

  // --- AUTH & UI STATES ---
  const [userData, setUserData] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // State loading proteksi
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- DATA STATES ---
  const [santriList, setSantriList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("Semua");

  // --- CRUD & MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSantri, setEditingSantri] = useState<any>(null);
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
      setSantriList(data.data_santri || []);
    } catch (error) {
      console.error("Gagal memuat data dari file:", error);
      // setAlert({ msg: "Gagal terhubung ke database file", type: "error" });
    } finally {
      // setIsLoading(false);
    }
  };

  // ==========================================
  // 1. PROTEKSI RUTE (ROUTE GUARD)
  // ==========================================
  useEffect(() => {
    loadDataFromFile();
    const session = sessionStorage.getItem("userSession");

    if (!session) {
      // Jika tidak ada session, paksa ke login tanpa bisa klik back
      router.replace("/");
      return;
    }

    const parsedUser = JSON.parse(session);
    setUserData(parsedUser);
    setIsCheckingAuth(false);

    // LOGIC HAK AKSES:
    // Jika user adalah Guru tapi memaksa masuk ke rute /admin
    const currentPath = window.location.pathname;
    if (parsedUser.role === "guru" && currentPath.includes("/admin")) {
      router.replace("/dasboard"); // Lempar ke dashboard guru
    }
  }, [router]);

  // ==========================================
  // 2. CRUD HANDLERS
  // ==========================================
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteClick = (santri: any) => {
    setSelectedItem(santri);
    setIsDeleteOpen(true);
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
          data_santri: newList, // Update list users-nya saja
        }),
      });
    } catch (error) {
      console.error("Gagal sinkronisasi ke database:", error);
      triggerToast("Gagal menyimpan ke server!");
    }
  };

  // 2. Handler Simpan (Tambah & Edit)
  const handleSaveSantri = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      nama: formData.get("nama") as string,
      NIS: formData.get("NIS") as string,
      kelas: formData.get("kelas") as string,
    };

    let newList;

    if (editingSantri) {
      // LOGIKA EDIT
      newList = santriList.map((g) =>
        g.id === editingSantri.id ? { ...g, ...payload } : g,
      );
      triggerToast(`Data ${payload.nama} diperbarui!`);
    } else {
      // LOGIKA TAMBAH
      const newGuru = {
        id: Date.now(),
        role: "guru",
        ...payload,
      };
      newList = [newGuru, ...santriList];
      triggerToast(`Guru ${payload.nama} ditambahkan!`);
    }

    // Update UI & Server secara paralel
    setSantriList(newList);
    await syncDatabase(newList);
    setIsModalOpen(false);
    setEditingSantri(null);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      setSantriList((prev) => prev.filter((s) => s.id !== selectedItem.id));
      setIsDeleteOpen(false);
      triggerToast(`Data ${selectedItem.nama} dihapus!`);
      setSelectedItem(null);
    }
  };

  // ==========================================
  // 3. FILTERING LOGIC
  // ==========================================
  const filteredSantri = santriList.filter((s) => {
    const matchKelas = selectedKelas === "Semua" || s.kelas === selectedKelas;
    const matchSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchKelas && matchSearch;
  });

  // ==========================================
  // 4. RENDER LOADING (Anti-Flicker)
  // ==========================================
  if (isCheckingAuth) {
    <Loading />;
  }

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {/* SIDEBAR DESKTOP */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
          <AdminSidebarContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </aside>

        <main className="flex-1 w-full flex flex-col">
          {/* HEADER */}
          <DashboardHeader
            activeTab={activeTab}
            setIsSidebarOpen={setIsSidebarOpen}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          {/* NOTIFIKASI TOAST */}
          <ToastAlert
            isVisible={showToast}
            message={toastMsg}
            onClose={() => setShowToast(false)}
          />

          {/* WELCOME BANNER */}
          {userData && (
            <WelcomeAlert userName={userData.nama} role={userData.role} />
          )}

          <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
            {/* HEADER ACTIONS */}
            {activeTab !== "absensi" && (
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <SearchBar
                  activeTab={activeTab}
                  setSearchTerm={setSearchTerm}
                />

                {/* Tombol Tambah hanya muncul jika tab Santri atau Guru (Hanya Admin yang bisa tambah Guru) */}
                {activeTab === "santri" && (
                  <button
                    onClick={() => {
                      setEditingSantri(null);
                      setIsModalOpen(true);
                    }}
                    className="w-full md:w-auto bg-indigo-600 text-white text-sm px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:bg-indigo-700 active:scale-95 transition-all"
                  >
                    <Plus size={22} strokeWidth={3} /> TAMBAH SANTRI
                  </button>
                )}
              </div>
            )}

            {/* STATISTIC CARDS */}
            {activeTab === "dashboard" && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <StatCard
                  label="Total Santri"
                  count={santriList.length}
                  color="emerald"
                />
                <StatCard label="Total Kelas" count="12" color="amber" />
                <StatCard label="Kehadiran" count="98%" color="rose" />
                <StatCard label="Total Guru" count="24" color="indigo" />
              </div>
            )}

            {/* DATA TABLE SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border dark:border-slate-800 overflow-hidden"
            >
              {activeTab === "santri" && (
                <div className="p-2 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <FilterKelas
                    selectedKelas={selectedKelas}
                    setSelectedKelas={setSelectedKelas}
                  />
                </div>
              )}
              {activeTab !== "absensi" && (
                <DataTable
                  activeTab={activeTab}
                  data={filteredSantri}
                  onEdit={(item) => {
                    setEditingSantri(item);
                    setIsModalOpen(true);
                  }}
                  onDelete={(id) => {
                    const target = santriList.find((s) => s.id === id);
                    handleDeleteClick(target);
                  }}
                />
              )}
            </motion.div>
          </div>
          {activeTab === "absensi" && <AbsenManager />}
        </main>

        {/* MODAL COMPONENTS */}
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          itemName={selectedItem?.nama || "data ini"}
        />

        <SantriModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingSantri={editingSantri}
          onSave={handleSaveSantri}
        />
      </div>
    </div>
  );
}
