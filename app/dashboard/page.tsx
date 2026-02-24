// import Dashboard from "./Dashboard";
// import { getAuthData } from "@/lib/auth-helper";
// async function Page() {
//   const user = await getAuthData();
//   // const user = { _id: "123", name: "Budi Santoso anggaia", role: "guru" };
// import { useState } from "react";

import Header from "@/components/ui/Header";
import StatCard from "@/components/dashboard/StatCard";
import { ToastAlert } from "@/components/ui/toastalert";
import WelcomeAlert from "../../components/ui/alert";

export default function DashboardPage() {
  // const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  // const [darkMode, setDarkMode] = useState(true);
  // const [activeTab, setActiveTab] = useState("dashboard");
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [santriList, setSantriList] = useState<any[]>([]);

  return (
    // <main className="flex-1 w-full flex flex-col">
    <>
      {/* HEADER */}

      {/* NOTIFIKASI TOAST */}
      {/* <ToastAlert
            isVisible={showToast}
            message={toastMsg}
            onClose={() => setShowToast(false)}
          /> */}

      {/* WELCOME BANNER */}
      {/* {userData && (
            <WelcomeAlert userName={userData.nama} role={userData.role} />
          )} */}

      <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
        {/* HEADER ACTIONS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard label="Total Santri" count={20} color="emerald" />
          <StatCard label="Total Kelas" count="12" color="amber" />
          <StatCard label="Kehadiran" count="98%" color="rose" />
          <StatCard label="Total Guru" count="24" color="indigo" />
        </div>

        <p>uyyy</p>
      </div>
    </>
  );
}
