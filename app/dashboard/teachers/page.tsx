import TeacherLayout from "@/components/teachers/TeacherManager";
import { getAllTeachers } from "@/lib/services/teacher.services";
import LoadingPage from "@/components/ui/LoadingPage";
export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Manajemen Guru | Sistem Akademik",
  description: "Kelola data kelas dan wali kelas",
};
export default async function TeacherPage() {
  const data = await getAllTeachers();
  return (
    <Suspense fallback={<LoadingPage />}>
      <TeacherLayout data={data} />
    </Suspense>
  );
}
