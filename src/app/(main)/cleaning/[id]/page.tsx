"use client";

import { use } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCleaningContext } from "@/contexts/CleaningContext";
import { mockConsumableItems } from "@/data/mockConsumable";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function CleaningDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { items, categories } = useCleaningContext();
  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <PageContainer>
        <p className="text-center text-gray-500 py-8">
          タスクが見つかりませんでした
        </p>
      </PageContainer>
    );
  }

  const itemCategories = item.categoryIds
    .map((cid) => categories.find((c) => c.id === cid))
    .filter(Boolean);

  const itemConsumables = item.consumableIds
    .map((cid) => mockConsumableItems.find((c) => c.id === cid))
    .filter(Boolean);

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
        <div className="flex gap-2">
          <Link href={`/cleaning/${item.id}/edit`}>
            <Button variant="secondary">編集</Button>
          </Link>
          <Link href="/cleaning/list">
            <Button variant="ghost">戻る</Button>
          </Link>
        </div>
      </div>

      <Card>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">カテゴリー</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {itemCategories.map(
                (cat) =>
                  cat && (
                    <Badge key={cat.id} className={cat.color}>
                      {cat.name}
                    </Badge>
                  ),
              )}
              {itemCategories.length === 0 && (
                <span className="text-sm text-gray-400">未設定</span>
              )}
            </dd>
          </div>

          {itemConsumables.length > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500">使用消耗品</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {itemConsumables.map(
                  (cons) =>
                    cons && (
                      <Badge
                        key={cons.id}
                        className="bg-gray-100 text-gray-800"
                      >
                        {cons.name}
                      </Badge>
                    ),
                )}
              </dd>
            </div>
          )}

          {item.description && (
            <div>
              <dt className="text-sm font-medium text-gray-500">説明</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {item.description}
              </dd>
            </div>
          )}

          {item.imageFileName && (
            <div>
              <dt className="text-sm font-medium text-gray-500">画像</dt>
              <dd className="mt-1 text-sm text-gray-600">
                {item.imageFileName}
              </dd>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">周期</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {item.frequency}日ごと
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">最終掃除日</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {item.lastCleanedAt}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">次回予定</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {item.nextCleaningAt}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">状態</dt>
              <dd className="mt-1">
                {item.warningStatus === "warning" ? (
                  <Badge className="bg-amber-100 text-amber-800">
                    警戒タスク
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">通常</Badge>
                )}
              </dd>
            </div>
          </div>

          {item.memo && (
            <div>
              <dt className="text-sm font-medium text-gray-500">メモ</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {item.memo}
              </dd>
            </div>
          )}
        </dl>
      </Card>

      {/* 警戒タスク歴 */}
      {item.kaizenHistory.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            警戒タスク歴
          </h2>
          <Card>
            <div className="space-y-3">
              {item.kaizenHistory
                .slice(-30)
                .reverse()
                .map((record) => (
                  <div
                    key={record.id}
                    className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {record.createdAt}
                      </span>
                      {record.previousFrequency !== record.newFrequency && (
                        <span className="text-xs text-blue-600">
                          周期変更: {record.previousFrequency}日 →{" "}
                          {record.newFrequency}日
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-900 mt-1">
                      {record.cause}
                    </p>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
