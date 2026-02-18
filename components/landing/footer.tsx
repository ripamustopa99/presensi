export default function Footer() {
  return (
    <footer className="bg-emerald-900 py-10 px-6 text-white text-center text-sm">
      <div className="max-w-6xl mx-auto">
        <p>
          &copy; {new Date().getFullYear()} Pesantren Al Musthofa Nangorak. Hak
          Cipta Dilindungi.
        </p>
        <p className="mt-2 text-xs opacity-80">
          Didesain dengan ❤️ untuk generasi masa depan Islami.
        </p>
      </div>
    </footer>
  );
}
