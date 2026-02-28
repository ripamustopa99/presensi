// "use client";
"use server";
import { motion } from "framer-motion";
import { getAllClasses } from "@/lib/services/class.services";
import { getAllStudents } from "@/lib/services/auth.service";
import { getAllTeachers } from "@/lib/services/teacher.services";
import {
  Users,
  School,
  BarChart3,
  GraduationCap,
  Plus,
  Calendar,
  ArrowRight,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import {
  AttendanceChart,
  AttendanceChart2,
} from "@/components/dashboard/AttendanceChart";

export default async function BalancedDashboard() {
  const [classes, students, teachers] = await Promise.all([
    getAllClasses(),
    getAllStudents(),
    getAllTeachers(),
  ]);
  return (
    <div className="min-h-screen bg-[#020617] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex justify-end items-center gap-2 mt-1">
          <Calendar size={12} className="text-slate-500" />
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
            Kamis, 26 Februari 2026
          </p>
        </div>

        {/* STATCARDS - COMPACT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Santri"
            count={students.length}
            color="emerald"
            icon={Users}
            trend="+4%↑"
          />
          <StatCard
            label="Total Kelas"
            count={classes.length}
            color="amber"
            icon={School}
          />
          <StatCard
            label="Kehadiran"
            count="98%"
            color="rose"
            icon={BarChart3}
            trend="+2%↑"
          />
          <StatCard
            label="Total Guru"
            count={teachers.length}
            color="indigo"
            icon={GraduationCap}
          />
        </div>

        {/* MAIN CONTENT GRID */}
        <div className=" grid grid-cols-1 lg:grid-cols-2 grid-rows-2 lg:grid-rows-1 gap-6">
          <AttendanceChart2 />
          <AttendanceChart />
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Sesi Hari ini
              </h3>
              {/* <button className="text-[9px] font-black text-indigo-500 uppercase hover:underline">
                Lihat Semua
              </button> */}
            </div>

            <div className="space-y-4">
              {[
                { kelas: "10-A", ustadz: "Iwan", jam: "08:00" },
                { kelas: "11-B", ustadz: "Gigi", jam: "09:15" },
                { kelas: "10-B", ustadz: "Iwan", jam: "10:30" },
              ].map((sesi, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl group cursor-pointer hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-[10px] font-black group-hover:text-indigo-400">
                      {sesi.kelas.split("-")[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">
                        Kelas {sesi.kelas}
                      </p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                        Ustadz {sesi.ustadz}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-slate-600">
                    {sesi.jam}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK LINK / BANNER */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white relative overflow-hidden group cursor-pointer">
            <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
              <BarChart3 size={100} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
              Rekapitulasi
            </p>
            <h4 className="text-lg font-black mt-1">Laporan Bulanan</h4>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
              Buka Sekarang <ArrowRight size={14} />
            </div>
          </div>
        </div>
        {/* FOOTER */}
        <div className="flex justify-center opacity-20 py-4">
          <div className="h-1 w-20 bg-slate-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}
