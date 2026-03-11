"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signup } from "@/app/(auth)/actions";

function SignupForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">CleanTask</h1>
        <p className="text-gray-600">新規アカウント登録</p>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <form action={signup} className="space-y-4">
        <Input
          label="ユーザー名"
          name="username"
          type="text"
          placeholder="表示名を入力"
          required
        />
        <Input
          label="メールアドレス"
          name="email"
          type="email"
          placeholder="メールアドレスを入力"
          required
        />
        <Input
          label="パスワード"
          name="password"
          type="password"
          placeholder="パスワードを入力"
          required
        />
        <Input
          label="パスワード（確認）"
          name="confirmPassword"
          type="password"
          placeholder="パスワードを再入力"
          required
        />
        <Button type="submit" className="w-full">
          登録する
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          すでにアカウントをお持ちの方は
          <Link href="/login" className="text-blue-600 hover:underline ml-1">
            ログイン
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
