import React from "react";
import { LayoutGrid } from "lucide-react";
import AbsenSessionCard from "@/components/sessions/SessionCard";

interface AbsenGridProps {
  sessions: any[];
  onStart: (session: any) => void;
  onEdit: (session: any) => void;
  onDelete: (_id: string) => void;
}

export default function AbsenGrid({
  sessions,
  onStart,
  onEdit,
  onDelete,
}: AbsenGridProps) {
  if (sessions.length === 0) {
    return (
      <div className="h-[400px] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-slate-600">
        <LayoutGrid size={48} className="mb-4 opacity-10" />
        <p className="text-[10px] font-black uppercase tracking-widest">
          Belum ada sesi untuk akun ini
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((s) => (
        <AbsenSessionCard
          key={s._id}
          session={s}
          onStart={() => onStart(s)}
          onEdit={() => onEdit(s)}
          onDelete={() => onDelete(s._id)}
        />
      ))}
    </div>
  );
}
