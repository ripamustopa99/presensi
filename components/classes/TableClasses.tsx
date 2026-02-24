import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Trash2, MoreVertical } from "lucide-react";
const TableClasses = (openEdit) => {
  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Nama Kelas
            </th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Wali Kelas
            </th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">
              Opsi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {classes.length > 0 ? (
            classes.map((c) => (
              <tr
                key={c.id}
                className="group hover:bg-white/[0.01] transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 font-black">
                      {c.nama.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-200 uppercase tracking-tight text-lg">
                      Kelas {c.nama}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-slate-400 font-medium italic">
                  {c.wali}
                </td>
                <td className="px-8 py-6 text-right relative">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === c.id ? null : c.id)
                    }
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {/* DROPDOWN MENU */}
                  <AnimatePresence>
                    {activeMenu === c.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActiveMenu(null)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -10 }}
                          className="absolute right-8 top-16 w-40 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden"
                        >
                          <button
                            onClick={() => openEdit(c)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-600 hover:text-white transition-colors border-t border-white/5"
                          >
                            <Trash2 size={14} /> Hapus
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-8 py-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                  Belum ada data kelas terdaftar
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableClasses;
