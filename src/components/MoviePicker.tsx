// SeatPicker.tsx
"use client";
import { useMemo } from "react";
import { useSeats, type Movie } from "../hooks/api";

type Props = { cinemaId?: string; values: string[]; onChange: (next: string[]) => void; maxPick?: number };

export default function SeatPicker({ cinemaId, values, onChange, maxPick }: Props) {
  // 1) Hook selalu dipanggil, biar urutannya konsisten
  const { data, isLoading } = useSeats(cinemaId); // pastikan di dalam hook pakai enabled: !!cinemaId

  // 2) Hook lain juga selalu dipanggil
  const list = useMemo(() => {
    const arr = [...(data ?? [])].map((m) => {
      const code = (m as any).seat_number;
      const seatStr = typeof code === "number" ? `A${code}` : String(code ?? "");
      return { ...m, seat_number: seatStr } as Movie & { seat_number: string };
    });
    // tetap pakai sort kamu
    arr.sort((a, b) => Number((a as any)?.seat_number?.slice(1)) - Number((b as any)?.seat_number?.slice(1)));
    return arr;
  }, [data]);

  const picked = useMemo(() => new Set(values), [values]);

  // 3) Setelah semua hooks dipanggil, baru conditional UI
  if (!cinemaId) return <div className="text-sm text-zinc-500">Pilih bioskop dulu.</div>;
  if (isLoading) return <div className="h-28 rounded-lg bg-zinc-100 animate-pulse" />;

  const toggle = (id: string, disabled: boolean) => {
    if (disabled) return;
    const next = new Set(picked);
    next.has(id) ? next.delete(id) : (maxPick && next.size >= maxPick ? null : next.add(id));
    onChange([...next]);
  };

  return (
    <>
      <div className="h-[5vh] bg-gray-500 mb-5 flex justify-center items-center font-semibold text-white">
        <p>SCREEN IN HERE</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {list.map((m) => {
          const selected = picked.has(m.id);
          const disabled = m.is_available === false;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => toggle(m.id, disabled)}
              disabled={disabled}
              role="checkbox"
              aria-checked={selected}
              className={[
                "flex items-center gap-4 rounded-xl border p-4 text-left transition",
                disabled
                  ? "opacity-50 cursor-not-allowed border-zinc-200 bg-zinc-50"
                  : selected
                    ? "border-sky-500 bg-sky-50 hover:border-sky-600"
                    : "border-zinc-200 hover:border-zinc-700",
              ].join(" ")}
            >
              <div className="w-20 h-28 bg-zinc-200 rounded-md overflow-hidden" />
              <div className="flex-1">
                <div className="font-semibold">{(m as any).seat_number}</div>
                {/* saya mendapat issue backend tidak update status ticket saat sudah terjual */}
                <div className="text-sm text-zinc-500">{m.is_available ? "Tersedia" : "Terjual"}</div>
              </div>
              <span className={["ml-auto rounded-full px-2.5 py-1 text-xs font-semibold border",
                selected ? "bg-sky-100 text-sky-800 border-sky-200" : "bg-zinc-50 text-zinc-600 border-zinc-200"
              ].join(" ")}>
                {selected ? "Dipilih" : "Pilih"}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
