"use client";
import { useState, useEffect } from "react";
import SearchBar from "@/components/ui/SearchBar";
import { Plus } from "lucide-react";
import TeachersTable from "@/components/teachers/TeacherTable";
import { TeacherModal } from "@/components/teachers/TeacherModal";
import { DeleteConfirmModal } from "../ui/DeleteConfirmModal";
import { deleteTeacherAction } from "@/lib/actions/teacher.actions";
import Alert from "../ui/Alert"; // Pastikan path import benar
import { AnimatePresence } from "framer-motion";

export default function TeacherLayout({ data: initialData }: { data: any[] }) {
  const [teachers, setTeachers] = useState(initialData);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editingGuru, setEditingGuru] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setTeachers(initialData);
  }, [initialData]);

  // Fungsi helper untuk memicu alert
  const showAlert = (message: string, type: "success" | "error") => {
    setAlertConfig({ show: true, message, type });
  };

  const confirmDelete = async () => {
    if (selectedItem) {
      try {
        const idToDelete = selectedItem._id;
        const nameToDelete = selectedItem.name;

        await deleteTeacherAction(idToDelete);

        // Update UI secara optimis
        setTeachers((prev) => prev.filter((t) => t._id !== idToDelete));

        setIsDeleteOpen(false);
        setSelectedItem(null);

        // Tampilkan Alert Berhasil
        showAlert(`Guru ${nameToDelete} berhasil dihapus`, "success");
      } catch (error) {
        console.error("Gagal menghapus guru:", error);
        showAlert("Gagal menghapus data guru", "error");
      }
    }
  };

  const filteredData = teachers.filter((t) =>
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* NOTIFIKASI ALERT */}
      <AnimatePresence>
        {alertConfig.show && (
          <Alert
            message={alertConfig.message}
            type={alertConfig.type}
            onClose={() => setAlertConfig((prev) => ({ ...prev, show: false }))}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <SearchBar activeTab={"guru"} setSearchTerm={setSearchTerm} />

        <button
          onClick={() => {
            setEditingGuru(null);
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Plus size={20} /> Tambah Guru
        </button>
      </div>

      <TeachersTable
        data={filteredData}
        onEdit={(item) => {
          setEditingGuru(item);
          setIsModalOpen(true);
        }}
        onDelete={(id) => {
          setSelectedItem(teachers.find((g) => g._id === id));
          setIsDeleteOpen(true);
        }}
      />

      <TeacherModal
        isOpen={isModalOpen}
        onClose={(success, message) => {
          setIsModalOpen(false);
          // Jika modal ditutup karena berhasil (simpan/update)
          if (success) {
            showAlert(message || "Data berhasil disimpan", "success");
          }
        }}
        editingGuru={editingGuru}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedItem?.name || "data ini"}
      />
    </div>
  );
}
