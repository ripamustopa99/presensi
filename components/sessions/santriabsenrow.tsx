"use client";

import React, { useState } from "react";
import { Plus, LayoutGrid, ListFilter } from "lucide-react";
import AbsenSessionCard from "./grid";

export default function AbsenManager() {
  const [sessions, setSessions] = useState<any[]>([]); // Data sesi absen
  const [showForm, setShowForm] = useState(false);

  // State untuk form input sesi baru
  const [newSession, setNewSession] = useState({
    kelas: "",
    tanggal: new Date().toISOString().split("T")[0], // Otomatis hari ini
  });

  const createSession = () => {
    if (!newSession.kelas) return alert("Pilih kelas dulu!");

    const sessionData = {
      id: Date.now(),
      ...newSession,
      status: "pending", // pending | selesai
    };

    setSessions([sessionData, ...sessions]);
    setShowForm(false);
  };

  return (
    <div className="p-6 lg:p-10 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Manajemen Absensi
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">
            Kelola kehadiran santri per kelas
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl hover:bg-indigo-500 transition-all active:scale-95"
        >
          <Plus size={18} /> Buat Absensi Baru
        </button>
      </div>

      {/* FORM MODAL SINGKAT (Bisa dipisah filenya) */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black text-white uppercase mb-6">
              Setup Sesi Absen
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
                  Pilih Kelas
                </label>
                <select
                  onChange={(e) =>
                    setNewSession({ ...newSession, kelas: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-2xl outline-none focus:ring-2 ring-indigo-500"
                >
                  <option value="">-- Pilih --</option>
                  <option value="7A">Kelas 7A</option>
                  <option value="7B">Kelas 7B</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={newSession.tanggal}
                  onChange={(e) =>
                    setNewSession({ ...newSession, tanggal: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 text-white p-4 rounded-2xl outline-none focus:ring-2 ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-4 text-slate-500 font-black text-[10px] uppercase tracking-widest"
                >
                  Batal
                </button>
                <button
                  onClick={createSession}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20"
                >
                  Buat Sesi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sessions.map((session) => (
            <AbsenSessionCard
              key={session.id}
              session={session}
              onStart={(s: any) => console.log("Mulai Absen:", s)}
              onEdit={(s: any) => console.log("Edit Sesi:", s)}
            />
          ))}
        </div>
      ) : (
        <div className="h-64 border-2 border-dashed border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-slate-600">
          <LayoutGrid size={48} className="mb-4 opacity-20" />
          <p className="font-bold text-[10px] uppercase tracking-[0.3em]">
            Belum ada sesi absensi dibuat
          </p>
        </div>
      )}
    </div>
  );
}
