"use client";
import { useState } from "react";
import { useGetOrderList, type OrderItem } from "../hooks/useGetOrderList";

function StatusChip({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  const map: Record<string, string> = {
    active: "bg-sky-50 text-sky-700 border-sky-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    failed: "bg-rose-50 text-rose-700 border-rose-200",
  };
  const cls = map[s] ?? "bg-zinc-50 text-zinc-700 border-zinc-200";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {String(status || "-").toUpperCase()}
    </span>
  );
}

export default function OrdersPage() {
  const { data, isLoading, isError } = useGetOrderList();
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  if (isLoading) {
    return (
      <section className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="h-24 rounded-2xl bg-zinc-100 animate-pulse" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="max-w-5xl mx-auto p-4 md:p-8">
        <p className="text-rose-600">Gagal memuat pesanan.</p>
      </section>
    );
  }

  const orders: OrderItem[] = data ?? [];

  return (
    <>
      <section className="max-w-5xl mx-auto md:p-8">
        <div className="flex items-start gap-3 mb-5">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="h-9 w-9 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50 active:scale-95 transition text-lg"
          >
            ←
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-sky-950">
              Order History
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Ketuk salah satu order untuk melihat QR tiket dalam ukuran
              lebih besar.
            </p>
          </div>
        </div>

        {!orders.length ? (
          <div className="rounded-2xl border border-dashed p-8 text-center text-zinc-600">
            Belum ada pesanan.
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((o) => (
              <div
                key={o.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (o.qr_code) {
                    setPreviewSrc(o.qr_code);
                  }
                }}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && o.qr_code) {
                    setPreviewSrc(o.qr_code);
                  }
                }}
                className="group rounded-2xl border border-zinc-200 bg-white p-4 hover:shadow-sm hover:border-sky-300 transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* QR thumbnail */}
                  <div className="shrink-0">
                    {o.qr_code ? (
                      <img
                        src={o.qr_code}
                        alt="QR"
                        className="h-16 w-16 rounded-lg border border-zinc-200 object-contain bg-white"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg border border-zinc-200 bg-zinc-50" />
                    )}
                  </div>

                  {/* info utama */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">
                        Kode: {o.booking_code ?? ""}
                      </span>
                      <StatusChip status={o.status} />
                    </div>
                    <div className="text-sm text-zinc-600">
                      {o.user_name} • {o.user_email}
                    </div>
                  </div>

                  {/* kanan: meta singkat */}
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">
                      {o.booking_type}
                    </div>
                    <div className="text-xs text-zinc-500">
                      Studio #{o.studio_id}
                    </div>
                  </div>
                </div>

                {/* foot: kursi */}
                <div className="mt-3 text-xs text-zinc-600">
                  Kursi:{" "}
                  {o.seat_ids?.length ? o.seat_ids.join(", ") : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal QR preview */}
      {previewSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setPreviewSrc(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-700 text-xl leading-none"
              onClick={() => setPreviewSrc(null)}
            >
              ×
            </button>
            <h3 className="text-sm font-semibold text-zinc-800 mb-3">
              QR Code Tiket
            </h3>
            <div className="bg-zinc-50 rounded-xl p-3 flex items-center justify-center">
              <img
                src={previewSrc}
                alt="QR preview"
                className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
              />
            </div>
            <p className="mt-2 text-[11px] text-zinc-500 text-center">
              Tunjukkan QR ini ke petugas untuk proses check-in.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
