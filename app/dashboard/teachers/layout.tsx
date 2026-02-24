"use client";
import { useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import { Plus } from "lucide-react";
import TeachersTable from "@/components/teachers/TeachersTable";
import { TeacherModal } from "@/components/teachers/TeacherModal";
export default function TeacherLayout(dat: any) {
  const confirmDelete = async () => {
    // if (selectedItem) {
    //   const newList = data.filter((g) => g.id !== selectedItem.id);
    //   setGuruList(newList);
    //   await syncDatabase(newList);
    //   setIsDeleteOpen(false);
    //   triggerToast(`Data ${selectedItem.nama} dihapus!`);
    //   setSelectedItem(null);
  };
  //   };
  const [editingGuru, setEditingGuru] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [data, setGuruList] = useState([]);
  const data = [
    {
      _id: "1771457245683",
      role: "guru",
      email: "ad@pondok.id",
      username: "1010",
      password: "1100",
      name: "asdf",
    },
  ];
  return (
    <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
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
        data={data}
        onEdit={(item) => {
          setEditingGuru(item);
          setIsModalOpen(true);
        }}
        onDelete={(_id) => {
          const item = data.find((g) => g._id === _id);
          setIsDeleteOpen(true);
        }}
      />
      <TeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingGuru={editingGuru}
      />
    </div>
  );
}
