import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { mockUser } from "@/data/mockUser";

export default function AccountPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">アカウント設定</h1>

      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            プロフィール
          </h2>
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={mockUser.username} size="lg" />
            <Button variant="secondary" size="sm">
              画像を変更
            </Button>
          </div>
          <form className="space-y-4">
            <Input
              label="ユーザー名"
              type="text"
              defaultValue={mockUser.username}
              required
            />
            <Input
              label="メールアドレス"
              type="email"
              defaultValue={mockUser.email}
              required
            />
            <div className="flex justify-end">
              <Button type="submit">保存する</Button>
            </div>
          </form>
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
