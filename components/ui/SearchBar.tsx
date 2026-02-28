"use client";

import React from "react";
import { Search } from "lucide-react";

// Definisikan interface agar tidak merah
interface SearchBarProps {
  activeTab: string; // Untuk placeholder dinamis
  setSearchTerm: (val: string) => void; // Fungsi untuk update state pencarian
}

export default function SearchBar({
  activeTab,
  setSearchTerm,
}: SearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between w-full md:max-w-md">
      <div className="relative flex-1 w-full">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          // Placeholder akan berubah otomatis: "Cari data guru..." atau "Cari data santri..."
          placeholder={`Cari data ${activeTab}...`}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl shadow-sm outline-none focus:ring-2 ring-indigo-500 transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}
// "use client";

// import React, { useState, useRef } from "react";
// import { Search, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// interface SearchBarProps {
//   activeTab: string;
//   setSearchTerm: (val: string) => void;
// }

// export default function SearchBar({
//   activeTab,
//   setSearchTerm,
// }: SearchBarProps) {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleExpand = () => {
//     setIsExpanded(true);
//     setTimeout(() => inputRef.current?.focus(), 200);
//   };

//   const handleClose = (e: React.MouseEvent) => {
//     e.stopPropagation(); // Biar nggak trigger handleExpand lagi
//     setIsExpanded(false);
//     setSearchTerm("");
//     if (inputRef.current) inputRef.current.value = "";
//   };

//   return (
//     <div className="flex items-center justify-end sm:ml-0sm:w-full h-12">
//       <motion.div
//         initial={false}
//         animate={{
//           width: isExpanded ? "100%" : "50px",
//           maxWidth: isExpanded ? "400px" : "50px",
//         }}
//         transition={{ type: "spring", stiffness: 350, damping: 25 }}
//         className={`relative p-4 flex items-center h-11 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm overflow-hidden transition-colors ${
//           isExpanded
//             ? "border-indigo-500 ring-2 ring-indigo-500/10"
//             : "border-slate-200 dark:border-slate-800"
//         }`}
//       >
//         {/* ICON SEARCH: Tetap di kiri dengan posisi fixed width */}
//         <div
//           onClick={handleExpand}
//           className="flex items-center justify-center min-w-[50px] h-full text-slate-400  cursor-pointer"
//         >
//           <Search size={20} />
//         </div>

//         {/* INPUT: Mengisi sisa ruang yang ada */}
//         <input
//           ref={inputRef}
//           type="text"
//           placeholder={isExpanded ? `Cari ${activeTab}...` : ""}
//           className={`flex-1 bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 transition-opacity duration-300 ${
//             isExpanded ? "opacity-100 px-1" : "opacity-0 p-0"
//           }`}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onBlur={() => {
//             if (!inputRef.current?.value) setIsExpanded(false);
//           }}
//         />

//         {/* TOMBOL CLOSE: Berada di dalam aliran flex (kanan) */}
//         <AnimatePresence>
//           {isExpanded && (
//             <motion.div
//               initial={{ opacity: 0, x: 10 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 10 }}
//               className="flex items-center justify-center min-w-[40px] h-full"
//             >
//               <button
//                 onClick={handleClose}
//                 className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
//               >
//                 <X size={16} />
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// }
