import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">CleanTask</h1>
        <p className="text-gray-600">アカウントにログイン</p>
      </div>

      <form className="space-y-4">
        <Input
          label="ユーザーID"
          type="text"
          placeholder="ユーザーIDを入力"
          required
        />
        <Input
          label="パスワード"
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
