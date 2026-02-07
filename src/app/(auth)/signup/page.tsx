import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">CleanTask</h1>
        <p className="text-gray-600">新規アカウント登録</p>
      </div>

      <form className="space-y-4">
        <Input
          label="ユーザー名"
          type="text"
          placeholder="表示名を入力"
          required
        />
        <Input
          label="ユーザーID"
          type="text"
          placeholder="ログインIDを入力"
          required
        />
        <Input
          label="メールアドレス"
          type="email"
          placeholder="メールアドレスを入力"
          required
        />
        <Input
          label="パスワード"
          type="password"
          placeholder="パスワードを入力"
          required
        />
        <Input
          label="パスワード（確認）"
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
