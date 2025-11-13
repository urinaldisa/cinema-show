// src/hooks/useCreateOrder.ts
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { handleJsonResponse } from "../helper/apiError";

export type CreateOrderPayload = {
  studioId: number;
  seatIds: number[];
  customerName?: string;
  customerEmail?: string;
};

type CreateOrderResponse = {
  id: string;
  status: "PENDING" | "PAID" | "FAILED";
  booking: {
    booking_code: string;
  };
  payment_url?: string;
};

const API_URL = import.meta.env.PUBLIC_API_URL;

function createOrderMutation(type: "online" | "offline") {
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
      const token = Cookies.get("auth_token"); 

      const r = await fetch(`${API_URL}/booking/${type}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

        return handleJsonResponse<CreateOrderResponse>(r, {
        401: "Sesi berakhir. Silakan login ulang.",
        409: "Beberapa kursi sudah diambil. Pilih kursi lain.",
      });
    },
  });
}

// API yang lo pakai di komponen tetap sama:
export function useCreateOrder() {
  return createOrderMutation("online");
}

export function useCreateOfflineOrder() {
  return createOrderMutation("offline");
}
