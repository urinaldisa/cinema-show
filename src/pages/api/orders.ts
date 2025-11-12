// src/pages/api/orders.ts
import type { APIRoute } from "astro";
export const prerender = false;

const BASE = import.meta.env.PRIVATE_API_BASE!;

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get("auth_token")?.value;
  if (!BASE) {
  console.error("PRIVATE_API_BASE belum diset");
}
  if (!token) return new Response(JSON.stringify({ error: "UNAUTHENTICATED" }), { status: 401 });
  const body = await request.json();
  const r = await fetch(`${BASE}/booking/online`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return new Response(r.body, {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
  });
};
