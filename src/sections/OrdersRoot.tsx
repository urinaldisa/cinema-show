// src/sections/orders/OrdersRoot.tsx
"use client";

import OrdersPage from "../components/OrdersPage";
import QueryProvider from "../helper/QueryProvider";
import { Toaster } from "sonner";

export default function OrdersRoot() {
  return (
    <QueryProvider>
      <OrdersPage />
      <Toaster richColors position="top-right" closeButton />
    </QueryProvider>
  );
}