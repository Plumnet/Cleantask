"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { updateProfile } from "@/app/(main)/account/actions";

type Props = {
  username: string;
  email: string;
};

const initialState: { success?: string; error?: string } = {};

export function ProfileForm({ username, email }: Props) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  return (
    <>
      {state.success && (
        <p className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          {state.success}
        </p>
      )}
      {state.error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {state.error}
        </p>
      )}
      <div className="flex items-center gap-4 mb-6">
        <Avatar name={username} size="lg" />
        <Button variant="secondary" size="sm" type="button">
          画像を変更
        </Button>
      </div>
      <form action={formAction} className="space-y-4">
        <Input
          label="ユーザー名"
          name="username"
          type="text"
          defaultValue={username}
          required
        />
        <Input
          label="メールアドレス"
          name="email"
          type="email"
          defaultValue={email}
          required
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "保存中..." : "保存する"}
          </Button>
        </div>
      </form>
    </>
  );
}
