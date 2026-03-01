import ClassManager from "@/components/classes/ClassesManager";
import { getAllClasses } from "@/lib/services/class.services";
import { getAllTeachers } from "@/lib/services/teacher.services";
import { Metadata } from "next";
import { Suspense } from "react";
import LoadingPage from "@/components/ui/LoadingPage";
// Metadata untuk SEO dan judul tab browser
export const metadata: Metadata = {
  title: "Manajemen Kelas | Sistem Akademik",
  description: "Kelola data guru",
};

export default async function ClassesPage() {
  const classes = await getAllClasses();

  const [teachersData, classesData] = await Promise.allSettled([
    getAllTeachers(),
    getAllClasses(),
  ]);

  // Handle hasil fetch dengan aman
  const allTeachers =
    teachersData.status === "fulfilled" ? teachersData.value : [];
  const allClasses =
    classesData.status === "fulfilled" ? classesData.value : [];
  return (
    <Suspense fallback={<LoadingPage />}>
      <ClassManager initialClasses={allClasses} initialTeachers={allTeachers} />
    </Suspense>
  );
}
