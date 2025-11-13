"use client";
import { useMemo } from "react";

type Props = {
  cinemaName?: string | null;
  showtimeLabel?: string | null;     
  seats: string[];                   
  pricePerSeat?: number;             
  onOrder?: () => void;
};

const toRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function OrderSummary({
  cinemaName,
  showtimeLabel,
  seats,
  pricePerSeat = 50000,
  onOrder,
}: Props) {
  const seatCount = seats.length;
  const subtotal = useMemo(() => seatCount * pricePerSeat, [seatCount, pricePerSeat]);

  const hasSelection = seatCount > 0;

  return (
    <section className="rounded-2xl border border-sky-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sky-900">Ringkasan Pesanan</h3>
        {hasSelection ? (
          <span className="text-xs px-2 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
            {seatCount} kursi
          </span>
        ) : null}
      </div>

      <div className="mt-3 space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <div className="min-w-16 text-zinc-500">Bioskop</div>
          <div className="flex-1 font-medium">{cinemaName || <span className="text-zinc-400">Belum dipilih</span>}</div>
        </div>


        <div className="flex items-start gap-3">
          <div className="min-w-16 text-zinc-500">Kursi</div>
          <div className="flex-1">
            {hasSelection ? (
              <div className="flex flex-wrap gap-2">
                {seats.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-zinc-400">Belum ada kursi dipilih</span>
            )}
          </div>
        </div>

        <div className="h-px bg-zinc-100 my-2" />

        <div className="flex items-center justify-between">
          <div className="text-zinc-600">
            {seatCount} x {toRupiah(pricePerSeat)}
          </div>
          <div className="text-base font-semibold">{toRupiah(subtotal)}</div>
        </div>
      </div>

      <button
        className={[
          "mt-4 w-full h-10 rounded-lg font-semibold transition",
          hasSelection
            ? "bg-linear-to-r from-sky-500 to-sky-600 text-white hover:brightness-105"
            : "bg-zinc-100 text-zinc-400 cursor-not-allowed",
        ].join(" ")}
        disabled={!hasSelection}
        onClick={hasSelection ? onOrder : undefined}
      >
        {hasSelection ? "Beli Tiket " : "Pilih kursi dulu"}
      </button>

      <p className="mt-2 text-xs text-zinc-500 text-center">
        pastikan data pesanan sudah sesuai.
      </p>
    </section>
  );
}
