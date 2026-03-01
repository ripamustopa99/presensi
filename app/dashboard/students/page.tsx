import { getAllStudents } from "@/lib/services/students.services";
import { SantriManager } from "@/components/students/StudentManager";
import { getAllClasses } from "@/lib/services/class.services";
import { Suspense } from "react";
import LoadingPage from "@/components/ui/LoadingPage";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Manajemen Santri | Sistem Akademik",
  description: "Kelola data santri",
};

export default async function DashboardPage() {
  // Ambil data secara paralel untuk menghemat waktu loading
  const [studentsData, classesData] = await Promise.allSettled([
    getAllStudents(),
    getAllClasses(),
  ]);

  // Handle hasil fetch dengan aman
  const allStudents =
    studentsData.status === "fulfilled" ? studentsData.value : [];
  const allClasses =
    classesData.status === "fulfilled" ? classesData.value : [];

  // Log error jika salah satu gagal (untuk internal monitoring)
  if (studentsData.status === "rejected") console.error(studentsData.reason);
  if (classesData.status === "rejected") console.error(classesData.reason);

  return (
    <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      <Suspense fallback={<LoadingPage />}>
        <SantriManager students={allStudents} classes={allClasses} />
      </Suspense>
    </div>
  );
}
