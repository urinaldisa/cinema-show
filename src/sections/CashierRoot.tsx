"use client";

import { Toaster } from "sonner";
import QueryProvider from "../helper/QueryProvider";
import CashierPage from "./CashierPage";

export default function CashierRoot() {
  return (
    <QueryProvider>
      <CashierPage />
      <Toaster richColors position="top-right" closeButton />
    </QueryProvider>
  );
}