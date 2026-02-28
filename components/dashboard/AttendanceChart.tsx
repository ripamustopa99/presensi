"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const data = [
  { name: "Sen", hadir: 85 },
  { name: "Sel", hadir: 88 },
  { name: "Rab", hadir: 20 },
  { name: "Kam", hadir: 90 },
  { name: "Jum", hadir: 95 },
  { name: "Sab", hadir: 98 },
];

export function AttendanceChart() {
  return (
    <div className="h-full w-full bg-slate-900/50 p-6 rounded-xl border border-white/5 shadow-2xl">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 ml-2">
        Tren Kehadiran Mingguan (%)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#ffffff05"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #ffffff10",
              borderRadius: "12px",
              fontSize: "10px",
            }}
            itemStyle={{ color: "#818cf8", fontWeight: "bold" }}
          />
          <Area
            type="monotone"
            dataKey="hadir"
            stroke="#6366f1"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorHadir)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

import { BarChart, Bar, Cell } from "recharts";

export function AttendanceChart2() {
  const data = [
    { name: "10-A", hadir: 18, total: 20 },
    { name: "10-B", hadir: 15, total: 20 },
    { name: "11-A", hadir: 20, total: 20 },
    { name: "11-B", hadir: 12, total: 20 },
    { name: "12-A", hadir: 19, total: 20 },
    { name: "12-B", hadir: 17, total: 20 },
  ];
  return (
    <div className="h-full min-h-[350px] w-full bg-slate-900/40 backdrop-blur-md p-8 rounded-xl border border-white/5 shadow-2xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-white font-black text-sm uppercase tracking-tighter">
            Statistik Per Kelas
          </h3>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
            Kehadiran Santri Hari Ini
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase">
              Hadir
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#ffffff05"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 10, fontWeight: "bold" }}
          />
          <Tooltip
            cursor={{ fill: "#ffffff05" }}
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #ffffff10",
              borderRadius: "12px",
            }}
            itemStyle={{
              fontSize: "10px",
              fontWeight: "bold",
              color: "#818cf8",
            }}
          />
          <Bar dataKey="hadir" radius={[6, 6, 0, 0]} barSize={30}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.hadir < 15 ? "#f43f5e" : "#6366f1"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
