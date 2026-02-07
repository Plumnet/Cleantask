import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main>{children}</main>
    </div>
  );
}
