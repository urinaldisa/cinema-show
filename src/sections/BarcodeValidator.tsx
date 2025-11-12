"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
// import { useValidateTicket } from "../../hooks/cashier";

export default function BarcodeValidator() {
  const [code, setCode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
//   const validate = useValidateTicket();

//   const onValidate = async () => {
//     if (!code.trim()) {
//       toast.error("Kode kosong", { description: "Masukkan kode tiket" });
//       inputRef.current?.focus();
//       return;
//     }
//     try {
//       const res = await validate.mutateAsync({ code: code.trim() });
//       toast.success("Tiket valid ✅", {
//         description: `Kode ${res.booking_code.slice(0,8)} • status: ${res.status}`,
//       });
//       setCode("");
//     } catch (e: any) {
//       const msg = e?.message ?? "Tiket tidak valid atau sudah digunakan.";
//       toast.error("Validasi gagal", { description: msg });
//     }
//   };

  return (
    <div className="space-y-3">
      <div className="text-sm text-zinc-600">
        Tempel kode barcode (atau ketik manual), lalu klik validasi.
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Mis. 3310fe1d-10e4-4d67-a38b-79a050c77e29"
          className="flex-1 h-10 rounded-lg border border-zinc-300 px-3 outline-none focus:border-sky-400"
        />
        {/* <button
          onClick={onValidate}
          disabled={validate.isPending}
          className="h-10 px-4 rounded-lg bg-sky-600 text-white font-semibold disabled:opacity-60"
        >
          {validate.isPending ? "Memeriksa…" : "Validasi"}
        </button> */}
      </div>

      {/* Placeholder area kamera (opsional) */}
      <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-xs text-zinc-500">
        Kamera scanner bisa dimasukin nanti. Untuk sekarang, pakai input kode dulu.
      </div>
    </div>
  );
}
