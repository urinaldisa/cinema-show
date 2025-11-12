import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

// React island (kalau pakai client component)
function Greeting() {
  const h = new Date().getHours();
  const waktu =
    h < 11 ? "Pagi" : h < 15 ? "Siang" : h < 19 ? "Sore" : "Malam";
  const qc = useQueryClient();
  async function handleLogout() {
    // 1) Bersihin auth di client
    try {
      Cookies.remove("auth_token", { path: "/" });          // kalau token disimpan di cookie non-HttpOnly
      localStorage.removeItem("auth_token");                // kalau kamu simpan di localStorage
      sessionStorage.clear();                               // kalau ada sisa sampah
    } catch { }

    // 2) Bersihin cache React Query (biar data nggak nyangkut)
    try {
      qc.clear(); // atau: qc.removeQueries(); qc.invalidateQueries();
    } catch { }

    // 3) Kalau pake Zustand persist, optional bersihin key tertentu
    // localStorage.removeItem("zustand-store");

    // 4) Gas ke login (hard redirect biar state bener-bener reset)
    window.location.assign("/login");
  }
  return (
    <section className="rounded-2xl border border-sky-100 bg-white/70 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start  justify-between gap-4">
        <div>
          <p className="text-sm text-sky-700/80">Selamat {waktu}</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-sky-950">
            Selamat datang di <span className="text-sky-600">Cinema XII</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Tonton cinema favoritmu disini
          </p>
        </div>
      </div>
     <div className="w-full">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full my-4">
    {/* My Orders */}
    <a
      href="/orders"
      className="group block w-full rounded-2xl border border-sky-200 bg-sky-50/80
                 hover:border-sky-300 hover:bg-sky-50 transition shadow-sm
                 px-5 py-4 h-full"
      aria-label="Buka daftar pesanan saya"
    >
      <div className="flex h-full items-center justify-between gap-4 min-h-16">
        <div className="min-w-0">
          <h3 className="font-semibold text-sky-900">My Orders</h3>
          <p className="text-xs text-sky-800/70 truncate">
            Lihat riwayat & status pesanan
          </p>
        </div>
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl
                     border border-sky-200 bg-white text-sky-700
                     transition group-hover:translate-x-0.5 group-hover:border-sky-300 shrink-0"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </a>

    {/* Cashier */}
    <a
      href="/cashier"
      className="group block w-full rounded-2xl border border-sky-200 bg-sky-50/80
                 hover:border-sky-300 hover:bg-sky-50 transition shadow-sm
                 px-5 py-4 h-full"
      aria-label="Menu kasir"
    >
      <div className="flex h-full items-center justify-between gap-4 min-h-16">
        <div className="min-w-0">
          <h3 className="font-semibold text-sky-900">Cashier</h3>
          <p className="text-xs text-sky-800/70 truncate">
            Pura pura menjadi kasir
          </p>
        </div>
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl
                     border border-sky-200 bg-white text-sky-700
                     transition group-hover:translate-x-0.5 group-hover:border-sky-300 shrink-0"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </a>

    {/* Logout */}
    <button
      onClick={handleLogout}
      className="group block w-full rounded-2xl border border-rose-200 bg-rose-50/80
                 hover:border-rose-300 hover:bg-rose-50 transition shadow-sm
                 px-5 py-4 h-full text-left"
      aria-label="Keluar"
      type="button"
    >
      <div className="flex h-full items-center justify-between gap-4 min-h-16">
        <div className="min-w-0">
          <h3 className="font-semibold text-rose-900">Logout</h3>
          <p className="text-xs text-rose-800/70 truncate">
            Keluar cinema
          </p>
        </div>
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl
                     border border-rose-200 bg-white text-rose-700
                     transition group-hover:translate-x-0.5 group-hover:border-rose-300 shrink-0"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </button>
  </div>
</div>

    </section>
  );
}

export default Greeting;
