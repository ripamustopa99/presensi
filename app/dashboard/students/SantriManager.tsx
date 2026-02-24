"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import FilterKelas from "@/components/students/ClassesFilter";
import { motion } from "framer-motion";

import SearchBar from "@/components/ui/SearchBar";
import { DeleteConfirmModal } from "@/components/ui/deletemodal";
import { StudentModal } from "../../../components/students/StudentModal";
import { Table } from "../../../components/students/Table";
import ClassesFilter from "@/components/students/ClassesFilter";
const data = [
  {
    _id: "1771457346999",
    nama: "adsf",
    NIS: "adsf",
    kelas: "11-B",
    asrama: "Al-Khawarizmi",
    status: "Aktif",
    tglMasuk: "12 Februari 2026",
  },
];

export const SantriManager = ({ students }: { students: any[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [santriList, setSantriList] = useState(students);
  const [selectedKelas, setSelectedKelas] = useState("Semua");
  // --- CRUD & MODAL STATES ---

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [editingSantri, setEditingSantri] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveSantri = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("nama") as string,
      NIS: formData.get("NIS") as string,
      kelas: formData.get("kelas") as string,
    };

    let newList;

    if (editingSantri) {
      // LOGIKA EDIT
      newList = santriList.map((g) =>
        g._id === editingSantri._id ? { ...g, ...payload } : g,
      );
      // triggerToast(`Data ${payload.nama} diperbarui!`);
    } else {
      // LOGIKA TAMBAH
      const newGuru = {
        _id: Date.now(),
        role: "guru",
        ...payload,
      };
      newList = [newGuru, ...santriList];
      // triggerToast(`Guru ${payload.nama} ditambahkan!`);
    }

    // Update UI & Server secara paralel
    // setSantriList(newList);
    // await syncDatabase(newList);
    setIsModalOpen(false);
    setEditingSantri(null);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      setSantriList((prev) => prev.filter((s) => s._id !== selectedItem._id));
      setIsDeleteOpen(false);
      // triggerToast(`Data ${selectedItem.nama} dihapus!`);
      setSelectedItem(null);
    }
  };
  const filteredSantri = santriList.filter((s) => {
    const matchKelas = selectedKelas === "Semua" || s.class === selectedKelas;
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchKelas && matchSearch;
  });
  return (
    <>
      <div className="flex lg:flex-col gap-4 justify-between items-center w-full mb-6 ">
        <SearchBar activeTab="santri" setSearchTerm={setSearchTerm} />
        <button
          onClick={() => {
            setEditingSantri(null);
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto bg-indigo-600 text-white text-sm px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Plus size={22} strokeWidth={3} />
          <p className="hidden lg:flex">TAMBAH SANTRI</p>
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border dark:border-slate-800 overflow-hidden"
      >
        {/* <div className="p-2 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        </div> */}
        <ClassesFilter
          selectedKelas={selectedKelas}
          setSelectedKelas={setSelectedKelas}
        />

        <Table
          data={filteredSantri}
          onEdit={(item: any) => {
            setEditingSantri(item);
            setIsModalOpen(true);
          }}
          onDelete={(item: any) => {
            setSelectedItem(item);
            setIsDeleteOpen(true);
          }}
        />
      </motion.div>

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedItem?.nama || "data ini"}
      />

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingSantri={editingSantri}
      />
    </>
  );
};
