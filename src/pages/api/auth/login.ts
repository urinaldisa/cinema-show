import type { APIRoute } from "astro";
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const fd = await request.formData();
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");

    // Validasi input
    if (!email || !password) {
        return redirect("/login?error=Email%20atau%20password%20kosong", 303);
    }

    const API_URL = import.meta.env.PUBLIC_API_URL;
    if (!API_URL) {
        console.error("❌ PUBLIC_API_URL tidak diset di .env");
        return redirect("/login?error=Konfigurasi%20server%20salah", 303);
    }

    try {
        // 🔧 Pastikan endpoint benar (sesuaikan dengan backend)
        const endpoint = `${API_URL}/auth/login`; // atau /api/auth/login

        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        // Handle error response
        if (!res.ok) {
            const status = res.status;
            let errorMsg = "Login%20gagal";

            try {
                const errData = await res.json();
                console.error("\n🔴 [LOGIN ERROR]");
                console.error("→ URL     :", endpoint);
                console.error("→ Status  :", status, res.statusText);
                console.error("← Response:", errData);

                // Ambil pesan error dari backend
                errorMsg = encodeURIComponent(
                    errData.message || errData.error || `Error ${status}`
                );
            } catch {
                // Kalau response bukan JSON
                const text = await res.text();
                console.error("← Raw Body:", text.slice(0, 500));

                if (status === 401) errorMsg = "Email%20atau%20password%20salah";
                else if (status === 404) errorMsg = "Endpoint%20tidak%20ditemukan";
                else if (status >= 500) errorMsg = "Server%20error";
            }

            return redirect(`/login?error=${errorMsg}`, 303);
        }

        // Parse response sukses
        const data = await res.json();
        const token = data.token || data.data?.token || data.accessToken;

        if (!token) {
            console.error("❌ Token tidak ada di response:", data);
            return redirect("/login?error=Token%20tidak%20ditemukan", 303);
        }
        
        cookies.set("auth_token", token, {
            path: "/",
            httpOnly: false,    
            sameSite: "lax",
            secure: false,
            maxAge: 60 * 60 * 24 * 30,
        });

        return redirect("/", 303);

    } catch (err) {
        console.error("❌ [FETCH ERROR]", err);
        return redirect("/login?error=Koneksi%20ke%20server%20gagal", 303);
    }
};