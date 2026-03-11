"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { login } from "@/app/(auth)/actions";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">CleanTask</h1>
        <p className="text-gray-600">アカウントにログイン</p>
      </div>

      {message && (
        <p className="mb-4 text-sm text-green-600 bg-green-50 rounded-md px-3 py-2">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <form action={login} className="space-y-4">
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
        <Button type="submit" className="w-full">
          ログイン
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          アカウントをお持ちでない方は
          <Link href="/signup" className="text-blue-600 hover:underline ml-1">
            新規登録
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
