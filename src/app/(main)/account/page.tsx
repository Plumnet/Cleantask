import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/ProfileForm";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const username = user.user_metadata?.username ?? user.email ?? "";
  const email = user.email ?? "";

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">アカウント設定</h1>

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            プロフィール
          </h2>
          <ProfileForm username={username} email={email} />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            パスワード変更
          </h2>
          <form className="space-y-4">
            <Input
              label="現在のパスワード"
              type="password"
              placeholder="現在のパスワードを入力"
              required
            />
            <Input
              label="新しいパスワード"
              type="password"
              placeholder="新しいパスワードを入力"
              required
            />
            <Input
              label="新しいパスワード（確認）"
              type="password"
              placeholder="新しいパスワードを再入力"
              required
            />
            <div className="flex justify-end">
              <Button type="submit">パスワードを変更</Button>
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-red-600">
            アカウント削除
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            アカウントを削除すると、すべてのデータが完全に削除されます。この操作は取り消せません。
          </p>
          <Button variant="danger">アカウントを削除</Button>
        </Card>
      </div>
    </PageContainer>
  );
}
