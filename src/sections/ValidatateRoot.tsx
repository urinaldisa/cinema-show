"use client";

import { Toaster } from "sonner";
import QueryProvider from "../helper/QueryProvider";
import BarcodeValidator from "../components/BarcodeValidator";

export default function ValidationRoot() {
  return (
    <QueryProvider>
      <BarcodeValidator />
      <Toaster richColors position="top-right" closeButton />
    </QueryProvider>
  );
}