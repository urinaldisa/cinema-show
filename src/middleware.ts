// // src/middleware.ts
// import type { MiddlewareHandler } from "astro";

// export const onRequest: MiddlewareHandler = async (ctx, next) => {
//     const { pathname } = new URL(ctx.request.url);

//     // Allowlist: jangan diblok
//     if (
//         pathname === "/login" ||
//         pathname.startsWith("/api/") ||
//         pathname.startsWith("/_astro/") ||
//         pathname.startsWith("/assets/") ||
//         pathname === "/favicon.ico" ||
//         pathname.startsWith("/@") 
//     ) return next();
//     console.log("Cookie header:", ctx.request.headers.get("cookie"));
//     console.log("Parsed token:", ctx.cookies.get("auth_token")?.value);

//     const token = ctx.cookies.get("auth_token")?.value ?? null;

//     if (pathname === "/") {
//         return token ? next() : ctx.redirect("/login");
//     }


//     return next();
// };
