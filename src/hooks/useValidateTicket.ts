// src/hooks/useCreateOrder.ts
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie"; 

export type CreateValidate = {
    bookingCode?: string ;
};

type CreateOrderResponse = {
    id: string;
    status: "PENDING" | "PAID" | "FAILED";
    booking: {
        booking_code: string
    }
    payment_url?: string;         
};

export function useValidateTicket() {
    const API_URL = import.meta.env.PUBLIC_API_URL;
    const token = Cookies.get("auth_token")
    return useMutation({
        mutationFn: async (payload: CreateValidate): Promise<CreateOrderResponse> => {
            const r = await fetch(`${API_URL}/booking/validate`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });
            const data = await r.json().catch(() => ({}));
            if (!r.ok) {
                const msg =
                    data?.message ||
                    data?.error ||
                    (r.status === 401
                        ? "Sesi berakhir. Silakan login ulang."
                        : r.status === 409
                            ? "Beberapa kursi sudah diambil. Pilih kursi lain."
                            : `Gagal membuat order (${r.status})`);
                const err = new Error(msg) as any;
                err.status = r.status;
                err.details = data;
                throw err;
            }
            return data;
        },
    });
}