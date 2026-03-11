import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { DevInspector } from "@/components/DevInspector";

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

  return (
    <div className="min-h-screen bg-neutral-50">
      <DevInspector />
      <Header user={displayUser} />
      <main>{children}</main>
    </div>
  );
}
