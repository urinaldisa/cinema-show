"use client";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
export type OrderStatus = "active" | "pending" | "paid" | "failed" | (string & {});

export interface OrderItem {
  id: number;
  booking_code: string;
  user_id?: number;
  user_name: string;
  user_email: string;
  studio_id: number;
  seat_ids: string[];         
  qr_code?: string;          
  booking_type: "online" | "offline" | (string & {});
  status: OrderStatus;
  created_at: string;       
  updated_at: string;          
}
const API_URL = import.meta.env.PUBLIC_API_URL;

export const useGetOrderList = (showtimeId?: string) =>
  useQuery<OrderItem[]>({
    enabled: showtimeId ? true : true,        
    queryKey: ["myOrder", showtimeId ?? null],
    queryFn: async () => {
      const token = Cookies.get("auth_token"); 
      const r = await fetch(`${API_URL}/booking/my-bookings`, {
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err?.message || err?.error || `Fetch failed (${r.status})`);
      }
      return r.json() as Promise<OrderItem[]>;
    },
    refetchInterval: 15_000,
  });
