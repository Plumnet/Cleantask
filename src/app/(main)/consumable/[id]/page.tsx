import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { StockOutHistory } from "@/components/consumable/StockOutHistory";
import {
  mockConsumableItems,
  mockStockOutRecords,
} from "@/data/mockConsumable";
import { mockConsumableCategories } from "@/data/mockCategories";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConsumableDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item =
    mockConsumableItems.find((i) => i.id === id) || mockConsumableItems[0];
  const category = mockConsumableCategories.find(
    (c) => c.id === item.categoryId,
  );
  const stockOutRecords = mockStockOutRecords.filter(
    (r) => r.consumableId === item.id,
  );

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">消耗品詳細</h1>
        <div className="flex gap-2">
          <Link href={`/consumable/${item.id}/edit`}>
            <Button variant="secondary">編集</Button>
          </Link>
          <Button variant="danger">削除</Button>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {item.name}
              </h2>
              {category && (
                <Badge className={category.color}>{category.name}</Badge>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">残量</p>
              <Counter current={item.currentStock} max={item.maxStock} />
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="secondary">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
                1つ使用
              </Button>
              <Button size="sm" variant="secondary">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                1つ補充
              </Button>
            </div>

            {item.memo && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-600">メモ</p>
                <p className="text-gray-900 mt-1">{item.memo}</p>
              </div>
            )}
          </div>
        </Card>

        <StockOutHistory records={stockOutRecords} />
      </div>

      <div className="mt-6">
        <Link
          href="/consumable/list"
          className="text-blue-600 hover:underline text-sm"
        >
          ← 一覧に戻る
        </Link>
      </div>
    </PageContainer>
  );
}
