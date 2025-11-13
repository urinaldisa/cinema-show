// src/sections/AppRoot.tsx
"use client";

import HomePage from "../components/Homepage";
import QueryProvider from "../helper/QueryProvider";


export default function AppRoot() {
  return (
    <QueryProvider>
      <HomePage />
    </QueryProvider>
  );
}
