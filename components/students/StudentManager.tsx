"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Actions & UI Components
import { deleteStudentAction } from "@/lib/actions/students.actions";
import SearchBar from "@/components/ui/SearchBar";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { StudentModal } from "./StudentModal";
import { Table } from "./StudentTable";
import ClassesFilter from "@/components/students/StudentFilterClass";
import Alert from "../ui/Alert";

// --- INTERFACES ---
interface ClassItem {
  _id: string;
  class_name: string;
}

// interface Student {
//   _id: string;
//   id?: string;
//   name: string;
//   nis?: string;
//   class: string; // Berisi ID Kelas (string)
//   gender: "L" | "P";
// }

export const SantriManager = ({
  students,
  classes,
}: {
  classes: ClassItem[];
  students: any[];
}) => {
  const router = useRouter();

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("Semua");

  // --- CRUD & MODAL STATES ---
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [editingSantri, setEditingSantri] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- ALERT STATE ---
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showAlert = (message: string, type: "success" | "error") => {
    setAlertConfig({ show: true, message, type });
  };

  // --- HANDLERS ---
  const confirmDelete = async () => {
    if (!selectedItem) return;

    try {
      const idToDelete = selectedItem._id || selectedItem.id;
      const result = await deleteStudentAction(idToDelete!);

      if (result.success) {
        showAlert(
          `Data santri ${selectedItem.name} berhasil dihapus`,
          "success",
        );
        router.refresh();
      } else {
        showAlert(result.message || "Gagal menghapus data", "error");
      }
    } catch (error) {
      showAlert("Terjadi kesalahan koneksi", "error");
    } finally {
      setIsDeleteOpen(false);
      setSelectedItem(null);
    }
  };

  const handleCloseModal = (success?: boolean, message?: string) => {
    setIsModalOpen(false);
    setEditingSantri(null);
    if (success && message) {
      showAlert(message, "success");
      router.refresh();
    }
  };

  // --- FILTER LOGIC ---
  const filteredSantri = students.filter((s) => {
    // Pastikan membandingkan ID (s.class) dengan ID yang dipilih di filter
    const matchKelas = selectedKelas === "Semua" || s.class === selectedKelas;
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchKelas && matchSearch;
  });

  return (
    <>
      <AnimatePresence mode="wait">
        {alertConfig.show && (
          <Alert
            message={alertConfig.message}
            type={alertConfig.type}
            onClose={() => setAlertConfig((p) => ({ ...p, show: false }))}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <SearchBar activeTab="santri" setSearchTerm={setSearchTerm} />

        <button
          onClick={() => {
            setEditingSantri(null);
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto bg-indigo-600 text-white text-sm px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Plus size={22} strokeWidth={3} />
          Tambah Santri
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border dark:border-slate-800"
      >
        {/* Filter Kelas: Pastikan setSelectedKelas menerima _id dari ClassItem */}
        <ClassesFilter
          kelasList={classes}
          selectedKelas={selectedKelas}
          setSelectedKelas={setSelectedKelas}
        />

        {/* PENTING: Kirim props 'classes' ke Table agar Table bisa melakukan 
           lookup ID Kelas menjadi Nama Kelas 
        */}
        <Table
          data={filteredSantri}
          classes={classes}
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
        itemName={selectedItem?.name || "data ini"}
      />

      <StudentModal
        classes={classes}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingSantri={editingSantri}
      />
    </>
  );
};
