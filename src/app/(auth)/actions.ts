"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/top");
}

export async function signup(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    redirect("/signup?error=%E3%83%91%E3%82%B9%E3%83%AF%E3%83%BC%E3%83%89%E3%81%8C%E4%B8%80%E8%87%B4%E3%81%97%E3%81%BE%E3%81%9B%E3%82%93");
  }

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password,
    options: {
      data: {
        username: formData.get("username") as string,
      },
    },
  });
  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }
  redirect(
    "/login?message=%E7%99%BB%E9%8C%B2%E3%81%8C%E5%AE%8C%E4%BA%86%E3%81%97%E3%81%BE%E3%81%97%E3%81%9F",
  );
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
