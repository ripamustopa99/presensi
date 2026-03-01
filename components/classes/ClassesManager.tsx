"use client";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import ClassesTable from "@/components/classes/ClassesTable";
import ClassesForm from "@/components/classes/ClassesForm";
import { useRouter } from "next/navigation";
import { deleteClassAction } from "@/lib/actions/class.actions";
import { motion, AnimatePresence } from "framer-motion";
import { Alert } from "@/components/ui/Alert";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal"; // Sesuaikan path-nya

interface Teacher {
  _id: string;
  name: string;
}

interface ClassData {
  _id: string;
  class_name: string;
  wali: string;
}

export default function ClassManager({
  initialClasses,
  initialTeachers,
}: {
  initialClasses: ClassData[];
  initialTeachers: Teacher[];
}) {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassData[]>(initialClasses);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingData, setEditingData] = useState<ClassData | null>(null);

  // --- STATE UNTUK DELETE MODAL ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ClassData | null>(null);

  // --- STATE UNTUK ALERT ---
  const [alertConfig, setAlertConfig] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    setClasses(initialClasses);
  }, [initialClasses]);

  const showAlert = (message: string, type: "success" | "error") => {
    setAlertConfig({ show: true, message, type });
  };

  // Trigger saat tombol hapus di tabel diklik
  const handleDeleteClick = (item: ClassData) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Eksekusi hapus setelah konfirmasi di modal
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const result = await deleteClassAction(itemToDelete._id);
      if (result.success) {
        showAlert(
          `Kelas ${itemToDelete.class_name} berhasil dihapus`,
          "success",
        );
        router.refresh();
      } else {
        showAlert(result.message || "Gagal menghapus kelas", "error");
      }
    } catch (error) {
      showAlert("Terjadi kesalahan koneksi", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const openAdd = () => {
    setEditingData(null);
    setIsEditMode(false);
    setShowForm(true);
  };

  const openEdit = (cls: ClassData) => {
    setEditingData(cls);
    setIsEditMode(true);
    setShowForm(true);
  };

  const closeModal = (success?: boolean, message?: string) => {
    setShowForm(false);
    setEditingData(null);
    if (success && message) {
      showAlert(message, "success");
    }
  };

  return (
    <main className="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* NOTIFIKASI ALERT */}
      <AnimatePresence mode="wait">
        {alertConfig.show && (
          <Alert
            message={alertConfig.message}
            type={alertConfig.type}
            onClose={() => setAlertConfig((prev) => ({ ...prev, show: false }))}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
              Data Ruang Kelas & Wali Kelas
            </p>
          </div>
          <button
            onClick={openAdd}
            className="bg-indigo-600 hover:bg-indigo-500 px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 text-white"
          >
            <Plus size={18} /> Tambah Kelas Baru
          </button>
        </div>

        {/* TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border dark:border-slate-800"
        >
          <ClassesTable
            teachers={initialTeachers}
            data={classes}
            onEdit={openEdit}
            onDelete={handleDeleteClick} // Ganti ke fungsi trigger modal
          />
        </motion.div>
      </div>

      {/* FORM MODAL (TAMBAH/EDIT) */}
      <ClassesForm
        teachers={initialTeachers}
        isOpen={showForm}
        onClose={closeModal}
        formData={editingData}
        isEditMode={isEditMode}
        onSaveSuccess={() => router.refresh()}
      />

      {/* MODAL KONFIRMASI HAPUS */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete ? `Kelas ${itemToDelete.class_name}` : ""}
      />
    </main>
  );
}
