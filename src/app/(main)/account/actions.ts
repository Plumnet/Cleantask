"use server";

import { createClient } from "@/lib/supabase/server";

type ActionState = { success?: string; error?: string };

export async function updateProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.updateUser({
    email,
    data: { username },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "プロフィールを保存しました" };
}
