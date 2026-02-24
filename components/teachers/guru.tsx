import { Modal } from "../ui/modal";
import { FormInput } from "../ui/Input";
import { Save, X } from "lucide-react";

export function GuruModal({ isOpen, onClose, editingGuru, onSave }: any) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingGuru ? "Update Akun Pengajar" : "Akun Guru Baru"}
    >
      <form onSubmit={onSave} className="space-y-4">
        <FormInput
          label="Email"
          name="email"
          defaultValue={editingGuru?.email}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Username"
            name="username"
            defaultValue={editingGuru?.username}
            required
          />
          <FormInput
            label="Password"
            name="password"
            defaultValue={editingGuru?.password}
            required
          />
        </div>

        {/* Button Action - Menggunakan gaya SidebarItem yang kamu minta */}
        <button
          type="submit"
          className="flex items-center justify-center gap-4 w-full p-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 font-black text-sm mt-4"
        >
          <Save size={20} />
          <span>SIMPAN DATA</span>
        </button>
      </form>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors hidden sm:block"
      >
        <X size={20} />
      </button>
    </Modal>
  );
}
