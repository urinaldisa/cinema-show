"use client";
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
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {String(status || "-").toUpperCase()}
    </span>
  );
}

export default function OrdersPage() {
  const { data, isLoading, isError } = useGetOrderList(); // param opsional

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
    <section className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="text-sm text-zinc-600">Riwayat & status pesanan tiket kamu</p>
      </div>

      {!orders.length ? (
        <div className="rounded-2xl border border-dashed p-8 text-center text-zinc-600">
          Belum ada pesanan.
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((o) => (
            <a
              key={o.id}
              href={`/orders/${o.id}`}
              className="group block rounded-2xl border border-zinc-200 bg-white p-4 hover:shadow-sm hover:border-sky-300 transition"
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
                      Kode: {(o.booking_code ?? "").slice(0, 8)}
                    </span>
                    <StatusChip status={o.status} />
                  </div>
                  <div className="text-sm text-zinc-600">
                    {o.user_name} • {o.user_email}
                  </div>
                  {/* <div className="mt-1 text-xs text-zinc-500">
                    Dibuat: {formatDateID(o.created_at)}
                  </div> */}
                </div>

                {/* kanan: meta singkat */}
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">
                    {o.booking_type}
                  </div>
                  <div className="text-xs text-zinc-500">Studio #{o.studio_id}</div>
                </div>
              </div>

              {/* foot: kursi */}
              <div className="mt-3 text-xs text-zinc-600">
                Kursi: {o.seat_ids?.length ? o.seat_ids.join(", ") : "—"}
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
