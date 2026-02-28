import TeacherLayout from "@/components/teachers/TeacherManager";
import { getAllTeachers } from "@/lib/services/teacher.services";

export const dynamic = "force-dynamic";

export default async function TeacherPage() {
  // try {
  const data = await getAllTeachers();

  //   if (!data || data.length === 0) {
  //     return (
  //       <div className="p-8 text-center">
  //         <p>Belum ada data guru yang tersedia.</p>
  //       </div>
  //     );
  //   }

  return (
    <main className="container mx-auto py-6">
      <TeacherLayout data={data} />
    </main>
  );
  // } catch (error) {
  //   // Log error untuk kebutuhan debugging
  //   console.error("Failed to fetch teachers:", error);

  //   return (
  //     <div className="p-8 text-center text-red-500">
  //       <p>Gagal memuat data guru. Silakan coba lagi nanti.</p>
  //     </div>
  //   );
  // }
}
