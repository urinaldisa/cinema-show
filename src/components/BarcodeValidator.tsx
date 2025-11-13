"use client";

import { useState, useCallback } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "sonner";
import { useValidateTicket } from "../hooks/useValidateTicket";

type TicketPayload = {
  bookingCode: string;
  timestamp: string;
  seatsIds: string[];
};

export default function BarcodeValidator() {
  const [isScanning, setIsScanning] = useState(true);
  const [lastDecoded, setLastDecoded] = useState<string | null>(null);

  const { mutateAsync: validateTicket, isPending } = useValidateTicket();

  const handleDecoded = useCallback(
    async (value: string | TicketPayload) => {
      if (!value) return;

      const payload: TicketPayload =
        typeof value === "string" ? JSON.parse(value) : value;

      if (payload.bookingCode === lastDecoded) return;

      setLastDecoded(payload.bookingCode);
      setIsScanning(false);

      try {
        await validateTicket({
          bookingCode: payload.bookingCode,
        });

        toast.success("Tiket valid ✅", {
          description: `Kode ${payload.bookingCode} validated!`,
        });
      } catch (e: any) {
        toast.error("Validasi gagal", {
          description:
            e?.message ?? "Tiket tidak valid atau sudah digunakan.",
        });
        setIsScanning(true);
      }
    },
    [lastDecoded, validateTicket]
  );

  const handleError = (err: any) => {
    toast.error("Kamera tidak bisa dipakai", {
      description:
        typeof err?.message === "string"
          ? err.message
          : "Cek permission kamera atau pastikan pakai HTTPS / localhost.",
    });
    setIsScanning(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="h-9 w-9 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50 active:scale-95 transition text-lg"
        >
          ←
        </button>
        <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-sky-950">Ticket Validation</h2>

          <p className="mt-1 text-xs text-zinc-500">
            Buka kamera, arahkan ke barcode e-ticket atau gelang. Sistem akan
            cek status tiket secara real-time biar antrian nggak drama.
          </p>
        </div>
      </div>
      {/* Scanner / Info box */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3">
        {isScanning ? (
          <div className="flex justify-center">
            <div className="relative w-full max-w-xs aspect-[3/4] rounded-2xl overflow-hidden bg-black">
              <Scanner
                onScan={(e) => {
                  if (Array.isArray(e) && e.length > 0 && e[0].rawValue) {
                    handleDecoded(e[0].rawValue);
                  }
                }}
                onError={handleError}
                constraints={{
                  facingMode: "environment",
                }}
              />

              \            </div>
          </div>
        ) : (
          <div className="p-4 text-xs text-zinc-500 text-center">
            Kamera scanner akan muncul setelah klik{" "}
            <b className="font-semibold text-zinc-700">Start Scan</b>.
            <br />
            Khusus browser mobile, pastikan izin kamera sudah aktif. iOS Safari
            wajib HTTPS atau localhost.
          </div>
        )}

      </div>
      <div className="flex w-full items-center gap-2">
        {!isScanning ? (
          <button
            onClick={() => {
              setLastDecoded(null);
              setIsScanning(true);
            }}
            className="h-10 px-4 w-full rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            type="button"
            disabled={isPending}
          >
            {isPending ? "Validating..." : "Start Scan"}
          </button>
        ) : (
          <button
            onClick={() => setIsScanning(false)}
            className="h-10 w-full px-4 rounded-lg bg-zinc-200 text-zinc-900 text-sm font-semibold hover:bg-zinc-300 transition"
            type="button"
          >
            Stop
          </button>
        )}
        {isPending && (
          <span className="text-xs text-zinc-500">
            Sedang validasi tiket...
          </span>
        )}
      </div>
    </div>
  );
}
