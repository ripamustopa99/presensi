import { Modal } from "../ui/modal";
const FormModal = (
  showForm,
  closeModal,
  isEditMode,
  formData,
  setFormData,
  handleSave,
) => {
  return (
    <Modal
      isOpen={showForm}
      onClose={closeModal}
      title={isEditMode ? "Update Kelas" : "Tambah Kelas"}
    >
      <div className="space-y-6">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
            Nama Kelas
          </label>
          <input
            type="text"
            placeholder="Misal: 7A"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-5 font-bold text-white outline-none focus:ring-2 ring-indigo-500 transition-all"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
            Nama Wali Kelas
          </label>
          <input
            type="text"
            placeholder="Nama Pengajar"
            value={formData.wali}
            onChange={(e) => setFormData({ ...formData, wali: e.target.value })}
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-5 font-bold text-white outline-none focus:ring-2 ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-4 pt-6">
          <button
            onClick={closeModal}
            className="flex-1 py-5 text-slate-500 font-black uppercase text-[10px] tracking-widest"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
          >
            Simpan Data
          </button>
        </div>
      </div>
    </Modal>
  );
};
