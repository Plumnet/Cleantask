import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { DevInspector } from "@/components/DevInspector";
import prisma from "@/lib/prisma";

export default async function MainLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const displayUser = {
    username: user.user_metadata?.username ?? user.email ?? "",
    avatarUrl: undefined as string | undefined,
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [overdueCount, outOfStockCount] = await Promise.all([
    prisma.cleaningItem.count({
      where: { nextCleaningAt: { lte: today } },
    }),
    prisma.consumableItem.count({
      where: { currentStock: 0 },
    }),
  ]);

  const alertCount = overdueCount + outOfStockCount;

  return (
    <div className="min-h-screen bg-neutral-50">
      <DevInspector />
      <Header user={displayUser} alertCount={alertCount} />
      <main>{children}</main>
    </div>
  );
}
