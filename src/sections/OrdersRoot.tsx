// src/sections/orders/OrdersRoot.tsx
"use client";

import QueryProvider from "../helper/QueryProvider";
import OrdersPage from "./OrdersPage";
import { Toaster } from "sonner";

export default function OrdersRoot() {
  return (
    <QueryProvider>
      <OrdersPage />
      <Toaster richColors position="top-right" closeButton />
    </QueryProvider>
  );
}