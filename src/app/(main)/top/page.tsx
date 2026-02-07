import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";

export default function TopPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/cleaning/list">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  掃除一覧
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  掃除タスクの管理・スケジュール確認
                </p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="text-red-600 font-medium">
                    期限超過: 2件
                  </span>
                  <span className="text-orange-600 font-medium">本日: 3件</span>
                </div>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/consumable/list">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  消耗品一覧
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  消耗品の在庫管理・切らし歴の確認
                </p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="text-red-600 font-medium">
                    在庫切れ: 1件
                  </span>
                  <span className="text-orange-600 font-medium">
                    残り少: 2件
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </PageContainer>
  );
}
