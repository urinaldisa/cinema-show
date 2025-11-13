"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import SeatPicker from "./MoviePicker";
import OrderSummary from "./OrderSummary";
import { useCinemas } from "../hooks/api";
import { useCreateOfflineOrder } from "../hooks/useCreateOrder";

export default function CreateOrderForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const emailValid = useMemo(() => {
    if (!email) return false;
    return /\S+@\S+\.\S+/.test(email);
  }, [email]);

  const { data: cinemas } = useCinemas();
  const { mutate: createOrder, isPending } = useCreateOfflineOrder();
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const [cinemaId, setCinemaId] = useState<string | undefined>(params.get("cinemaId") ?? undefined);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(
    (params?.get("seats") ?? "").split(",").filter(Boolean)
  );
  const qc = useQueryClient();
  const seatsData = qc.getQueryData<any[]>(["seats", cinemaId]) ?? [];
  const seatLabel = (m: any) => {
    if (m?.seat_name) return String(m.seat_name);
    if (typeof m?.seat_number === "string") return m.seat_number;
    if (typeof m?.seat_number === "number") return `A${m.seat_number}`;
    return String(m?.id ?? "?");
  };
  const seatLabelMap = useMemo(() => {
    const entries = (seatsData ?? []).map(m => [m.id, seatLabel(m)]);
    return Object.fromEntries(entries) as Record<string, string>;
  }, [seatsData]);

  const seatsPreview = useMemo(
    () => selectedSeatIds.map(id => seatLabelMap[id] ?? id),
    [selectedSeatIds, seatLabelMap]
  );
  const cinemaOptions = useMemo(() => cinemas?.map(c => ({ value: c.id, label: c.name })) ?? [], [cinemas]);
  const cinemaName = useMemo(
    () => cinemaOptions.find((c) => c.value.toString() === cinemaId?.toString())?.label ?? null,
    [cinemaOptions, cinemaId]
  );
  useEffect(() => {
    if (!params) return;
    const u = new URL(window.location.href);
    setParam(u.searchParams, "cinemaId", cinemaId);
    if (selectedSeatIds.length) u.searchParams.set("seats", selectedSeatIds.join(","));
    else u.searchParams.delete("seats");
    window.history.replaceState({}, "", `${u.pathname}?${u.searchParams.toString()}`);
  }, [cinemaId, selectedSeatIds]);


  useEffect(() => {
    setSelectedSeatIds([]);
  }, [cinemaId]);


  return (
    <div className="flex justify-center">
      <div className="w-full max-w-5xl space-y-6 ">
        {/* TITLE */}
        <div className="flex justify-between ">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
              className="h-9 w-9 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50 active:scale-95 transition text-lg"
            >
              ←
            </button>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-sky-950">Buat Offline Order</h2>
          </div>

          <a
            href="/cashier/validate"
            className="group block w-[20vw] rounded-2xl border border-sky-200 bg-sky-50/80
                 hover:border-sky-300 hover:bg-sky-50 transition shadow-sm
                 px-5 py-4 "
            aria-label="Menu kasir"
          >
            <div className="flex h-full items-center justify-between gap-4 min-h-14">
              <div className="min-w-0">
                <h3 className="font-semibold text-sky-900">Validate Ticket</h3>
                <p className="text-xs text-sky-800/70 truncate">
                  Scan Barcode ticket untuk validasi
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
        </div>

        {/* CUSTOMER FORM */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-800">Nama</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
                className="w-full h-11 rounded-xl border border-zinc-300 px-3 outline-none transition
                         focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-800">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
                inputMode="email"
                className={[
                  "w-full h-11 rounded-xl border px-3 outline-none transition",
                  email ? (emailValid ? "border-emerald-400" : "border-rose-400") : "border-zinc-300",
                  "focus:border-sky-500 focus:ring-4 focus:ring-sky-100",
                ].join(" ")}
              />
              {email && !emailValid && (
                <p className="text-xs text-rose-600">Format email kurang valid.</p>
              )}
            </div>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            Data pelanggan akan ikut disimpan bersama order.
          </p>
        </section>

        {/* CINEMA PICKER */}
        <section className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4 md:p-6">
          <h3 className="font-semibold mb-3 text-sky-900">Pilih Bioskop</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {cinemaOptions.map((opt) => {
              const selected = cinemaId === opt.value;
              const imgSrc =
                (opt as any).image ??
                "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop";

              return (
                <button
                  key={opt.value}
                  onClick={() => setCinemaId(String(opt.value))}
                  aria-pressed={selected}
                  className={[
                    "group relative overflow-hidden rounded-2xl border transition will-change-transform",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                    selected
                      ? "border-sky-500 bg-white shadow-sm"
                      : "border-sky-100 bg-white hover:border-sky-300 hover:shadow-sm",
                  ].join(" ")}
                >
                  <div className="aspect-4/3 w-full overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={`Studio ${opt.label}`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3">
                    <div className="min-w-0">
                      <div className="font-medium text-sky-900 truncate">{opt.label}</div>
                      {(opt as any).address && (
                        <div className="text-xs text-sky-700/70 truncate">
                          {(opt as any).address}
                        </div>
                      )}
                    </div>

                    <span
                      className={[
                        "ml-2 rounded-full px-2.5 py-1 text-xs font-semibold",
                        selected
                          ? "bg-sky-100 text-sky-800 border border-sky-200"
                          : "bg-sky-50 text-sky-700 border border-sky-100 opacity-0 group-hover:opacity-100",
                      ].join(" ")}
                    >
                      {selected ? "Dipilih" : "Pilih"}
                    </span>
                  </div>

                  {/* accent gradient fix */}
                  <div
                    className={[
                      "pointer-events-none absolute inset-x-0 top-0 h-1",
                      selected ? "bg-linear-to-r from-sky-400 to-sky-600" : "bg-transparent",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-3 text-xs text-sky-800/70">
            <span className="inline-block h-2 w-2 rounded-full bg-sky-400/80" />
            <span>Pilih salah satu bioskop untuk lanjut</span>
          </div>
        </section>

        {/* SEAT PICKER */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-6">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold">Pilih kursi yang tersedia</h3>
            <div className="text-sm text-zinc-500">{cinemaName ?? "—"}</div>
          </div>

          <div className="mt-3">
            <SeatPicker
              cinemaId={cinemaId}
              values={selectedSeatIds}
              onChange={setSelectedSeatIds}
              maxPick={6}
            />
          </div>
        </section>

        {/* SUMMARY + ORDER */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-6">
          <OrderSummary
            cinemaName={cinemaName}
            seats={seatsPreview}
            pricePerSeat={50000}
            onOrder={() => {
              if (!cinemaId || selectedSeatIds.length === 0) return;

              createOrder(
                {
                  studioId: parseInt(cinemaId),
                  seatIds: selectedSeatIds.map(Number),
                  customerEmail: email,
                  customerName: name,
                },
                {
                  onSuccess: (res) => {
                    setSelectedSeatIds([]);
                    setName("");
                    setEmail("");
                    toast.success("Order offline berhasil 🎉", {
                      description: `Kode pesanan: ${res.booking.booking_code}`,
                      duration: 4000,
                    });
                    qc.invalidateQueries({ queryKey: ["seats"] });
                  },
                  onError: (e: any) => {
                    const status = e?.status ?? 0;
                    const desc =
                      status === 401
                        ? "Sesi berakhir. Silakan login ulang."
                        : status === 409
                          ? "Beberapa kursi sudah diambil orang lain."
                          : e?.message || "Gagal membuat order.";
                    toast.error("Order gagal", {
                      description: desc,
                      duration: 4500,
                      action: {
                        label: status === 409 ? "Refresh kursi" : "Coba lagi",
                        onClick: () => {
                          qc.invalidateQueries({ queryKey: ["seats"], refetchType: "all" });
                        },
                      },
                    });
                  },
                }
              );
            }}
          />
        </section>
      </div>
    </div>
  );

}

function setParam(sp: URLSearchParams, key: string, val?: string | null) {
  if (!val) sp.delete(key); else sp.set(key, val);
}
