import { Loader2 } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
      <p className="text-slate-400 font-black tracking-widest text-xs uppercase">
        Memverifikasi Sesi...
      </p>
    </div>
  );
};
export default LoadingPage;
