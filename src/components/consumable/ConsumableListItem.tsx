"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ConsumableItem } from "@/types/consumable";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Counter } from "@/components/ui/Counter";
import { mockConsumableCategories } from "@/data/mockCategories";
import {
  deleteConsumableItem,
  restockConsumable,
  decreaseStock,
} from "@/app/(main)/consumable/actions";

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
  const router = useRouter();
  const [showStockOutPopup, setShowStockOutPopup] = useState(false);

  const category = mockConsumableCategories.find(
    (c) => c.id === item.categoryId,
  );

  const rakutenUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(item.keyword || item.name)}/`;

  const handleRestock = async () => {
    if (item.shopType === "ネットショップ") {
      window.open(rakutenUrl, "_blank", "noopener,noreferrer");
      await restockConsumable(item.id);
    } else {
      router.push(`/consumable/receipt?itemId=${item.id}`);
    }
  };

  const handleDecrease = async () => {
    const result = await decreaseStock(item.id);
    if (result.newStock === 0) {
      setShowStockOutPopup(true);
    }
  };

  return (
    <>
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
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* 1つ使用ボタン */}
          <button
            type="button"
            onClick={handleDecrease}
            disabled={item.currentStock <= 0}
            className="text-xs text-gray-700 hover:bg-gray-50 px-2 py-1 border border-gray-200 rounded disabled:opacity-40 disabled:cursor-not-allowed"
          >
            1つ使用
          </button>

          {/* 補充ボタン */}
          <button
            type="button"
            onClick={handleRestock}
            className="text-xs text-green-700 hover:bg-green-50 px-2 py-1 border border-green-200 rounded"
          >
            補充
          </button>

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

          <form action={deleteConsumableItem.bind(null, item.id)}>
            <IconButton type="submit" label="削除" variant="danger">
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
          </form>
        </div>
      </div>
    </Card>

    {/* 在庫切れポップアップ */}
    {showStockOutPopup && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setShowStockOutPopup(false)}
        />
        <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">在庫切れ！</h3>
          </div>
          <p className="text-gray-600 mb-4">
            <span className="font-medium">{item.name}</span>の在庫がなくなりました。補充しましょう。
          </p>
          {item.shopType === "ネットショップ" ? (
            <a
              href={rakutenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-3"
            >
              商品を買いに行く（楽天）
            </a>
          ) : (
            <p className="text-sm text-gray-500 mb-3 text-center">
              お店で購入してください
            </p>
          )}
          <button
            type="button"
            onClick={() => setShowStockOutPopup(false)}
            className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            閉じる
          </button>
        </div>
      </div>
    )}
    </>
  );
}
