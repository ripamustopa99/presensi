import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";
interface NavLinkProps {
  id: string;
  label: string;
  active: boolean;
  onClick: (id: string) => void;
}

export function NavLink({ id, label, active, onClick }: NavLinkProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`relative text-lg font-medium transition-colors ${active ? "text-emerald-700" : "text-slate-700 hover:text-emerald-600"}`}
    >
      {label}
      {active && (
        <motion.span
          layoutId="underline"
          className="absolute left-0 right-0 h-[3px] bg-emerald-600 bottom-[-8px] rounded-full"
        />
      )}
    </button>
  );
}

export function MobileNavLink({
  id,
  label,
  onClick,
}: Omit<NavLinkProps, "active">) {
  return (
    <button
      onClick={() => onClick(id)}
      className="block text-left text-base font-medium text-slate-700 hover:text-emerald-600 py-2 px-4 rounded-lg transition-colors"
    >
      {label}
    </button>
  );
}

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
  isDark?: boolean;
}

export function SectionTitle({
  icon,
  title,
  isDark = false,
}: SectionTitleProps) {
  const textColor = isDark ? "text-white" : "text-slate-800";
  const iconColor = isDark ? "text-emerald-400" : "text-emerald-700";
  const lineColor = isDark ? "bg-emerald-400/50" : "bg-emerald-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
      className="inline-block"
    >
      <h3
        className={`font-serif text-3xl md:text-4xl font-extrabold ${textColor} relative pb-4`}
      >
        <span className="relative z-10">{title}</span>
        <span
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1.5 ${lineColor} rounded-full`}
        />
      </h3>
      <div
        className={`mt-4 w-12 h-12 flex items-center justify-center rounded-full mx-auto ${iconColor} bg-opacity-10`}
        style={{
          backgroundColor: isDark
            ? "rgba(52, 211, 153, 0.1)"
            : "rgba(16, 185, 129, 0.1)",
        }}
      >
        {/* {React.cloneElement(icon as React.ReactElement, { size: 24 })} */}
      </div>
    </motion.div>
  );
}

interface ProgramCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function ProgramCard({ title, description, icon }: ProgramCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
    >
      <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-6">
        {/* {React.cloneElement(icon as React.ReactElement, { size: 32 })} */}
      </div>
      <h4 className="font-bold text-xl text-slate-800 mb-3">{title}</h4>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

interface FacilityCardProps {
  title: string;
  description: string;
  icon: string; // Emoji for simplicity
}

export function FacilityCard({ title, description, icon }: FacilityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 flex flex-col items-center text-center"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="font-bold text-xl text-slate-800 mb-2">{title}</h4>
      <p className="text-slate-600 text-sm">{description}</p>
    </motion.div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  avatar,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-left relative overflow-hidden"
    >
      <QuoteIcon />
      <p className="relative z-10 text-lg italic text-slate-700 mb-6 leading-relaxed">
        "{quote}"
      </p>
      <div className="flex items-center gap-4 relative z-10">
        <Image
          src={avatar}
          alt={author}
          width={56}
          height={56}
          className="rounded-full object-cover"
        />
        <div>
          <h5 className="font-bold text-slate-800">{author}</h5>
          <p className="text-sm text-slate-500">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function QuoteIcon() {
  return (
    <svg
      className="absolute top-4 right-4 text-emerald-100/50 w-24 h-24"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M13 14.725c0-5.405 3.303-9.873 8-11.725l-.995 2.149c-3.267 1.522-5.005 4.786-5.005 9.576v.001h5l-.994 2.149c-3.266 1.522-5.006 4.786-5.006 9.576v.001h-5v-.001c0-3.957 2.053-7.79 5-9.764zm-13 0c0-5.405 3.303-9.873 8-11.725l-.995 2.149c-3.267 1.522-5.005 4.786-5.005 9.576v.001h5l-.994 2.149c-3.266 1.522-5.006 4.786-5.006 9.576v.001h-5v-.001c0-3.957 2.053-7.79 5-9.764z" />
    </svg>
  );
}
