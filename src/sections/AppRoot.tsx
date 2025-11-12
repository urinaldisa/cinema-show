// src/sections/AppRoot.tsx
"use client";

import QueryProvider from "../helper/QueryProvider";
import HomePage from "./Homepage";


export default function AppRoot() {
  return (
    <QueryProvider>
      <HomePage />
    </QueryProvider>
  );
}
