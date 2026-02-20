"use client";

import { CleaningProvider } from "@/contexts/CleaningContext";

export default function CleaningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CleaningProvider>{children}</CleaningProvider>;
}
