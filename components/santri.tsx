import { Modal } from "./ui/modal";
import { FormInput } from "./ui/forminput";
import { Save, X } from "lucide-react";
import { SelectInput } from "./ui/forminput";
const DAFTAR_KELAS = ["10-A", "10-B", "11-A", "11-B", "12-A"];
export function SantriModal({ isOpen, onClose, editingSantri, onSave }: any) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSantri ? "Update Data" : "Santri Baru"}
    >
      <form onSubmit={onSave} className="space-y-4">
        <FormInput
          label="Nama"
          name="nama"
          defaultValue={editingSantri?.nama}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput label="NIS" name="NIS" defaultValue={editingSantri?.NIS} />
          <SelectInput
            label="Pilih Kelas"
            name="kelas"
            options={DAFTAR_KELAS}
            defaultValue={editingSantri?.kelas}
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
