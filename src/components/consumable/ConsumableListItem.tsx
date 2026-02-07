import Link from "next/link";
import type { ConsumableItem } from "@/types/consumable";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Counter } from "@/components/ui/Counter";
import { mockConsumableCategories } from "@/data/mockCategories";

type ConsumableListItemProps = {
  item: ConsumableItem;
};

function getStockStatus(current: number, max: number) {
  const ratio = current / max;
  if (current === 0) {
    return <Badge className="bg-red-100 text-red-800">在庫切れ</Badge>;
  }
  if (ratio <= 0.3) {
    return <Badge className="bg-orange-100 text-orange-800">残り少</Badge>;
  }
  return null;
}

export function ConsumableListItem({ item }: ConsumableListItemProps) {
  const category = mockConsumableCategories.find(
    (c) => c.id === item.categoryId,
  );

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/consumable/${item.id}`} className="hover:underline">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
            </Link>
            {category && (
              <Badge className={category.color}>{category.name}</Badge>
            )}
            {getStockStatus(item.currentStock, item.maxStock)}
          </div>
          <div className="mt-2">
            <Counter current={item.currentStock} max={item.maxStock} />
          </div>
          {item.memo && (
            <p className="mt-2 text-sm text-gray-500 truncate">
              メモ: {item.memo}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Link href={`/consumable/${item.id}/edit`}>
            <IconButton label="編集">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </IconButton>
          </Link>
          <IconButton label="削除" variant="danger">
            <svg
              className="w-5 h-5"
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
          </IconButton>
        </div>
      </div>
    </Card>
  );
}
