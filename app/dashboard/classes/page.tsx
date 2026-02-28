import ClassManager from "@/components/classes/ClassesManager";
import { getAllClasses } from "@/lib/services/class.services";
import { getAllTeachers } from "@/lib/services/teacher.services";
import { Metadata } from "next";

// Metadata untuk SEO dan judul tab browser
export const metadata: Metadata = {
  title: "Manajemen Kelas | Sistem Akademik",
  description: "Kelola data kelas dan wali kelas",
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
    <main className="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      <ClassManager initialClasses={allClasses} initialTeachers={allTeachers} />
    </main>
  );
}
