import { Modal } from "./Modal";
import { Trash2, AlertTriangle, X } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus Data?">
      <div className="text-center pb-4">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} />
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Apakah Anda yakin ingin menghapus data
          <span className="font-black text-slate-900 dark:text-white">
            "{itemName}"
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={onConfirm}
          className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-rose-500 text-white font-black text-sm shadow-lg shadow-rose-200 dark:shadow-none hover:bg-rose-600 transition-all active:scale-95"
        >
          <Trash2 size={18} />
          Ya, Hapus Sekarang
        </button>
        <button
          onClick={onClose}
          className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-sm hover:bg-slate-200 transition-all"
        >
          Batalkan
        </button>
      </div>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors hidden sm:block"
      >
        <X size={20} />
      </button>
    </Modal>
  );
}
