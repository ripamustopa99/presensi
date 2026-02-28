import AttendanceManager from "@/components/sessions/AttendanceManager";
import { getAllSessions } from "@/lib/services/session.services";
import { getAllClasses } from "@/lib/services/class.services";
import { getAllStudents } from "@/lib/services/students.services"; // Asumsi service ini ada
import { Metadata } from "next";
import { getAuthData } from "@/lib/auth.helper";

export const metadata: Metadata = {
  title: "Presensi Santri | Sistem Akademik",
};

export default async function AttendancePage() {
  const [sessions, classes, students, authData] = await Promise.all([
    getAllSessions(),
    getAllClasses(),
    getAllStudents(),
    getAuthData(),
  ]);

  return (
    <main className="min-h-screen bg-slate-950">
      <AttendanceManager
        initialSessions={sessions}
        classes={classes}
        students={students}
        user={authData}
      />
    </main>
  );
}
