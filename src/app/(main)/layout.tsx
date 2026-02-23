import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { DevInspector } from "@/components/DevInspector";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <DevInspector />
      <Header />
      <main>{children}</main>
    </div>
  );
}
