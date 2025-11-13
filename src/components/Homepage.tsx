"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { useCinemas } from "../hooks/api";
import SeatPicker from "./MoviePicker";
import OrderSummary from "./OrderSummary";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { toast } from "sonner";
import Greeting from "./Greeting";

export default function HomePage() {
  const { data: cinemas } = useCinemas();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const qc = useQueryClient();

  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const [cinemaId, setCinemaId] = useState<string | undefined>(
    params.get("cinemaId") ?? undefined
  );
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(
    (params?.get("seats") ?? "").split(",").filter(Boolean)
  );

  const seatSectionRef = useRef<HTMLDivElement | null>(null);

  const seatsData = qc.getQueryData<any[]>(["seats", cinemaId]) ?? [];
  const seatLabel = (m: any) => {
    if (m?.seat_name) return String(m.seat_name);
    if (typeof m?.seat_number === "string") return m.seat_number;
    if (typeof m?.seat_number === "number") return `A${m.seat_number}`;
    return String(m?.id ?? "?");
  };
  const seatLabelMap = useMemo(() => {
    const entries = (seatsData ?? []).map((m) => [m.id, seatLabel(m)]);
    return Object.fromEntries(entries) as Record<string, string>;
  }, [seatsData]);

  const seatsPreview = useMemo(
    () => selectedSeatIds.map((id) => seatLabelMap[id] ?? id),
    [selectedSeatIds, seatLabelMap]
  );

  const cinemaOptions = useMemo(
    () => cinemas?.map((c) => ({ value: c.id, label: c.name })) ?? [],
    [cinemas]
  );

  const cinemaName = useMemo(
    () =>
      cinemaOptions.find(
        (c) => c.value.toString() === cinemaId?.toString()
      )?.label ?? null,
    [cinemaOptions, cinemaId]
  );

  useEffect(() => {
    if (!params) return;
    const u = new URL(window.location.href);
    setParam(u.searchParams, "cinemaId", cinemaId);
    if (selectedSeatIds.length)
      u.searchParams.set("seats", selectedSeatIds.join(","));
    else u.searchParams.delete("seats");
    window.history.replaceState(
      {},
      "",
      `${u.pathname}?${u.searchParams.toString()}`
    );
  }, [cinemaId, selectedSeatIds]);

  useEffect(() => {
    setSelectedSeatIds([]);
  }, [cinemaId]);

  useEffect(() => {
    if (!cinemaId) return;
    if (!seatSectionRef.current) return;

    seatSectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [cinemaId]);

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-6xl gap-6 pt-5">
        <div className="space-y-6">
          <Greeting />

          {/* PILIH BIOSKOP */}
          <section className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
            <h2 className="font-semibold mb-3 text-sky-900">Pilih Bioskop</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {cinemaOptions.map((opt) => {
                const selected = cinemaId === opt.value;
                const imgSrc =
                  (opt as any).image ??
                  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200";

                return (
                  <button
                    key={opt.value}
                    onClick={() => setCinemaId(String(opt.value))}
                    aria-pressed={selected}
                    className={[
                      "group relative overflow-hidden rounded-2xl border transition",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                      selected
                        ? "border-sky-500 bg-white shadow-sm"
                        : "border-sky-100 bg-white hover:border-sky-300 hover:shadow-sm",
                    ].join(" ")}
                  >
                    <div className="w-full overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={`Studio ${opt.label}`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3">
                      <div>
                        <div className="font-medium text-sky-900">
                          {opt.label}
                        </div>
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
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs text-sky-800/70">
              <span className="inline-block h-2 w-2 rounded-full bg-sky-400/80" />
              <span>Pilih salah satu bioskop untuk lanjut</span>
            </div>
          </section>

          {/* PILIH KURSI */}
          <section
            ref={seatSectionRef}
            className="rounded-2xl border p-4"
          >
            <h2 className="font-semibold mb-3">Pilih kursi yang tersedia</h2>
            <h2 className="font-semibold mb-3">{cinemaName}</h2>
            <SeatPicker
              cinemaId={cinemaId}
              values={selectedSeatIds}
              onChange={setSelectedSeatIds}
              maxPick={6}
            />
          </section>

          {/* RINGKASAN ORDER */}
          <section className="rounded-2xl border p-4">
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
                  },
                  {
                    onSuccess: (res) => {
                      setSelectedSeatIds([]);
                      toast.success("Order berhasil 🎉", {
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
                            qc.invalidateQueries({
                              queryKey: ["seats"],
                              refetchType: "all",
                            });
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
    </div>
  );
}

function setParam(sp: URLSearchParams, key: string, val?: string | null) {
  if (!val) sp.delete(key);
  else sp.set(key, val);
}
  
