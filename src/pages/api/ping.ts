// src/pages/api/ping.ts
import type { APIRoute } from "astro";
export const GET: APIRoute = async () => new Response("pong");
