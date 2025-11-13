"use client";
import { useQuery } from "@tanstack/react-query";

const B = "/api";
const API_URL = import.meta.env.PUBLIC_API_URL;

export const useCinemas = () =>
    useQuery<Cinema[]>({ queryKey: ["cinemas"], queryFn: async () => (await fetch(`${API_URL}/cinema/studios`)).json() });

export const useSeats = (cinemaId?: string) =>
    useQuery<Movie[]>({
        enabled: !!cinemaId,
        queryKey: ["seats", cinemaId],
        queryFn: async () => (await fetch(`${API_URL}/cinema/studios/${cinemaId}/seats`)).json(),
    });
export type Cinema = { id: string; name: string; total_seats?: string; };
export type Movie = { id: string; studio_id: number; seat_number?: string; is_available?: boolean; studio_name?: string; studio?: Cinema };

