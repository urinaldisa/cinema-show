// src/pages/api/auth/register.ts
import type { APIRoute } from "astro";
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const fd = await request.formData();
  const name = String(fd.get("name") || "").trim();
  const email = String(fd.get("email") || "").trim();
  const password = String(fd.get("password") || "");

  // Validasi input
  if (!name || !email || !password) {
    return redirect(
      `/register?error=${encodeURIComponent("Nama, email, atau password kosong")}`,
      303
    );
  }

  const API_URL = import.meta.env.PUBLIC_API_URL;
  if (!API_URL) {
    console.error("❌ PUBLIC_API_URL tidak diset di .env");
    return redirect(
      `/register?error=${encodeURIComponent("Konfigurasi server salah")}`,
      303
    );
  }

  try {
    // Sesuaikan dengan endpoint backend kamu
    const endpoint = `${API_URL}/auth/register`; // atau /api/auth/register

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const status = res.status;
      let errorMsg = "Registrasi gagal";

      try {
        const errData = await res.json();
        console.error("\n🔴 [REGISTER ERROR]");
        console.error("→ URL     :", endpoint);
        console.error("→ Status  :", status, res.statusText);
        console.error("← Response:", errData);

        errorMsg = errData.message || errData.error || `Error ${status}`;
      } catch {
        const text = await res.text();
        console.error("← Raw Body:", text.slice(0, 500));

        if (status === 409) errorMsg = "Email sudah terdaftar";
        else if (status >= 500) errorMsg = "Server error";
      }

      return redirect(`/register?error=${encodeURIComponent(errorMsg)}`, 303);
    }

    // Parse response sukses
    const data = await res.json().catch(() => ({}));
    const token = data.token || data.data?.token || data.accessToken;

    // Jika backend kasih token saat register: auto-login
    if (token) {
      cookies.set("auth_token", token, {
        path: "/",
        httpOnly: false,     // samain sama login kamu
        sameSite: "lax",
        secure: false,       // set true di production kalau pakai https
        maxAge: 60 * 60 * 24 * 30, // 30 hari
      });
      return redirect("/", 303);
    }

    // Kalau nggak ada token, arahkan ke login dengan pesan sukses
    return redirect(
      `/login?success=${encodeURIComponent("Registrasi berhasil, silakan login.")}`,
      303
    );
  } catch (err) {
    console.error("❌ [FETCH ERROR]", err);
    return redirect(
      `/register?error=${encodeURIComponent("Koneksi ke server gagal")}`,
      303
    );
  }
};
