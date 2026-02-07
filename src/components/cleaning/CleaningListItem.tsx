import Link from "next/link";
import type { CleaningItem } from "@/types/cleaning";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { mockCategories } from "@/data/mockCategories";

type CleaningListItemProps = {
  item: CleaningItem;
};

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
}

function getStatusBadge(daysUntil: number) {
  if (daysUntil < 0) {
    return <Badge className="bg-red-100 text-red-800">期限超過</Badge>;
  }
  if (daysUntil === 0) {
    return <Badge className="bg-orange-100 text-orange-800">本日</Badge>;
  }
  if (daysUntil <= 2) {
    return <Badge className="bg-yellow-100 text-yellow-800">まもなく</Badge>;
  }
  return null;
}

export function CleaningListItem({ item }: CleaningListItemProps) {
  const category = mockCategories.find((c) => c.id === item.categoryId);
  const daysUntil = getDaysUntil(item.nextCleaningAt);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            {category && (
              <Badge className={category.color}>{category.name}</Badge>
            )}
            {getStatusBadge(daysUntil)}
          </div>
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            <p>頻度: {item.frequency}日ごと</p>
            <p>
              次回: {item.nextCleaningAt}
              {daysUntil >= 0 && (
                <span className="ml-1">（あと{daysUntil}日）</span>
              )}
              {daysUntil < 0 && (
                <span className="ml-1 text-red-600">
                  （{Math.abs(daysUntil)}日超過）
                </span>
              )}
            </p>
            {item.memo && (
              <p className="text-gray-500 truncate">メモ: {item.memo}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Link href={`/cleaning/${item.id}/edit`}>
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
