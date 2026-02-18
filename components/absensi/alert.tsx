"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  X,
  Plus,
  Calendar,
  Users,
} from "lucide-react";

// --- CUSTOM ALERT ---
export function CustomAlert({ message, type, onClose }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: -20, x: "-50%" }}
      className={`fixed top-10 left-1/2 z-[999] min-w-[320px] p-5 rounded-[2rem] border flex items-center gap-4 shadow-2xl backdrop-blur-xl ${
        type === "success"
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          : "bg-red-500/10 border-red-500/20 text-red-400"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 size={20} />
      ) : (
        <AlertCircle size={20} />
      )}
      <span className="text-[10px] font-black uppercase tracking-widest flex-1">
        {message}
      </span>
      <button onClick={onClose}>
        <X size={16} />
      </button>
    </motion.div>
  );
}

// "use client";
// import { motion, AnimatePresence } from "framer-motion";
// import { AlertCircle, CheckCircle2, X } from "lucide-react";

// export function CustomAlert({
//   message,
//   type,
//   onClose,
// }: {
//   message: string;
//   type: "success" | "error";
//   onClose: () => void;
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20, x: "-50%" }}
//       animate={{ opacity: 1, y: 0, x: "-50%" }}
//       exit={{ opacity: 0, y: -20, x: "-50%" }}
//       className={`fixed top-10 left-1/2 z-[999] min-w-[300px] p-4 rounded-2xl border flex items-center gap-4 shadow-2xl backdrop-blur-xl ${
//         type === "success"
//           ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
//           : "bg-red-500/10 border-red-500/20 text-red-400"
//       }`}
//     >
//       {type === "success" ? (
//         <CheckCircle2 size={20} />
//       ) : (
//         <AlertCircle size={20} />
//       )}
//       <span className="text-[10px] font-black uppercase tracking-widest flex-1">
//         {message}
//       </span>
//       <button
//         onClick={onClose}
//         className="hover:rotate-90 transition-transform"
//       >
//         <X size={16} />
//       </button>
//     </motion.div>
//   );
// }
