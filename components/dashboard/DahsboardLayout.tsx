"use client";

import { useState } from "react";

import Header from "@/components/ui/Header";
import { Sidebar } from "@/components/ui/Sidebar";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
export default function DashboardLayout({ children, user }: any) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {/* SIDEBAR DESKTOP */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-[70] p-6 flex flex-col shadow-2xl"
              >
                <Sidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  close={() => setIsSidebarOpen(false)}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
        <aside className="w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 hidden lg:flex flex-col p-6 sticky top-0 h-screen">
          <Sidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSidebarOpen={isSidebarOpen}
          />
        </aside>
        <main className="flex-1 w-full flex flex-col">
          <Header
            user={user}
            activeTab={activeTab}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
