import { getAllStudents } from "@/lib/services/students.services";
import { SantriManager } from "./SantriManager";

export default async function DashboardPage() {
  const allStudents = await getAllStudents();
  return (
    <div className="p-4 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      <SantriManager students={allStudents} />
    </div>
  );
}
